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
import * as disabledClaimByPolicyNoSelectors from '../../stores/disabled-claim-by-policy-no-list/disabled-claim-by-policy-no-list.selectors';
import * as DisabledClaimByPolicyNoActions from '../../stores/disabled-claim-by-policy-no-list/disabled-claim-by-policy-no-list.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { DisabledClaimByPolicyNoListColumns } from '../../constants/disabled-claim-by-policy-no-list-columns.const';
import { DisabledClaimPolicy } from '../../models/disabled-claim-policy.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { DisabledClaimByPolicyNoListFilterComponent } from '../disabled-claim-by-policy-no-list-filter/disabled-claim-by-policy-no-list-filter.component';
import { AddPolicyComponent } from '../add-policy/add-policy.component';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { SvgDeleteComponent } from '@app/shared/icons/svg-delete/svg-delete.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

@Component({
  selector: 'app-disabled-claim-by-policy-no-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DemoprojTableComponent,
    DisabledClaimByPolicyNoListFilterComponent,
    AddPolicyComponent,
    MatButtonModule,
    SvgDeleteComponent,
    HasPermissionsDirective,
  ],
  templateUrl: './disabled-claim-by-policy-no-list.component.html',
  styleUrls: ['./disabled-claim-by-policy-no-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisabledClaimByPolicyNoListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private actions$ = inject(Actions);

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  tableColumns: WritableSignal<TableColumn[]> = signal(
    DisabledClaimByPolicyNoListColumns,
  );
  disabledClaimPolicies$: Observable<DisabledClaimPolicy[]> = this.store.select(
    disabledClaimByPolicyNoSelectors.selectDisabledClaimPolicies,
  );
  pagination$: Observable<Pagination> = this.store.select(
    disabledClaimByPolicyNoSelectors.selectPagination,
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getDisabledClaimPolicies'),
  );
  deleting$: Observable<boolean> = this.store.select(
    selectIsLoading('deleteDisabledClaimPolicy'),
  );
  selectCommonSearch$: Observable<string> = this.store
    .select(disabledClaimByPolicyNoSelectors.selectDisabledClaimPolicyFilters)
    .pipe(map((filters) => filters.keyword || ''));

  defaultParams: WritableSignal<Partial<CommonListQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  ngOnInit(): void {
    this.store.dispatch(
      DisabledClaimByPolicyNoActions.setDisabledClaimPolicyFilters({
        filters: this.defaultParams(),
      }),
    );

    this.actions$
      .pipe(
        ofType(DisabledClaimByPolicyNoActions.addPolicyToDisabledClaimSuccess),
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
            DisabledClaimByPolicyNoActions.setDisabledClaimPolicyFilters({
              filters: this.defaultParams(),
            }),
          );
        });
      });

    this.actions$
      .pipe(
        ofType(DisabledClaimByPolicyNoActions.deleteDisabledClaimPolicySuccess),
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
            DisabledClaimByPolicyNoActions.setDisabledClaimPolicyFilters({
              filters: this.defaultParams(),
            }),
          );
        });
      });
  }

  onPageChange(page: number) {
    this.store.dispatch(
      DisabledClaimByPolicyNoActions.setDisabledClaimPolicyFilters({
        filters: { page },
      }),
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      DisabledClaimByPolicyNoActions.setDisabledClaimPolicyFilters({
        filters: { size: pageSize, page: 0 },
      }),
    );
  }

  deleteDisabledClaimPolicy(rowData: DisabledClaimPolicy) {
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
          DisabledClaimByPolicyNoActions.deleteDisabledClaimPolicy({
            disabled_claim_policy_id: rowData.disabled_claim_policy_id,
          }),
        );
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(DisabledClaimByPolicyNoActions.resetAll());
  }
}
