import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Store } from '@ngrx/store';
import { map, Observable, takeUntil } from 'rxjs';
import * as pointBulkSelectors from '../../stores/point-bulk-list/point-bulk-list.selectors';
import * as PointBulkActions from '../../stores/point-bulk-list/point-bulk-list.actions';
import * as CreateEditPointBulkActions from '@app/features/point-bulk/stores/create-edit-point-bulk/create-edit-point-bulk.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { PointBulkListColumns } from '../../constants/point-bulk-list-columns.const';
import { PointBulk } from '../../models/point-bulk.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { PointBulkListFilterComponent } from '../point-bulk-list-filter/point-bulk-list-filter.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { MatDialog } from '@angular/material/dialog';
import { UploadPointDialogComponent } from '../upload-point-dialog/upload-point-dialog.component';
import { Actions, ofType } from '@ngrx/effects';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { SvgBtnDownloadComponent } from '../../../../shared/icons/svg-btn-download/svg-btn-download.component';

@Component({
  selector: 'app-point-bulk-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatSlideToggleModule,
    SvgPlusComponent,
    MatButtonModule,
    PointBulkListFilterComponent,
    HasPermissionsDirective,
    SvgBtnDownloadComponent,
  ],
  templateUrl: './point-bulk-list.component.html',
  styleUrls: ['./point-bulk-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointBulkListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private actions$ = inject(Actions);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(PointBulkListColumns);
  pointBulks$: Observable<PointBulk[]> = this.store.select(
    pointBulkSelectors.selectPointBulks
  );
  pagination$: Observable<Pagination> = this.store.select(
    pointBulkSelectors.selectPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getPointBulks')
  );
  downloadLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('downloadFileTemplate')
  );
  selectCommonSearch$: Observable<string> = this.store
    .select(pointBulkSelectors.selectPointBulkFilters)
    .pipe(map((filters) => filters.keyword || ''));

  defaultParams: WritableSignal<Partial<CommonListQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;
  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.PointBulkAction,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  ngOnInit(): void {
    this.store.dispatch(
      PointBulkActions.setPointBulkFilters({
        filters: this.defaultParams(),
      })
    );

    this.actions$
      .pipe(
        ofType(CreateEditPointBulkActions.uploadPointBulkSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: `The point was updated`,
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.store.dispatch(
            PointBulkActions.setPointBulkFilters({
              filters: this.defaultParams(),
            })
          );
        });
      });
  }

  onPageChange(page: number) {
    this.store.dispatch(
      PointBulkActions.setPointBulkFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      PointBulkActions.setPointBulkFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  openUploadPointDialog() {
    this.dialog.open(UploadPointDialogComponent, {
      data: {},
      width: '36rem',
      autoFocus: false,
      disableClose: true,
    });
  }

  downloadFileTemplate() {
    this.store.dispatch(PointBulkActions.downloadFileTemplate());
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(PointBulkActions.resetAll());
  }
}
