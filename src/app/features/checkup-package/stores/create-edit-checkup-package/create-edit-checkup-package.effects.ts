import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CreateEditCheckupPackageActions from './create-edit-checkup-package.actions';

import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { CheckupPackageService } from '../../services/checkup-package.services';
import { CreateEditCheckupPackageQueryParams } from '../../models/create-edit-checkup-package-query-params.model';

@Injectable()
export class CreateEditCheckupPackageEffects {
  private actions$ = inject(Actions);
  private checkupPackageService = inject(CheckupPackageService);
  private authService = inject(AuthService);

  createCheckupPackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCheckupPackageActions.createCheckupPackage),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ queryParams }, currentUser]) => {
        const params: Partial<CreateEditCheckupPackageQueryParams> = {
          ...queryParams,
          created_by: currentUser?.username,
        };

        return this.checkupPackageService.createCheckupPackage(params).pipe(
          map(() =>
            CreateEditCheckupPackageActions.createCheckupPackageSuccess()
          ),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Checkup Package',
              message: `Failed to Checkup Package (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditCheckupPackageActions.createCheckupPackageFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  getCheckupPackageDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCheckupPackageActions.getCheckupPackageDetail),
      switchMap(({ checkupPackageId }) => {
        return this.checkupPackageService
          .getCheckupPackageDetail(checkupPackageId)
          .pipe(
            map((checkupPackage) =>
              CreateEditCheckupPackageActions.getCheckupPackageDetailSuccess({
                checkupPackage,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditCheckupPackageActions.getCheckupPackageDetailFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  updateCheckupPackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCheckupPackageActions.updateCheckupPackage),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data }, currentUser]) => {
        const dataBody: Partial<CreateEditCheckupPackageQueryParams> = {
          ...data,
          created_by: currentUser?.username,
        };

        return this.checkupPackageService.updateCheckupPackage(dataBody).pipe(
          map(() =>
            CreateEditCheckupPackageActions.updateCheckupPackageSuccess()
          ),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Checkup Package',
              message: `Failed to update Checkup Package (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditCheckupPackageActions.updateCheckupPackageFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );
}
