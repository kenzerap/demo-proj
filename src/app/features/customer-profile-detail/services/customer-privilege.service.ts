import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { redeemHistories } from '../constants/dummy-data.const';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { RedeemHistoriesQueryParams } from '../models/redeem-histories-query-params.model';
import { RedeemHistory } from '../models/redeem-history.model';
import { FileExportInfo } from '@app/shared/models/file-export-info.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerPrivilegeService {
  readonly baseUrl = `${environment.apiBaseUrl}/privilege`;
  private readonly http: HttpClient = inject(HttpClient);

  getRedeemHistories(
    partyId: string,
    params: Partial<RedeemHistoriesQueryParams>
  ): Observable<PagedData<RedeemHistory>> {
    return this.http.post<PagedData<RedeemHistory>>(
      `${this.baseUrl}/redeem/${partyId}/get-history-list`,
      params
    );

    // dummy data
    // return of(redeemHistories).pipe(delay(1000));
  }

  exportRedeemToExcel(
    partyId: string,
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

    return this.http.post<{
      request_id: string;
      file_upload_infos: FileExportInfo[];
    }>(`${this.baseUrl}/redeem/${partyId}/export`, { expected_zone_id });
  }
}
