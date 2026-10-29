import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFundTypes from './fund-type-list.reducer';

export const selectFeature = createFeatureSelector<fromFundTypes.State>(
  fromFundTypes.featureKey
);

const { selectAll } = fromFundTypes.adapter.getSelectors();

export const selectFundTypes = createSelector(
  selectFeature,
  (state: fromFundTypes.State) => selectAll(state.fundTypes)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromFundTypes.State) => state.pagination
);

export const selectFundTypeFilters = createSelector(
  selectFeature,
  (state: fromFundTypes.State) => state.filters
);
