import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserPermissionsActions from './user-permission.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserPermissionService } from '@app/shared/services/user-permission.service';
import { AuthService } from '@app/core/services/auth-service';
import { selectUserPermissions } from './user-permission.selectors';
import { decryptData, hashString } from '@app/shared/utils/crypto';
import { UserPermission } from '@app/shared/models/user-permission.model';
import { userPermission } from '@app/shared/constants/dummy-data.const';

@Injectable()
export class UserPermissionsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private userPermissionService = inject(UserPermissionService);

  getUserPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserPermissionsActions.getUserPermissions),
      withLatestFrom(
        this.authService.getCurrentUser$(),
        this.store.select(selectUserPermissions)
      ),
      switchMap(([_, currentUser, userPermissions]) => {
        if (userPermissions) {
          return of(
            UserPermissionsActions.getUserPermissionsSuccess({
              data: userPermissions as any,
            })
          );
        }

        return this.userPermissionService.getUserPermissions().pipe(
          map((data) => {
            const email = currentUser?.email || '';
            const hash = hashString(email);
            const key = hash.substring(0, 16);

            // dummy data userPermission
            // const decryptedString = JSON.stringify(userPermission);
            const decryptedString = decryptData(data.data, key);

            if (!decryptedString) {
              return UserPermissionsActions.getUserPermissionsFailure({
                data: {
                  error: {
                    errors: [
                      {
                        error_code: 'DECRYPTION_FAILED',
                        message: 'Failed to get user permissions data',
                      },
                    ],
                  },
                  title: 'User permissions',
                  status_code: 500,
                },
              });
            }

            const dataObject = JSON.parse(decryptedString);
            const result: UserPermission = {
              data: dataObject,
              status_code: data.status_code,
            };

            return UserPermissionsActions.getUserPermissionsSuccess({
              data: result,
            });
          }),
          catchError((error) => {
            return of(
              UserPermissionsActions.getUserPermissionsFailure({
                data: error,
              })
            );
          })
        );
      })
    )
  );
}
