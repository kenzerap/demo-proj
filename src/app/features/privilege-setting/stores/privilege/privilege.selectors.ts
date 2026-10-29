import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPrivilegeSettings from './privilege.reducer';

export const selectFeature = createFeatureSelector<fromPrivilegeSettings.State>(
  fromPrivilegeSettings.featureKey
);

const { selectIds, selectEntities, selectAll } =
  fromPrivilegeSettings.privilegeSettingsAdapter.getSelectors();

export const selectPrivilegeSettingIds = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => selectIds(state.privilegeSettings)
);

export const selectPrivilegeSettingEntities = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) =>
    selectEntities(state.privilegeSettings)
);

export const selectPrivilegeSettings = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => selectAll(state.privilegeSettings)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => state.pagination
);

export const selectPrivilegeSettingFilters = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => state.filters
);

export const selectSelectedTargetGroupIds = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => state.filters.target_group_ids
);

export const selectSelectedTab = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => state.filters.privilege_type
);

export const selectLastPrivilegeId = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => state.lastPrivilegeId
);

export const selectLastDisplayOrder = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => state.lastDisplayOrder
);

export const selectIsOrderDirty = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => state.isOrderDirty
);

const { selectAll: selectAllTargetGroupUserCount } =
  fromPrivilegeSettings.targetGroupUserCountsAdapter.getSelectors();

export const selectTargetGroupUserCounts = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) =>
    selectAllTargetGroupUserCount(state.targetGroupUserCounts)
);

export const selectTargetGroupUserCountsPagination = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => state.targetGroupUserCountsPagination
);

export const selectIsEditOrderMode = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => state.isEditOrderMode
);

export const selectPublishedItems = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) => selectAll(state.virtualPublishedItems)
);

export const selectUnPublishedItems = createSelector(
  selectFeature,
  (state: fromPrivilegeSettings.State) =>
    selectAll(state.virtualUnPublishedItems)
);
