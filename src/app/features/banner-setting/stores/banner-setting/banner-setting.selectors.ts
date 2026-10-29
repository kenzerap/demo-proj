import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBannerSettings from './banner-setting.reducer';

export const selectFeature = createFeatureSelector<fromBannerSettings.State>(
  fromBannerSettings.featureKey
);

const { selectIds, selectEntities, selectAll } =
  fromBannerSettings.bannerSettingsAdapter.getSelectors();

export const selectBannerSettingIds = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) => selectIds(state.bannerSettings)
);

export const selectBannerSettingEntities = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) => selectEntities(state.bannerSettings)
);

export const selectBannerSettings = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) => selectAll(state.bannerSettings)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) => state.pagination
);

export const selectBannerSettingFilters = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) => state.filters
);

export const selectselectedTargetGroupIds = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) => state.filters.target_group_ids
);

export const selectSelectedTab = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) => state.filters.page_id
);

export const selectBannerSettingTabs = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) => state.bannerSettingTabs
);

const { selectAll: selectAllTargetGroupUserCount } =
  fromBannerSettings.targetGroupUserCountsAdapter.getSelectors();

export const selectTargetGroupUserCounts = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) =>
    selectAllTargetGroupUserCount(state.targetGroupUserCounts)
);

export const selectTargetGroupUserCountsPagination = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) => state.targetGroupUserCountsPagination
);

const {
  selectIds: selectPreviewImagesIds,
  selectEntities: selectPreviewImagesEntities,
  selectAll: selectPreviewImagesAll,
} = fromBannerSettings.previewImagesAdapter.getSelectors();

export const selectPreviewImageIds = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) =>
    selectPreviewImagesIds(state.previewImages)
);

export const selectPreviewImageEntities = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) =>
    selectPreviewImagesEntities(state.previewImages)
);

export const selectPreviewImages = createSelector(
  selectFeature,
  (state: fromBannerSettings.State) =>
    selectPreviewImagesAll(state.previewImages)
);
