import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CustomerProfileFilterActions from './customer-profile-filter.actions';
import * as CustomerProfileListActions from '../customer-profile-list/customer-profile-list.actions';
import * as CustomerProfileListSelector from '../customer-profile-list/customer-profile-list.selectors';
import { map, withLatestFrom } from 'rxjs/operators';
import { CustomerProfileQueryParams } from '../../models/customer-profile-query-params.model';
import { Store } from '@ngrx/store';

@Injectable()
export class CustomerProfileFilterEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);

  searchCustomerProfiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerProfileFilterActions.searchCustomerProfiles),
      withLatestFrom(
        this.store.select(CustomerProfileListSelector.selectPagination)
      ),
      map(([{ commonSearch, policyNumber, certificateNumber }, pagination]) => {
        const params: Partial<CustomerProfileQueryParams> = {
          page: 0,
          size: pagination.size,
          keyword: commonSearch?.trim() || '',
          policy_no: policyNumber?.trim() || '',
          cert_no: certificateNumber?.trim() || '',
          sort_field: 'createdDate',
          sort_order: 'DESC',
        };
        return CustomerProfileListActions.getCustomerProfiles({ params });
      })
    )
  );
}
