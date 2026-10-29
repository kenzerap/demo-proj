import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PolicyDetailActions from './policy-detail.actions';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerProfileDetailService } from '../../services/customer-profile-detail.service';
import { Store } from '@ngrx/store';
import * as fromPolicyDetailSelectors from './policy-detail.selectors';
import { setLoading } from 'src/app/store/loading/loading.actions';

@Injectable()
export class PolicyDetailEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private customerProfileDetailService = inject(CustomerProfileDetailService);

  getPolicyDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PolicyDetailActions.getPolicyDetail),
      withLatestFrom(
        this.store.select(fromPolicyDetailSelectors.selectPolicyDetails)
      ),
      mergeMap(([{ partyId, policyId }, policyDetails]) => {
        if (policyDetails[policyId]) {
          return of(
            PolicyDetailActions.getPolicyDetailSuccess({
              policyId,
              policyDetail: policyDetails[policyId],
            })
          );
        }

        return this.customerProfileDetailService
          .getPolicyDetail(partyId, policyId)
          .pipe(
            map((policyDetail) =>
              PolicyDetailActions.getPolicyDetailSuccess({
                policyId,
                policyDetail,
              })
            ),
            catchError((error) => {
              return of(
                PolicyDetailActions.getPolicyDetailFailure({ policyId, error })
              );
            })
          );
      })
    )
  );

  startLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PolicyDetailActions.getPolicyDetail),
      concatMap(({ policyId }) => {
        return of(
          setLoading({
            loadingKey: `getPolicyDetail-${policyId}`,
            value: true,
          })
        );
      })
    )
  );

  stopLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PolicyDetailActions.getPolicyDetailSuccess,
        PolicyDetailActions.getPolicyDetailFailure
      ),
      concatMap(({ policyId }) => {
        return of(
          setLoading({
            loadingKey: `getPolicyDetail-${policyId}`,
            value: false,
          })
        );
      })
    )
  );
}
