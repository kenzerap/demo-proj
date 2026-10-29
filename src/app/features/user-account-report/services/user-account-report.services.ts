import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  timer,
  throwError,
  of,
  switchMap,
  map,
  catchError,
  Observable,
  takeWhile,
} from 'rxjs';
import { environment } from '@env/environment';
import { UserAccountReportQueryParams } from '../models/user-account-report-query-params.model';
import {
  UserAccountReportLists,
  UserAccountReportTotals,
} from '../models/user-account-report-report.model';
import { PagedData } from '@app/shared/models/paged-data.model';

@Injectable({
  providedIn: 'root',
})
export class UserAccountReportService {
  readonly baseUrl = `${environment.apiBaseUrl}/report`;
  private readonly http: HttpClient = inject(HttpClient);

  getTotals(
    params: Partial<UserAccountReportQueryParams>
  ): Observable<UserAccountReportTotals> {
    return this.http.post<UserAccountReportTotals>(
      `${this.baseUrl}/user/account-summary`,
      params
    );
  }

  getUserAccountReportLists(
    params: Partial<UserAccountReportQueryParams>
  ): Observable<PagedData<UserAccountReportLists>> {
    return this.http.post<PagedData<UserAccountReportLists>>(
      `${this.baseUrl}/user/account-details`,
      params
    );
  }

  exportToExcel(params: Partial<UserAccountReportQueryParams>) {
    return this.http
      .post<any>(`${this.baseUrl}/export/user/account`, params)
      .pipe(
        switchMap((res) => {
          const fileInfo = res.file_upload_infos?.[0];
          const fileName = fileInfo?.file_name;
          if (fileInfo?.upload_status === 'FAILED') {
            return throwError(() => ({ message: 'Export failed', fileName }));
          }
          if (
            fileInfo?.upload_status === 'VERIFIED' &&
            fileInfo.file_upload_id
          ) {
            return timer(0, 4000).pipe(
              switchMap(() =>
                this.http.get<any>(
                  `${environment.apiBaseUrl}/content/documents/file-info/${fileInfo.file_upload_id}`
                )
              ),
              map((infoRes) => {
                if (
                  infoRes.upload_status === 'COMPLETED' &&
                  infoRes.presigned_url
                ) {
                  return {
                    fileName,
                    fileUrl: infoRes.presigned_url,
                  };
                }
                if (infoRes.upload_status === 'FAILED') {
                  throw new Error('Export failed');
                }
                return null;
              }),
              takeWhile((result) => !result || !result.fileUrl, true),
              switchMap((result) => (result ? of(result) : []))
            );
          }
          return throwError(() => ({
            message: 'Export failed or invalid response',
            fileName,
          }));
        }),
        catchError((err) => throwError(() => err))
      );
  }
}
