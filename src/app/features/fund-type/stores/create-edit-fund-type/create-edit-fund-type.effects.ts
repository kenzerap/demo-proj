import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as CreateEditFundTypeActions from './create-edit-fund-type.actions';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { FundTypeService } from '../../services/fund-type.service';
import { AuthService } from '@app/core/services/auth-service';
import { CreateEditFundTypeQueryParams } from '../../models/create-edit-fund-type-query-params.model';

@Injectable()
export class CreateEditFundTypeEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private fundTypeService = inject(FundTypeService);

  createFundType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditFundTypeActions.createFundType),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ queryParams }, currentUser]) => {
        const params: Partial<CreateEditFundTypeQueryParams> = {
          ...queryParams,
          action_by: currentUser?.username,
        };

        return this.fundTypeService.createFundType(params).pipe(
          map(() => CreateEditFundTypeActions.createFundTypeSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Fund Type',
              message: `Failed to create Fund Type (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditFundTypeActions.createFundTypeFailure({ messageData }),
            );
          }),
        );
      }),
    ),
  );

  updateFundType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditFundTypeActions.updateFundType),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data }, currentUser]) => {
        const params: Partial<CreateEditFundTypeQueryParams> = {
          ...data,
          action_by: currentUser?.username,
        };

        return this.fundTypeService.updateFundType(params).pipe(
          map(() => CreateEditFundTypeActions.updateFundTypeSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Fund Type',
              message: `Failed to update Fund Type (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditFundTypeActions.updateFundTypeFailure({ messageData }),
            );
          }),
        );
      }),
    ),
  );

  getFundTypeDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditFundTypeActions.getFundTypeDetail),
      switchMap(({ fundId }) => {
        return this.fundTypeService.getFundTypeDetail(fundId).pipe(
          map((fundType) =>
            CreateEditFundTypeActions.getFundTypeDetailSuccess({ fundType }),
          ),
          catchError((error) => {
            return of(
              CreateEditFundTypeActions.getFundTypeDetailFailure({ error }),
            );
          }),
        );
      }),
    ),
  );

  getFundTypeOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditFundTypeActions.getFundTypeOptions),
      switchMap(() => {
        return this.fundTypeService.getFundTypeOptions().pipe(
          map((fundTypeOptions) =>
            CreateEditFundTypeActions.getFundTypeOptionsSuccess({
              fundTypeOptions,
            }),
          ),
          catchError((error) => {
            return of(
              CreateEditFundTypeActions.getFundTypeOptionsFailure({ error }),
            );
          }),
        );
      }),
    ),
  );
}
