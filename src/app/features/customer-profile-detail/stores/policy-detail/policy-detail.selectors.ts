import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPolicyDetail from './policy-detail.reducer';

export const selectFeature = createFeatureSelector<fromPolicyDetail.State>(
  fromPolicyDetail.featureKey
);

export const selectPolicyDetails = createSelector(
  selectFeature,
  (state: fromPolicyDetail.State) => state.policyDetails
);

export const selectPolicyDetailByPolicyId = (policyId: number) =>
  createSelector(
    selectFeature,
    (state: fromPolicyDetail.State) => state.policyDetails[policyId]
  );
