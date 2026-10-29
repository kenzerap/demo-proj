import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CreateEditPointRuleActions from './create-edit-point-rule.actions';

import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { PointRuleSettingService } from '../../services/point-rule-setting.service';
import { CreateEditPointRulesQueryParams } from '../../models/create-edit-point-rule-query-params.model';
import { CommonTierSegmentService } from '@app/shared/services/common-tier-segment.service';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { CommonContentService } from '@app/shared/services/common-content.service';

@Injectable()
export class CreateEditPointRuleEffects {
  private actions$ = inject(Actions);
  private pointRuleSettingService = inject(PointRuleSettingService);
  private authService = inject(AuthService);
  private commonTierSegmentService = inject(CommonTierSegmentService);
  private commonContentService = inject(CommonContentService);

  createPointRule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPointRuleActions.createPointRule),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ queryParams }, currentUser]) => {
        const params: Partial<CreateEditPointRulesQueryParams> = {
          ...queryParams,
          action_done_by: currentUser?.username,
        };

        return this.pointRuleSettingService.createPointRule(params).pipe(
          map(() => CreateEditPointRuleActions.createPointRuleSuccess()),
          catchError((error) => {
            if (
              !(error?.error?.errors?.[0]?.message || '').includes(
                'An active rule with the same Category'
              )
            ) {
              const messageData: ToastMessageData = {
                title: 'Point Rule',
                message: `Failed to create Point Rule (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                pushMessage({ messageData }),
                CreateEditPointRuleActions.createPointRuleFailure({
                  duplicated: false,
                  messageData,
                })
              );
            }

            return of(
              CreateEditPointRuleActions.createPointRuleFailure({
                duplicated: true,
                messageData: {
                  title: 'Duplicate Rule Detected',
                  message: `<div>${error?.error?.errors?.[0]?.message}</div><br/>
                  <div>Please adjust the effective period or modify the rule details to avoid conflicts.</div>`,
                  type: ToastMessageType.ERROR,
                },
              })
            );
          })
        );
      })
    )
  );

  getTierGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPointRuleActions.getTierGroups),
      switchMap(({ page, size }) => {
        return this.commonTierSegmentService.getTierGroupList(page, size).pipe(
          map((data) =>
            CreateEditPointRuleActions.getTierGroupsSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditPointRuleActions.getTierGroupsFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getPointRuleDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPointRuleActions.getPointRuleDetail),
      switchMap(({ pointRuleId }) => {
        return this.pointRuleSettingService
          .getPointRuleDetail(pointRuleId)
          .pipe(
            map((pointRule) =>
              CreateEditPointRuleActions.getPointRuleDetailSuccess({
                pointRule,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditPointRuleActions.getPointRuleDetailFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  updatePointRule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPointRuleActions.updatePointRule),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data }, currentUser]) => {
        const dataBody: Partial<CreateEditPointRulesQueryParams> = {
          ...data,
          action_done_by: currentUser?.username,
        };

        return this.pointRuleSettingService.updatePointRule(dataBody).pipe(
          map(() => CreateEditPointRuleActions.updatePointRuleSuccess()),
          catchError((error) => {
            if (
              !(error?.error?.errors?.[0]?.message || '').includes(
                'An active rule with the same Category'
              )
            ) {
              const messageData: ToastMessageData = {
                title: 'Point Rule',
                message: `Failed to update Point Rule (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                pushMessage({ messageData }),
                CreateEditPointRuleActions.updatePointRuleFailure({
                  duplicated: false,
                  messageData,
                })
              );
            }

            return of(
              CreateEditPointRuleActions.updatePointRuleFailure({
                duplicated: true,
                messageData: {
                  title: 'Duplicate Rule Detected',
                  message: `<div>${error?.error?.errors?.[0]?.message}</div><br/>
                  <div>Please adjust the effective period or modify the rule details to avoid conflicts.</div>`,
                  type: ToastMessageType.ERROR,
                },
              })
            );
          })
        );
      })
    )
  );

  getPolicyChannels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPointRuleActions.getPolicyChannels),
      switchMap(() => {
        return this.commonContentService.getPolicyChannels().pipe(
          map((channels) =>
            CreateEditPointRuleActions.getPolicyChannelsSuccess({
              data: channels || [],
            })
          ),
          catchError((error) => {
            return of(
              CreateEditPointRuleActions.getPolicyChannelsFailure({ error })
            );
          })
        );
      })
    )
  );

  getProductNames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPointRuleActions.getProductNames),
      switchMap(() => {
        return this.commonContentService.getProductNameList().pipe(
          map((productNames) =>
            CreateEditPointRuleActions.getProductNamesSuccess({
              data: productNames || [],
            })
          ),
          catchError((error) => {
            return of(
              CreateEditPointRuleActions.getProductNamesFailure({ error })
            );
          })
        );
      })
    )
  );
}
