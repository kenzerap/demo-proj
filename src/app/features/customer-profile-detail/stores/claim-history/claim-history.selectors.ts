import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromClaimHistory from './claim-history.reducer';

export const selectFeature = createFeatureSelector<fromClaimHistory.State>(
  fromClaimHistory.featureKey
);

export const selectClaimHistoryEntities = createSelector(
  selectFeature,
  (state: fromClaimHistory.State) => state.claimHistories
);

export const selectPagedClaimHistoryByPolicyId = (policyId: number) =>
  createSelector(
    selectClaimHistoryEntities,
    (claimHistories) => claimHistories[policyId] || null
  );

export const selectClaimHistoryByPolicyId = (policyId: number) =>
  createSelector(
    selectPagedClaimHistoryByPolicyId(policyId),
    (pagedData) => pagedData?.data || []
  );

export const selectClaimHistoryPaginationByPolicyId = (policyId: number) =>
  createSelector(
    selectPagedClaimHistoryByPolicyId(policyId),
    (pagedData) => pagedData?.pagination || null
  );
