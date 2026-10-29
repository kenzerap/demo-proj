import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { CreateEditCustomerSegmentationQueryParams } from '../models/create-edit-customer-segmentation-query-params.model';
import { ProductType } from '../models/product-type.model';
import { CustomerSegmentationsQueryParams } from '../models/customer-segmentations-query-params.model';
import {
  CustomerSegmentationDetail,
  PagedCustomerSegmentations,
} from '../models/customer-segmentation.model';
import { ReorderCustomerSegmentationsQueryParams } from '../models/reorder-customer-segmentations-query-params.model';
import { StatusCode } from '@app/shared/utils/enums/status-code.enum';
import { ProductGroupType } from '../../../shared/models/product-group-type.model';
import { ValidateUploadPartyIdResponse } from '../models/validate-upload-party-id-response.model';
import {
  uploadSegmentPartyIdResponse,
  validateUploadPartyIdResponse,
} from '@app/shared/constants/dummy-data.const';
import { UploadPartyIdResponse } from '../models/upload-party-id-response.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerSegmentationService {
  readonly baseUrl = `${environment.apiBaseUrl}/content`;
  private readonly http: HttpClient = inject(HttpClient);

  getProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(
      `${this.baseUrl}/common/get-product-type-list`,
    );
  }

  getProductGroupTypes(): Observable<ProductGroupType[]> {
    return this.http.get<ProductGroupType[]>(
      `${this.baseUrl}/common/product-group-type/search`,
    );
  }

  createCustomerSegmentation(
    data: Partial<CreateEditCustomerSegmentationQueryParams>,
  ): Observable<void> {
    return this.http.post<void>(
      `${environment.apiBaseUrl}/tier-segment/segments`,
      data,
    );
  }

  getCustomerSegmentations(
    params: Partial<CustomerSegmentationsQueryParams>,
  ): Observable<PagedCustomerSegmentations> {
    return this.http
      .get<PagedCustomerSegmentations>(
        `${environment.apiBaseUrl}/tier-segment/segments/search`,
        { params },
      )
      .pipe(
        map((pagedData) => {
          return {
            ...pagedData,
            data: pagedData.data.map((item) => {
              return {
                ...item,
                is_published: item.status === StatusCode.ACTIVE,
                display_order: item.priority,
              };
            }),
            lastDisplayOrder: pagedData.lastPriority,
          };
        }),
      );
  }

  reOrderCustomerSegmentations(
    params: ReorderCustomerSegmentationsQueryParams,
  ): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiBaseUrl}/tier-segment/segments`,
      params,
    );
  }
  getCustomerSegmentationDetail(
    id: number,
  ): Observable<CustomerSegmentationDetail> {
    return this.http.get<CustomerSegmentationDetail>(
      `${environment.apiBaseUrl}/tier-segment/segments/${id}`,
    );
  }

  validateSegmentUploadPartyId(
    file: File,
  ): Observable<ValidateUploadPartyIdResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ValidateUploadPartyIdResponse>(
      `${environment.apiBaseUrl}/tier-segment/segments/party-id-files/validate`,
      formData,
    );

    // dummy data
    // return of(validateUploadPartyIdResponse).pipe(delay(1000));
  }

  uploadSegmentPartyId(
    uploaded_by: string,
    file: File | null,
  ): Observable<UploadPartyIdResponse> {
    const formData = new FormData();
    formData.append('file', file || '');
    formData.append('uploaded_by', uploaded_by);
    return this.http.post<UploadPartyIdResponse>(
      `${environment.apiBaseUrl}/tier-segment/segments/party-id-files`,
      formData,
    );

    // dummy data
    // return of(uploadSegmentPartyIdResponse).pipe(delay(1000));
  }

  deleteUploadCode(fileId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiBaseUrl}/tier-segment/segments/party-id-files/${fileId}`,
    );

    // dummy data
    // return of(true).pipe(delay(1000));
  }
}
