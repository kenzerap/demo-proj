import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ClaimHistoryActions from './claim-history.actions';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerProfileDetailService } from '../../services/customer-profile-detail.service';
import { ClaimHistoriesQueryParams } from '../../models/claim-histories-query-params.model';
import { setLoading } from 'src/app/store/loading/loading.actions';

@Injectable()
export class ClaimHistoryEffects {
  private actions$ = inject(Actions);
  private customerProfileDetailService = inject(CustomerProfileDetailService);

  getClaimHistories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClaimHistoryActions.getClaimHistories),
      mergeMap(({ partyId, policyId, queryParams }) => {
        const params: Partial<ClaimHistoriesQueryParams> = {
          ...queryParams,
          policy_ids: [policyId],
        };

        return this.customerProfileDetailService
          .getClaimHistories(partyId, params)
          .pipe(
            map((pagedData) =>
              ClaimHistoryActions.getClaimHistoriesSuccess({
                policyId,
                pagedData,
              })
            ),
            catchError((error) => {
              return of(
                ClaimHistoryActions.getClaimHistoriesFailure({
                  policyId,
                  error,
                })
              );
            })
          );
      })
    )
  );

  startLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClaimHistoryActions.getClaimHistories),
      concatMap(({ policyId }) => {
        return of(
          setLoading({
            loadingKey: `getClaimHistories-${policyId}`,
            value: true,
          })
        );
      })
    )
  );

  stopLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ClaimHistoryActions.getClaimHistoriesSuccess,
        ClaimHistoryActions.getClaimHistoriesFailure
      ),
      concatMap(({ policyId }) => {
        return of(
          setLoading({
            loadingKey: `getClaimHistories-${policyId}`,
            value: false,
          })
        );
      })
    )
  );
}
