import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { CreateEditInventoryQueryParams } from '../../models/create-edit-inventory-query-params.model';
import { BrandCommon } from '../../models/brand-common.model';
import { ValidateUploadCodeResponse } from '../../models/validate-upload-code-response.model';
import { UploadCodeInventoryParams } from '../../models/upload-code-inventory-params.model';
import { UploadCode } from '../../models/upload-code.model';
import { InventorySummary } from '../../models/inventory-summary.model';
import { DeleteUploadCodeResponse } from '../../models/delete-upload-code-response.model';
import { InventoryDetail } from '../../models/inventory-detail.model';
import { CreateEditProductStockQueryParams } from '../../models/create-edit-product-stock-query-params.model';
import { UpdateDeleteProductStockResponse } from '../../models/update-delete-product-stock-response.model';
import { InventoryType } from '../../../../shared/utils/enums/inventory-type.enum';

const prefix = '[Create Edit Inventory]';

export const createInventory = createAction(
  `${prefix} Create Inventory | loadingKey=createEditInventory`,
  props<{ data: Partial<CreateEditInventoryQueryParams> }>()
);

export const createInventorySuccess = createAction(
  `${prefix} Create Inventory Success | loadingKey=createEditInventory`,
  props<{
    inventory_id: number;
  }>()
);

export const createInventoryFailure = createAction(
  `${prefix} Create Inventory Failure | loadingKey=createEditInventory`,
  props<{ messageData: ToastMessageData }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getBrandOptions = createAction(
  `${prefix} Get Brands Options | loadingKey=getBrandOptions`
);

export const getBrandOptionsSuccess = createAction(
  `${prefix} Get Brands Options Success | loadingKey=getBrandOptions`,
  props<{ data: BrandCommon[] }>()
);

export const getBrandOptionsFailure = createAction(
  `${prefix} Get Brands Options Failure | loadingKey=getBrandOptions`,
  props<{ error: CommonError }>()
);

export const validateUploadCode = createAction(
  `${prefix} Validate Upload Code | loadingKey=validateUploadCode`,
  props<{ brand_id: number; file: File }>()
);

export const validateUploadCodeSuccess = createAction(
  `${prefix} Validate Upload Code Success | loadingKey=validateUploadCode`,
  props<{ response: ValidateUploadCodeResponse }>()
);

export const validateUploadCodeFailure = createAction(
  `${prefix} Validate Upload Code Failure | loadingKey=validateUploadCode`,
  props<{ messageData: ToastMessageData }>()
);

export const createInventoryAndUpdateData = createAction(
  `${prefix} Create Inventory And Update data | loadingKey=createInventoryAndUpdateData`,
  props<{
    inventoryData: Partial<CreateEditInventoryQueryParams>;
    dataUpdated: Partial<
      UploadCodeInventoryParams | CreateEditProductStockQueryParams
    >;
    file?: File;
  }>()
);

export const createInventoryAndUpdateDataSuccess = createAction(
  `${prefix} Create Inventory And Update data Success | loadingKey=createInventoryAndUpdateData`,
  props<{
    inventory_id: number;
    inventory_type: InventoryType | string;
    data: Partial<
      UploadCodeInventoryParams | CreateEditProductStockQueryParams
    >;
    file?: File;
  }>()
);

export const createInventoryAndUpdateDataFailure = createAction(
  `${prefix} Create Inventory And Update data Failure | loadingKey=createInventoryAndUpdateData`,
  props<{ messageData: ToastMessageData }>()
);

export const uploadCode = createAction(
  `${prefix} Upload Code | loadingKey=uploadCode`,
  props<{
    inventory_id: number;
    data: Partial<UploadCodeInventoryParams>;
    file?: File;
  }>()
);

export const uploadCodeSuccess = createAction(
  `${prefix} Upload Code Success | loadingKey=uploadCode`,
  props<{
    uploadCodes: UploadCode[];
    inventory_id: number;
  }>()
);

export const uploadCodeFailure = createAction(
  `${prefix} Upload Code Failure | loadingKey=uploadCode`,
  props<{ messageData: ToastMessageData }>()
);

export const getInventoryUploadCodeSummary = createAction(
  `${prefix} Get Inventory Upload Code Summary | loadingKey=getInventoryUploadCodeSummary`,
  props<{
    inventory_id: number;
  }>()
);

export const getInventoryUploadCodeSummarySuccess = createAction(
  `${prefix} Get Inventory Upload Code Summary Success | loadingKey=getInventoryUploadCodeSummary`,
  props<{ summary: InventorySummary }>()
);

export const getInventoryUploadCodeSummaryFailure = createAction(
  `${prefix} Get Inventory Upload Code Summary Failure | loadingKey=getInventoryUploadCodeSummary`,
  props<{ error: CommonError }>()
);

export const deleteUploadCode = createAction(
  `${prefix} Delete Upload Code | loadingKey=deleteUploadCode`,
  props<{ upload_code_id: number }>()
);

export const deleteUploadCodeSuccess = createAction(
  `${prefix} Delete Upload Code Success | loadingKey=deleteUploadCode`,
  props<{ response: DeleteUploadCodeResponse; inventory_id: number }>()
);

export const deleteUploadCodeFailure = createAction(
  `${prefix} Delete Upload Code Failure | loadingKey=deleteUploadCode`,
  props<{ messageData: ToastMessageData }>()
);

export const getInventoryDetail = createAction(
  `${prefix} Get Inventory Detail | loadingKey=getInventoryDetail`,
  props<{ inventory_id: number }>()
);

export const getInventoryDetailSuccess = createAction(
  `${prefix} Get Inventory Detail Success | loadingKey=getInventoryDetail`,
  props<{ inventory: InventoryDetail }>()
);

export const getInventoryDetailFailure = createAction(
  `${prefix} Get Inventory Detail Failure | loadingKey=getInventoryDetail`,
  props<{ error: CommonError }>()
);

export const updateInventory = createAction(
  `${prefix} Update Inventory | loadingKey=createEditInventory`,
  props<{
    data: Partial<CreateEditInventoryQueryParams>;
  }>()
);

export const updateInventorySuccess = createAction(
  `${prefix} Update Inventory Success | loadingKey=createEditInventory`
);

export const updateInventoryFailure = createAction(
  `${prefix} Update Inventory Failure | loadingKey=createEditInventory`,
  props<{ messageData: ToastMessageData }>()
);

export const createEditProductStock = createAction(
  `${prefix} Create Edit Product Stock | loadingKey=createEditProductStock`,
  props<{
    data: Partial<CreateEditProductStockQueryParams>;
  }>()
);

export const createEditProductStockSuccess = createAction(
  `${prefix} Create Edit Product Stock Success | loadingKey=createEditProductStock`,
  props<{
    response: UpdateDeleteProductStockResponse;
    inventory_id: number;
  }>()
);

export const createEditProductStockFailure = createAction(
  `${prefix} Create Edit Product Stock Failure | loadingKey=createEditProductStock`,
  props<{ messageData: ToastMessageData }>()
);

export const deleteProductStock = createAction(
  `${prefix} Delete Product Stock | loadingKey=deleteProductStock`,
  props<{ product_stock_id: number }>()
);

export const deleteProductStockSuccess = createAction(
  `${prefix} Delete Product Stock Success | loadingKey=deleteProductStock`,
  props<{ response: UpdateDeleteProductStockResponse; inventory_id: number }>()
);

export const deleteProductStockFailure = createAction(
  `${prefix} Delete Product Stock Failure | loadingKey=deleteProductStock`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(`${prefix} Reset Create Edit Inventory`);
