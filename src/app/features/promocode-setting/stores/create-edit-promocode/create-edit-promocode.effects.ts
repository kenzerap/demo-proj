import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as CreateEditPromocodeActions from './create-edit-promocode.actions';
import * as CreateEditPromocodeSelectors from './create-edit-promocode.selectors';

import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { PromocodeSettingService } from '../../services/promocode-setting.service';
import { CreateEditPromocodesQueryParams } from '../../models/create-edit-promocode-query-params.model';
import { CommonContentService } from '@app/shared/services/common-content.service';
import { PrivilegeService } from '@app/shared/services/privilege.service';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';

@Injectable()
export class CreateEditPromocodeEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private promocodeSettingService = inject(PromocodeSettingService);
  private authService = inject(AuthService);
  private commonContentService = inject(CommonContentService);
  private privilegeService = inject(PrivilegeService);

  createPromocode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPromocodeActions.createPromocode),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ queryParams }, currentUser]) => {
        const params: Partial<CreateEditPromocodesQueryParams> = {
          ...queryParams,
          created_by: currentUser?.username,
        };

        return this.promocodeSettingService.createPromocode(params).pipe(
          map((response) =>
            CreateEditPromocodeActions.createPromocodeSuccess({ response })
          ),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Promocode',
              message: `Failed to create promocode (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditPromocodeActions.createPromocodeFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  getPromocodeDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPromocodeActions.getPromocodeDetail),
      switchMap(({ promocodeId }) => {
        return this.promocodeSettingService
          .getPromocodeDetail(promocodeId)
          .pipe(
            map((promocode) =>
              CreateEditPromocodeActions.getPromocodeDetailSuccess({
                promocode,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditPromocodeActions.getPromocodeDetailFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  updatePromocode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPromocodeActions.updatePromocode),
      withLatestFrom(
        this.authService.getCurrentUser$(),
        this.store.select(CreateEditPromocodeSelectors.selectPromocodeDetail)
      ),
      switchMap(([{ data }, currentUser, promocodeDetail]) => {
        const dataBody: Partial<CreateEditPromocodesQueryParams> = {
          ...data,
          updated_by: currentUser?.username,
          created_by: promocodeDetail?.created_by,
        };

        return this.promocodeSettingService.updatePromocode(dataBody).pipe(
          map(() => CreateEditPromocodeActions.updatePromocodeSuccess()),
          catchError((error) => {
            if (error?.status !== 409) {
              const messageData: ToastMessageData = {
                title: 'Promocode',
                message: `Failed to update promocode (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                pushMessage({ messageData }),
                CreateEditPromocodeActions.updatePromocodeFailure({
                  duplicated: false,
                  promocode_name: '',
                  promocode_id: null,
                })
              );
            }

            return of(
              CreateEditPromocodeActions.updatePromocodeFailure({
                duplicated: true,
                promocode_name: error?.error?.data[0]?.name,
                promocode_id: error?.error?.data[0]?.promocode_id,
              })
            );
          })
        );
      })
    )
  );

  getPolicyChannels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPromocodeActions.getPolicyChannels),
      switchMap(() => {
        return this.commonContentService.getPolicyChannels().pipe(
          map((rows) =>
            CreateEditPromocodeActions.getPolicyChannelsSuccess({
              data: rows || [],
            })
          ),
          catchError((error) => {
            return of(
              CreateEditPromocodeActions.getPolicyChannelsFailure({ error })
            );
          })
        );
      })
    )
  );

  getPrivileges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPromocodeActions.getPrivileges),
      switchMap(() => {
        return this.privilegeService.getPrivileges().pipe(
          map((data) =>
            CreateEditPromocodeActions.getPrivilegesSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditPromocodeActions.getPrivilegesFailure({ error })
            );
          })
        );
      })
    )
  );
}
