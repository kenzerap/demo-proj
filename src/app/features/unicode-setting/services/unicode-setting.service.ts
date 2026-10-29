import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { CreateEditUnicodeQueryParams } from '../models/create-edit-unicode-query-params.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { Unicode, UnicodeDetail } from '../models/unicode-model';
import { FileExportInfo } from '@app/shared/models/file-export-info.model';

@Injectable({
  providedIn: 'root',
})
export class UnicodeSettingService {
  readonly baseUrl = `${environment.apiBaseUrl}/privilege`;
  private readonly http: HttpClient = inject(HttpClient);

  getUnicodes(
    params: Partial<CommonListQueryParams>
  ): Observable<PagedData<Unicode>> {
    return this.http.post<PagedData<Unicode>>(
      `${this.baseUrl}/unicode/search`,
      params
    );
  }

  getUnicodeDetail(unicodeId: number): Observable<UnicodeDetail> {
    return this.http.get<UnicodeDetail>(`${this.baseUrl}/unicode/${unicodeId}`);
  }

  createUnicode(data: Partial<CreateEditUnicodeQueryParams>): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/unicode`, data);
  }

  updateUnicode(data: Partial<CreateEditUnicodeQueryParams>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/unicode/${data.id}`, data);
  }

  exportUnicode(
    unicode_id: number,
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
    }>(`${this.baseUrl}/unicode/${unicode_id}/export-code`, {
      expected_zone_id,
    });
  }
}
