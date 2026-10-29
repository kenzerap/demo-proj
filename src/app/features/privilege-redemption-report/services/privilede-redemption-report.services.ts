import { HttpClient, HttpResponse } from '@angular/common/http';
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
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { environment } from '@env/environment';
import { PrivilegeRedemptionReport } from '../models/privilede-redemption-report.model';
import { PrivilegeRedemptionReportQueryParams } from '../models/privilede-redemption-report-query-params.model';

@Injectable({
  providedIn: 'root',
})
export class PriviledeRedemptionReportService {
  readonly baseUrl = `${environment.apiBaseUrl}/report`;
  private readonly http: HttpClient = inject(HttpClient);

  getPriviledeRedemptionReport(
    params: Partial<PrivilegeRedemptionReportQueryParams>
  ): Observable<PagedData<PrivilegeRedemptionReport>> {
    return this.http.post<PagedData<PrivilegeRedemptionReport>>(
      `${this.baseUrl}/privileges/redemption`,
      params
    );
  }

  exportToExcel(params: Partial<PrivilegeRedemptionReportQueryParams>) {
    return this.http
      .post<any>(`${this.baseUrl}/export/privileges/redemption`, params)
      .pipe(
        switchMap((res) => {
          const fileInfo = res.file_upload_infos?.[0];
          if (fileInfo?.upload_status === 'FAILED') {
            return throwError(() => new Error('Export failed'));
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
                    fileName: infoRes.file_name,
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
          return throwError(
            () => new Error('Export failed or invalid response')
          );
        }),
        catchError((err) => throwError(() => err))
      );
  }
}
