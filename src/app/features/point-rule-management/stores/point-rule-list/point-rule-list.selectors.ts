import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPointRules from './point-rule-list.reducer';

export const selectFeature = createFeatureSelector<fromPointRules.State>(
  fromPointRules.featureKey
);

const { selectAll } = fromPointRules.adapter.getSelectors();

export const selectPointRules = createSelector(
  selectFeature,
  (state: fromPointRules.State) => selectAll(state.pointRules)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromPointRules.State) => state.pagination
);

export const selectPointRuleFilters = createSelector(
  selectFeature,
  (state: fromPointRules.State) => state.filters
);
