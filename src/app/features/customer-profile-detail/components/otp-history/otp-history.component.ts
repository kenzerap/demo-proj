import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { DemoprojTableComponent } from 'src/app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from 'src/app/shared/components/demoproj-table/models/table-column.model';
import { filter, Observable, take, takeUntil } from 'rxjs';
import { OtpHistory } from '../../models/otp-history.model';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as OtpHistorySelectors from '../../stores/otp-history/otp-history.selectors';
import * as OtpHistoryActions from '../../stores/otp-history/otp-history.actions';
import * as CustomerDetailActions from '../../stores/customer-detail/customer-detail.actions';
import * as CustomerDetailSelectors from '../../stores/customer-detail/customer-detail.selectors';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ActivatedRoute } from '@angular/router';
import { otpHistoryColumns } from '../../constants/otp-history-columns.const';
import { Customer } from '../../models/customer.model';
import { OtpHistoriesQueryParams } from '../../models/otp-histories-query-params.model';

@Component({
  selector: 'app-otp-history',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent],
  templateUrl: './otp-history.component.html',
  styleUrl: './otp-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpHistoryComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  tableColumns: WritableSignal<TableColumn[]> = signal(otpHistoryColumns);
  partyId: WritableSignal<string> = signal('');

  otpHistories$: Observable<OtpHistory[]> = this.store.select(
    OtpHistorySelectors.selectOtpHistories
  );
  customerDetail$: Observable<Customer | null> = this.store.select(
    CustomerDetailSelectors.selectCustomerDetail
  );

  pagination$: Observable<Pagination> = this.store.select(
    OtpHistorySelectors.selectPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getOtpHistories')
  );

  defaultParams: WritableSignal<Partial<OtpHistoriesQueryParams>> = signal({
    mobile_no: '',
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
          CustomerDetailActions.getCustomerDetail({ partyId: this.partyId() })
        );
      });
  }

  ngOnInit(): void {
    this.customerDetail$
      .pipe(
        filter((customer) => !!customer),
        take(1)
      )
      .subscribe((customer) => {
        this.defaultParams.set({
          mobile_no: customer.mobile_no || '',
          page: 0,
          size: 20,
        });

        this.store.dispatch(
          OtpHistoryActions.getOtpHistories({
            queryParams: { ...this.defaultParams() },
          })
        );
      });
  }

  onPageChange(page: number) {
    this.defaultParams.update((params) => ({ ...params, page }));
    this.store.dispatch(
      OtpHistoryActions.getOtpHistories({
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
      OtpHistoryActions.getOtpHistories({
        queryParams: { ...this.defaultParams() },
      })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CustomerDetailActions.reset());
    this.store.dispatch(OtpHistoryActions.resetOtpHistories());
  }
}
