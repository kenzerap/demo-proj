import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { customerPoint, pointHistories } from '../constants/dummy-data.const';
import { CustomerPoint } from '../models/customer-point.model';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { PointHistory } from '../models/point-history.model';
import {
  AddDeletePointQueryParams,
  PointHistoriesQueryParams,
} from '../models/point-histories-query-params.model';
import { PointExpiriesQueryParams } from '../models/point-expires-query-params.model';
import { PointExpire } from '../models/point-expire-history.model';
import { CustomerPointResource } from 'src/app/shared/utils/enums/customer-point-resource';
import { FileExportInfo } from '@app/shared/models/file-export-info.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerPointService {
  readonly baseUrl = `${environment.apiBaseUrl}/point`;
  private readonly http: HttpClient = inject(HttpClient);

  getCustomerPoint(
    partyId: string,
    resources: CustomerPointResource[]
  ): Observable<CustomerPoint> {
    return this.http.get<CustomerPoint>(
      `${this.baseUrl}/points/${partyId}/total-point-detail`,
      { params: { resources } }
    );

    // dummy data
    /* return of(customerPoint).pipe(delay(1000)); */
  }

  getPointHistories(
    partyId: string,
    params: Partial<PointHistoriesQueryParams>
  ): Observable<PagedData<PointHistory>> {
    return this.http.get<PagedData<PointHistory>>(
      `${this.baseUrl}/points/${partyId}/history`,
      { params }
    );

    // dummy data
    /* return of({
      data: pointHistories,
      pagination: { page: 0, totalPages: 10, totalItems: 100, size: 10 },
    }).pipe(delay(1000)); */
  }

  getPointExpiries(
    partyId: string,
    params: Partial<PointExpiriesQueryParams>
  ): Observable<PagedData<PointExpire>> {
    return this.http.post<PagedData<PointExpire>>(
      `${this.baseUrl}/points/${partyId}/expiring-list`,
      params
    );

    // dummy data
    /* return of({
      data: pointHistories,
      pagination: { page: 0, totalPages: 10, totalItems: 100, size: 10 },
    }).pipe(delay(1000)); */
  }

  addPoint(
    partyId: string,
    params: Partial<AddDeletePointQueryParams>
  ): Observable<PointHistory> {
    return this.http.post<PointHistory>(
      `${this.baseUrl}/points/${partyId}/add`,
      params
    );

    // dummy data
    /* return of({
      data: pointHistories,
      pagination: { page: 0, totalPages: 10, totalItems: 100, size: 10 },
    }).pipe(delay(1000)); */
  }

  deletePoint(
    partyId: string,
    params: Partial<AddDeletePointQueryParams>
  ): Observable<PointHistory> {
    return this.http.post<PointHistory>(
      `${this.baseUrl}/points/${partyId}/delete`,
      params
    );

    // dummy data
    /* return of({
      data: pointHistories,
      pagination: { page: 0, totalPages: 10, totalItems: 100, size: 10 },
    }).pipe(delay(1000)); */
  }

  exportPointToExcel(
    partyId: string,
    exportType: string,
    expected_zone_id: string
  ): Observable<{ request_id: string; file_upload_infos: FileExportInfo[] }> {
    /* return of({
        request_id: '920c7d42-0fa6-475e-a65a-f4bec856fd65',
        file_upload_infos: [
          {
            file_upload_id: 265,
            file_name: 'unicode_code_20250623_0908.xlsx',
            s3_key: null,
            upload_status: 'VERIFIED',
            file_upload_type: 'UNICODE_CODE_EXPORT',
            presigned_url: null,
          },
        ],
      } as any).pipe(delay(1000)); */

    const type = exportType === 'history' ? 'point-history' : 'point-expiry';

    return this.http.post<{
      request_id: string;
      file_upload_infos: FileExportInfo[];
    }>(`${this.baseUrl}/exports/${partyId}/${type}`, {
      expected_zone_id,
    });
  }
}
