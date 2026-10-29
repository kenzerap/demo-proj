import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPointBulks from './point-bulk-list.reducer';

export const selectFeature = createFeatureSelector<fromPointBulks.State>(
  fromPointBulks.featureKey
);

const { selectAll } = fromPointBulks.adapter.getSelectors();

export const selectPointBulks = createSelector(
  selectFeature,
  (state: fromPointBulks.State) => selectAll(state.pointBulks)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromPointBulks.State) => state.pagination
);

export const selectPointBulkFilters = createSelector(
  selectFeature,
  (state: fromPointBulks.State) => state.filters
);
