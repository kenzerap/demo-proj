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
import * as fromHospitalListSelector from '../../stores/hospital-list/hospital-list.selector';
import * as HospitalActions from '../../stores/hospital-list/hospital-list.actions';
import * as HospitalOrderSelector from '../../stores/reorder-list/reorder-list.selectors';
import * as HospitalOrderActions from '../../stores/reorder-list/reorder-list.actions';

import { map, Observable, take, takeUntil } from 'rxjs';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
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
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { DragDropChange } from '@app/shared/components/demoproj-table/models/drag-drop-change.model';
import { HospitalListColumns } from '../../constants/display-columns.const';
import { Hospital } from '../../models/hospital.model';
import { HospitalQueryParams } from '../../models/hospital-query-params.model';
import { HospitalListFilterComponent } from '../hospital-list-filter/hospital-list-filter.component';
import { Sort } from '@angular/material/sort';
@Component({
  selector: 'app-hospital-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatButtonModule,
    MatSlideToggleModule,
    SvgPlusComponent,
    MatIconModule,
    HasPermissionsDirective,
    HospitalListFilterComponent,
  ],
  templateUrl: './hospital-list.component.html',
  styleUrl: './hospital-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HospitalListComponent
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

  tableColumns: WritableSignal<TableColumn[]> = signal(HospitalListColumns);
  isEditOrder: WritableSignal<boolean> = signal(false);
  isOrderDirty: WritableSignal<boolean> = signal(false);

  isOrderDirty$: Observable<boolean> = this.store.select(
    HospitalOrderSelector.selectIsOrderDirty
  );

  reOrderLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('reOrderHospitals')
  );

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.Hospital,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  virtualHospitals$: Observable<Hospital[]> = this.store
    .select(HospitalOrderSelector.selectVirtualHospitals)
    .pipe(
      map((hospitals) => {
        return hospitals.map((item) => {
          return {
            ...item,
            dragDisabled: !item.is_published,
          };
        });
      })
    );

  pagination$: Observable<Pagination> = this.store.select(
    fromHospitalListSelector.selectPagination
  );

  hospitalLists$: Observable<Hospital[]> = this.store.select(
    fromHospitalListSelector.selectHospitalLists
  );

  selectCommonSearch$: Observable<string> = this.store
    .select(fromHospitalListSelector.selectHospitalFilters)
    .pipe(map((filters) => filters.keyword || ''));

  listLoading$ = this.store.select(selectIsLoading('getHospital'));
  getMissingHospitalsLoading$ = this.store.select(
    selectIsLoading('getMissingHospitals')
  );

  defaultParams: WritableSignal<Partial<HospitalQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  ngOnInit(): void {
    this.store.dispatch(
      HospitalActions.setHospitalFilters({
        filters: { ...this.defaultParams() },
      })
    );

    this.isOrderDirty$.pipe(takeUntil(this.destroy$)).subscribe((isDirty) => {
      this.isOrderDirty.set(isDirty);
    });

    this.actions$
      .pipe(
        ofType(HospitalOrderActions.reOrderHospitalsSuccess),
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
              HospitalActions.setHospitalFilters({
                filters: { page: 0 },
              })
            );

            this.setEditOrder(false);
          });
      });
  }

  onPageChange(page: number) {
    this.store.dispatch(
      HospitalActions.setHospitalFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      HospitalActions.setHospitalFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  onSortChange(event: Sort) {
    if (this.isEditOrder()) {
      return;
    }

    this.store.dispatch(
      HospitalActions.setHospitalFilters({
        filters: {
          sort_by: event.direction ? event.active : undefined,
          sort_direction: event.direction,
        },
      })
    );
  }

  setEditOrder(isEditOrder: boolean) {
    this.isEditOrder.set(isEditOrder);
    this.store.dispatch(
      HospitalOrderActions.setIsEditOrderMode({ isEditOrder })
    );

    if (isEditOrder) {
      this.store.dispatch(
        HospitalActions.setHospitalFilters({
          filters: {
            sort_by: '',
            sort_direction: '',
            keyword: '',
          },
        })
      );
    }

    if (!isEditOrder) {
      this.store.dispatch(
        HospitalOrderActions.setOrderDirty({ isDirty: false })
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
          this.store.dispatch(HospitalOrderActions.resetAll());
          this.store.dispatch(
            HospitalActions.setHospitalFilters({
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
          this.store.dispatch(HospitalOrderActions.reOrderHospitals());
        }
      });
  }

  onDragDropChange(event: DragDropChange<Hospital>) {
    this.store.dispatch(
      HospitalOrderActions.updateHospitalsOrder({
        newList: event.data,
      })
    );
  }

  onToggleChange(event: MatSlideToggleChange, rowData: Hospital) {
    this.store.dispatch(
      HospitalOrderActions.updatePublishedStatus({
        id: rowData.hospital_id,
        is_published: event.checked,
      })
    );
  }

  openCreateNewHospital() {
    this.router.navigate([
      '/master-data-management',
      'hospital',
      'form',
      'create',
    ]);
  }

  onRowClick(hospital: Hospital) {
    if (!this.isEditOrder()) {
      this.router.navigate([
        '/master-data-management',
        'hospital',
        'form',
        hospital.hospital_id,
        'view-edit',
      ]);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(HospitalActions.resetAll());
    this.store.dispatch(HospitalOrderActions.resetAll());
  }
}
