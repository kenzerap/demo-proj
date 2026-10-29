import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as CreateEditUnicodeActions from './create-edit-unicode.actions';

import {
  catchError,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { CommonTierSegmentService } from '@app/shared/services/common-tier-segment.service';
import { UnicodeSettingService } from '../../services/unicode-setting.service';
import { CreateEditUnicodeQueryParams } from '../../models/create-edit-unicode-query-params.model';
import { CommonContentService } from '@app/shared/services/common-content.service';
import { PrivilegeService } from '@app/shared/services/privilege.service';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ProcessStatusCode } from '@app/shared/utils/enums/process-status-code.enum';

@Injectable()
export class CreateEditUnicodeEffects {
  private actions$ = inject(Actions);
  private unicodeSettingService = inject(UnicodeSettingService);
  private authService = inject(AuthService);
  private commonContentService = inject(CommonContentService);
  private privilegeService = inject(PrivilegeService);

  createUnicode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditUnicodeActions.createUnicode),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ queryParams }, currentUser]) => {
        const params: Partial<CreateEditUnicodeQueryParams> = {
          ...queryParams,
          action_done_by: currentUser?.username,
        };

        return this.unicodeSettingService.createUnicode(params).pipe(
          map(() => CreateEditUnicodeActions.createUnicodeSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Unicode',
              message: `Failed to create unicode (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditUnicodeActions.createUnicodeFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  getUnicodeDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditUnicodeActions.getUnicodeDetail),
      switchMap(({ unicodeId }) => {
        return this.unicodeSettingService.getUnicodeDetail(unicodeId).pipe(
          map((unicode) =>
            CreateEditUnicodeActions.getUnicodeDetailSuccess({
              unicode,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditUnicodeActions.getUnicodeDetailFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  updateUnicode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditUnicodeActions.updateUnicode),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data }, currentUser]) => {
        const dataBody: Partial<CreateEditUnicodeQueryParams> = {
          ...data,
          action_done_by: currentUser?.username,
        };

        return this.unicodeSettingService.updateUnicode(dataBody).pipe(
          map(() => CreateEditUnicodeActions.updateUnicodeSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Unicode',
              message: `Failed to update unicode (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditUnicodeActions.updateUnicodeFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  getPolicyChannels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditUnicodeActions.getPolicyChannels),
      switchMap(() => {
        return this.commonContentService.getPolicyChannels().pipe(
          map((rows) =>
            CreateEditUnicodeActions.getPolicyChannelsSuccess({
              data: rows || [],
            })
          ),
          catchError((error) => {
            return of(
              CreateEditUnicodeActions.getPolicyChannelsFailure({ error })
            );
          })
        );
      })
    )
  );

  getPrivileges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditUnicodeActions.getPrivileges),
      switchMap(() => {
        return this.privilegeService.getPrivileges().pipe(
          map((data) =>
            CreateEditUnicodeActions.getPrivilegesSuccess({ data })
          ),
          catchError((error) => {
            return of(CreateEditUnicodeActions.getPrivilegesFailure({ error }));
          })
        );
      })
    )
  );

  showExportPreparingToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditUnicodeActions.exportUnicode),
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

  exportUnicode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditUnicodeActions.exportUnicode),
      switchMap(({ unicode_id, expected_zone_id }) => {
        return this.unicodeSettingService
          .exportUnicode(unicode_id, expected_zone_id || Intl.DateTimeFormat().resolvedOptions().timeZone)
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
                            return CreateEditUnicodeActions.exportUnicodeSuccess(
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
                            return CreateEditUnicodeActions.exportUnicodeFailure(
                              {
                                messageData: {
                                  title: "Couldn't generate your file",
                                  message: `<b>${fileInfo.file_name}</b><br/>. Please try again.`,
                                  type: ToastMessageType.ERROR,
                                },
                              }
                            );
                          }

                          return CreateEditUnicodeActions.exportUnicodePending();
                        }),
                        catchError(() => {
                          return of(
                            CreateEditUnicodeActions.exportUnicodeFailure({
                              messageData: {
                                title: "Couldn't generate your file",
                                message: `<b>${fileInfo.file_name}</b><br/>. Please try again.`,
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
                        CreateEditUnicodeActions.exportUnicodeSuccess,
                        CreateEditUnicodeActions.exportUnicodeFailure
                      )
                    )
                  )
                );
              }

              return of(
                CreateEditUnicodeActions.exportUnicodeFailure({
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
                title: 'Unicode',
                message: `Failed to export unicode (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditUnicodeActions.exportUnicodeFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  exportUnicodeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditUnicodeActions.exportUnicodeSuccess),
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
      })
    )
  );
}
