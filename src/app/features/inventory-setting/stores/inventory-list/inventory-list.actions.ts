import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { InventoriesQueryParams } from '../../../../shared/models/inventories-query-params.model';
import { Inventory } from '../../../../shared/models/inventory-model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

const prefix = '[inventories]';

export const getInventories = createAction(
  `${prefix} Get Inventories | loadingKey=getInventories`,
  props<{ queryParams: Partial<InventoriesQueryParams> }>()
);

export const getInventoriesSuccess = createAction(
  `${prefix} Get Inventories Success | loadingKey=getInventories`,
  props<{ pagedData: PagedData<Inventory> }>()
);

export const getInventoriesFailure = createAction(
  `${prefix} Get Inventories Failure | loadingKey=getInventories`,
  props<{ error: CommonError }>()
);

export const setInventoryFilters = createAction(
  `${prefix} Set Inventory Filters`,
  props<{ filters: Partial<InventoriesQueryParams> }>()
);

export const exportUploadCodeInventory = createAction(
  `${prefix} Export Upload Code Inventory | loadingKey=exportUploadCodeInventory`,
  props<{ expected_zone_id: string }>()
);

export const exportUploadCodeInventoryPending = createAction(
  `${prefix} Export Upload Code Inventory Pending | loadingKey=exportUploadCodeInventory`
);

export const exportUploadCodeInventorySuccess = createAction(
  `${prefix} Export Upload Code Inventory Success | loadingKey=exportUploadCodeInventory`,
  props<{ file_name: string; url: string }>()
);

export const exportUploadCodeInventoryFailure = createAction(
  `${prefix} Export Upload Code Inventory Failure | loadingKey=exportUploadCodeInventory`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
