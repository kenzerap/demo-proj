import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { NotificationQueryParams } from '../../models/notifications-query-params.model';
import { Notification } from '../../models/notification.model';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';

const prefix = '[Notifications]';

export const getNotifications = createAction(
  `${prefix} Get Notifications | loadingKey=getNotifications`,
  props<{ queryParams: Partial<NotificationQueryParams> }>()
);

export const getNotificationsSuccess = createAction(
  `${prefix} Get Notifications Success | loadingKey=getNotifications`,
  props<{ pagedData: PagedData<Notification> }>()
);

export const getNotificationsFailure = createAction(
  `${prefix} Get Notifications Failure | loadingKey=getNotifications`,
  props<{ error: CommonError }>()
);

export const getTargetGroupUserCount = createAction(
  `${prefix} get Target Group User Count | loadingKey=getTargetGroupUserCount`,
  props<{ sendTimeType: TimePeriodType; page?: number; isGetMore?: boolean }>()
);

export const getTargetGroupUserCountSuccess = createAction(
  `${prefix} get Target Group User Count Success | loadingKey=getTargetGroupUserCount`,
  props<{ pagedData: PagedData<TargetGroupUserCount>; isGetMore?: boolean }>()
);

export const getTargetGroupUserCountFailure = createAction(
  `${prefix} get Target Group User Count Failure | loadingKey=getTargetGroupUserCount`,
  props<{ error: CommonError }>()
);

export const setNotificationFilters = createAction(
  `${prefix} Set Notification Filters`,
  props<{ filters: Partial<NotificationQueryParams> }>()
);

export const resetNotifications = createAction(`${prefix} Reset Notifications`);

export const resetAll = createAction(`${prefix} Reset All`);
