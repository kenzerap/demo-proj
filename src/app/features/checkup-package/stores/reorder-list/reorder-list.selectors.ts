import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCheckupPackageOrder from './reorder-list.reducer';

export const selectFeature =
  createFeatureSelector<fromCheckupPackageOrder.State>(
    fromCheckupPackageOrder.featureKey
  );

export const selectIsOrderDirty = createSelector(
  selectFeature,
  (state: fromCheckupPackageOrder.State) => state.isOrderDirty
);

export const selectIsEditOrderMode = createSelector(
  selectFeature,
  (state: fromCheckupPackageOrder.State) => state.isEditOrderMode
);

export const selectVirtualLastDisplayOrder = createSelector(
  selectFeature,
  (state: fromCheckupPackageOrder.State) => state.virtualLastDisplayOrder
);

const { selectAll } =
  fromCheckupPackageOrder.checkupPackagesAdapter.getSelectors();

export const selectVirtualCheckupPackages = createSelector(
  selectFeature,
  (state: fromCheckupPackageOrder.State) =>
    selectAll(state.virtualCheckupPackages)
);

const { selectAll: selectAllOrdered } =
  fromCheckupPackageOrder.orderedCheckupPackagesAdapter.getSelectors();

export const selectVirtualPublishedItems = createSelector(
  selectFeature,
  (state: fromCheckupPackageOrder.State) =>
    selectAllOrdered(state.virtualPublishedItems)
);

export const selectVirtualUnPublishedItems = createSelector(
  selectFeature,
  (state: fromCheckupPackageOrder.State) =>
    selectAllOrdered(state.virtualUnPublishedItems)
);
