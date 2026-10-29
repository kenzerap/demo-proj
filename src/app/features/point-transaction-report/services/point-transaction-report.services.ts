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
import { PointTransactionReportQueryParams } from '../models/point-transaction-report-query-params.model';
import { PointTransactionReport } from '../models/point-transaction-report.model';

@Injectable({
  providedIn: 'root',
})
export class PointTransactionReportService {
  readonly baseUrl = `${environment.apiBaseUrl}/report`;
  private readonly http: HttpClient = inject(HttpClient);

  getPointTransactionReport(
    params: Partial<PointTransactionReportQueryParams>
  ): Observable<PagedData<PointTransactionReport>> {
    return this.http.post<PagedData<PointTransactionReport>>(
      `${this.baseUrl}/points/transaction`,
      params
    );
  }

  exportToExcel(params: Partial<PointTransactionReportQueryParams>) {
    return this.http
      .post<any>(`${this.baseUrl}/export/points/transaction`, params)
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
