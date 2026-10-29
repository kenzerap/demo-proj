import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TargetGroupUserCount } from '../models/target-group-user-count.model';
import { PolicyChannel } from '../models/policy-channel.model';
import { ProductName } from '../models/product-name.model';
import { FileExportInfo } from '../models/file-export-info.model';
import { PagedData } from '../models/paged-data.model';
import { ProductGroupType } from '../models/product-group-type.model';

@Injectable({
  providedIn: 'root',
})
export class CommonContentService {
  readonly baseUrl = `${environment.apiBaseUrl}/content`;
  private readonly http: HttpClient = inject(HttpClient);

  getTargetGroupUserCount(
    pageId: number,
    bannerType: string,
    page: number
  ): Observable<PagedData<TargetGroupUserCount>> {
    return this.http.get<PagedData<TargetGroupUserCount>>(
      `${this.baseUrl}/common/get-target-group-user-count`,
      {
        params: {
          pageId,
          bannerType,
          page,
        },
      }
    );
  }

  getPolicyChannels(): Observable<PolicyChannel[]> {
    /* return of([
      {
        system_id: '1',
        name: 'Agent',
      },
      {
        system_id: '1',
        name: 'Bancassurance',
      },
      {
        system_id: '1',
        name: 'TLM',
      },
      {
        system_id: '1',
        name: 'Other Channels',
      },
      {
        system_id: '1',
        name: 'Broker VAT',
      },
    ] as any[]).pipe(delay(1000)); */
    return this.http
      .get<PolicyChannel[]>(`${this.baseUrl}/common/get-policy-channel-list`)
      .pipe(
        // filter unique policy channels by name due to BE returning duplicates
        /* map((data) => {
          return Array.from(
            new Map(data.map((item) => [item.name, item])).values()
          );
        }) */
      );
  }

  getProductNameList(): Observable<ProductName[]> {
    return this.http.get<ProductName[]>(
      `${this.baseUrl}/common/get-product-name-list`
    );
  }

  getProductGroupTypes(): Observable<ProductGroupType[]> {
      return this.http.get<ProductGroupType[]>(
        `${this.baseUrl}/common/product-group-type/search`
      );
    }

  getFileInfo(fileUploadId: number): Observable<FileExportInfo> {
    // return of({
    //   file_upload_id: 60,
    //   file_name: 'privilege_usage_report_20250609_1740.xlsx',
    //   s3_key: 'export/privilege_usage_report_20250609_1740.xlsx',
    //   upload_status: 'COMPLETED',
    //   file_upload_type: 'RIVILEGE_REDEMPTION_REPORT',
    //   presigned_url:
    //     'http://demoproj-content-dev.localhost:4566/export/privilege_usage_report_20250609_1740.xlsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250609T134447Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Credential=test%2F20250609%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1acdf78f0f3f214eb40899dc0db43bb84f8b0395f84b753af2338253020c3b95',
    // } as any).pipe(delay(1000));
    // return of({
    //   file_upload_id: 60,
    //   file_name: 'privilege_usage_report_20250609_1740.xlsx',
    //   s3_key: 'export/privilege_usage_report_20250609_1740.xlsx',
    //   upload_status: ProcessStatusCode.PENDING,
    //   file_upload_type: 'RIVILEGE_REDEMPTION_REPORT',
    //   presigned_url: '',
    // }).pipe(delay(1000));

    return this.http.get<FileExportInfo>(
      `${this.baseUrl}/documents/file-info/${fileUploadId}`
    );
  }
}
