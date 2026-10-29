import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PopupAnnouncementService } from '../../services/popup-announcement.service';
import * as CreateEditPopupAnnouncementActions from './create-edit-popup-announcement.actions';
import * as CreateEditPopupAnnouncementSelectors from './create-edit-popup-announcement.selectors';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { PrivilegeService } from '@app/shared/services/privilege.service';
import { CreateEditPopupAnnouncementQueryParams } from '../../models/create-edit-popup-announcement-query-params.model';
import { CommonNotificationService } from '@app/shared/services/common-notification.service';
import { CommonTierSegmentService } from '@app/shared/services/common-tier-segment.service';
import { TargetGroupsUserSummaryQueryParams } from '@app/shared/models/target-groups-user-summary.model';

@Injectable()
export class CreateEditPopupAnnouncementEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private popupAnnouncementService = inject(PopupAnnouncementService);
  private commonNotificationService = inject(CommonNotificationService);
  private commonTierSegmentService = inject(CommonTierSegmentService);
  private authService = inject(AuthService);
  private privilegeService = inject(PrivilegeService);

  createPopupAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPopupAnnouncementActions.createPopupAnnouncement),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data, file }, currentUser]) => {
        const dataBody: Partial<CreateEditPopupAnnouncementQueryParams> = {
          ...data,
          createdBy: currentUser?.username,
        };

        return this.popupAnnouncementService
          .createPopupAnnouncement(dataBody, file)
          .pipe(
            map(() =>
              CreateEditPopupAnnouncementActions.createPopupAnnouncementSuccess()
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Popup announcement',
                message: `Failed to create Popup announcement (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditPopupAnnouncementActions.createPopupAnnouncementFailure(
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

  updatePopupAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPopupAnnouncementActions.updatePopupAnnouncement),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data, file }, currentUser]) => {
        const dataBody: Partial<CreateEditPopupAnnouncementQueryParams> = {
          ...data,
          createdBy: currentUser?.username,
        };

        return this.popupAnnouncementService
          .editPopupAnnouncement(dataBody, file)
          .pipe(
            map(() =>
              CreateEditPopupAnnouncementActions.updatePopupAnnouncementSuccess()
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Popup announcement',
                message: `Failed to update Popup announcement (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditPopupAnnouncementActions.updatePopupAnnouncementFailure(
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

  getPrivileges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPopupAnnouncementActions.getPrivileges),
      switchMap(() => {
        return this.privilegeService.getPrivileges().pipe(
          map((data) =>
            CreateEditPopupAnnouncementActions.getPrivilegesSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditPopupAnnouncementActions.getPrivilegesFailure({ error })
            );
          })
        );
      })
    )
  );

  getPopupAnnouncementDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPopupAnnouncementActions.getPopupAnnouncementDetail),
      switchMap(({ id }) => {
        return this.popupAnnouncementService
          .getPopupAnnouncementDetail(id)
          .pipe(
            map((popupAnnouncement) =>
              CreateEditPopupAnnouncementActions.getPopupAnnouncementDetailSuccess(
                {
                  popupAnnouncement,
                }
              )
            ),
            catchError((error) => {
              return of(
                CreateEditPopupAnnouncementActions.getPopupAnnouncementDetailFailure(
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

  getTierGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPopupAnnouncementActions.getTierGroups),
      switchMap(({ page, size }) => {
        return this.commonTierSegmentService.getTierGroupList(page, size).pipe(
          map((data) =>
            CreateEditPopupAnnouncementActions.getTierGroupsSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditPopupAnnouncementActions.getTierGroupsFailure({
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
      ofType(CreateEditPopupAnnouncementActions.getSegmentGroups),
      switchMap(({ page, size }) => {
        return this.commonTierSegmentService
          .getSegmentGroupList(page, size)
          .pipe(
            map((data) =>
              CreateEditPopupAnnouncementActions.getSegmentGroupsSuccess({
                data,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditPopupAnnouncementActions.getSegmentGroupsFailure({
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
      ofType(CreateEditPopupAnnouncementActions.getTargetGroupUserSummary),
      withLatestFrom(
        this.store.select(
          CreateEditPopupAnnouncementSelectors.selectIncludeExcludeSegmentTier
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
              CreateEditPopupAnnouncementActions.getTargetGroupUserSummarySuccess(
                { data }
              )
            ),
            catchError((error) => {
              return of(
                CreateEditPopupAnnouncementActions.getTargetGroupUserSummaryFailure(
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
