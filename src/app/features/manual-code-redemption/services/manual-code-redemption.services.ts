import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  ManualCodeRedemptionQueryParams,
  UpdateStatusQueryParams,
} from '../models/manual-code-redemption-query-params.model';
import { ManualCodeRedemption } from '../models/manual-code-redemption.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { FileExportInfo } from '@app/shared/models/file-export-info.model';

@Injectable({
  providedIn: 'root',
})
export class ManualCodeRedemptionService {
  readonly baseUrl = `${environment.apiBaseUrl}/privilege`;
  private readonly http: HttpClient = inject(HttpClient);

  getManualCodeRedemption(
    params: Partial<ManualCodeRedemptionQueryParams>
  ): Observable<PagedData<ManualCodeRedemption>> {
    return this.http.get<PagedData<ManualCodeRedemption>>(
      `${this.baseUrl}/manual-code-redemption/promo-uni-code-quota-details-list`,
      { params }
    );
  }

  updateManualCodeRedemptionStatus(
    params: UpdateStatusQueryParams
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/manual-code-redemption/${params.id}`,
      params
    );
  }

  exportManualCodeRedemption(
    keyword: string,
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
    }>(`${this.baseUrl}/manual-code-redemption/export`, {
      keyword,
      expected_zone_id,
    });
  }
}
