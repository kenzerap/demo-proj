import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { PagedData } from '@app/shared/models/paged-data.model';
import { Inventory } from '../../../shared/models/inventory-model';
import { environment } from '@env/environment';
import { InventoriesQueryParams } from '../../../shared/models/inventories-query-params.model';
import { CreateEditInventoryQueryParams } from '../models/create-edit-inventory-query-params.model';
import { UploadCodeInventoryParams } from '../models/upload-code-inventory-params.model';
import { InventorySummary } from '../models/inventory-summary.model';
import { BrandCommon } from '../models/brand-common.model';
import { UploadCode } from '../models/upload-code.model';
import { ValidateUploadCodeResponse } from '../models/validate-upload-code-response.model';
import { CreateInventoryResponse } from '../models/create-inventory-response.model';
import {
  brands,
  createInventorySuccess,
  getInventoryUploadCodeSummarySuccess,
  uploadCodeInventorySuccess,
  validateInvalid,
  validateValid,
} from '../constants/dummy-data.const';
import { DeleteUploadCodeResponse } from '../models/delete-upload-code-response.model';
import { InventoryDetail } from '../models/inventory-detail.model';
import { CreateEditProductStockQueryParams } from '../models/create-edit-product-stock-query-params.model';
import { UpdateDeleteProductStockResponse } from '../models/update-delete-product-stock-response.model';
import { FileExportInfo } from '@app/shared/models/file-export-info.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  readonly baseUrl = `${environment.apiBaseUrl}/privilege`;
  private readonly http: HttpClient = inject(HttpClient);

  createInventory(
    data: Partial<CreateEditInventoryQueryParams>
  ): Observable<CreateInventoryResponse> {
    return this.http.post<CreateInventoryResponse>(
      `${this.baseUrl}/inventories/save`,
      data
    );

    /* return of(createInventorySuccess).pipe(delay(1000)); */
  }

  updateInventory(
    data: Partial<CreateEditInventoryQueryParams>
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/inventories/update/${data.inventory_id}`,
      data
    );
  }

  validateInventoryUploadCode(
    brand_id: number,
    file: File
  ): Observable<ValidateUploadCodeResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ValidateUploadCodeResponse>(
      `${this.baseUrl}/inventories/upload-code/validate/${brand_id}`,
      formData
    );

    /* return of(validateValid).pipe(delay(1000)); */
  }

  uploadCodeInventory(
    inventory_id: number,
    data: Partial<UploadCodeInventoryParams>,
    file: File | null
  ): Observable<UploadCode[]> {
    const formData = new FormData();
    formData.append('file', file || '');
    formData.append('input', JSON.stringify(data));
    return this.http.post<UploadCode[]>(
      `${this.baseUrl}/inventories/${inventory_id}/upload-code`,
      formData
    );

    /* return of(uploadCodeInventorySuccess).pipe(delay(1000)); */
  }

  getInventoryUploadCodeSummary(
    inventory_id: number
  ): Observable<InventorySummary> {
    return this.http.get<InventorySummary>(
      `${this.baseUrl}/inventories/${inventory_id}/upload-code/summary`
    );

    /* return of(getInventoryUploadCodeSummarySuccess).pipe(delay(1000)); */
  }

  getBrandsDropdown(): Observable<BrandCommon[]> {
    return this.http.get<BrandCommon[]>(
      `${this.baseUrl}/brands/brands-dropdown`
    );

    /* return of(brands).pipe(delay(1000)); */
  }

  deleteUploadCode(
    inventory_id: number,
    upload_code_id: number
  ): Observable<DeleteUploadCodeResponse> {
    return this.http.delete<DeleteUploadCodeResponse>(
      `${this.baseUrl}/inventories/${inventory_id}/upload-code/delete/${upload_code_id}`
    );
  }

  getInventoryDetail(inventory_id: number): Observable<InventoryDetail> {
    return this.http.get<InventoryDetail>(
      `${this.baseUrl}/inventories/${inventory_id}`
    );
  }

  createProductStock(
    inventory_id: number,
    data: Partial<CreateEditProductStockQueryParams>
  ): Observable<UpdateDeleteProductStockResponse> {
    return this.http.post<UpdateDeleteProductStockResponse>(
      `${this.baseUrl}/inventories/${inventory_id}/product-stock`,
      data
    );
  }

  deleteProductStock(
    inventory_id: number,
    product_stock_id: number
  ): Observable<UpdateDeleteProductStockResponse> {
    return this.http.delete<UpdateDeleteProductStockResponse>(
      `${this.baseUrl}/inventories/${inventory_id}/product-stock/${product_stock_id}`
    );
  }

  exportUploadCodeInventory(
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
    }>(`${this.baseUrl}/inventories/upload-code/export`, {
      expected_zone_id,
    });
  }
}
