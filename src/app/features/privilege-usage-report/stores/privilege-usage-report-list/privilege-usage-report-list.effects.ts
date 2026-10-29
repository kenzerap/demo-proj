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
import { PrivilegeUsageReportService } from '../../services/privilege-usage-report.services';
import * as PrivilegeListActions from './privilege-usage-report-list.actions';
import { selectPrivilegeUsageFilters } from './privilege-usage-report-list.selector';

@Injectable()
export class PrivilegeUsageReportEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private privilegeUsageReportService = inject(PrivilegeUsageReportService);

  getPrivilegeUsageReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegeListActions.getPrivilegeUsageReports),
      switchMap(({ params }) => {
        return this.privilegeUsageReportService
          .getPrivilegeUsageReport(params)
          .pipe(
            map((pagedData) => {
              const dataWithId = pagedData.data.map((item, idx) => ({
                ...item,
                id: `${item.privilege_name}-${idx + 1}`,
              }));
              return PrivilegeListActions.getPrivilegeUsageReportsSuccess({
                pagedData: {
                  ...pagedData,
                  data: dataWithId,
                },
              });
            }),
            catchError((error) => {
              return of(
                PrivilegeListActions.getPrivilegeUsageReportsFailure({
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
      ofType(PrivilegeListActions.setPrivilegeUsageReportsFilters),
      withLatestFrom(this.store.select(selectPrivilegeUsageFilters)),
      switchMap(([_, filters]) => {
        return of(
          PrivilegeListActions.getPrivilegeUsageReports({
            params: filters,
          })
        );
      })
    )
  );

  showExportPreparingToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegeListActions.exportPrivilegeUsageReports),
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
      ofType(PrivilegeListActions.exportPrivilegeUsageReportsSuccess),
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
    return `privilege_usage_report_${yyyy}${MM}${dd}_${HH}${mm}.xlsx`;
  }

  showExportFailToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegeListActions.exportPrivilegeUsageReportsFailure),
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

  exportPrivilegeUsageReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegeListActions.exportPrivilegeUsageReports),
      withLatestFrom(this.store.select(selectPrivilegeUsageFilters)),
      switchMap(([_, filters]) =>
        this.privilegeUsageReportService.exportToExcel(filters).pipe(
          tap((result) => {
            if (result?.fileUrl) {
              const a = document.createElement('a');
              a.href = result.fileUrl;
              a.download = result.fileName || 'privilege-usage-report.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(result.fileUrl);
            }
          }),
          map((result) =>
            PrivilegeListActions.exportPrivilegeUsageReportsSuccess({
              fileName: result?.fileName,
            })
          ),
          catchError((error) =>
            of(
              PrivilegeListActions.exportPrivilegeUsageReportsFailure({
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
