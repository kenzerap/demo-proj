import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCustomerSegmentations from './customer-segmentation.reducer';

export const selectFeature =
  createFeatureSelector<fromCustomerSegmentations.State>(
    fromCustomerSegmentations.featureKey
  );

const { selectIds, selectEntities, selectAll } =
  fromCustomerSegmentations.customerSegmentationsAdapter.getSelectors();

export const selectCustomerSegmentationIds = createSelector(
  selectFeature,
  (state: fromCustomerSegmentations.State) =>
    selectIds(state.customerSegmentations)
);

export const selectCustomerSegmentationEntities = createSelector(
  selectFeature,
  (state: fromCustomerSegmentations.State) =>
    selectEntities(state.customerSegmentations)
);

export const selectCustomerSegmentations = createSelector(
  selectFeature,
  (state: fromCustomerSegmentations.State) =>
    selectAll(state.customerSegmentations)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromCustomerSegmentations.State) => state.pagination
);

export const selectCustomerSegmentationFilters = createSelector(
  selectFeature,
  (state: fromCustomerSegmentations.State) => state.filters
);
