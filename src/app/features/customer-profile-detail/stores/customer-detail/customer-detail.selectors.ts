import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCustomerDetail from './customer-detail.reducer';

export const selectFeature = createFeatureSelector<fromCustomerDetail.State>(
  fromCustomerDetail.featureKey
);

export const selectCustomerDetail = createSelector(
  selectFeature,
  (state: fromCustomerDetail.State) => state.customerDetail
);

export const selectIsEditFormDirty = createSelector(
  selectFeature,
  (state: fromCustomerDetail.State) => state.isEditFormDirty
);
