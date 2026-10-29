import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCustomerSegmentationOrder from './reorder-list.reducer';

export const selectFeature =
  createFeatureSelector<fromCustomerSegmentationOrder.State>(
    fromCustomerSegmentationOrder.featureKey
  );

export const selectIsOrderDirty = createSelector(
  selectFeature,
  (state: fromCustomerSegmentationOrder.State) => state.isOrderDirty
);

export const selectIsEditOrderMode = createSelector(
  selectFeature,
  (state: fromCustomerSegmentationOrder.State) => state.isEditOrderMode
);

export const selectVirtualLastDisplayOrder = createSelector(
  selectFeature,
  (state: fromCustomerSegmentationOrder.State) => state.virtualLastDisplayOrder
);

const { selectAll } =
  fromCustomerSegmentationOrder.customerSegmentationsAdapter.getSelectors();

export const selectVirtualCustomerSegmentations = createSelector(
  selectFeature,
  (state: fromCustomerSegmentationOrder.State) =>
    selectAll(state.virtualCustomerSegmentations)
);

const { selectAll: selectAllOrdered } =
  fromCustomerSegmentationOrder.orderedCustomerSegmentationsAdapter.getSelectors();

export const selectVirtualPublishedItems = createSelector(
  selectFeature,
  (state: fromCustomerSegmentationOrder.State) =>
    selectAllOrdered(state.virtualPublishedItems)
);

export const selectVirtualUnPublishedItems = createSelector(
  selectFeature,
  (state: fromCustomerSegmentationOrder.State) =>
    selectAllOrdered(state.virtualUnPublishedItems)
);
