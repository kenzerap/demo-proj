import { createReducer, on } from '@ngrx/store';
import * as CreateEditInventoryActions from './create-edit-inventory.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { BrandCommon } from '../../models/brand-common.model';
import { UploadCode } from '../../models/upload-code.model';
import { InventorySummary } from '../../models/inventory-summary.model';
import { InventoryDetail } from '../../models/inventory-detail.model';
import { ProductStock } from '../../models/product-stock.model';

export const featureKey = 'createEditInventory';

export interface State {
  isFormDirty: boolean;
  brands: EntityState<BrandCommon>;
  uploadCodes: EntityState<UploadCode>;
  productStocks: EntityState<ProductStock>;
  inventory_id?: number;
  summary: InventorySummary | null;
  inventoryDetail: InventoryDetail | null;
}

export const adapter: EntityAdapter<BrandCommon> =
  createEntityAdapter<BrandCommon>({
    selectId: (brand: BrandCommon) => brand.brand_id,
  });

export const uploadCodeAdapter: EntityAdapter<UploadCode> =
  createEntityAdapter<UploadCode>({
    selectId: (uploadCode: UploadCode) => uploadCode.upload_code_id,
  });

export const productStockAdapter: EntityAdapter<ProductStock> =
  createEntityAdapter<ProductStock>({
    selectId: (productStock: ProductStock) => productStock.product_stock_id,
  });

export const initialState: State = {
  brands: adapter.getInitialState(),
  isFormDirty: false,
  uploadCodes: uploadCodeAdapter.getInitialState(),
  productStocks: productStockAdapter.getInitialState(),
  summary: null,
  inventoryDetail: null,
};

export const reducer = createReducer(
  initialState,
  on(CreateEditInventoryActions.getBrandOptionsSuccess, (state, { data }) => {
    return {
      ...state,
      brands: adapter.setAll(data, state.brands),
    };
  }),
  on(
    CreateEditInventoryActions.createInventorySuccess,
    CreateEditInventoryActions.createInventoryAndUpdateDataSuccess,
    (state, { inventory_id }) => {
      return {
        ...state,
        inventory_id,
      };
    }
  ),
  on(CreateEditInventoryActions.uploadCodeSuccess, (state, { uploadCodes }) => {
    return {
      ...state,
      uploadCodes: uploadCodeAdapter.setAll(uploadCodes, state.uploadCodes),
    };
  }),
  on(CreateEditInventoryActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(
    CreateEditInventoryActions.getInventoryUploadCodeSummarySuccess,
    (state, { summary }) => {
      return {
        ...state,
        summary,
      };
    }
  ),
  on(
    CreateEditInventoryActions.deleteUploadCodeSuccess,
    (state, { response }) => {
      return {
        ...state,
        uploadCodes: response.deleted
          ? uploadCodeAdapter.setAll(
              response.upload_code_list,
              state.uploadCodes
            )
          : state.uploadCodes,
      };
    }
  ),
  on(
    CreateEditInventoryActions.getInventoryDetailSuccess,
    (state, { inventory }) => ({
      ...state,
      inventoryDetail: inventory,
      summary: inventory.summary_section_output,
      inventory_id: inventory.inventory_id,
      uploadCodes:
        inventory.upload_code_list?.length > 0
          ? uploadCodeAdapter.setAll(
              inventory.upload_code_list,
              state.uploadCodes
            )
          : state.uploadCodes,
      productStocks:
        inventory.product_stock_list?.length > 0
          ? productStockAdapter.setAll(
              inventory.product_stock_list,
              state.productStocks
            )
          : state.productStocks,
    })
  ),
  on(
    CreateEditInventoryActions.createEditProductStockSuccess,
    CreateEditInventoryActions.deleteProductStockSuccess,
    (state, { response }) => {
      return {
        ...state,
        summary: response.summary_section_output,
        productStocks: response.could_update_delete
          ? productStockAdapter.setAll(
              response.product_stock_outputs,
              state.productStocks
            )
          : state.productStocks,
      };
    }
  ),
  on(CreateEditInventoryActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
