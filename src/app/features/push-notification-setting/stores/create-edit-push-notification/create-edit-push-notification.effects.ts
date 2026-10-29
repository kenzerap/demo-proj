import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../services/notification.service';
import * as CreateEditPushNotificationActions from './create-edit-push-notification.actions';
import * as CreateEditPushNotificationSelectors from './create-edit-push-notification.selectors';

import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { PrivilegeService } from '@app/shared/services/privilege.service';
import { AuthService } from '@app/core/services/auth-service';
import { CreateEditNotificationsQueryParams } from '../../models/create-edit-notifications-query-params.model';
import { CommonTierSegmentService } from '@app/shared/services/common-tier-segment.service';
import { TargetGroupsUserSummaryQueryParams } from '@app/shared/models/target-groups-user-summary.model';

@Injectable()
export class CreateEditPushNotificationEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private commonTierSegmentService = inject(CommonTierSegmentService);
  private privilegeService = inject(PrivilegeService);
  private authService = inject(AuthService);

  createPushNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPushNotificationActions.createPushNotification),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ queryParams }, currentUser]) => {
        const params: Partial<CreateEditNotificationsQueryParams> = {
          ...queryParams,
          created_by: currentUser?.username,
        };

        return this.notificationService.createNotifications(params).pipe(
          map(() =>
            CreateEditPushNotificationActions.createPushNotificationSuccess()
          ),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Push notification',
              message: `Failed to create Push notification (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditPushNotificationActions.createPushNotificationFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  getPrivileges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPushNotificationActions.getPrivileges),
      switchMap(() => {
        return this.privilegeService.getPrivileges().pipe(
          map((data) =>
            CreateEditPushNotificationActions.getPrivilegesSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditPushNotificationActions.getPrivilegesFailure({ error })
            );
          })
        );
      })
    )
  );

  getNotificationDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPushNotificationActions.getNotificationDetail),
      switchMap(({ notificationId }) => {
        return this.notificationService
          .getNotificationDetail(notificationId)
          .pipe(
            map((notification) =>
              CreateEditPushNotificationActions.getNotificationDetailSuccess({
                notification,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditPushNotificationActions.getNotificationDetailFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  updatePushNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPushNotificationActions.updatePushNotification),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ notificationId, data }, currentUser]) => {
        const dataBody: Partial<CreateEditNotificationsQueryParams> = {
          ...data,
          updated_by: currentUser?.username,
        };

        return this.notificationService
          .updateNotification(notificationId, dataBody)
          .pipe(
            map(() =>
              CreateEditPushNotificationActions.updatePushNotificationSuccess()
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Push notification',
                message: `Failed to update Push notification (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditPushNotificationActions.updatePushNotificationFailure(
                  {
                    messageData,
                  }
                )
              );
            })
          );
      })
    )
  );

  getTierGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPushNotificationActions.getTierGroups),
      switchMap(({ page, size }) => {
        return this.commonTierSegmentService.getTierGroupList(page, size).pipe(
          map((data) =>
            CreateEditPushNotificationActions.getTierGroupsSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditPushNotificationActions.getTierGroupsFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getSegmentGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPushNotificationActions.getSegmentGroups),
      switchMap(({ page, size }) => {
        return this.commonTierSegmentService
          .getSegmentGroupList(page, size)
          .pipe(
            map((data) =>
              CreateEditPushNotificationActions.getSegmentGroupsSuccess({
                data,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditPushNotificationActions.getSegmentGroupsFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  targetGroupUserSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPushNotificationActions.getTargetGroupUserSummary),
      withLatestFrom(
        this.store.select(
          CreateEditPushNotificationSelectors.selectIncludeExcludeSegmentTier
        )
      ),
      switchMap(([{ target_group_id }, items]) => {
        const included_tier_ids = items
          .filter((item) => {
            return item.type === 'tier' && item.isInclude;
          })
          .map((item) => item.id);
        const excluded_tier_ids = items
          .filter((item) => {
            return item.type === 'tier' && !item.isInclude;
          })
          .map((item) => item.id);
        const included_segment_ids = items
          .filter((item) => {
            return item.type === 'segmentation' && item.isInclude;
          })
          .map((item) => item.id);
        const excluded_segment_ids = items
          .filter((item) => {
            return item.type === 'segmentation' && !item.isInclude;
          })
          .map((item) => item.id);

        const params: Partial<TargetGroupsUserSummaryQueryParams> = {
          target_group_id,
          included_tier_ids,
          excluded_tier_ids,
          included_segment_ids,
          excluded_segment_ids,
        };

        return this.commonTierSegmentService
          .getTargetGroupsUserSummary(params)
          .pipe(
            map((data) =>
              CreateEditPushNotificationActions.getTargetGroupUserSummarySuccess(
                {
                  data,
                }
              )
            ),
            catchError((error) => {
              return of(
                CreateEditPushNotificationActions.getTargetGroupUserSummaryFailure(
                  {
                    error,
                  }
                )
              );
            })
          );
      })
    )
  );
}
