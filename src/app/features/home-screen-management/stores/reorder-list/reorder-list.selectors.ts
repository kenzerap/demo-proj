import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHomeScreenManagementOrder from './reorder-list.reducer';

export const selectFeature =
  createFeatureSelector<fromHomeScreenManagementOrder.State>(
    fromHomeScreenManagementOrder.featureKey
  );

export const selectIsOrderDirty = createSelector(
  selectFeature,
  (state: fromHomeScreenManagementOrder.State) => state.isOrderDirty
);

export const selectIsEditOrderMode = createSelector(
  selectFeature,
  (state: fromHomeScreenManagementOrder.State) => state.isEditOrderMode
);

export const selectVirtualLastDisplayOrder = createSelector(
  selectFeature,
  (state: fromHomeScreenManagementOrder.State) => state.virtualLastDisplayOrder
);

const { selectAll } =
  fromHomeScreenManagementOrder.homeScreenManagementsAdapter.getSelectors();

export const selectVirtualHomeScreenManagements = createSelector(
  selectFeature,
  (state: fromHomeScreenManagementOrder.State) =>
    selectAll(state.virtualHomeScreenManagements)
);

const { selectAll: selectAllOrdered } =
  fromHomeScreenManagementOrder.orderedHomeScreenManagementsAdapter.getSelectors();

export const selectVirtualPublishedItems = createSelector(
  selectFeature,
  (state: fromHomeScreenManagementOrder.State) =>
    selectAllOrdered(state.virtualPublishedItems)
);

export const selectVirtualUnPublishedItems = createSelector(
  selectFeature,
  (state: fromHomeScreenManagementOrder.State) =>
    selectAllOrdered(state.virtualUnPublishedItems)
);
