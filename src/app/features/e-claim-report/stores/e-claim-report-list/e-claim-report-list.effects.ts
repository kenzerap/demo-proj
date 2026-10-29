import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import * as EclaimListActions from './e-claim-report-list.actions';
import { selectClaimFilters } from './e-claim-report-list.selector';
import { EclaimReportService } from '../../services/e-claim-report.services';

@Injectable()
export class EclaimReportEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private eclaimReportService = inject(EclaimReportService);

  getEclaimReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EclaimListActions.getEclaimReports),
      switchMap(({ params }) => {
        return this.eclaimReportService.getEclaimReport(params).pipe(
          map((pagedData) => {
            return EclaimListActions.getEclaimReportsSuccess({
              pagedData,
            });
          }),
          catchError((error) => {
            return of(
              EclaimListActions.getEclaimReportsFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  setPrivilegeUsageFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EclaimListActions.setEclaimReportsFilters),
      withLatestFrom(this.store.select(selectClaimFilters)),
      switchMap(([_, filters]) => {
        return of(
          EclaimListActions.getEclaimReports({
            params: filters,
          })
        );
      })
    )
  );

  showExportPreparingToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EclaimListActions.exportEclaimReports),
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
      ofType(EclaimListActions.exportEclaimReportsSuccess),
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
    return `eclaim_report_${yyyy}${MM}${dd}_${HH}${mm}.xlsx`;
  }

  showExportFailToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EclaimListActions.exportEclaimReportsFailure),
      map((error) =>
        pushMessage({
          messageData: {
            title: "Couldn't generate your report",
            message: `<b>${error.fileName}</b><br/>. Please try again.`,
            type: ToastMessageType.ERROR,
          },
        })
      )
    )
  );

  exportEclaimReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EclaimListActions.exportEclaimReports),
      withLatestFrom(this.store.select(selectClaimFilters)),
      switchMap(([_, filters]) =>
        this.eclaimReportService.exportToExcel(filters).pipe(
          tap((result) => {
            if (result?.fileUrl) {
              const a = document.createElement('a');
              a.href = result.fileUrl;
              a.download = result.fileName || 'eclaim-report.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(result.fileUrl);
            }
          }),
          map((result) =>
            EclaimListActions.exportEclaimReportsSuccess({
              fileName: result?.fileName,
            })
          ),
          catchError((error) =>
            of(
              EclaimListActions.exportEclaimReportsFailure({
                error,
                fileName: this.getDefaultExportFileName(),
              })
            )
          )
        )
      )
    )
  );
}
