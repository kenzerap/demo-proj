import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromEClaimSubmit from './e-claim-submit.reducer';

export const selectFeature = createFeatureSelector<fromEClaimSubmit.State>(
  fromEClaimSubmit.featureKey
);

// eclaim submits
export const selectEClaimSubmitEntities = createSelector(
  selectFeature,
  (state: fromEClaimSubmit.State) => state.eClaimSubmits
);

export const selectPagedEClaimSubmitByPolicyId = (policyId: number) =>
  createSelector(
    selectEClaimSubmitEntities,
    (eClaimSubmits) => eClaimSubmits[policyId] || null
  );

export const selectEClaimSubmitByPolicyId = (policyId: number) =>
  createSelector(
    selectPagedEClaimSubmitByPolicyId(policyId),
    (pagedData) => pagedData?.data || []
  );

export const selectEClaimSubmitPaginationByPolicyId = (policyId: number) =>
  createSelector(
    selectPagedEClaimSubmitByPolicyId(policyId),
    (pagedData) => pagedData?.pagination || null
  );

// eclaim image urls
export const selectEClaimImageUrlsEntities = createSelector(
  selectFeature,
  (state: fromEClaimSubmit.State) => state.eClaimImageUrls
);

export const selectEClaimImageUrlsByPolicyId = (policyId: number) =>
  createSelector(
    selectEClaimImageUrlsEntities,
    (eClaimImageUrls) => eClaimImageUrls[policyId] || {}
  );
