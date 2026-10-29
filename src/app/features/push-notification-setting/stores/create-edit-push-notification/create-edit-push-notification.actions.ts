import { createAction, props } from '@ngrx/store';
import { CreateEditNotificationsQueryParams } from '../../models/create-edit-notifications-query-params.model';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { Privilege } from '@app/shared/models/privilege.model';
import { NotificationDetail } from '../../models/notification.model';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TargetGroupsUserSummary } from '@app/shared/models/target-groups-user-summary.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';

const prefix = '[Create Edit Push Notification]';

export const createPushNotification = createAction(
  `${prefix} Create Push Notification | loadingKey=createNotifications`,
  props<{ queryParams: Partial<CreateEditNotificationsQueryParams> }>()
);

export const createPushNotificationSuccess = createAction(
  `${prefix} Create Push Notification Success | loadingKey=createNotifications`
);

export const createPushNotificationFailure = createAction(
  `${prefix} Create Push Notification Failure | loadingKey=createNotifications`,
  props<{ messageData: ToastMessageData }>()
);

export const getPrivileges = createAction(
  `${prefix} Get Privileges | loadingKey=getPrivileges`
);

export const getPrivilegesSuccess = createAction(
  `${prefix} Get Privileges Success | loadingKey=getPrivileges`,
  props<{ data: Privilege[] }>()
);

export const getPrivilegesFailure = createAction(
  `${prefix} Get Privileges Failure | loadingKey=getPrivileges`,
  props<{ error: CommonError }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getNotificationDetail = createAction(
  `${prefix} Get Notification Detail | loadingKey=getNotificationDetail`,
  props<{ notificationId: string }>()
);

export const getNotificationDetailSuccess = createAction(
  `${prefix} Get Notification Detail Success | loadingKey=getNotificationDetail`,
  props<{ notification: NotificationDetail }>()
);

export const getNotificationDetailFailure = createAction(
  `${prefix} Get Notification Detail Failure | loadingKey=getNotificationDetail`,
  props<{ error: CommonError }>()
);

export const updatePushNotification = createAction(
  `${prefix} Update Push Notification | loadingKey=updatePushNotification`,
  props<{
    notificationId: string;
    data: Partial<CreateEditNotificationsQueryParams>;
  }>()
);

export const updatePushNotificationSuccess = createAction(
  `${prefix} Update Push Notification Success | loadingKey=updatePushNotification`
);

export const updatePushNotificationFailure = createAction(
  `${prefix} Update Push Notification Failure | loadingKey=updatePushNotification`,
  props<{ messageData: ToastMessageData }>()
);

export const setPreviewMessage = createAction(
  `${prefix} Set Preview Message`,
  props<{ title: string; body: string }>()
);

export const getTierGroups = createAction(
  `${prefix} Get Tier Groups | loadingKey=getTierGroups`,
  props<{ page: number; size: number }>()
);

export const getTierGroupsSuccess = createAction(
  `${prefix} Get Tier Groups Success | loadingKey=getTierGroups`,
  props<{ data: PagedData<TierGroup> }>()
);

export const getTierGroupsFailure = createAction(
  `${prefix} Get Tier Groups Failure | loadingKey=getTierGroups`,
  props<{ error: CommonError }>()
);

export const getSegmentGroups = createAction(
  `${prefix} Get Segment Groups | loadingKey=getSegmentGroups`,
  props<{ page: number; size: number }>()
);

export const getSegmentGroupsSuccess = createAction(
  `${prefix} Get Segment Groups Success | loadingKey=getSegmentGroups`,
  props<{ data: PagedData<SegmentGroup> }>()
);

export const getSegmentGroupsFailure = createAction(
  `${prefix} Get Segment Groups Failure | loadingKey=getSegmentGroups`,
  props<{ error: CommonError }>()
);

export const getTargetGroupUserSummary = createAction(
  `${prefix} get Target Group User Summary | loadingKey=getTargetGroupUserSummary`,
  props<{ target_group_id: number }>()
);

export const getTargetGroupUserSummarySuccess = createAction(
  `${prefix} get Target Group User Summary Success | loadingKey=getTargetGroupUserSummary`,
  props<{ data: TargetGroupsUserSummary }>()
);

export const getTargetGroupUserSummaryFailure = createAction(
  `${prefix} get Target Group User Summary Failure | loadingKey=getTargetGroupUserSummary`,
  props<{ error: CommonError }>()
);

export const setIncludeExcludeSegmentTier = createAction(
  `${prefix} set Include Exclude Segment Tier`,
  props<{ items: TierSegmentIncludeExclude[] }>()
);

export const reset = createAction(
  `${prefix} Reset Create Edit Push Notification`
);
