import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { DemoprojTableComponent } from 'src/app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from 'src/app/shared/components/demoproj-table/models/table-column.model';
import { filter, map, Observable, of, takeUntil } from 'rxjs';
import { RedeemHistoryTable } from '../../models/redeem-history.model';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as redeemHistorySelectors from '../../stores/redeem-history/redeem-history.selectors';
import * as RedeemHistoryActions from '../../stores/redeem-history/redeem-history.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ActivatedRoute } from '@angular/router';
import { redeemHistoryColumns } from '../../constants/redeem-history-columns.const';
import { RedeemType } from '@app/shared/utils/enums/redeem-type.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { SvgExportComponent } from '@app/shared/icons/svg-export/svg-export.component';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-redeem-history',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatButtonModule,
    HasPermissionsDirective,
    SvgExportComponent,
  ],
  templateUrl: './redeem-history.component.html',
  styleUrl: './redeem-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedeemHistoryComponent extends BaseComponent implements OnDestroy {
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  tableColumns: WritableSignal<TableColumn[]> = signal(redeemHistoryColumns);
  partyId: WritableSignal<string> = signal('');

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  exportLoading$ = this.store.select(selectIsLoading(`exportRedeemToExcel`));

  redeemHistories$: Observable<RedeemHistoryTable[]> = this.store
    .select(redeemHistorySelectors.selectRedeemHistories)
    .pipe(
      map((redeemHistories) => {
        return redeemHistories.map((redeemHistory) => {
          return {
            ...redeemHistory,
            promoOrUniqueCode:
              redeemHistory.redeemType === RedeemType.UNICODE
                ? redeemHistory.uniCodeCode
                : redeemHistory.promoCodeCode,
          };
        });
      })
    );

  pagination$: Observable<Pagination> = this.store.select(
    redeemHistorySelectors.selectPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getRedeemHistories')
  );

  defaultParams: WritableSignal<Partial<Pagination>> = signal({
    page: 0,
    size: 20,
  });

  constructor() {
    super();

    this.activatedRoute.parent?.params
      .pipe(
        filter((params) => !!params['party_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.partyId.set(params['party_id']);

        this.store.dispatch(
          RedeemHistoryActions.getRedeemHistories({
            partyId: this.partyId(),
            queryParams: { ...this.defaultParams() },
          })
        );
      });
  }

  onPageChange(page: number) {
    this.defaultParams.update((params) => ({ ...params, page }));
    this.store.dispatch(
      RedeemHistoryActions.getRedeemHistories({
        partyId: this.partyId(),
        queryParams: { ...this.defaultParams() },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.defaultParams.update((params) => ({
      ...params,
      size: pageSize,
      page: 0,
    }));
    this.store.dispatch(
      RedeemHistoryActions.getRedeemHistories({
        partyId: this.partyId(),
        queryParams: { ...this.defaultParams() },
      })
    );
  }

  exportToExcel(): void {
    const file_name = `Redeem_History_${this.partyId}_[ExportDate].xlsx`;

    this.store.dispatch(
      RedeemHistoryActions.exportRedeemToExcel({
        file_name,
        partyId: this.partyId(),
      })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(RedeemHistoryActions.resetRedeemHistories());
  }
}
