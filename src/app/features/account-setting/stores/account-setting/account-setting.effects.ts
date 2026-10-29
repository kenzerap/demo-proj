import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AccountSettingsActions from './account-setting.actions';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountSettingService } from '../../services/account-setting.service';
import { Store } from '@ngrx/store';
import { selectAccountSettingFilters } from './account-setting.selectors';
import { AuthService } from '@app/core/services/auth-service';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { CreateUserQueryParams } from '../../models/create-user-query-params.model';
import { GetUsersQueryParams } from '../../models/get-users-query-params.model';

@Injectable()
export class AccountSettingsEffects {
  private actions$ = inject(Actions);
  private accountSettingService = inject(AccountSettingService);
  private authService = inject(AuthService);
  private store = inject(Store);

  getAccountSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountSettingsActions.getAccountSettings),
      switchMap(({ queryParams }) => {
        return this.accountSettingService.getUserAccounts(queryParams).pipe(
          map((pagedData) =>
            AccountSettingsActions.getAccountSettingsSuccess({ pagedData })
          ),
          catchError((error) => {
            return of(
              AccountSettingsActions.getAccountSettingsFailure({ error })
            );
          })
        );
      })
    )
  );

  setAccountSettingFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountSettingsActions.setAccountSettingFilters),
      withLatestFrom(this.store.select(selectAccountSettingFilters)),
      switchMap(([_, filters]) => {
        return of(
          AccountSettingsActions.getAccountSettings({ queryParams: filters })
        );
      })
    )
  );

  createUserAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountSettingsActions.createUserAccount),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ queryParams }, currentUser]) => {
        const params: Partial<CreateUserQueryParams> = {
          ...queryParams,
          created_by: currentUser?.username,
        };

        return this.accountSettingService.createUser(params).pipe(
          map(() => AccountSettingsActions.createUserAccountSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Create user',
              message: `Failed to create user (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              AccountSettingsActions.createUserAccountFailure({ messageData })
            );
          })
        );
      })
    )
  );

  createUserAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountSettingsActions.createUserAccountSuccess),
      mergeMap(() => {
        const messageData: ToastMessageData = {
          title: 'Create user',
          message: `User created successfully.`,
          type: ToastMessageType.SUCCESS,
        };

        return of(pushMessage({ messageData, duration: 3000 }));
      })
    )
  );

  refreshList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountSettingsActions.createUserAccountSuccess),
      mergeMap(() => {
        const filters: Partial<GetUsersQueryParams> = {
          page: 0,
          size: 20,
        };

        return of(AccountSettingsActions.setAccountSettingFilters({ filters }));
      })
    )
  );

  getGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountSettingsActions.getGroups),
      switchMap(() => {
        return this.accountSettingService.getGroups().pipe(
          map((data) => AccountSettingsActions.getGroupsSuccess({ data })),
          catchError((error) => {
            return of(AccountSettingsActions.getGroupsFailure({ error }));
          })
        );
      })
    )
  );
}
