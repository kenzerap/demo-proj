import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CustomerProfileListActions from './customer-profile-list.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerProfileService } from '../../services/customer-profile.service';
import { Store } from '@ngrx/store';
import * as customerProfileFilterSelectors from '../customer-profile-filter/customer-profile-filter.selectors';

@Injectable()
export class CustomerProfileListEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private customerProfileService = inject(CustomerProfileService);

  getCustomerProfiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerProfileListActions.getCustomerProfiles),
      withLatestFrom(
        this.store.select(customerProfileFilterSelectors.selectCommonSearch),
        this.store.select(customerProfileFilterSelectors.selectPolicyNumber),
        this.store.select(customerProfileFilterSelectors.selectCertificateNumber),
      ),
      switchMap(([{ params }, commonSearch, policyNumber, certificateNumber]) => {
        return this.customerProfileService
          .getCustomerProfiles({
            ...params,
            keyword: commonSearch?.trim() || '',
            policy_no: policyNumber?.trim() || '',
            cert_no: certificateNumber?.trim() || '',
          })
          .pipe(
            map((pagedData) =>
              CustomerProfileListActions.getCustomerProfilesSuccess({
                pagedData,
              })
            ),
            catchError((error) => {
              return of(
                CustomerProfileListActions.getCustomerProfilesFailure({ error })
              );
            })
          );
      })
    )
  );
}
