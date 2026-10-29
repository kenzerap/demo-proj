import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { InventoryService } from '../../services/inventory.service';
import * as CreateEditInventoryActions from './create-edit-inventory.actions';
import * as CreateEditInventorySelectors from './create-edit-inventory.selectors';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { CreateEditInventoryQueryParams } from '../../models/create-edit-inventory-query-params.model';
import { UploadCodeInventoryParams } from '../../models/upload-code-inventory-params.model';
import { InventoryType } from '../../../../shared/utils/enums/inventory-type.enum';
import { CreateEditProductStockQueryParams } from '../../models/create-edit-product-stock-query-params.model';

@Injectable()
export class CreateEditInventoryEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private inventoryService = inject(InventoryService);
  private authService = inject(AuthService);

  createInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.createInventory),
      withLatestFrom(
        this.store.select(CreateEditInventorySelectors.selectInventoryId),
        this.authService.getCurrentUser$()
      ),
      switchMap(([{ data }, inventory_id, currentUser]) => {
        const dataBody: Partial<CreateEditInventoryQueryParams> = {
          ...data,
          created_by: currentUser?.username,
          inventory_id: inventory_id || undefined,
        };

        return this.inventoryService.createInventory(dataBody).pipe(
          map((response) =>
            CreateEditInventoryActions.createInventorySuccess({
              inventory_id: response.inventory_id,
            })
          ),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Inventory',
              message: `Failed to create Inventory (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditInventoryActions.createInventoryFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  getBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.getBrandOptions),
      switchMap(() => {
        return this.inventoryService.getBrandsDropdown().pipe(
          map((data) =>
            CreateEditInventoryActions.getBrandOptionsSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditInventoryActions.getBrandOptionsFailure({ error })
            );
          })
        );
      })
    )
  );

  validateUploadCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.validateUploadCode),
      switchMap(({ brand_id, file }) => {
        return this.inventoryService
          .validateInventoryUploadCode(brand_id, file)
          .pipe(
            map((response) =>
              CreateEditInventoryActions.validateUploadCodeSuccess({ response })
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Inventory',
                message: `Failed to validate Inventory (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditInventoryActions.validateUploadCodeFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  createInventoryAndUpdateData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.createInventoryAndUpdateData),
      withLatestFrom(
        this.store.select(CreateEditInventorySelectors.selectInventoryId),
        this.authService.getCurrentUser$()
      ),
      switchMap(
        ([{ file, inventoryData, dataUpdated }, inventory_id, currentUser]) => {
          const dataBody: Partial<CreateEditInventoryQueryParams> = {
            ...inventoryData,
            created_by: currentUser?.username,
            inventory_id: inventory_id || undefined,
          };

          if (inventory_id) {
            return of(
              CreateEditInventoryActions.createInventoryAndUpdateDataSuccess({
                file,
                inventory_id,
                inventory_type: inventoryData.inventory_type || '',
                data: dataUpdated,
              })
            );
          }

          return this.inventoryService.createInventory(dataBody).pipe(
            map((response) =>
              CreateEditInventoryActions.createInventoryAndUpdateDataSuccess({
                file,
                inventory_id: response.inventory_id,
                inventory_type: inventoryData.inventory_type || '',
                data: dataUpdated,
              })
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Inventory',
                message: `Failed to create Inventory (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditInventoryActions.createInventoryAndUpdateDataFailure({
                  messageData,
                })
              );
            })
          );
        }
      )
    )
  );

  getInventoryUploadCodeSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CreateEditInventoryActions.uploadCodeSuccess,
        CreateEditInventoryActions.deleteUploadCodeSuccess,
        CreateEditInventoryActions.getInventoryUploadCodeSummary
      ),
      switchMap(({ inventory_id }) => {
        return this.inventoryService
          .getInventoryUploadCodeSummary(inventory_id)
          .pipe(
            map((summary) =>
              CreateEditInventoryActions.getInventoryUploadCodeSummarySuccess({
                summary,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditInventoryActions.getInventoryUploadCodeSummaryFailure(
                  { error }
                )
              );
            })
          );
      })
    )
  );

  createInventoryAndUpdateDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.createInventoryAndUpdateDataSuccess),
      mergeMap(({ data, file, inventory_id, inventory_type }) => {
        switch (inventory_type) {
          case InventoryType.UPLOAD_CODE:
            return of(
              CreateEditInventoryActions.uploadCode({
                data,
                file,
                inventory_id,
              })
            );
          case InventoryType.PRODUCT:
            return of(
              CreateEditInventoryActions.createEditProductStock({
                data,
              })
            );

          default:
            return EMPTY;
        }
      })
    )
  );

  uploadCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.uploadCode),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data, file, inventory_id }, currentUser]) => {
        const dataBody: Partial<UploadCodeInventoryParams> = {
          ...data,
          created_by: currentUser?.username,
        };

        return this.inventoryService
          .uploadCodeInventory(inventory_id, dataBody, file || null)
          .pipe(
            map((uploadCodes) =>
              CreateEditInventoryActions.uploadCodeSuccess({
                uploadCodes,
                inventory_id,
              })
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Inventory',
                message: `Failed to upload code (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditInventoryActions.uploadCodeFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  deleteUploadCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.deleteUploadCode),
      withLatestFrom(
        this.store.select(CreateEditInventorySelectors.selectInventoryId)
      ),
      switchMap(([{ upload_code_id }, inventory_id]) => {
        return this.inventoryService
          .deleteUploadCode(inventory_id || 0, upload_code_id)
          .pipe(
            map((response) =>
              CreateEditInventoryActions.deleteUploadCodeSuccess({
                response,
                inventory_id: inventory_id || 0,
              })
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Upload Code',
                message: `Failed to delete Upload Code (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditInventoryActions.deleteUploadCodeFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  getInventoryDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.getInventoryDetail),
      switchMap(({ inventory_id }) => {
        return this.inventoryService.getInventoryDetail(inventory_id).pipe(
          map((inventory) =>
            CreateEditInventoryActions.getInventoryDetailSuccess({
              inventory,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditInventoryActions.getInventoryDetailFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getInventoryDetailSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.getInventoryDetailSuccess),
      switchMap(({ inventory }) => {
        if (inventory.inventory_type === InventoryType.UPLOAD_CODE) {
          return of(
            CreateEditInventoryActions.getInventoryUploadCodeSummary({
              inventory_id: inventory.inventory_id,
            })
          );
        }

        return EMPTY;
      })
    )
  );

  updateInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.updateInventory),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data }, currentUser]) => {
        const dataBody: Partial<CreateEditInventoryQueryParams> = {
          ...data,
          updated_by: currentUser?.username,
        };

        return this.inventoryService.updateInventory(dataBody).pipe(
          map(() => CreateEditInventoryActions.updateInventorySuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Inventory',
              message: `Failed to update inventory (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditInventoryActions.updateInventoryFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  createEditProductStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.createEditProductStock),
      withLatestFrom(
        this.authService.getCurrentUser$(),
        this.store.select(CreateEditInventorySelectors.selectInventoryId)
      ),
      switchMap(([{ data }, currentUser, inventory_id]) => {
        const dataBody: Partial<CreateEditProductStockQueryParams> = {
          ...data,
          created_by: currentUser?.username,
        };

        return this.inventoryService
          .createProductStock(inventory_id || 0, dataBody)
          .pipe(
            map((response) =>
              CreateEditInventoryActions.createEditProductStockSuccess({
                response,
                inventory_id: inventory_id || 0,
              })
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Create Product Stock',
                message: `Failed to Create Product Stock (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditInventoryActions.createEditProductStockFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  deleteProductStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditInventoryActions.deleteProductStock),
      withLatestFrom(
        this.store.select(CreateEditInventorySelectors.selectInventoryId)
      ),
      switchMap(([{ product_stock_id }, inventory_id]) => {
        return this.inventoryService
          .deleteProductStock(inventory_id || 0, product_stock_id)
          .pipe(
            map((response) =>
              CreateEditInventoryActions.deleteProductStockSuccess({
                response,
                inventory_id: inventory_id || 0,
              })
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Delete Product Stock',
                message: `Failed to delete Product Stock (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditInventoryActions.deleteProductStockFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );
}
