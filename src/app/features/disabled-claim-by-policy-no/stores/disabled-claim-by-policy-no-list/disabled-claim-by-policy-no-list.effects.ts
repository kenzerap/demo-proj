import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as DisabledClaimByPolicyNoActions from './disabled-claim-by-policy-no-list.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDisabledClaimPolicyFilters } from './disabled-claim-by-policy-no-list.selectors';
import { DisabledClaimByPolicyNoService } from '../../services/disabled-claim-by-policy-no.service';
import { AuthService } from '@app/core/services/auth-service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';

@Injectable()
export class DisabledClaimByPolicyNoListEffects {
  private actions$ = inject(Actions);
  private disabledClaimByPolicyNoService = inject(
    DisabledClaimByPolicyNoService,
  );
  private authService = inject(AuthService);
  private store = inject(Store);

  getDisabledClaimPolicies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DisabledClaimByPolicyNoActions.getDisabledClaimPolicies),
      switchMap(({ queryParams }) => {
        return this.disabledClaimByPolicyNoService
          .getDisabledClaimPolicies(queryParams)
          .pipe(
            map((pagedData) =>
              DisabledClaimByPolicyNoActions.getDisabledClaimPoliciesSuccess({
                pagedData,
              }),
            ),
            catchError((error) => {
              return of(
                DisabledClaimByPolicyNoActions.getDisabledClaimPoliciesFailure({
                  error,
                }),
              );
            }),
          );
      }),
    ),
  );

  setDisabledClaimPolicyFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DisabledClaimByPolicyNoActions.setDisabledClaimPolicyFilters),
      withLatestFrom(this.store.select(selectDisabledClaimPolicyFilters)),
      switchMap(([_, filters]) => {
        return of(
          DisabledClaimByPolicyNoActions.getDisabledClaimPolicies({
            queryParams: filters,
          }),
        );
      }),
    ),
  );

  addPolicyToDisabledClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DisabledClaimByPolicyNoActions.addPolicyToDisabledClaim),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ policy_no }, currentUser]) => {
        return this.disabledClaimByPolicyNoService
          .addPolicyToDisabledClaim({
            policy_no,
            action_by: currentUser?.username,
          })
          .pipe(
            map((disabledClaimPolicy) =>
              DisabledClaimByPolicyNoActions.addPolicyToDisabledClaimSuccess({
                disabledClaimPolicy,
              }),
            ),
            catchError((error) => {
              const error_code = error?.error?.errors?.[0]?.error_code;
              let message = error?.error?.errors?.[0]?.message;

              if (
                error_code?.toString() === '60003' &&
                message === 'Policy not found'
              ) {
                message =
                  'Policy number not found. Please check and try again.';
              }

              let messageData: ToastMessageData = {
                title: 'Disabled Claim By Policy No',
                message: `Failed to add disabled claim policy (${error_code} - ${message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                DisabledClaimByPolicyNoActions.addPolicyToDisabledClaimFailure({
                  messageData,
                }),
              );
            }),
          );
      }),
    ),
  );

  deleteDisabledClaimPolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DisabledClaimByPolicyNoActions.deleteDisabledClaimPolicy),
      switchMap(({ disabled_claim_policy_id }) => {
        return this.disabledClaimByPolicyNoService
          .deleteDisabledClaimPolicy(disabled_claim_policy_id)
          .pipe(
            map(() =>
              DisabledClaimByPolicyNoActions.deleteDisabledClaimPolicySuccess(),
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Disabled Claim By Policy No',
                message: `Failed to delete disabled claim policy (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };
              return of(
                DisabledClaimByPolicyNoActions.deleteDisabledClaimPolicyFailure(
                  { messageData },
                ),
              );
            }),
          );
      }),
    ),
  );
}
