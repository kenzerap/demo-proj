import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ExcludePointByPolicyNoActions from './exclude-point-by-policy-no-list.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectExcludePointPolicyFilters } from './exclude-point-by-policy-no-list.selectors';
import { ExcludePointByPolicyNoService } from '../../services/exclude-point-by-policy-no.service';
import { AuthService } from '@app/core/services/auth-service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';

@Injectable()
export class ExcludePointByPolicyNoListEffects {
  private actions$ = inject(Actions);
  private excludePointByPolicyNoService = inject(
    ExcludePointByPolicyNoService,
  );
  private authService = inject(AuthService);
  private store = inject(Store);

  getExcludePointPolicies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExcludePointByPolicyNoActions.getExcludePointPolicies),
      switchMap(({ queryParams }) => {
        return this.excludePointByPolicyNoService
          .getExcludePointPolicies(queryParams)
          .pipe(
            map((pagedData) =>
              ExcludePointByPolicyNoActions.getExcludePointPoliciesSuccess({
                pagedData,
              }),
            ),
            catchError((error) => {
              return of(
                ExcludePointByPolicyNoActions.getExcludePointPoliciesFailure({
                  error,
                }),
              );
            }),
          );
      }),
    ),
  );

  setExcludePointPolicyFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExcludePointByPolicyNoActions.setExcludePointPolicyFilters),
      withLatestFrom(this.store.select(selectExcludePointPolicyFilters)),
      switchMap(([_, filters]) => {
        return of(
          ExcludePointByPolicyNoActions.getExcludePointPolicies({
            queryParams: filters,
          }),
        );
      }),
    ),
  );

  addPolicyToExcludePoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExcludePointByPolicyNoActions.addPolicyToExcludePoint),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ policy_no }, currentUser]) => {
        return this.excludePointByPolicyNoService
          .addPolicyToExcludePoint({
            policy_no,
            action_by: currentUser?.username,
          })
          .pipe(
            map((excludePointPolicy) =>
              ExcludePointByPolicyNoActions.addPolicyToExcludePointSuccess({
                excludePointPolicy,
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
                title: 'Exclude Point By Policy No',
                message: `Failed to add exclude point policy (${error_code} - ${message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                ExcludePointByPolicyNoActions.addPolicyToExcludePointFailure({
                  messageData,
                }),
              );
            }),
          );
      }),
    ),
  );

  deleteExcludePointPolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExcludePointByPolicyNoActions.deleteExcludePointPolicy),
      switchMap(({ excluded_policy_id }) => {
        return this.excludePointByPolicyNoService
          .deleteExcludePointPolicy(excluded_policy_id)
          .pipe(
            map(() =>
              ExcludePointByPolicyNoActions.deleteExcludePointPolicySuccess(),
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Exclude Point By Policy No',
                message: `Failed to delete exclude point policy (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };
              return of(
                ExcludePointByPolicyNoActions.deleteExcludePointPolicyFailure(
                  { messageData },
                ),
              );
            }),
          );
      }),
    ),
  );
}
