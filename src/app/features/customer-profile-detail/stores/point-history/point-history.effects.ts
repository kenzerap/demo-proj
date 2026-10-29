import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PointHistoryActions from './point-history.actions';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { CustomerPointService } from '../../services/customer-point.service';
import { ToastMessageData } from 'src/app/shared/models/toast-message-data.model';
import { ToastMessageType } from 'src/app/shared/utils/enums/toast-message-type.enum';
import { getCustomerPoint } from '../analytic-summary/analytic-summary.actions';
import { AuthService } from '@app/core/services/auth-service';
import { AddDeletePointQueryParams } from '../../models/point-histories-query-params.model';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ProcessStatusCode } from '@app/shared/utils/enums/process-status-code.enum';
import { CommonContentService } from '@app/shared/services/common-content.service';

@Injectable()
export class PointHistoryEffects {
  private actions$ = inject(Actions);
  private customerPointService = inject(CustomerPointService);
  private authService = inject(AuthService);
  private commonContentService = inject(CommonContentService);

  addPoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointHistoryActions.addPoint),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ partyId, queryParams }, currentUser]) => {
        const params: Partial<AddDeletePointQueryParams> = {
          ...queryParams,
          createdBy: currentUser?.username,
        };

        return this.customerPointService.addPoint(partyId, params).pipe(
          map((data) => PointHistoryActions.addPointSuccess({ data, partyId })),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Add point',
              message: `Failed to add points (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(PointHistoryActions.addPointFailure({ messageData }));
          })
        );
      })
    )
  );

  addPointSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointHistoryActions.addPointSuccess),
      mergeMap(() => {
        const messageData: ToastMessageData = {
          title: 'Add point',
          message: `Points added successfully.`,
          type: ToastMessageType.SUCCESS,
        };

        return of(pushMessage({ messageData, duration: 3000 }));
      })
    )
  );

  refreshPointHistories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PointHistoryActions.addPointSuccess,
        PointHistoryActions.deletePointSuccess
      ),
      concatMap(({ partyId }) => [
        PointHistoryActions.getPointHistories({
          partyId,
          queryParams: {
            page: 0,
            size: 10,
          },
        }),
        PointHistoryActions.getPointExpiries({
          partyId,
          queryParams: {
            page: 0,
            size: 10,
          },
        }),
        getCustomerPoint({
          partyId,
        }),
      ])
    )
  );

  deletePoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointHistoryActions.deletePoint),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ partyId, queryParams }, currentUser]) => {
        const params: Partial<AddDeletePointQueryParams> = {
          ...queryParams,
          createdBy: currentUser?.username,
        };

        return this.customerPointService.deletePoint(partyId, params).pipe(
          map((data) =>
            PointHistoryActions.deletePointSuccess({ data, partyId })
          ),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Delete point',
              message: `Failed to delete points (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(PointHistoryActions.deletePointFailure({ messageData }));
          })
        );
      })
    )
  );

  deletePointSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointHistoryActions.deletePointSuccess),
      mergeMap(() => {
        const messageData: ToastMessageData = {
          title: 'Delete point',
          message: `Points deleted successfully.`,
          type: ToastMessageType.SUCCESS,
        };

        return of(pushMessage({ messageData, duration: 3000 }));
      })
    )
  );

  getPointHistories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointHistoryActions.getPointHistories),
      switchMap(({ partyId, queryParams }) => {
        return this.customerPointService
          .getPointHistories(partyId, queryParams)
          .pipe(
            map((pagedData) =>
              PointHistoryActions.getPointHistoriesSuccess({ pagedData })
            ),
            catchError((error) => {
              return of(
                PointHistoryActions.getPointHistoriesFailure({ error })
              );
            })
          );
      })
    )
  );

  getPointExpiries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointHistoryActions.getPointExpiries),
      switchMap(({ partyId, queryParams }) => {
        return this.customerPointService
          .getPointExpiries(partyId, queryParams)
          .pipe(
            map((pagedData) =>
              PointHistoryActions.getPointExpiriesSuccess({ pagedData })
            ),
            catchError((error) => {
              return of(PointHistoryActions.getPointExpiriesFailure({ error }));
            })
          );
      })
    )
  );

  showExportPreparingToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointHistoryActions.exportPointToExcel),
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

  exportPointToExcel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointHistoryActions.exportPointToExcel),
      switchMap(({ file_name, partyId, exportType }) => {
        return this.customerPointService
          .exportPointToExcel(
            partyId,
            exportType,
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
                            return PointHistoryActions.exportPointToExcelSuccess(
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
                            return PointHistoryActions.exportPointToExcelFailure(
                              {
                                messageData: {
                                  title: "Couldn't generate your file",
                                  message: `<b>${fileName}</b><br/>. Please try again.`,
                                  type: ToastMessageType.ERROR,
                                },
                              }
                            );
                          }

                          return PointHistoryActions.exportPointToExcelPending();
                        }),
                        catchError(() => {
                          return of(
                            PointHistoryActions.exportPointToExcelFailure({
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
                        PointHistoryActions.exportPointToExcelSuccess,
                        PointHistoryActions.exportPointToExcelFailure
                      )
                    )
                  )
                );
              }

              return of(
                PointHistoryActions.exportPointToExcelFailure({
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
                title: 'Point History',
                message: `Failed to export Point History (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                PointHistoryActions.exportPointToExcelFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  exportPointToExcelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointHistoryActions.exportPointToExcelSuccess),
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
