import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreateCheckupPackage from './create-edit-checkup-package.reducer';

export const selectFeature =
  createFeatureSelector<fromCreateCheckupPackage.State>(
    fromCreateCheckupPackage.featureKey
  );

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreateCheckupPackage.State) => state.isFormDirty
);
export const selectCheckupPackageDetail = createSelector(
  selectFeature,
  (state: fromCreateCheckupPackage.State) => state.checkupPackageDetail
);
