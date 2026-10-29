import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { LoadingDirective } from '@app/shared/directives/loading.directive';
import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, Observable, of, take, takeUntil } from 'rxjs';
import {
  CustomerSegmentation,
  CustomerSegmentationTable,
} from '../../models/customer-segmentation.model';
import * as CustomerSegmentationActions from '../../stores/customer-segmentation/customer-segmentation.actions';
import * as customerSegmentationSelectors from '../../stores/customer-segmentation/customer-segmentation.selectors';
import * as CustomerSegmentationOrderActions from '../../stores/reorder-list/reorder-list.actions';
import * as CustomerSegmentationOrderSelectors from '../../stores/reorder-list/reorder-list.selectors';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { customerSegmentationListColumns } from '../../consts/customer-segmentation-list-columns.const';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { DragDropChange } from '@app/shared/components/demoproj-table/models/drag-drop-change.model';
import { StatusCode } from '@app/shared/utils/enums/status-code.enum';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { HasPermissionService } from '@app/shared/services/has-permission.service';

@Component({
  selector: 'app-customer-segmentation-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    LoadingDirective,
    MatTooltipModule,
    SvgPlusComponent,
    MatIconModule,
    DemoprojTableComponent,
    MatSlideToggleModule,
    HasPermissionsDirective,
  ],
  templateUrl: './customer-segmentation-list.component.html',
  styleUrl: './customer-segmentation-list.component.scss',
})
export class CustomerSegmentationListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private router = inject(Router);
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private actions$ = inject(Actions);
  private hasPermissionService = inject(HasPermissionService);

  pageId: WritableSignal<number | undefined> = signal(undefined);
  isEditOrder: WritableSignal<boolean> = signal(false);
  isOrderDirty: WritableSignal<boolean> = signal(false);
  targetGroupUserCountId: WritableSignal<string> = signal('');
  tableColumns: WritableSignal<TableColumn[]> = signal(
    customerSegmentationListColumns
  );

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;
  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.CustomerSegmentation,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  isOrderDirty$: Observable<boolean> = this.store.select(
    CustomerSegmentationOrderSelectors.selectIsOrderDirty
  );

  reOrderLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('reOrderCustomerSegmentations')
  );

  customerSegmentations$: Observable<CustomerSegmentationTable[]> = this.store
    .select(
      CustomerSegmentationOrderSelectors.selectVirtualCustomerSegmentations
    )
    .pipe(
      map((customerSegmentations) => {
        return customerSegmentations.map((customerSegmentation) => {
          return {
            ...customerSegmentation,
            dragDisabled: !customerSegmentation.is_published,
          } as CustomerSegmentationTable;
        });
      })
    );

  pagination$: Observable<Pagination> = this.store.select(
    customerSegmentationSelectors.selectPagination
  );

  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getCustomerSegmentations')
  );
  getMissingCustomerSegmentationsLoading$: Observable<boolean> =
    this.store.select(selectIsLoading('getMissingCustomerSegmentations'));

  ngOnInit(): void {
    this.actions$
      .pipe(
        ofType(
          CustomerSegmentationOrderActions.reOrderCustomerSegmentationsSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: 'The segmentation list was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef
          .afterClosed()
          .pipe(take(1))
          .subscribe(() => {
            this.store.dispatch(
              CustomerSegmentationActions.setCustomerSegmentationsFilter({
                filters: { page: 0 },
              })
            );

            this.setEditOrder(false);
          });
      });

    this.isOrderDirty$.pipe(takeUntil(this.destroy$)).subscribe((isDirty) => {
      this.isOrderDirty.set(isDirty);
    });

    this.store.dispatch(
      CustomerSegmentationActions.setCustomerSegmentationsFilter({
        filters: {
          page: 0,
        },
      })
    );
  }

  setEditOrder(isEditOrder: boolean) {
    this.isEditOrder.set(isEditOrder);
    if (!isEditOrder) {
      this.store.dispatch(
        CustomerSegmentationOrderActions.setOrderDirty({ isDirty: false })
      );
    }
  }

  publishItems() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'You want to publish changes?',
        message: `The updated order will immediately affect customer-facing views. Please confirm to apply changes or cancel to continue editing.`,
        btnConfirmText: 'Confirm',
        btnCloseText: 'Cancel',
        type: 'warning',
      },
      width: '25rem',
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.store.dispatch(
            CustomerSegmentationOrderActions.reOrderCustomerSegmentations()
          );
        }
      });
  }

  cancelEditOrder() {
    if (!this.isOrderDirty()) {
      this.setEditOrder(false);
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Discard Changes?',
        message: `You have unsaved changes. If you cancel now, your changes will not be saved. Do you want to continue?`,
        btnConfirmText: 'Discard',
        btnCloseText: 'Cancel',
        type: 'warning',
      },
      width: '25rem',
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.setEditOrder(false);
          this.store.dispatch(CustomerSegmentationOrderActions.resetAll());
          this.store.dispatch(
            CustomerSegmentationActions.setCustomerSegmentationsFilter({
              filters: { page: 0 },
            })
          );
        }
      });
  }

  createCustomerSegment() {
    this.router.navigate([
      'user-management',
      'customer-segmentation',
      'form',
      'create',
    ]);
  }

  onRowClick(rowItem: CustomerSegmentation) {
    if (!this.hasEditPermission) {
      return;
    }

    if (!this.isEditOrder()) {
      this.router.navigate([
        'user-management',
        'customer-segmentation',
        'form',
        rowItem.id,
        'view-edit',
      ]);
    }
  }
  onPageChange(page: number) {
    this.store.dispatch(
      CustomerSegmentationActions.setCustomerSegmentationsFilter({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      CustomerSegmentationActions.setCustomerSegmentationsFilter({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  onDragDropChange(event: DragDropChange<CustomerSegmentationTable>) {
    this.store.dispatch(
      CustomerSegmentationOrderActions.updateCustomerSegmentationsOrder({
        newList: event.data,
      })
    );
  }

  onToggleChange(
    event: MatSlideToggleChange,
    rowData: CustomerSegmentationTable
  ) {
    this.store.dispatch(
      CustomerSegmentationOrderActions.updatePublishedStatus({
        id: rowData.id,
        is_published: event.checked,
      })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CustomerSegmentationActions.resetAll());
    this.store.dispatch(CustomerSegmentationOrderActions.resetAll());
  }
}
