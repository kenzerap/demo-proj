import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPromoCodes from './promocode-list.reducer';

export const selectFeature = createFeatureSelector<fromPromoCodes.State>(
  fromPromoCodes.featureKey
);

const { selectAll } = fromPromoCodes.adapter.getSelectors();

export const selectPromoCodes = createSelector(
  selectFeature,
  (state: fromPromoCodes.State) => selectAll(state.promoCodes)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromPromoCodes.State) => state.pagination
);

export const selectPromoCodeFilters = createSelector(
  selectFeature,
  (state: fromPromoCodes.State) => state.filters
);
