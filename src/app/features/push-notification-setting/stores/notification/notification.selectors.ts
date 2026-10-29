import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNotifications from './notification.reducer';

export const selectFeature = createFeatureSelector<fromNotifications.State>(
  fromNotifications.featureKey
);

const { selectIds, selectEntities, selectAll } =
  fromNotifications.adapter.getSelectors();

export const selectNotificationsIds = createSelector(
  selectFeature,
  (state: fromNotifications.State) => selectIds(state)
);

export const selectNotificationsEntities = createSelector(
  selectFeature,
  (state: fromNotifications.State) => selectEntities(state)
);

export const selectNotifications = createSelector(
  selectFeature,
  (state: fromNotifications.State) => selectAll(state)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromNotifications.State) => state.pagination
);

const { selectAll: selectAllTargetGroupUserCount } =
  fromNotifications.targetGroupUserCountsAdapter.getSelectors();

export const selectTargetGroupUserCounts = createSelector(
  selectFeature,
  (state: fromNotifications.State) =>
    selectAllTargetGroupUserCount(state.targetGroupUserCounts)
);

export const selectTargetGroupUserCountsPagination = createSelector(
  selectFeature,
  (state: fromNotifications.State) => state.targetGroupUserCountsPagination
);

export const selectNotificationFilters = createSelector(
  selectFeature,
  (state: fromNotifications.State) => state.filters
);

export const selectselectedTargetGroupIds = createSelector(
  selectFeature,
  (state: fromNotifications.State) => state.filters.target_group_ids
);
