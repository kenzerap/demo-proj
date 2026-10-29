import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreatePointRule from './create-edit-point-rule.reducer';

export const selectFeature = createFeatureSelector<fromCreatePointRule.State>(
  fromCreatePointRule.featureKey
);

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreatePointRule.State) => state.isFormDirty
);

export const selectPointRuleDetail = createSelector(
  selectFeature,
  (state: fromCreatePointRule.State) => state.pointRuleDetail
);

// TierGroup list
const { selectAll: selectAllTierGroups } =
  fromCreatePointRule.tierGroupsAdapter.getSelectors();

export const selectTierGroups = createSelector(
  selectFeature,
  (state: fromCreatePointRule.State) => selectAllTierGroups(state.tierGroups)
);

// Policy Channel list
export const selectPolicyChannels = createSelector(
  selectFeature,
  (state: fromCreatePointRule.State) => state.policyChannels
);

// Product Name list
const { selectAll: selectAllProductNames } =
  fromCreatePointRule.productNamesAdapter.getSelectors();

export const selectProductNames = createSelector(
  selectFeature,
  (state: fromCreatePointRule.State) =>
    selectAllProductNames(state.productNames)
);
