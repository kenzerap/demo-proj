import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCheckupPackageLists from './checkup-package-list.reducer';

export const selectFeature =
  createFeatureSelector<fromCheckupPackageLists.State>(
    fromCheckupPackageLists.featureKey
  );

const { selectAll } = fromCheckupPackageLists.adapter.getSelectors();

export const selectCheckupPackageLists = createSelector(
  selectFeature,
  (state: fromCheckupPackageLists.State) => selectAll(state.checkupPackages)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromCheckupPackageLists.State) => state.pagination
);

export const selectCheckupPackageFilters = createSelector(
  selectFeature,
  (state: fromCheckupPackageLists.State) => state.filters
);
