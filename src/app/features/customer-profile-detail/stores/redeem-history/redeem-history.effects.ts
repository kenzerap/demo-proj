import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RedeemHistoryActions from './redeem-history.actions';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { CustomerPrivilegeService } from '../../services/customer-privilege.service';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ProcessStatusCode } from '@app/shared/utils/enums/process-status-code.enum';
import { CommonContentService } from '@app/shared/services/common-content.service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

@Injectable()
export class RedeemHistoryEffects {
  private actions$ = inject(Actions);
  private customerPrivilegeService = inject(CustomerPrivilegeService);
  private commonContentService = inject(CommonContentService);

  getRedeemHistories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RedeemHistoryActions.getRedeemHistories),
      switchMap(({ partyId, queryParams }) => {
        return this.customerPrivilegeService
          .getRedeemHistories(partyId, queryParams)
          .pipe(
            map((pagedData) =>
              RedeemHistoryActions.getRedeemHistoriesSuccess({ pagedData })
            ),
            catchError((error) => {
              return of(
                RedeemHistoryActions.getRedeemHistoriesFailure({ error })
              );
            })
          );
      })
    )
  );

  showExportPreparingToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RedeemHistoryActions.exportRedeemToExcel),
      map(() => {
        return pushMessage({
          messageData: {
            title: 'Exporting',
            message: 'Preparing your file for download',
            type: ToastMessageType.WARNING,
          },
        });
      })
    )
  );

  exportRedeemToExcel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RedeemHistoryActions.exportRedeemToExcel),
      switchMap(({ file_name, partyId }) => {
        return this.customerPrivilegeService
          .exportRedeemToExcel(
            partyId,
            Intl.DateTimeFormat().resolvedOptions().timeZone
          )
          .pipe(
            switchMap((res) => {
              const fileInfo = res.file_upload_infos?.[0];
              const fileName = fileInfo?.file_name || file_name;
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
                            return RedeemHistoryActions.exportRedeemToExcelSuccess(
                              {
                                file_name: fileName,
                                url: fileInfoResponse.presigned_url,
                              }
                            );
                          }

                          if (
                            fileInfoResponse.upload_status ===
                            ProcessStatusCode.FAILED
                          ) {
                            return RedeemHistoryActions.exportRedeemToExcelFailure(
                              {
                                messageData: {
                                  title: "Couldn't generate your file",
                                  message: `<b>${fileName}</b><br/>. Please try again.`,
                                  type: ToastMessageType.ERROR,
                                },
                              }
                            );
                          }

                          return RedeemHistoryActions.exportRedeemToExcelPending();
                        }),
                        catchError(() => {
                          return of(
                            RedeemHistoryActions.exportRedeemToExcelFailure({
                              messageData: {
                                title: "Couldn't generate your file",
                                message: `<b>${fileName}</b><br/>. Please try again.`,
                                type: ToastMessageType.ERROR,
                              },
                            })
                          );
                        })
                      );
                  }),
                  takeUntil(
                    this.actions$.pipe(
                      ofType(
                        RedeemHistoryActions.exportRedeemToExcelSuccess,
                        RedeemHistoryActions.exportRedeemToExcelFailure
                      )
                    )
                  )
                );
              }

              return of(
                RedeemHistoryActions.exportRedeemToExcelFailure({
                  messageData: {
                    title: "Couldn't generate your file",
                    message: `<b>${fileName}</b><br/>. Please try again.`,
                    type: ToastMessageType.ERROR,
                  },
                })
              );
            }),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Redeem History',
                message: `Failed to export Redeem History (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                RedeemHistoryActions.exportRedeemToExcelFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  exportRedeemToExcelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RedeemHistoryActions.exportRedeemToExcelSuccess),
      map(({ file_name, url }) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = file_name;
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
      })
    )
  );
}
