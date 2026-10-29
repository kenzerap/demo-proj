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
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { environment } from '@env/environment';
import { PrivilegeUsageReportQueryParams } from '../models/privilege-usage-report-query-params.model';
import { PrivilegeUsageReport } from '../models/privilege-usage-report.model';

@Injectable({
  providedIn: 'root',
})
export class PrivilegeUsageReportService {
  readonly baseUrl = `${environment.apiBaseUrl}/report`;
  private readonly http: HttpClient = inject(HttpClient);

  getPrivilegeUsageReport(
    params: Partial<PrivilegeUsageReportQueryParams>
  ): Observable<PagedData<PrivilegeUsageReport>> {
    return this.http.post<PagedData<PrivilegeUsageReport>>(
      `${this.baseUrl}/privileges/usage`,
      params
    );
  }

  exportToExcel(params: Partial<PrivilegeUsageReportQueryParams>) {
    return this.http
      .post<any>(`${this.baseUrl}/export/privileges/usage`, params)
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
