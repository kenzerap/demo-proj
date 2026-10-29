import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreateHomeScreen from './create-edit-home-screen.reducer';

export const selectFeature = createFeatureSelector<fromCreateHomeScreen.State>(
  fromCreateHomeScreen.featureKey,
);

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreateHomeScreen.State) => state.isFormDirty,
);

export const selectHomeScreenDetail = createSelector(
  selectFeature,
  (state: fromCreateHomeScreen.State) => state.homeScreenDetail,
);

// TierGroup list
const {
  selectIds: selectTierGroupIds,
  selectEntities: selectTierGroupEntities,
  selectAll: selectAllTierGroups,
} = fromCreateHomeScreen.tierGroupsAdapter.getSelectors();

export const selectTierGroups = createSelector(
  selectFeature,
  (state: fromCreateHomeScreen.State) => selectAllTierGroups(state.tierGroups),
);
