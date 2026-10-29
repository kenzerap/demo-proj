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
import { UserAccountReportService } from '../../services/user-account-report.services';
import * as UserAccountReportListActions from './user-account-report-list.actions';
import { selectUserAccountFilters } from './user-account-report-list.selector';

@Injectable()
export class UserAccountReportEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private userAccountReportService = inject(UserAccountReportService);

  getUserAccountReportTotals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAccountReportListActions.getUserAccountReportTotals),
      switchMap(({ params }) =>
        this.userAccountReportService.getTotals(params).pipe(
          map((totals) =>
            UserAccountReportListActions.getUserAccountReportTotalsSuccess({
              totals,
            })
          ),
          catchError((error) =>
            of(
              UserAccountReportListActions.getUserAccountReportTotalsFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  getUserAccountReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAccountReportListActions.getUserAccountReports),
      switchMap(({ params }) =>
        this.userAccountReportService.getUserAccountReportLists(params).pipe(
          map((pagedData) =>
            UserAccountReportListActions.getUserAccountReportsSuccess({
              pagedData,
            })
          ),
          catchError((error) =>
            of(
              UserAccountReportListActions.getUserAccountReportsFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  setUserAccountFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAccountReportListActions.setUserAccountReportsFilters),
      withLatestFrom(this.store.select(selectUserAccountFilters)),
      switchMap(([action, filters]) => {
        const keys = Object.keys(action.filters);
        const onlyPageOrSize = keys.every((k) => k === 'page' || k === 'size');
        if (keys.length > 0 && onlyPageOrSize) {
          return [
            UserAccountReportListActions.getUserAccountReports({
              params: filters,
            }),
          ];
        }
        return [
          UserAccountReportListActions.getUserAccountReports({
            params: filters,
          }),
          UserAccountReportListActions.getUserAccountReportTotals({
            params: filters,
          }),
        ];
      })
    )
  );

  showExportPreparingToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAccountReportListActions.exportUserAccountReports),
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
      ofType(UserAccountReportListActions.exportUserAccountReportsSuccess),
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
    return `user_account_report_${yyyy}${MM}${dd}_${HH}${mm}.xlsx`;
  }

  showExportFailToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAccountReportListActions.exportUserAccountReportsFailure),
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

  exportUserAccountReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAccountReportListActions.exportUserAccountReports),
      withLatestFrom(this.store.select(selectUserAccountFilters)),
      switchMap(([_, filters]) =>
        this.userAccountReportService.exportToExcel(filters).pipe(
          tap((result) => {
            if (result?.fileUrl) {
              const a = document.createElement('a');
              a.href = result.fileUrl;
              a.download = result.fileName || this.getDefaultExportFileName();
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(result.fileUrl);
            }
          }),
          map((result) =>
            UserAccountReportListActions.exportUserAccountReportsSuccess({
              fileName: result?.fileName,
            })
          ),
          catchError((error) =>
            of(
              UserAccountReportListActions.exportUserAccountReportsFailure({
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
