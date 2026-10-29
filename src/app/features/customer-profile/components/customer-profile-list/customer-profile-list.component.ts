import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  CustomerProfile,
  CustomerProfileDataTable,
} from '../../models/customer-profile.model';
import { customerProfilesColumns } from '../../constants/display-columns.const';
import { DemoprojTableComponent } from 'src/app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from 'src/app/shared/components/demoproj-table/models/table-column.model';
import { Store } from '@ngrx/store';
import * as customerProfileListActions from '../../stores/customer-profile-list/customer-profile-list.actions';
import * as customerProfileListSelectors from '../../stores/customer-profile-list/customer-profile-list.selectors';
import * as customerProfileFilterSelectors from '../../stores/customer-profile-filter/customer-profile-filter.selectors';
import * as customerProfileFilterActions from '../../stores/customer-profile-filter/customer-profile-filter.actions';
import { CustomerProfileQueryParams } from '../../models/customer-profile-query-params.model';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { CustomerProfileFilterComponent } from '../customer-profile-filter/customer-profile-filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { checkCustomerStatus } from 'src/app/shared/utils/check-customer-status';
import { PartyType } from '@app/shared/utils/enums/party-type.enum';
import { CustomerType } from '@app/shared/utils/enums/customer-type.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-customer-profile-list',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent, CustomerProfileFilterComponent],
  templateUrl: './customer-profile-list.component.html',
  styleUrl: './customer-profile-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerProfileListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  tableColumns: WritableSignal<TableColumn[]> = signal(customerProfilesColumns);

  customerProfiles$: Observable<CustomerProfileDataTable[]> = this.store
    .select(customerProfileListSelectors.selectCustomerProfiles)
    .pipe(
      map((customerProfiles) => {
        return customerProfiles.map((customerProfile) => ({
          ...customerProfile,
          customerStatus: checkCustomerStatus(customerProfile),
          userType:
            customerProfile.party_type === PartyType.CUSTOMER
              ? CustomerType.INSURED
              : CustomerType.PROSPECT,
        }));
      }),
    );

  pagination$: Observable<Pagination> = this.store.select(
    customerProfileListSelectors.selectPagination,
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getCustomerProfiles'),
  );
  selectCommonSearch$: Observable<string> = this.store.select(
    customerProfileFilterSelectors.selectCommonSearch,
  );

  defaultParams: WritableSignal<Partial<CustomerProfileQueryParams>> = signal({
    page: 0,
    size: 20,
    sort_field: 'createdDate',
    sort_order: 'DESC',
  });

  ngOnInit(): void {
    this.pagination$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pagination) => {
        this.defaultParams.update((params) => ({
          ...params,
          page: pagination.page,
          size: pagination.size,
        }));
      });

    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryParams) => {
        const isBack = queryParams['isBack'] === 'true';

        if (!isBack) {
          this.store.dispatch(customerProfileListActions.reset());
          this.store.dispatch(customerProfileFilterActions.reset());

          this.store.dispatch(
            customerProfileListActions.getCustomerProfiles({
              params: { ...this.defaultParams() },
            }),
          );
        }
      });
  }

  onPageChange(page: number) {
    this.defaultParams.update((params) => ({ ...params, page }));
    this.store.dispatch(
      customerProfileListActions.getCustomerProfiles({
        params: { ...this.defaultParams() },
      }),
    );
  }

  onPageSizeChange(pageSize: number) {
    this.defaultParams.update((params) => ({
      ...params,
      size: pageSize,
      page: 0,
    }));
    this.store.dispatch(
      customerProfileListActions.getCustomerProfiles({
        params: { ...this.defaultParams() },
      }),
    );
  }

  selectCustomer(customer: CustomerProfile) {
    this.router.navigate([
      'user-management/customer-profile',
      customer.party_id,
    ]);
  }
}
