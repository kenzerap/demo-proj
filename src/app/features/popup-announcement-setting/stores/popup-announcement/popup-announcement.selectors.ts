import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPopupAnnouncements from './popup-announcement.reducer';

export const selectFeature =
  createFeatureSelector<fromPopupAnnouncements.State>(
    fromPopupAnnouncements.featureKey
  );

const { selectIds, selectEntities, selectAll } =
  fromPopupAnnouncements.popupAnnouncementsAdapter.getSelectors();

export const selectPopupAnnouncementIds = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) => selectIds(state.popupAnnouncements)
);

export const selectPopupAnnouncementEntities = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) =>
    selectEntities(state.popupAnnouncements)
);

export const selectPopupAnnouncements = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) => selectAll(state.popupAnnouncements)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) => state.pagination
);

export const selectPopupAnnouncementFilters = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) => state.filters
);

export const selectselectedTargetGroupIds = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) => state.filters.targetGroupIds
);

export const selectSelectedTab = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) => state.filters.pageId
);

export const selectPopupAnnouncementTabs = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) => state.popupAnnouncementTabs
);

const { selectAll: selectAllTargetGroupUserCount } =
  fromPopupAnnouncements.targetGroupUserCountsAdapter.getSelectors();

export const selectTargetGroupUserCounts = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) =>
    selectAllTargetGroupUserCount(state.targetGroupUserCounts)
);

export const selectTargetGroupUserCountsPagination = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) => state.targetGroupUserCountsPagination
);

const {
  selectIds: selectPreviewImagesIds,
  selectEntities: selectPreviewImagesEntities,
  selectAll: selectPreviewImagesAll,
} = fromPopupAnnouncements.previewImagesAdapter.getSelectors();

export const selectPreviewImageIds = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) =>
    selectPreviewImagesIds(state.previewImages)
);

export const selectPreviewImageEntities = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) =>
    selectPreviewImagesEntities(state.previewImages)
);

export const selectPreviewImages = createSelector(
  selectFeature,
  (state: fromPopupAnnouncements.State) =>
    selectPreviewImagesAll(state.previewImages)
);
