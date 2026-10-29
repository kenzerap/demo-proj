import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';

import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';

import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import * as fromCheckupPackageListSelector from '../../stores/checkup-package-list/checkup-package-list.selector';
import * as CheckupPackageActions from '../../stores/checkup-package-list/checkup-package-list.actions';
import * as CheckupPackageOrderSelector from '../../stores/reorder-list/reorder-list.selectors';
import * as CheckupPackageOrderActions from '../../stores/reorder-list/reorder-list.actions';

import { map, Observable, take, takeUntil } from 'rxjs';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { CheckupPackageListColumns } from '../../constants/display-columns.const';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { Actions, ofType } from '@ngrx/effects';
import { CheckupPackageQueryParams } from '../../models/checkup-package-query-params.model';
import { CheckupPackage } from '../../models/checkup-package.model';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { DragDropChange } from '@app/shared/components/demoproj-table/models/drag-drop-change.model';
@Component({
  selector: 'app-checkup-package-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatButtonModule,
    MatSlideToggleModule,
    SvgPlusComponent,
    MatIconModule,
    HasPermissionsDirective,
  ],
  templateUrl: './checkup-package-list.component.html',
  styleUrl: './checkup-package-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckupPackageListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private hasPermissionService = inject(HasPermissionService);
  private actions$ = inject(Actions);

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  tableColumns: WritableSignal<TableColumn[]> = signal(
    CheckupPackageListColumns
  );
  isEditOrder: WritableSignal<boolean> = signal(false);
  isOrderDirty: WritableSignal<boolean> = signal(false);

  isOrderDirty$: Observable<boolean> = this.store.select(
    CheckupPackageOrderSelector.selectIsOrderDirty
  );

  reOrderLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('reOrderCheckupPackages')
  );

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.CheckupPackage,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  virtualCheckupPackages$: Observable<CheckupPackage[]> = this.store
    .select(CheckupPackageOrderSelector.selectVirtualCheckupPackages)
    .pipe(
      map((checkupPackages) => {
        return checkupPackages.map((item) => {
          return {
            ...item,
            dragDisabled: !item.is_published,
          };
        });
      })
    );

  pagination$: Observable<Pagination> = this.store.select(
    fromCheckupPackageListSelector.selectPagination
  );

  listLoading$ = this.store.select(selectIsLoading('getCheckupPackgage'));
  getMissingCheckupPackageLoading$ = this.store.select(
    selectIsLoading('getMissingCheckupPackages')
  );
  defaultParams: WritableSignal<Partial<CheckupPackageQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  ngOnInit(): void {
    this.store.dispatch(
      CheckupPackageActions.setCheckupPackgageFilters({
        filters: { ...this.defaultParams() },
      })
    );

    this.isOrderDirty$.pipe(takeUntil(this.destroy$)).subscribe((isDirty) => {
      this.isOrderDirty.set(isDirty);
    });

    this.actions$
      .pipe(
        ofType(CheckupPackageOrderActions.reOrderCheckupPackagesSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: 'The master data was updated',
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
              CheckupPackageActions.setCheckupPackgageFilters({
                filters: { page: 0 },
              })
            );

            this.setEditOrder(false);
          });
      });
  }

  onPageChange(page: number) {
    this.store.dispatch(
      CheckupPackageActions.setCheckupPackgageFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      CheckupPackageActions.setCheckupPackgageFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  setEditOrder(isEditOrder: boolean) {
    this.isEditOrder.set(isEditOrder);
    this.store.dispatch(
      CheckupPackageOrderActions.setIsEditOrderMode({ isEditOrder })
    );

    if (!isEditOrder) {
      this.store.dispatch(
        CheckupPackageOrderActions.setOrderDirty({ isDirty: false })
      );
    }
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
          this.store.dispatch(CheckupPackageOrderActions.resetAll());
          this.store.dispatch(
            CheckupPackageActions.setCheckupPackgageFilters({
              filters: { page: 0 },
            })
          );
        }
      });
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
            CheckupPackageOrderActions.reOrderCheckupPackages()
          );
        }
      });
  }

  onDragDropChange(event: DragDropChange<CheckupPackage>) {
    this.store.dispatch(
      CheckupPackageOrderActions.updateCheckupPackagesOrder({
        newList: event.data,
      })
    );
  }

  onToggleChange(event: MatSlideToggleChange, rowData: CheckupPackage) {
    this.store.dispatch(
      CheckupPackageOrderActions.updatePublishedStatus({
        id: rowData.id,
        is_published: event.checked,
      })
    );
  }

  openCreateNewCheckupPackage() {
    this.router.navigate([
      '/master-data-management',
      'checkup-package',
      'form-checkup-package',
      'create',
    ]);
  }

  onRowClick(checkupPackage: CheckupPackage) {
    if (!this.isEditOrder()) {
      this.router.navigate([
        '/master-data-management',
        'checkup-package',
        'form-checkup-package',
        checkupPackage.id,
        'view-edit',
      ]);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CheckupPackageActions.resetAll());
    this.store.dispatch(CheckupPackageOrderActions.resetAll());
  }
}
