import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromExcludePointByPolicyNo from './exclude-point-by-policy-no-list.reducer';

export const selectFeature =
  createFeatureSelector<fromExcludePointByPolicyNo.State>(
    fromExcludePointByPolicyNo.featureKey
  );

const { selectAll } = fromExcludePointByPolicyNo.adapter.getSelectors();

export const selectExcludePointPolicies = createSelector(
  selectFeature,
  (state: fromExcludePointByPolicyNo.State) =>
    selectAll(state.excludePointPolicies)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromExcludePointByPolicyNo.State) => state.pagination
);

export const selectExcludePointPolicyFilters = createSelector(
  selectFeature,
  (state: fromExcludePointByPolicyNo.State) => state.filters
);
