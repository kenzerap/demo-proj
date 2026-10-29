import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { PriviledeRedemptionReportService } from '../../services/privilede-redemption-report.services';
import * as PrivilegeRedemptionReportListActions from './privilege-redemption-report-list.actions';
import { selectPrivilegeRedemptionReportFilters } from './privilege-redemption-report-list.selector';

@Injectable()
export class PrivilegeRedemptionReportsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private privilegeRedemptionReportService = inject(
    PriviledeRedemptionReportService
  );

  getprivilegeRedemptionReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegeRedemptionReportListActions.getPrivilegeRedemptionReport),
      switchMap(({ params }) => {
        return this.privilegeRedemptionReportService
          .getPriviledeRedemptionReport(params)
          .pipe(
            map((pagedData) =>
              PrivilegeRedemptionReportListActions.getPrivilegeRedemptionReportSuccess(
                {
                  pagedData,
                }
              )
            ),
            catchError((error) => {
              return of(
                PrivilegeRedemptionReportListActions.getPrivilegeRedemptionReportFailure(
                  {
                    error,
                  }
                )
              );
            })
          );
      })
    )
  );

  setPrivilegeReportFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PrivilegeRedemptionReportListActions.setPrivilegeRedemptionReportFilters
      ),
      withLatestFrom(this.store.select(selectPrivilegeRedemptionReportFilters)),
      switchMap(([_, filters]) => {
        return of(
          PrivilegeRedemptionReportListActions.getPrivilegeRedemptionReport({
            params: filters,
          })
        );
      })
    )
  );

  showExportPreparingToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PrivilegeRedemptionReportListActions.exportPrivilegeRedemptionReport
      ),
      map(() =>
        pushMessage({
          messageData: {
            title: 'Exporting',
            message: 'Preparing your file for download',
            type: ToastMessageType.WARNING,
          },
        })
      )
    )
  );

  showExportSuccessToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PrivilegeRedemptionReportListActions.exportPrivilegeRedemptionReportSuccess
      ),
      map(({ fileName }) =>
        pushMessage({
          messageData: {
            title: 'Done',
            message: `Your report <b>${fileName}</b> was downloaded successfully.`,
            type: ToastMessageType.SUCCESS,
          },
        })
      )
    )
  );

  getDefaultExportFileName(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const MM = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const HH = pad(now.getHours());
    const mm = pad(now.getMinutes());
    return `privilege_redemption_report_${yyyy}${MM}${dd}_${HH}${mm}.xlsx`;
  }

  showExportFailToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PrivilegeRedemptionReportListActions.exportPrivilegeRedemptionReportFailure
      ),
      map(({ fileName }) =>
        pushMessage({
          messageData: {
            title: "Couldn't generate your report",
            message: `<b>${fileName}</b><br/>. Please try again.`,
            type: ToastMessageType.ERROR,
          },
        })
      )
    )
  );

  exportPrivilegeRedemptionReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PrivilegeRedemptionReportListActions.exportPrivilegeRedemptionReport
      ),
      withLatestFrom(this.store.select(selectPrivilegeRedemptionReportFilters)),
      switchMap(([_, filters]) =>
        this.privilegeRedemptionReportService.exportToExcel(filters).pipe(
          tap((result) => {
            if (result?.fileUrl) {
              const a = document.createElement('a');
              a.href = result.fileUrl;
              a.download =
                result.fileName || 'privilege-redemption-report.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(result.fileUrl);
            }
          }),
          map((result) =>
            PrivilegeRedemptionReportListActions.exportPrivilegeRedemptionReportSuccess(
              {
                fileName: result?.fileName,
              }
            )
          ),
          catchError(({ error, fileName }) =>
            of(
              PrivilegeRedemptionReportListActions.exportPrivilegeRedemptionReportFailure(
                { error, fileName: this.getDefaultExportFileName() }
              )
            )
          )
        )
      )
    )
  );
}
