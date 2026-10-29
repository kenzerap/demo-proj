import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHomeScreenManagementLists from './home-screen-management-list.reducer';

export const selectFeature =
  createFeatureSelector<fromHomeScreenManagementLists.State>(
    fromHomeScreenManagementLists.featureKey
  );

const { selectAll } = fromHomeScreenManagementLists.adapter.getSelectors();

export const selectHomeScreenManagementLists = createSelector(
  selectFeature,
  (state: fromHomeScreenManagementLists.State) =>
    selectAll(state.homeScreenManagements)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromHomeScreenManagementLists.State) => state.pagination
);

export const selectHomeScreenManagementFilters = createSelector(
  selectFeature,
  (state: fromHomeScreenManagementLists.State) => state.filters
);
