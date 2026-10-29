import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreatePrivilege from './create-edit-privilege.reducer';

export const selectFeature = createFeatureSelector<fromCreatePrivilege.State>(
  fromCreatePrivilege.featureKey
);

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) => state.isFormDirty
);

export const selectPrivilegeDetail = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) => state.privilegeDetail
);

// brands list
const {
  selectIds: selectBrandIds,
  selectEntities: selectBrandEntities,
  selectAll: selectAllBrands,
} = fromCreatePrivilege.brandsAdapter.getSelectors();

export const selectBrandsIds = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) => selectBrandIds(state.brands)
);

export const selectBrandsEntities = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) => selectBrandEntities(state.brands)
);

export const selectBrands = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) => selectAllBrands(state.brands)
);

// healthcare Packages list
const {
  selectIds: selectHealthcarePackageIds,
  selectEntities: selectHealthcarePackageEntities,
  selectAll: selectAllHealthcarePackages,
} = fromCreatePrivilege.healthcarePackagesAdapter.getSelectors();

export const selectHealthcarePackagesIds = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) =>
    selectHealthcarePackageIds(state.healthcarePackages)
);

export const selectHealthcarePackagesEntities = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) =>
    selectHealthcarePackageEntities(state.healthcarePackages)
);

export const selectHealthcarePackages = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) =>
    selectAllHealthcarePackages(state.healthcarePackages)
);

// Inventory list
const { selectAll: selectAllInventories } =
  fromCreatePrivilege.inventoryAdapter.getSelectors();

export const selectUploadCodeInventories = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) =>
    selectAllInventories(state.uploadCodeInventories)
);

export const selectProductInventories = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) =>
    selectAllInventories(state.productInventories)
);

// TierGroup list
const {
  selectIds: selectTierGroupIds,
  selectEntities: selectTierGroupEntities,
  selectAll: selectAllTierGroups,
} = fromCreatePrivilege.tierGroupsAdapter.getSelectors();

export const selectTierGroupsIds = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) => selectTierGroupIds(state.tierGroups)
);

export const selectTierGroupsEntities = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) =>
    selectTierGroupEntities(state.tierGroups)
);

export const selectTierGroups = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) => selectAllTierGroups(state.tierGroups)
);

// SegmentGroup list
const {
  selectIds: selectSegmentGroupIds,
  selectEntities: selectSegmentGroupEntities,
  selectAll: selectAllSegmentGroups,
} = fromCreatePrivilege.segmentGroupsAdapter.getSelectors();

export const selectSegmentGroupsIds = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) =>
    selectSegmentGroupIds(state.segmentGroups)
);

export const selectSegmentGroupsEntities = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) =>
    selectSegmentGroupEntities(state.segmentGroups)
);

export const selectSegmentGroups = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) =>
    selectAllSegmentGroups(state.segmentGroups)
);

export const selectIncludeExcludeSegmentTier = createSelector(
  selectFeature,
  (state: fromCreatePrivilege.State) => state.includeExcludeSegmentTier
);
