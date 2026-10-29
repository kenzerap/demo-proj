import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSplashScreenManagements from './splash-screen-management-list.reducer';

export const selectFeature =
  createFeatureSelector<fromSplashScreenManagements.State>(
    fromSplashScreenManagements.featureKey
  );

const { selectAll } = fromSplashScreenManagements.adapter.getSelectors();

export const selectSplashScreenManagements = createSelector(
  selectFeature,
  (state: fromSplashScreenManagements.State) =>
    selectAll(state.splashScreenManagements)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromSplashScreenManagements.State) => state.pagination
);

export const selectSplashScreenManagementFilters = createSelector(
  selectFeature,
  (state: fromSplashScreenManagements.State) => state.filters
);
