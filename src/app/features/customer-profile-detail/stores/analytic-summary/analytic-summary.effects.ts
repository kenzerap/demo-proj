import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AnalyticSummaryActions from './analytic-summary.actions';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerProfileDetailService } from '../../services/customer-profile-detail.service';
import { CustomerPointService } from '../../services/customer-point.service';
import { CustomerPointResource } from 'src/app/shared/utils/enums/customer-point-resource';
import { CustomerTierService } from '../../services/custormer-tier.service';

@Injectable()
export class AnalyticSummaryEffects {
  private actions$ = inject(Actions);
  private customerProfileDetailService = inject(CustomerProfileDetailService);
  private customerPointService = inject(CustomerPointService);
  private customerTierService = inject(CustomerTierService);

  getAnalyticSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticSummaryActions.getAnalyticSummary),
      concatMap(({ partyId }) => [
        AnalyticSummaryActions.getCustomerPolicy({ partyId }),
        AnalyticSummaryActions.getCustomerPoint({ partyId }),
        AnalyticSummaryActions.getCustomerTier({ partyId }),
        AnalyticSummaryActions.getClientsInfoSvoc({ partyId }),
      ])
    )
  );

  getCustomerPolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticSummaryActions.getCustomerPolicy),
      switchMap(({ partyId }) => {
        return this.customerProfileDetailService
          .getCustomerPolicy(partyId)
          .pipe(
            map((customerPolicy) =>
              AnalyticSummaryActions.getCustomerPolicySuccess({
                customerPolicy,
              })
            ),
            catchError((error) => {
              return of(
                AnalyticSummaryActions.getCustomerPolicyFailure({ error })
              );
            })
          );
      })
    )
  );

  getCustomerTier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticSummaryActions.getCustomerTier),
      switchMap(({ partyId }) => {
        return this.customerTierService.getCustomerTier(partyId).pipe(
          map((customerTier) =>
            AnalyticSummaryActions.getCustomerTierSuccess({
              customerTier,
            })
          ),
          catchError((error) => {
            return of(AnalyticSummaryActions.getCustomerTierFailure({ error }));
          })
        );
      })
    )
  );

  getCustomerPoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticSummaryActions.getCustomerPoint),
      switchMap(({ partyId }) => {
        return this.customerPointService
          .getCustomerPoint(partyId, [
            CustomerPointResource.EXPIRING_TOTAL_POINTS,
            CustomerPointResource.TOTAL_POINTS,
          ])
          .pipe(
            map((customerPoint) =>
              AnalyticSummaryActions.getCustomerPointSuccess({ customerPoint })
            ),
            catchError((error) => {
              return of(
                AnalyticSummaryActions.getCustomerPointFailure({ error })
              );
            })
          );
      })
    )
  );

  getClientInfoSvoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticSummaryActions.getClientsInfoSvoc),
      switchMap(({ partyId }) => {
        return this.customerProfileDetailService
          .getClientsInfoSvoc(partyId)
          .pipe(
            map((customerClients) =>
              AnalyticSummaryActions.getClientsInfoSvocSuccess({
                clientsInfoSvoc: customerClients,
              })
            ),
            catchError((error) => {
              return of(
                AnalyticSummaryActions.getClientsInfoSvocFailure({ error })
              );
            })
          );
      })
    )
  );
}
