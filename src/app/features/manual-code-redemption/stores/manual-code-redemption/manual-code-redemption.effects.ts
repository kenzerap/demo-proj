import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ManualCodeRedemptionActions from './manual-code-redemption.actions';
import { selectManualCodeRedemptionFilters } from './manual-code-redemption.selector';
import { ManualCodeRedemptionService } from '../../services/manual-code-redemption.services';
import { AuthService } from '@app/core/services/auth-service';
import {
  ManualCodeRedemptionQueryParams,
  UpdateStatusQueryParams,
} from '../../models/manual-code-redemption-query-params.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ProcessStatusCode } from '@app/shared/utils/enums/process-status-code.enum';
import { CommonContentService } from '@app/shared/services/common-content.service';

@Injectable()
export class ManualCodeRedemptionEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private manualCodeRedemptionService = inject(ManualCodeRedemptionService);
  private authService = inject(AuthService);
  private commonContentService = inject(CommonContentService);

  getManualCodeRedemption$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualCodeRedemptionActions.getManualCodeRedemption),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ params }, currentUser]) => {
        const queryParams: Partial<ManualCodeRedemptionQueryParams> = {
          ...params,
          action_by: currentUser?.username,
        };
        return this.manualCodeRedemptionService
          .getManualCodeRedemption(queryParams)
          .pipe(
            map((pagedData) =>
              ManualCodeRedemptionActions.getManualCodeRedemptionSuccess({
                pagedData,
              })
            ),
            catchError((error) => {
              return of(
                ManualCodeRedemptionActions.getManualCodeRedemptionFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  setPrivilegeReportFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualCodeRedemptionActions.setManualCodeRedemptionFilters),
      withLatestFrom(this.store.select(selectManualCodeRedemptionFilters)),
      switchMap(([_, filters]) => {
        return of(
          ManualCodeRedemptionActions.getManualCodeRedemption({
            params: filters,
          })
        );
      })
    )
  );

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualCodeRedemptionActions.updateManualCodeRedemptionStatus),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ params }, currentUser]) => {
        const queryParams: UpdateStatusQueryParams = {
          ...params,
          action_done_by: currentUser?.username,
        };
        return this.manualCodeRedemptionService
          .updateManualCodeRedemptionStatus(queryParams)
          .pipe(
            map(() =>
              ManualCodeRedemptionActions.updateManualCodeRedemptionStatusSuccess(
                {
                  id: params.id,
                }
              )
            ),
            catchError((error) =>
              of(
                ManualCodeRedemptionActions.updateManualCodeRedemptionStatusFailure(
                  {
                    error,
                  }
                )
              )
            )
          );
      })
    )
  );

  showExportPreparingToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualCodeRedemptionActions.exportManualCodeRedemption),
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

  exportManualCodeRedemption$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualCodeRedemptionActions.exportManualCodeRedemption),
      withLatestFrom(this.store.select(selectManualCodeRedemptionFilters)),
      switchMap(([{ expected_zone_id }, filters]) => {
        return this.manualCodeRedemptionService
          .exportManualCodeRedemption(
            filters?.search_text || '',
            expected_zone_id || Intl.DateTimeFormat().resolvedOptions().timeZone
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
                            return ManualCodeRedemptionActions.exportManualCodeRedemptionSuccess(
                              {
                                file_name: fileInfo.file_name,
                                url: fileInfoResponse.presigned_url,
                              }
                            );
                          }

                          if (
                            fileInfoResponse.upload_status ===
                            ProcessStatusCode.FAILED
                          ) {
                            return ManualCodeRedemptionActions.exportManualCodeRedemptionFailure(
                              {
                                messageData: {
                                  title: "Couldn't generate your file",
                                  message: `<b>${fileInfo.file_name}</b><br/>. Please try again.`,
                                  type: ToastMessageType.ERROR,
                                },
                              }
                            );
                          }

                          return ManualCodeRedemptionActions.exportManualCodeRedemptionPending();
                        }),
                        catchError(() => {
                          return of(
                            ManualCodeRedemptionActions.exportManualCodeRedemptionFailure(
                              {
                                messageData: {
                                  title: "Couldn't generate your file",
                                  message: `<b>${fileInfo.file_name}</b><br/>. Please try again.`,
                                  type: ToastMessageType.ERROR,
                                },
                              }
                            )
                          );
                        })
                      );
                  }),
                  takeUntil(
                    this.actions$.pipe(
                      ofType(
                        ManualCodeRedemptionActions.exportManualCodeRedemptionSuccess,
                        ManualCodeRedemptionActions.exportManualCodeRedemptionFailure
                      )
                    )
                  )
                );
              }

              return of(
                ManualCodeRedemptionActions.exportManualCodeRedemptionFailure({
                  messageData: {
                    title: "Couldn't generate your file",
                    message: `<b>${fileInfo.file_name}</b><br/>. Please try again.`,
                    type: ToastMessageType.ERROR,
                  },
                })
              );
            }),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Manual Code Redemption',
                message: `Failed to export manual code redemption (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                ManualCodeRedemptionActions.exportManualCodeRedemptionFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  exportManualCodeRedemptionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualCodeRedemptionActions.exportManualCodeRedemptionSuccess),
      map(({ file_name, url }) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = file_name || 'manual-code-redemption-report.xlsx';
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
