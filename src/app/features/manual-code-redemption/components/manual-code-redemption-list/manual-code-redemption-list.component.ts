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
import * as manualCodeRedemptionSelector from '../../stores/manual-code-redemption/manual-code-redemption.selector';
import * as manualCodeRedemptionActions from '../../stores/manual-code-redemption/manual-code-redemption.actions';

import { map, Observable, take, takeUntil } from 'rxjs';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { MatButtonModule } from '@angular/material/button';
import { ManualCodeRedemptionColumns } from '../../constants/display-columns.const';
import { ManualCodeRedemptionFilterComponent } from '../manual-code-redemption-filter/manual-code-redemption-filter.component';
import { ManualCodeRedemptionQueryParams } from '../../models/manual-code-redemption-query-params.model';
import { ManualCodeRedemption } from '../../models/manual-code-redemption.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { SvgPenSquareComponent } from '@app/shared/icons/svg-pen-square/svg-pen-square.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { Actions, ofType } from '@ngrx/effects';
import { BaseComponent } from '@app/shared/components/base/base.component';
@Component({
  selector: 'app-manual-code-redemption-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatButtonModule,
    ManualCodeRedemptionFilterComponent,
    SvgPenSquareComponent,
  ],
  templateUrl: './manual-code-redemption-list.component.html',
  styleUrl: './manual-code-redemption-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualCodeRedemptionComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private actions$ = inject(Actions);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    ManualCodeRedemptionColumns
  );

  filters$ = this.store.select(
    manualCodeRedemptionSelector.selectManualCodeRedemptionFilters
  );

  hasFilter(filters: Partial<ManualCodeRedemptionQueryParams>): boolean {
    if (!filters) return false;
    return !!filters.search_text;
  }

  selectCommonSearch$: Observable<boolean> = this.store
    .select(manualCodeRedemptionSelector.selectManualCodeRedemptionFilters)
    .pipe(map((filters) => this.hasFilter(filters)));

  manualCodeRedemption$: Observable<ManualCodeRedemption[]> = this.store.select(
    manualCodeRedemptionSelector.selectfromManualCodeRedemption
  );

  pagination$: Observable<Pagination> = this.store.select(
    manualCodeRedemptionSelector.selectPagination
  );

  listLoading$ = this.store.select(selectIsLoading('getManualCodeRedemption'));

  selectSearchHighlightText$: Observable<string> = this.store
    .select(manualCodeRedemptionSelector.selectManualCodeRedemptionFilters)
    .pipe(map((filters) => filters.search_text || ''));

  defaultParams: WritableSignal<Partial<ManualCodeRedemptionQueryParams>> =
    signal({
      page: 0,
      size: 20,
    });

  ngOnInit(): void {
    this.actions$
      .pipe(
        ofType(
          manualCodeRedemptionActions.updateManualCodeRedemptionStatusSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: 'The code status was updated',
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
              manualCodeRedemptionActions.setManualCodeRedemptionFilters({
                filters: { page: 0 },
              })
            );
          });
      });
  }

  onPageChange(page: number) {
    this.store.dispatch(
      manualCodeRedemptionActions.setManualCodeRedemptionFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      manualCodeRedemptionActions.setManualCodeRedemptionFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  markAsRedeem(rowData: ManualCodeRedemption) {
    if (rowData?.status.toLowerCase() === 'redeemed') return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Change status to redeemed?',
        message: `If you click to confirmed the system will terminate this code and can't revert`,
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
            manualCodeRedemptionActions.updateManualCodeRedemptionStatus({
              params: {
                id: rowData.promo_code_unicode_quota_allocation_detail_id,
                type: rowData.type,
                action_done_by: rowData.created_by,
              },
            })
          );
        }
      });
  }

  override ngOnDestroy(): void {
    this.store.dispatch(manualCodeRedemptionActions.resetAll());
  }
}
