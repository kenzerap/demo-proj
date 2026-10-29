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
import * as fromHomeScreenManagementListSelector from '../../stores/home-screen-management-list/home-screen-management-list.selector';
import * as HomeScreenManagementActions from '../../stores/home-screen-management-list/home-screen-management-list.actions';
import * as HomeScreenManagementOrderSelector from '../../stores/reorder-list/reorder-list.selectors';
import * as HomeScreenManagementOrderActions from '../../stores/reorder-list/reorder-list.actions';

import { map, Observable, of, take, takeUntil } from 'rxjs';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { HomeScreenManagementListColumns } from '../../constants/display-columns.const';
import { MatButtonModule } from '@angular/material/button';
import { HomeScreenManagement } from '../../models/home-screen-management.model';
import { HomeScreenManagementQueryParams } from '../../models/home-screen-management-query-params.model';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { DragDropChange } from '@app/shared/components/demoproj-table/models/drag-drop-change.model';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { Actions, ofType } from '@ngrx/effects';
@Component({
  selector: 'app-home-screen-management-list',
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
  templateUrl: './home-screen-management-list.component.html',
  styleUrl: './home-screen-management-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeScreenManagementListComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private hasPermissionService = inject(HasPermissionService);
  private actions$ = inject(Actions);

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  tableColumns: WritableSignal<TableColumn[]> = signal(
    HomeScreenManagementListColumns
  );
  isEditOrder: WritableSignal<boolean> = signal(false);
  isOrderDirty: WritableSignal<boolean> = signal(false);

  isOrderDirty$: Observable<boolean> = this.store.select(
    HomeScreenManagementOrderSelector.selectIsOrderDirty
  );
  reOrderLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('reOrderHomeScreenManagements')
  );

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.HomeScreenManagement,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  virtualHomeScreenManagements$: Observable<HomeScreenManagement[]> =
    this.store.select(
      HomeScreenManagementOrderSelector.selectVirtualHomeScreenManagements
    ).pipe(
      map(homeScreenManagements => {
        return homeScreenManagements.map(homeScreenManagement => {
          return {
            ...homeScreenManagement,
            dragDisabled: !homeScreenManagement.is_published,
          }
        })
      })
    );

  pagination$: Observable<Pagination> = this.store.select(
    fromHomeScreenManagementListSelector.selectPagination
  );

  listLoading$ = this.store.select(selectIsLoading('getHomeScreenManagement'));
  getMissingBannerSettingsLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('getMissingHomeScreenManagements')
  );

  defaultParams: WritableSignal<Partial<HomeScreenManagementQueryParams>> =
    signal({
      page: 0,
      size: 20,
    });

  ngOnInit(): void {
    this.store.dispatch(
      HomeScreenManagementActions.setHomeScreenManagementFilters({
        filters: { ...this.defaultParams() },
      })
    );

    this.isOrderDirty$.pipe(takeUntil(this.destroy$)).subscribe((isDirty) => {
      this.isOrderDirty.set(isDirty);
    });

    this.actions$
      .pipe(
        ofType(
          HomeScreenManagementOrderActions.reOrderHomeScreenManagementsSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: 'The section order was updated',
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
              HomeScreenManagementActions.setHomeScreenManagementFilters({
                filters: { page: 0 },
              })
            );

            this.setEditOrder(false);
          });
      });
  }

  onPageChange(page: number) {
    this.store.dispatch(
      HomeScreenManagementActions.setHomeScreenManagementFilters({
        filters: { page },
      })
    );
  }
  openCreateNewHomeScreen() {
    this.router.navigate([
      '/application-management',
      'home-screen-management',
      'form-home',
      'create',
    ]);
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      HomeScreenManagementActions.setHomeScreenManagementFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  setEditOrder(isEditOrder: boolean) {
    this.isEditOrder.set(isEditOrder);
    this.store.dispatch(
      HomeScreenManagementOrderActions.setIsEditOrderMode({ isEditOrder })
    );

    if (!isEditOrder) {
      this.store.dispatch(
        HomeScreenManagementOrderActions.setOrderDirty({ isDirty: false })
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
          this.store.dispatch(HomeScreenManagementOrderActions.resetAll());
          this.store.dispatch(
            HomeScreenManagementActions.setHomeScreenManagementFilters({
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
            HomeScreenManagementOrderActions.reOrderHomeScreenManagements()
          );
        }
      });
  }

  onDragDropChange(event: DragDropChange<HomeScreenManagement>) {
    this.store.dispatch(
      HomeScreenManagementOrderActions.updateHomeScreenManagementsOrder({
        newList: event.data,
      })
    );
  }

  onToggleChange(event: MatSlideToggleChange, rowData: HomeScreenManagement) {
    this.store.dispatch(
      HomeScreenManagementOrderActions.updatePublishedStatus({
        id: rowData.id,
        is_published: event.checked,
      })
    );
  }

  onRowClick(homeScreenManagement: HomeScreenManagement) {
    if (!this.hasEditPermission) {
      return;
    }

    if (!this.isEditOrder()) {
      this.router.navigate([
        'application-management',
        'home-screen-management',
        'form-home',
        homeScreenManagement.id,
        'view-edit',
      ]);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(HomeScreenManagementActions.resetAll());
    this.store.dispatch(HomeScreenManagementOrderActions.resetAll());
  }
}
