import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { PointBulk } from '../models/point-bulk.model';
import { ValidateUploadPointResponse } from '../models/validate-upload-point-response.model';
import { UploadPointBulkParams } from '../models/upload-point-bulk-params.model';

@Injectable({
  providedIn: 'root',
})
export class PointBulkService {
  readonly baseUrl = `${environment.apiBaseUrl}/point`;
  private readonly http: HttpClient = inject(HttpClient);

  getPointBulks(
    params: Partial<CommonListQueryParams>
  ): Observable<PagedData<PointBulk>> {
    return this.http.get<PagedData<PointBulk>>(
      `${this.baseUrl}/points/upload/search`,
      { params }
    );
  }

  validatePointBulkUploadPoint(
    file: File
  ): Observable<ValidateUploadPointResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ValidateUploadPointResponse>(
      `${this.baseUrl}/points/upload/validate`,
      formData
    );
  }

  uploadPointBulk(
    data: Partial<UploadPointBulkParams>,
    file: File
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('input', JSON.stringify(data));
    return this.http.post<void>(`${this.baseUrl}/points/upload`, formData);
  }

  downloadFileTemplate(): Observable<{ file_name: string; data: string }> {
    return this.http.get<{ file_name: string; data: string }>(
      `${this.baseUrl}/points/template/download`
    );
  }
}
