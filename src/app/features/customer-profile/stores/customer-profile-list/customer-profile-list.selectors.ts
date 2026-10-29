import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCustomerProfileList from './customer-profile-list.reducer';

export const selectFeature =
  createFeatureSelector<fromCustomerProfileList.State>(
    fromCustomerProfileList.featureKey
  );

const { selectIds, selectEntities, selectAll } =
  fromCustomerProfileList.adapter.getSelectors();

export const selectCustomerProfileIds = createSelector(
  selectFeature,
  (state: fromCustomerProfileList.State) => selectIds(state)
);

export const selectCustomerProfileEntities = createSelector(
  selectFeature,
  (state: fromCustomerProfileList.State) => selectEntities(state)
);

export const selectCustomerProfiles = createSelector(
  selectFeature,
  (state: fromCustomerProfileList.State) => selectAll(state)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromCustomerProfileList.State) => state.pagination
);
