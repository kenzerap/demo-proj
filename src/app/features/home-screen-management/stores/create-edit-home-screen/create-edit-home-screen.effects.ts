import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CreateEditHomeScreenActions from './create-edit-home-screen.actions';

import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { CreateEditHomeScreenQueryParams } from '../../models/create-edit-home-screen-query-params.model';
import { HomeScreenManagementService } from '../../services/home-screen-management.services';
import { CategoryCode } from '../../constants/category-options.const';
import { CommonTierSegmentService } from '@app/shared/services/common-tier-segment.service';

@Injectable()
export class CreateEditHomeScreenEffects {
  private actions$ = inject(Actions);
  private homeScreenManagementService = inject(HomeScreenManagementService);
  private authService = inject(AuthService);
  private commonTierSegmentService = inject(CommonTierSegmentService);

  createHomeScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditHomeScreenActions.createHomeScreen),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ queryParams, files }, currentUser]) => {
        const params: Partial<CreateEditHomeScreenQueryParams> = {
          ...queryParams,
          action_by: currentUser?.username,
        };

        const filesData =
          params.category_type === CategoryCode.GroupByPrivilege ? [] : files;

        return this.homeScreenManagementService
          .createHomeScreen(params, filesData)
          .pipe(
            map(() => CreateEditHomeScreenActions.createHomeScreenSuccess()),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Home screen',
                message: `Failed to create Home screen (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditHomeScreenActions.createHomeScreenFailure({
                  messageData,
                }),
              );
            }),
          );
      }),
    ),
  );

  getHomeScreenDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditHomeScreenActions.getHomeScreenDetail),
      switchMap(({ homeScreenId }) => {
        return this.homeScreenManagementService
          .getHomeScreenManagementDetail(homeScreenId)
          .pipe(
            map((homeScreen) =>
              CreateEditHomeScreenActions.getHomeScreenDetailSuccess({
                homeScreen,
              }),
            ),
            catchError((error) => {
              return of(
                CreateEditHomeScreenActions.getHomeScreenDetailFailure({
                  error,
                }),
              );
            }),
          );
      }),
    ),
  );

  updateHomeScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditHomeScreenActions.updateHomeScreen),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data, files }, currentUser]) => {
        const dataBody: Partial<CreateEditHomeScreenQueryParams> = {
          ...data,
          action_by: currentUser?.username,
        };

        const filesData =
          data.category_type === CategoryCode.GroupByPrivilege ? [] : files;

        return this.homeScreenManagementService
          .updateHomeScreenManagement(dataBody, filesData)
          .pipe(
            map(() => CreateEditHomeScreenActions.updateHomeScreenSuccess()),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Home screen',
                message: `Failed to update Home screen (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditHomeScreenActions.updateHomeScreenFailure({
                  messageData,
                }),
              );
            }),
          );
      }),
    ),
  );

  getTierGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditHomeScreenActions.getTierGroups),
      switchMap(({ page, size }) => {
        return this.commonTierSegmentService.getTierGroupList(page, size).pipe(
          map((data) =>
            CreateEditHomeScreenActions.getTierGroupsSuccess({ data }),
          ),
          catchError((error) => {
            return of(
              CreateEditHomeScreenActions.getTierGroupsFailure({
                error,
              }),
            );
          }),
        );
      }),
    ),
  );
}
