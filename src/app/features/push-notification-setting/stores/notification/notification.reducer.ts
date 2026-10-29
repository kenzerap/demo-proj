import { createReducer, on } from '@ngrx/store';
import * as NotificationsActions from './notification.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Notification } from '../../models/notification.model';
import { NotificationQueryParams } from '../../models/notifications-query-params.model';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { v4 as uuidv4 } from 'uuid';

export const featureKey = 'notifications';

export interface State extends EntityState<Notification> {
  pagination: Pagination;
  filters: Partial<NotificationQueryParams>;
  targetGroupUserCounts: EntityState<TargetGroupUserCount>;
  targetGroupUserCountsPagination: Pagination;
}

export const adapter: EntityAdapter<Notification> =
  createEntityAdapter<Notification>({
    selectId: (notifications: Notification) => notifications.id,
  });

export const targetGroupUserCountsAdapter: EntityAdapter<TargetGroupUserCount> =
  createEntityAdapter<TargetGroupUserCount>({
    selectId: () => uuidv4(),
  });

export const initialState: State = adapter.getInitialState({
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
  filters: {
    page: 0,
    size: 20,
    isSent: true,
    sendTimeType: TimePeriodType.SPECIFIC_TIME,
  },
  targetGroupUserCounts: targetGroupUserCountsAdapter.getInitialState(),
  targetGroupUserCountsPagination: {
    page: 0,
    size: 5,
    totalItems: 0,
    totalPages: 0,
  },
});

export const reducer = createReducer(
  initialState,
  on(NotificationsActions.getNotificationsSuccess, (state, { pagedData }) => {
    return adapter.setAll(pagedData.data, {
      ...state,
      pagination: {
        ...pagedData.pagination,
      },
      filters: {
        ...state.filters,
        page: pagedData.pagination.page,
        size: pagedData.pagination.size,
      },
    });
  }),
  on(
    NotificationsActions.getTargetGroupUserCountSuccess,
    (state, { pagedData, isGetMore }) => {
      const targetGroupUserCounts = pagedData.data.map((item) => {
        return { ...item, id: uuidv4() };
      });

      if (isGetMore) {
        return {
          ...state,
          targetGroupUserCounts: targetGroupUserCountsAdapter.addMany(
            targetGroupUserCounts,
            state.targetGroupUserCounts
          ),
          targetGroupUserCountsPagination: {
            ...pagedData.pagination,
          },
        };
      }

      return {
        ...state,
        targetGroupUserCounts: targetGroupUserCountsAdapter.setAll(
          targetGroupUserCounts,
          state.targetGroupUserCounts
        ),
        targetGroupUserCountsPagination: {
          ...pagedData.pagination,
        },
      };
    }
  ),
  on(NotificationsActions.setNotificationFilters, (state, { filters }) => {
    return {
      ...state,
      filters: {
        page: filters.page !== undefined ? filters.page : state.filters.page,
        size: filters.size !== undefined ? filters.size : state.filters.size,
        isSent:
          filters.isSent !== undefined ? filters.isSent : state.filters.isSent,
        sendTimeType:
          filters.sendTimeType !== undefined
            ? filters.sendTimeType
            : state.filters.sendTimeType,
        target_group_ids:
          filters.target_group_ids !== undefined
            ? filters.target_group_ids
            : state.filters.target_group_ids,
      },
    };
  }),

  on(NotificationsActions.resetNotifications, (state) => {
    return adapter.getInitialState({
      pagination: {
        page: 0,
        size: 20,
        totalItems: 0,
        totalPages: 0,
      },
      targetGroupUserCounts: state.targetGroupUserCounts,
      targetGroupUserCountsPagination: state.targetGroupUserCountsPagination,
      filters: {
        page: 0,
        size: 20,
        isSent: true,
        sendTimeType: TimePeriodType.SPECIFIC_TIME,
      },
    });
  }),
  on(NotificationsActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
