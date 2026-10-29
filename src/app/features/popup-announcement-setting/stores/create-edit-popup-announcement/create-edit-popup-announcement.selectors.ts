import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreatePopupAnnouncement from './create-edit-popup-announcement.reducer';

export const selectFeature =
  createFeatureSelector<fromCreatePopupAnnouncement.State>(
    fromCreatePopupAnnouncement.featureKey
  );

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) => state.isFormDirty
);

export const selectPreviewImages = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) => state.previewImages
);

export const selectPopupAnnouncementDetail = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) => state.popupAnnouncementDetail
);

// Privilege list
const {
  selectIds: selectPrivilegeIds,
  selectEntities: selectPrivilegeEntities,
  selectAll: selectAllPrivileges,
} = fromCreatePopupAnnouncement.privilegeAdapter.getSelectors();

export const selectPrivilegesIds = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) =>
    selectPrivilegeIds(state.privileges)
);

export const selectPrivilegesEntities = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) =>
    selectPrivilegeEntities(state.privileges)
);

export const selectPrivileges = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) =>
    selectAllPrivileges(state.privileges)
);

// TierGroup list
const {
  selectIds: selectTierGroupIds,
  selectEntities: selectTierGroupEntities,
  selectAll: selectAllTierGroups,
} = fromCreatePopupAnnouncement.tierGroupsAdapter.getSelectors();

export const selectTierGroupsIds = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) =>
    selectTierGroupIds(state.tierGroups)
);

export const selectTierGroupsEntities = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) =>
    selectTierGroupEntities(state.tierGroups)
);

export const selectTierGroups = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) =>
    selectAllTierGroups(state.tierGroups)
);

// SegmentGroup list
const {
  selectIds: selectSegmentGroupIds,
  selectEntities: selectSegmentGroupEntities,
  selectAll: selectAllSegmentGroups,
} = fromCreatePopupAnnouncement.segmentGroupsAdapter.getSelectors();

export const selectSegmentGroupsIds = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) =>
    selectSegmentGroupIds(state.segmentGroups)
);

export const selectSegmentGroupsEntities = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) =>
    selectSegmentGroupEntities(state.segmentGroups)
);

export const selectSegmentGroups = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) =>
    selectAllSegmentGroups(state.segmentGroups)
);

// TargetGroupUserSummary
export const selectTargetGroupUserSummary = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) => state.targetGroupsUserSummary
);

export const selectIncludeExcludeSegmentTier = createSelector(
  selectFeature,
  (state: fromCreatePopupAnnouncement.State) => state.includeExcludeSegmentTier
);
