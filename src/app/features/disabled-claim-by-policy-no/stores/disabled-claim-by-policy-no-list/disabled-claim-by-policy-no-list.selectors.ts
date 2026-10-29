import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromDisabledClaimByPolicyNo from './disabled-claim-by-policy-no-list.reducer';

export const selectFeature =
  createFeatureSelector<fromDisabledClaimByPolicyNo.State>(
    fromDisabledClaimByPolicyNo.featureKey
  );

const { selectAll } = fromDisabledClaimByPolicyNo.adapter.getSelectors();

export const selectDisabledClaimPolicies = createSelector(
  selectFeature,
  (state: fromDisabledClaimByPolicyNo.State) =>
    selectAll(state.disabledClaimPolicies)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromDisabledClaimByPolicyNo.State) => state.pagination
);

export const selectDisabledClaimPolicyFilters = createSelector(
  selectFeature,
  (state: fromDisabledClaimByPolicyNo.State) => state.filters
);
