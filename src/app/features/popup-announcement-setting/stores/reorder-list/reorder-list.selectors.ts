import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPopupAnnouncementOrder from './reorder-list.reducer';

export const selectFeature =
  createFeatureSelector<fromPopupAnnouncementOrder.State>(
    fromPopupAnnouncementOrder.featureKey
  );

export const selectIsOrderDirty = createSelector(
  selectFeature,
  (state: fromPopupAnnouncementOrder.State) => state.isOrderDirty
);

export const selectIsEditOrderMode = createSelector(
  selectFeature,
  (state: fromPopupAnnouncementOrder.State) => state.isEditOrderMode
);

export const selectVirtualLastDisplayOrder = createSelector(
  selectFeature,
  (state: fromPopupAnnouncementOrder.State) => state.virtualLastDisplayOrder
);

const { selectAll } =
  fromPopupAnnouncementOrder.popupAnnouncementsAdapter.getSelectors();

export const selectVirtualPopupAnnouncements = createSelector(
  selectFeature,
  (state: fromPopupAnnouncementOrder.State) =>
    selectAll(state.virtualPopupAnnouncements)
);

const { selectAll: selectAllOrdered } =
  fromPopupAnnouncementOrder.orderedPopupAnnouncementsAdapter.getSelectors();

export const selectVirtualPublishedItems = createSelector(
  selectFeature,
  (state: fromPopupAnnouncementOrder.State) =>
    selectAllOrdered(state.virtualPublishedItems)
);

export const selectVirtualUnPublishedItems = createSelector(
  selectFeature,
  (state: fromPopupAnnouncementOrder.State) =>
    selectAllOrdered(state.virtualUnPublishedItems)
);
