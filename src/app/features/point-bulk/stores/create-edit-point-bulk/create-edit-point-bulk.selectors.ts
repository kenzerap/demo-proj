import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreatePointBulk from './create-edit-point-bulk.reducer';

export const selectFeature = createFeatureSelector<fromCreatePointBulk.State>(
  fromCreatePointBulk.featureKey
);

export const selectValidateUploadPointResponse = createSelector(
  selectFeature,
  (state: fromCreatePointBulk.State) => state.validateUploadPointResponse
);
