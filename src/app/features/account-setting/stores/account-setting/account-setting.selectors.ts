import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAccountSettings from './account-setting.reducer';

export const selectFeature = createFeatureSelector<fromAccountSettings.State>(
  fromAccountSettings.featureKey
);

const { selectIds, selectEntities, selectAll } =
  fromAccountSettings.adapter.getSelectors();

export const selectAccountSettingsIds = createSelector(
  selectFeature,
  (state: fromAccountSettings.State) => selectIds(state.accountSettings)
);

export const selectAccountSettingsEntities = createSelector(
  selectFeature,
  (state: fromAccountSettings.State) => selectEntities(state.accountSettings)
);

export const selectAccountSettings = createSelector(
  selectFeature,
  (state: fromAccountSettings.State) => selectAll(state.accountSettings)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromAccountSettings.State) => state.pagination
);

export const selectAccountSettingFilters = createSelector(
  selectFeature,
  (state: fromAccountSettings.State) => state.filters
);

// user groups
const {
  selectIds: userGroupSelectIds,
  selectEntities: userGroupSelectEntities,
  selectAll: userGroupSelectAll,
} = fromAccountSettings.userGroupAdapter.getSelectors();

export const selectUserGroupIds = createSelector(
  selectFeature,
  (state: fromAccountSettings.State) => userGroupSelectIds(state.userGroups)
);

export const selectUserGroupEntities = createSelector(
  selectFeature,
  (state: fromAccountSettings.State) =>
    userGroupSelectEntities(state.userGroups)
);

export const selectUserGroups = createSelector(
  selectFeature,
  (state: fromAccountSettings.State) => userGroupSelectAll(state.userGroups)
);
