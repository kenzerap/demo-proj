import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { SplashScreenManagementService } from '../../services/splash-screen-management.service';
import * as CreateEditSplashScreenActions from './create-edit-splash-screen.actions';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { CreateEditSplashScreenQueryParams } from '../../models/create-edit-splash-screen-query-params.model';

@Injectable()
export class CreateEditSplashScreenEffects {
  private actions$ = inject(Actions);
  private splashScreenManagementService = inject(SplashScreenManagementService);
  private authService = inject(AuthService);

  createSplashScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditSplashScreenActions.createSplashScreen),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data, file }, currentUser]) => {
        const dataBody: Partial<CreateEditSplashScreenQueryParams> = {
          ...data,
          created_by: currentUser?.username,
        };

        return this.splashScreenManagementService
          .createSplashScreen(dataBody, file)
          .pipe(
            map(() => CreateEditSplashScreenActions.createSplashScreenSuccess()),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Splash Screen',
                message: `Failed to create Splash Screen (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditSplashScreenActions.createSplashScreenFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  updateSplashScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditSplashScreenActions.updateSplashScreen),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ id, data, file }, currentUser]) => {
        const dataBody: Partial<CreateEditSplashScreenQueryParams> = {
          ...data,
          created_by: currentUser?.username,
        };

        return this.splashScreenManagementService
          .editSplashScreen(id, dataBody, file)
          .pipe(
            map(() => CreateEditSplashScreenActions.updateSplashScreenSuccess()),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Splash Screen',
                message: `Failed to update Splash Screen (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditSplashScreenActions.updateSplashScreenFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  getSplashScreenDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditSplashScreenActions.getSplashScreenDetail),
      switchMap(({ id }) => {
        return this.splashScreenManagementService.getSplashScreenDetail(id).pipe(
          map((splashScreenDetail) =>
            CreateEditSplashScreenActions.getSplashScreenDetailSuccess({
              splashScreenDetail,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditSplashScreenActions.getSplashScreenDetailFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getSplashScreenDisplayOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditSplashScreenActions.getSplashScreenDisplayOrders),
      switchMap(() => {
        return this.splashScreenManagementService
          .getSplashScreenDisplayOrders()
          .pipe(
            map((data) =>
              CreateEditSplashScreenActions.getSplashScreenDisplayOrdersSuccess({
                data,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditSplashScreenActions.getSplashScreenDisplayOrdersFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );
}
