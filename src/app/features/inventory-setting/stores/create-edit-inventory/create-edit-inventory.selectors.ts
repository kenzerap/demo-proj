import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreateInventory from './create-edit-inventory.reducer';

export const selectFeature = createFeatureSelector<fromCreateInventory.State>(
  fromCreateInventory.featureKey
);

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) => state.isFormDirty
);

export const selectInventoryId = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) => state.inventory_id
);

export const selectInventorySummary = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) => state.summary
);

export const selectInventoryDetail = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) => state.inventoryDetail
);

// Brands list
const { selectIds, selectEntities, selectAll } =
  fromCreateInventory.adapter.getSelectors();

export const selectBrandsIds = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) => selectIds(state.brands)
);

export const selectBrandsEntities = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) => selectEntities(state.brands)
);

export const selectBrands = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) => selectAll(state.brands)
);

// Upload Codes
const {
  selectIds: uploadCodesSelectIds,
  selectEntities: uploadCodesSelectEntities,
  selectAll: uploadCodesSelectAll,
} = fromCreateInventory.uploadCodeAdapter.getSelectors();

export const selectUploadCodesIds = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) => uploadCodesSelectIds(state.uploadCodes)
);

export const selectUploadCodesEntities = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) =>
    uploadCodesSelectEntities(state.uploadCodes)
);

export const selectUploadCodes = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) => uploadCodesSelectAll(state.uploadCodes)
);

// Upload Codes
const { selectAll: productStocksSelectAll } =
  fromCreateInventory.productStockAdapter.getSelectors();

export const selectProductStocks = createSelector(
  selectFeature,
  (state: fromCreateInventory.State) =>
    productStocksSelectAll(state.productStocks)
);
