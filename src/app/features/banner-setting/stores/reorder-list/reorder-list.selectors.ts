import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBannerSettingOrder from './reorder-list.reducer';

export const selectFeature =
  createFeatureSelector<fromBannerSettingOrder.State>(
    fromBannerSettingOrder.featureKey
  );

export const selectIsOrderDirty = createSelector(
  selectFeature,
  (state: fromBannerSettingOrder.State) => state.isOrderDirty
);

export const selectIsEditOrderMode = createSelector(
  selectFeature,
  (state: fromBannerSettingOrder.State) => state.isEditOrderMode
);

export const selectVirtualLastDisplayOrder = createSelector(
  selectFeature,
  (state: fromBannerSettingOrder.State) => state.virtualLastDisplayOrder
);

const { selectAll } =
  fromBannerSettingOrder.bannerSettingsAdapter.getSelectors();

export const selectVirtualBannerSettings = createSelector(
  selectFeature,
  (state: fromBannerSettingOrder.State) =>
    selectAll(state.virtualBannerSettings)
);

const { selectAll: selectAllOrdered } =
  fromBannerSettingOrder.orderedBannerSettingsAdapter.getSelectors();

export const selectVirtualPublishedItems = createSelector(
  selectFeature,
  (state: fromBannerSettingOrder.State) =>
    selectAllOrdered(state.virtualPublishedItems)
);

export const selectVirtualUnPublishedItems = createSelector(
  selectFeature,
  (state: fromBannerSettingOrder.State) =>
    selectAllOrdered(state.virtualUnPublishedItems)
);
