import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCustomerProfileFilter from './customer-profile-filter.reducer';

export const selectFeature =
  createFeatureSelector<fromCustomerProfileFilter.State>(
    fromCustomerProfileFilter.featureKey
  );

export const selectCommonSearch = createSelector(
  selectFeature,
  (state: fromCustomerProfileFilter.State) => state.commonSearch
);

export const selectPolicyNumber = createSelector(
  selectFeature,
  (state: fromCustomerProfileFilter.State) => state.policyNumber
);

export const selectCertificateNumber = createSelector(
  selectFeature,
  (state: fromCustomerProfileFilter.State) => state.certificateNumber
);
