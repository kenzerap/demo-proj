import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreateCustomerSegmentation from './create-edit-customer-segmentation.reducer';

export const selectFeature =
  createFeatureSelector<fromCreateCustomerSegmentation.State>(
    fromCreateCustomerSegmentation.featureKey
  );

export const segmentFormDirty = createSelector(
  selectFeature,
  (state: fromCreateCustomerSegmentation.State) => state.isFormDirty
);

export const selectProductTypes = createSelector(
  selectFeature,
  (state: fromCreateCustomerSegmentation.State) => state.productTypes
);

export const selectPolicyChannels = createSelector(
  selectFeature,
  (state: fromCreateCustomerSegmentation.State) => state.policyChannels
);

// remove
export const selectSegmentSummaryUsers = createSelector(
  selectFeature,
  (state: fromCreateCustomerSegmentation.State) => state.segmentSummaryUsers
);

export const selectSegmentSummaryUserById = (id: number) =>
  createSelector(
    selectFeature,
    (state: fromCreateCustomerSegmentation.State) => {
      return state.segmentSummaryUsers.find((user) => user.id === id);
    }
  );

export const selectCustomerSegmentationDetail = createSelector(
  selectFeature,
  (state: fromCreateCustomerSegmentation.State) =>
    state.customerSegmentationDetail
);

// Product Name list
const { selectAll: selectAllProductNames } =
  fromCreateCustomerSegmentation.productNamesAdapter.getSelectors();

export const selectProductNames = createSelector(
  selectFeature,
  (state: fromCreateCustomerSegmentation.State) =>
    selectAllProductNames(state.productNames)
);
