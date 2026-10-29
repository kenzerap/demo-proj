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
import * as PontTransactionReportListActions from './point-transaction-report-list.actions';
import { selectPointTransactionFilters } from '../../../popup-announcement-setting/point-transaction-report-list.selector';
import { PointTransactionReportService } from '../../services/point-transaction-report.services';

@Injectable()
export class PointTransactionReportsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private pointTransactionReportService = inject(PointTransactionReportService);

  getPointTransactionReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PontTransactionReportListActions.getPointTransactionReports),
      switchMap(({ params }) => {
        return this.pointTransactionReportService
          .getPointTransactionReport(params)
          .pipe(
            map((pagedData) =>
              PontTransactionReportListActions.getPointTransactionReportsSuccess(
                {
                  pagedData,
                }
              )
            ),
            catchError((error) => {
              return of(
                PontTransactionReportListActions.getPointTransactionReportsFailure(
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

  setPointTransactionFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PontTransactionReportListActions.setPointTransactionReportsFilters
      ),
      withLatestFrom(this.store.select(selectPointTransactionFilters)),
      switchMap(([_, filters]) => {
        return of(
          PontTransactionReportListActions.getPointTransactionReports({
            params: filters,
          })
        );
      })
    )
  );

  showExportPreparingToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PontTransactionReportListActions.exportPointTransactionReports),
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
        PontTransactionReportListActions.exportPointTransactionReportsSuccess
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
    return `point_transaction_report_${yyyy}${MM}${dd}_${HH}${mm}.xlsx`;
  }

  showExportFailToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PontTransactionReportListActions.exportPointTransactionReportsFailure
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

  exportPointTransactionReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PontTransactionReportListActions.exportPointTransactionReports),
      withLatestFrom(this.store.select(selectPointTransactionFilters)),
      switchMap(([_, filters]) =>
        this.pointTransactionReportService.exportToExcel(filters).pipe(
          tap((result) => {
            if (result?.fileUrl) {
              const a = document.createElement('a');
              a.href = result.fileUrl;
              a.download = result.fileName || 'point-transaction-report.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(result.fileUrl);
            }
          }),
          map((result) =>
            PontTransactionReportListActions.exportPointTransactionReportsSuccess(
              {
                fileName: result?.fileName,
              }
            )
          ),
          catchError(({ error, fileName }) =>
            of(
              PontTransactionReportListActions.exportPointTransactionReportsFailure(
                { error, fileName: this.getDefaultExportFileName() }
              )
            )
          )
        )
      )
    )
  );
}
