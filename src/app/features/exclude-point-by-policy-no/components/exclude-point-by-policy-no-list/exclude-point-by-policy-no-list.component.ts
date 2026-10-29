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
import { RouterLink } from '@angular/router';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Store } from '@ngrx/store';
import { map, Observable, takeUntil } from 'rxjs';
import * as excludePointByPolicyNoSelectors from '../../stores/exclude-point-by-policy-no-list/exclude-point-by-policy-no-list.selectors';
import * as ExcludePointByPolicyNoActions from '../../stores/exclude-point-by-policy-no-list/exclude-point-by-policy-no-list.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { ExcludePointByPolicyNoListColumns } from '../../constants/exclude-point-by-policy-no-list-columns.const';
import { ExcludePointPolicy } from '../../models/exclude-point-policy.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { ExcludePointByPolicyNoListFilterComponent } from '../exclude-point-by-policy-no-list-filter/exclude-point-by-policy-no-list-filter.component';
import { AddPolicyComponent } from '../add-policy/add-policy.component';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { SvgDeleteComponent } from '@app/shared/icons/svg-delete/svg-delete.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

@Component({
  selector: 'app-exclude-point-by-policy-no-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DemoprojTableComponent,
    ExcludePointByPolicyNoListFilterComponent,
    AddPolicyComponent,
    MatButtonModule,
    SvgDeleteComponent,
    HasPermissionsDirective
],
  templateUrl: './exclude-point-by-policy-no-list.component.html',
  styleUrls: ['./exclude-point-by-policy-no-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcludePointByPolicyNoListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private actions$ = inject(Actions);

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  tableColumns: WritableSignal<TableColumn[]> = signal(
    ExcludePointByPolicyNoListColumns,
  );
  excludePointPolicies$: Observable<ExcludePointPolicy[]> = this.store.select(
    excludePointByPolicyNoSelectors.selectExcludePointPolicies,
  );
  pagination$: Observable<Pagination> = this.store.select(
    excludePointByPolicyNoSelectors.selectPagination,
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getExcludePointPolicies'),
  );
  deleting$: Observable<boolean> = this.store.select(
    selectIsLoading('deleteExcludePointPolicy'),
  );
  selectCommonSearch$: Observable<string> = this.store
    .select(excludePointByPolicyNoSelectors.selectExcludePointPolicyFilters)
    .pipe(map((filters) => filters.keyword || ''));

  defaultParams: WritableSignal<Partial<CommonListQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  ngOnInit(): void {
    this.store.dispatch(
      ExcludePointByPolicyNoActions.setExcludePointPolicyFilters({
        filters: this.defaultParams(),
      }),
    );

    this.actions$
      .pipe(
        ofType(ExcludePointByPolicyNoActions.addPolicyToExcludePointSuccess),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: `The policy was added`,
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.store.dispatch(
            ExcludePointByPolicyNoActions.setExcludePointPolicyFilters({
              filters: this.defaultParams(),
            }),
          );
        });
      });

    this.actions$
      .pipe(
        ofType(ExcludePointByPolicyNoActions.deleteExcludePointPolicySuccess),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: `The record was deleted`,
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.store.dispatch(
            ExcludePointByPolicyNoActions.setExcludePointPolicyFilters({
              filters: this.defaultParams(),
            }),
          );
        });
      });
  }

  onPageChange(page: number) {
    this.store.dispatch(
      ExcludePointByPolicyNoActions.setExcludePointPolicyFilters({
        filters: { page },
      }),
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      ExcludePointByPolicyNoActions.setExcludePointPolicyFilters({
        filters: { size: pageSize, page: 0 },
      }),
    );
  }

  deleteExcludePointPolicy(rowData: ExcludePointPolicy) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Record?',
        message: `Are you sure you want to delete this record?`,
        btnCloseText: 'Cancel',
        btnConfirmText: 'Confirm',
        type: 'warning',
      },
      width: '25rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          ExcludePointByPolicyNoActions.deleteExcludePointPolicy({
            excluded_policy_id: rowData.excluded_policy_id,
          }),
        );
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(ExcludePointByPolicyNoActions.resetAll());
  }
}
