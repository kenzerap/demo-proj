import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as InventoriesActions from './inventory-list.actions';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectInventoryFilters } from './inventory-list.selectors';
import { PrivilegeService } from '@app/shared/services/privilege.service';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ProcessStatusCode } from '@app/shared/utils/enums/process-status-code.enum';
import { CommonContentService } from '@app/shared/services/common-content.service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { InventoryService } from '../../services/inventory.service';

@Injectable()
export class InventoriesListEffects {
  private actions$ = inject(Actions);
  private privilegeService = inject(PrivilegeService);
  private store = inject(Store);
  private commonContentService = inject(CommonContentService);
  private inventoryService = inject(InventoryService);

  getInventories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoriesActions.getInventories),
      switchMap(({ queryParams }) => {
        return this.privilegeService.getInventories(queryParams).pipe(
          map((pagedData) =>
            InventoriesActions.getInventoriesSuccess({ pagedData }),
          ),
          catchError((error) => {
            return of(InventoriesActions.getInventoriesFailure({ error }));
          }),
        );
      }),
    ),
  );

  setInventoryFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoriesActions.setInventoryFilters),
      withLatestFrom(this.store.select(selectInventoryFilters)),
      switchMap(([_, filters]) => {
        return of(InventoriesActions.getInventories({ queryParams: filters }));
      }),
    ),
  );

  showExportPreparingToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoriesActions.exportUploadCodeInventory),
      map(() => {
        return pushMessage({
          messageData: {
            title: 'Exporting',
            message: 'Preparing your file for download',
            type: ToastMessageType.WARNING,
          },
        });
      }),
    ),
  );

  exportUploadCodeInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoriesActions.exportUploadCodeInventory),
      switchMap(({ expected_zone_id }) => {
        return this.inventoryService
          .exportUploadCodeInventory(
            expected_zone_id ||
              Intl.DateTimeFormat().resolvedOptions().timeZone,
          )
          .pipe(
            switchMap((res) => {
              const fileInfo = res.file_upload_infos?.[0];
              if (
                fileInfo?.upload_status === ProcessStatusCode.VERIFIED &&
                fileInfo.file_upload_id
              ) {
                return timer(0, 4000).pipe(
                  switchMap(() => {
                    return this.commonContentService
                      .getFileInfo(fileInfo.file_upload_id)
                      .pipe(
                        map((fileInfoResponse) => {
                          if (
                            fileInfoResponse.upload_status ===
                              ProcessStatusCode.COMPLETED &&
                            fileInfoResponse.presigned_url
                          ) {
                            return InventoriesActions.exportUploadCodeInventorySuccess(
                              {
                                file_name: fileInfo.file_name,
                                url: fileInfoResponse.presigned_url,
                              },
                            );
                          }

                          if (
                            fileInfoResponse.upload_status ===
                            ProcessStatusCode.FAILED
                          ) {
                            return InventoriesActions.exportUploadCodeInventoryFailure(
                              {
                                messageData: {
                                  title: "Couldn't generate your file",
                                  message: `<b>${fileInfo.file_name}</b><br/>. Please try again.`,
                                  type: ToastMessageType.ERROR,
                                },
                              },
                            );
                          }

                          return InventoriesActions.exportUploadCodeInventoryPending();
                        }),
                        catchError(() => {
                          return of(
                            InventoriesActions.exportUploadCodeInventoryFailure(
                              {
                                messageData: {
                                  title: "Couldn't generate your file",
                                  message: `<b>${fileInfo.file_name}</b><br/>. Please try again.`,
                                  type: ToastMessageType.ERROR,
                                },
                              },
                            ),
                          );
                        }),
                      );
                  }),
                  takeUntil(
                    this.actions$.pipe(
                      ofType(
                        InventoriesActions.exportUploadCodeInventorySuccess,
                        InventoriesActions.exportUploadCodeInventoryFailure,
                      ),
                    ),
                  ),
                );
              }

              return of(
                InventoriesActions.exportUploadCodeInventoryFailure({
                  messageData: {
                    title: "Couldn't generate your file",
                    message: `<b>${fileInfo.file_name}</b><br/>. Please try again.`,
                    type: ToastMessageType.ERROR,
                  },
                }),
              );
            }),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Inventory',
                message: `Failed to export upload code inventory (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                InventoriesActions.exportUploadCodeInventoryFailure({
                  messageData,
                }),
              );
            }),
          );
      }),
    ),
  );

  exportUploadCodeInventorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoriesActions.exportUploadCodeInventorySuccess),
      map(({ file_name, url }) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = file_name || 'unicode-report.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        return pushMessage({
          messageData: {
            title: 'Done',
            message: `Your report <b>${file_name}</b> was downloaded successfully.`,
            type: ToastMessageType.SUCCESS,
          },
        });
      }),
    ),
  );
}
