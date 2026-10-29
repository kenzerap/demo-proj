import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUnicodes from './unicode-list.reducer';

export const selectFeature = createFeatureSelector<fromUnicodes.State>(
  fromUnicodes.featureKey
);

const { selectAll } = fromUnicodes.adapter.getSelectors();

export const selectUnicodes = createSelector(
  selectFeature,
  (state: fromUnicodes.State) => selectAll(state.unicodes)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromUnicodes.State) => state.pagination
);

export const selectUnicodeFilters = createSelector(
  selectFeature,
  (state: fromUnicodes.State) => state.filters
);
