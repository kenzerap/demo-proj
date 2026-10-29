import { createReducer, on } from '@ngrx/store';
import * as CreateEditPrivilegeActions from './create-edit-privilege.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';
import { BrandCommon } from '@app/features/inventory-setting/models/brand-common.model';
import { HealthcarePackage } from '../../models/healthcare-package.model';
import { Inventory } from '@app/shared/models/inventory-model';
import { PrivilegeDetail } from '../../models/privilege-setting-model';

export const featureKey = 'createEditPrivilege';

export interface State {
  brands: EntityState<BrandCommon>;
  healthcarePackages: EntityState<HealthcarePackage>;
  isFormDirty: boolean;
  privilegeDetail: PrivilegeDetail | null;
  tierGroups: EntityState<TierGroup>;
  segmentGroups: EntityState<SegmentGroup>;
  includeExcludeSegmentTier: TierSegmentIncludeExclude[];
  uploadCodeInventories: EntityState<Inventory>;
  productInventories: EntityState<Inventory>;
}

export const brandsAdapter: EntityAdapter<BrandCommon> =
  createEntityAdapter<BrandCommon>({
    selectId: (brand: BrandCommon) => brand.brand_id,
  });

export const healthcarePackagesAdapter: EntityAdapter<HealthcarePackage> =
  createEntityAdapter<HealthcarePackage>({
    selectId: (healthcarePackage: HealthcarePackage) => healthcarePackage.id,
  });

export const tierGroupsAdapter: EntityAdapter<TierGroup> =
  createEntityAdapter<TierGroup>({
    selectId: (tierGroup: TierGroup) => tierGroup.tier_id,
  });

export const segmentGroupsAdapter: EntityAdapter<SegmentGroup> =
  createEntityAdapter<SegmentGroup>({
    selectId: (segmentGroup: SegmentGroup) => segmentGroup.id,
  });

export const inventoryAdapter: EntityAdapter<Inventory> =
  createEntityAdapter<Inventory>({
    selectId: (inventory: Inventory) => inventory.inventory_id,
  });

export const initialState: State = {
  brands: brandsAdapter.getInitialState(),
  healthcarePackages: healthcarePackagesAdapter.getInitialState(),
  uploadCodeInventories: inventoryAdapter.getInitialState(),
  productInventories: inventoryAdapter.getInitialState(),
  isFormDirty: false,
  privilegeDetail: null,
  tierGroups: tierGroupsAdapter.getInitialState(),
  segmentGroups: segmentGroupsAdapter.getInitialState(),
  includeExcludeSegmentTier: [],
};

export const reducer = createReducer(
  initialState,
  on(CreateEditPrivilegeActions.getBrandOptionsSuccess, (state, { data }) => {
    return {
      ...state,
      brands: brandsAdapter.setAll(data, state.brands),
    };
  }),
  on(
    CreateEditPrivilegeActions.getHealthcarePackageOptionsSuccess,
    (state, { data }) => {
      return {
        ...state,
        healthcarePackages: healthcarePackagesAdapter.setAll(
          data,
          state.healthcarePackages
        ),
      };
    }
  ),
  on(
    CreateEditPrivilegeActions.getUploadCodeInventoriesSuccess,
    (state, { pagedData }) => {
      const filteredData = pagedData.data.filter(
        (item) => item.ready_to_use > 0
      );

      return {
        ...state,
        uploadCodeInventories: inventoryAdapter.setAll(
          filteredData,
          state.uploadCodeInventories
        ),
      };
    }
  ),
  on(
    CreateEditPrivilegeActions.getProductInventoriesSuccess,
    (state, { pagedData }) => {
      const filteredData = pagedData.data.filter(
        (item) => item.ready_to_use > 0
      );

      return {
        ...state,
        productInventories: inventoryAdapter.setAll(
          filteredData,
          state.productInventories
        ),
      };
    }
  ),
  on(CreateEditPrivilegeActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(
    CreateEditPrivilegeActions.getPrivilegeDetailSuccess,
    (state, { privilege }) => ({
      ...state,
      privilegeDetail: privilege,
    })
  ),
  on(CreateEditPrivilegeActions.getTierGroupsSuccess, (state, { data }) => ({
    ...state,
    tierGroups: tierGroupsAdapter.setAll(data.data, state.tierGroups),
  })),
  on(CreateEditPrivilegeActions.getSegmentGroupsSuccess, (state, { data }) => ({
    ...state,
    segmentGroups: segmentGroupsAdapter.setAll(data.data, state.segmentGroups),
  })),
  on(
    CreateEditPrivilegeActions.setIncludeExcludeSegmentTier,
    (state, { items }) => ({
      ...state,
      includeExcludeSegmentTier: items,
    })
  ),
  on(CreateEditPrivilegeActions.reset, () => ({
    ...initialState,
  }))
);
