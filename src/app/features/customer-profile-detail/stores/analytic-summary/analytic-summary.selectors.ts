import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAnalyticSummary from './analytic-summary.reducer';

export const selectFeature = createFeatureSelector<fromAnalyticSummary.State>(
  fromAnalyticSummary.featureKey
);

export const selectCustomerPolicy = createSelector(
  selectFeature,
  (state: fromAnalyticSummary.State) => state.customerPolicy
);

export const selectAnalyticSummary = createSelector(
  selectFeature,
  (state: fromAnalyticSummary.State) => {
    return {
      customerPolicy: state.customerPolicy,
      customerPoint: state.customerPoint,
      customerTier: state.customerTier,
    };
  }
);

export const selectCustomerPoint = createSelector(
  selectFeature,
  (state: fromAnalyticSummary.State) => state.customerPoint
);

export const selectCustomerTier = createSelector(
  selectFeature,
  (state: fromAnalyticSummary.State) => state.customerTier
);

export const selectOwnerPolicies = createSelector(
  selectCustomerPolicy,
  (customerPolicy) => customerPolicy?.all_policies_output.owner_policies || []
);

export const selectFamilyPolicies = createSelector(
  selectCustomerPolicy,
  (customerPolicy) => customerPolicy?.all_policies_output.family_policies || []
);

export const selectClientsInfoSvoc = createSelector(
  selectFeature,
  (state: fromAnalyticSummary.State) => state.clientsInfoSvoc
);
