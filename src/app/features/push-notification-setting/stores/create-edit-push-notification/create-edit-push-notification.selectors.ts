import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreatePushNotification from './create-edit-push-notification.reducer';

export const selectFeature =
  createFeatureSelector<fromCreatePushNotification.State>(
    fromCreatePushNotification.featureKey
  );

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) => state.isFormDirty
);

export const selectNotificationDetail = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) => state.notificationDetail
);

export const selectPreviewMessage = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) => state.previewMessage
);

// privileges list
const {
  selectIds: selectPrivilegeIds,
  selectEntities: selectPrivilegeEntities,
  selectAll: selectAllPrivileges,
} = fromCreatePushNotification.privilegesAdapter.getSelectors();

export const selectPrivilegesIds = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) =>
    selectPrivilegeIds(state.privileges)
);

export const selectPrivilegesEntities = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) =>
    selectPrivilegeEntities(state.privileges)
);

export const selectPrivileges = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) =>
    selectAllPrivileges(state.privileges)
);

// TierGroup list
const {
  selectIds: selectTierGroupIds,
  selectEntities: selectTierGroupEntities,
  selectAll: selectAllTierGroups,
} = fromCreatePushNotification.tierGroupsAdapter.getSelectors();

export const selectTierGroupsIds = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) =>
    selectTierGroupIds(state.tierGroups)
);

export const selectTierGroupsEntities = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) =>
    selectTierGroupEntities(state.tierGroups)
);

export const selectTierGroups = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) =>
    selectAllTierGroups(state.tierGroups)
);

// SegmentGroup list
const {
  selectIds: selectSegmentGroupIds,
  selectEntities: selectSegmentGroupEntities,
  selectAll: selectAllSegmentGroups,
} = fromCreatePushNotification.segmentGroupsAdapter.getSelectors();

export const selectSegmentGroupsIds = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) =>
    selectSegmentGroupIds(state.segmentGroups)
);

export const selectSegmentGroupsEntities = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) =>
    selectSegmentGroupEntities(state.segmentGroups)
);

export const selectSegmentGroups = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) =>
    selectAllSegmentGroups(state.segmentGroups)
);

// TargetGroupUserSummary
export const selectTargetGroupUserSummary = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) => state.targetGroupsUserSummary
);

export const selectIncludeExcludeSegmentTier = createSelector(
  selectFeature,
  (state: fromCreatePushNotification.State) => state.includeExcludeSegmentTier
);
