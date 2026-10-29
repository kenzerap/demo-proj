import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BannerSettingService } from '../../services/banner-setting.service';
import * as CreateEditBannerSettingActions from './create-edit-banner-setting.actions';
import * as CreateEditBannerSettingSelectors from './create-edit-banner-setting.selectors';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { PrivilegeService } from '@app/shared/services/privilege.service';
import { CreateEditBannerSettingQueryParams } from '../../models/create-edit-banner-setting-query-params.model';
import { CommonNotificationService } from '@app/shared/services/common-notification.service';
import { CommonTierSegmentService } from '@app/shared/services/common-tier-segment.service';
import { TargetGroupsUserSummaryQueryParams } from '@app/shared/models/target-groups-user-summary.model';
import { Store } from '@ngrx/store';

@Injectable()
export class CreateEditBannerSettingEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private bannerSettingService = inject(BannerSettingService);
  private commonNotificationService = inject(CommonNotificationService);
  private commonTierSegmentService = inject(CommonTierSegmentService);
  private authService = inject(AuthService);
  private privilegeService = inject(PrivilegeService);

  createBannerSetting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBannerSettingActions.createBannerSetting),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data, file }, currentUser]) => {
        const dataBody: Partial<CreateEditBannerSettingQueryParams> = {
          ...data,
          created_by: currentUser?.username,
        };

        return this.bannerSettingService
          .createBannerSetting(dataBody, file)
          .pipe(
            map(() =>
              CreateEditBannerSettingActions.createBannerSettingSuccess()
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Banner setting',
                message: `Failed to create Banner setting (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditBannerSettingActions.createBannerSettingFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  updateBannerSetting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBannerSettingActions.updateBannerSetting),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data, file }, currentUser]) => {
        const dataBody: Partial<CreateEditBannerSettingQueryParams> = {
          ...data,
          updated_by: currentUser?.username,
        };

        return this.bannerSettingService.editBannerSetting(dataBody, file).pipe(
          map(() =>
            CreateEditBannerSettingActions.updateBannerSettingSuccess()
          ),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Banner setting',
              message: `Failed to update Banner setting (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditBannerSettingActions.updateBannerSettingFailure({
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
      ofType(CreateEditBannerSettingActions.getPrivileges),
      switchMap(() => {
        return this.privilegeService.getPrivileges().pipe(
          map((data) =>
            CreateEditBannerSettingActions.getPrivilegesSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditBannerSettingActions.getPrivilegesFailure({ error })
            );
          })
        );
      })
    )
  );

  getBannerSettingDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBannerSettingActions.getBannerSettingDetail),
      switchMap(({ id }) => {
        return this.bannerSettingService.getBannerSettingDetail(id).pipe(
          map((bannerSetting) =>
            CreateEditBannerSettingActions.getBannerSettingDetailSuccess({
              bannerSetting,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditBannerSettingActions.getBannerSettingDetailFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getTierGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBannerSettingActions.getTierGroups),
      switchMap(({ page, size }) => {
        return this.commonTierSegmentService.getTierGroupList(page, size).pipe(
          map((data) =>
            CreateEditBannerSettingActions.getTierGroupsSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditBannerSettingActions.getTierGroupsFailure({
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
      ofType(CreateEditBannerSettingActions.getSegmentGroups),
      switchMap(({ page, size }) => {
        return this.commonTierSegmentService
          .getSegmentGroupList(page, size)
          .pipe(
            map((data) =>
              CreateEditBannerSettingActions.getSegmentGroupsSuccess({
                data,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditBannerSettingActions.getSegmentGroupsFailure({
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
      ofType(CreateEditBannerSettingActions.getTargetGroupUserSummary),
      withLatestFrom(
        this.store.select(
          CreateEditBannerSettingSelectors.selectIncludeExcludeSegmentTier
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
              CreateEditBannerSettingActions.getTargetGroupUserSummarySuccess({
                data,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditBannerSettingActions.getTargetGroupUserSummaryFailure(
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
