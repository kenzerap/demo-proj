import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreateBannerSetting from './create-edit-banner-setting.reducer';

export const selectFeature =
  createFeatureSelector<fromCreateBannerSetting.State>(
    fromCreateBannerSetting.featureKey
  );

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) => state.isFormDirty
);

export const selectPreviewImages = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) => state.previewImages
);

export const selectBannerSettingDetail = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) => state.bannerSettingDetail
);

// Privilege list
const {
  selectIds: selectPrivilegeIds,
  selectEntities: selectPrivilegeEntities,
  selectAll: selectAllPrivileges,
} = fromCreateBannerSetting.privilegeAdapter.getSelectors();

export const selectPrivilegesIds = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) => selectPrivilegeIds(state.privileges)
);

export const selectPrivilegesEntities = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) =>
    selectPrivilegeEntities(state.privileges)
);

export const selectPrivileges = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) =>
    selectAllPrivileges(state.privileges)
);

// TierGroup list
const {
  selectIds: selectTierGroupIds,
  selectEntities: selectTierGroupEntities,
  selectAll: selectAllTierGroups,
} = fromCreateBannerSetting.tierGroupsAdapter.getSelectors();

export const selectTierGroupsIds = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) => selectTierGroupIds(state.tierGroups)
);

export const selectTierGroupsEntities = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) =>
    selectTierGroupEntities(state.tierGroups)
);

export const selectTierGroups = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) =>
    selectAllTierGroups(state.tierGroups)
);

// SegmentGroup list
const {
  selectIds: selectSegmentGroupIds,
  selectEntities: selectSegmentGroupEntities,
  selectAll: selectAllSegmentGroups,
} = fromCreateBannerSetting.segmentGroupsAdapter.getSelectors();

export const selectSegmentGroupsIds = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) =>
    selectSegmentGroupIds(state.segmentGroups)
);

export const selectSegmentGroupsEntities = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) =>
    selectSegmentGroupEntities(state.segmentGroups)
);

export const selectSegmentGroups = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) =>
    selectAllSegmentGroups(state.segmentGroups)
);

// TargetGroupUserSummary
export const selectTargetGroupUserSummary = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) => state.targetGroupsUserSummary
);

export const selectIncludeExcludeSegmentTier = createSelector(
  selectFeature,
  (state: fromCreateBannerSetting.State) => state.includeExcludeSegmentTier
);
