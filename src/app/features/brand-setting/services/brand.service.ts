import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { PagedData } from '@app/shared/models/paged-data.model';
import { Brand, BrandDetail } from '../../../shared/models/brand-model';
import { environment } from '@env/environment';
import { BrandsQueryParams } from '../../../shared/models/brands-query-params.model';
import { CreateEditBrandQueryParams } from '../models/create-edit-brand-query-params.model';
import { BrandCategory } from '../models/brand-category.model';
import { CreateEditBrandCategoryQueryParams } from '../models/create-edit-brand-category-query-params.model';
import { brandCategories } from '../constants/dummy-data.const';
import { BrandUpdateStatusRequest } from '../models/brand-update-status-request.model';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  readonly baseUrl = `${environment.apiBaseUrl}/privilege`;
  private readonly http: HttpClient = inject(HttpClient);

  getBrands(params: Partial<BrandsQueryParams>): Observable<PagedData<Brand>> {
    return this.http.post<PagedData<Brand>>(
      `${this.baseUrl}/brands/get-list`,
      params
    );
  }

  updateStatusBrand(
    brandId: number,
    dataBody: BrandUpdateStatusRequest
  ): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/brands/${brandId}`, dataBody);
  }

  createBrand(
    data: Partial<CreateEditBrandQueryParams>,
    file: File
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('input', JSON.stringify(data));

    return this.http.post<void>(`${this.baseUrl}/brands`, formData);

    // dummy data
    // return of(notifications).pipe(delay(1000));
  }

  editBrand(
    brandId: number,
    data: Partial<CreateEditBrandQueryParams>,
    file: File
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('input', JSON.stringify(data));

    return this.http.put<void>(`${this.baseUrl}/brands/${brandId}`, formData);

    // dummy data
    // return of(notifications).pipe(delay(1000));
  }

  getBrandDetail(id: number): Observable<BrandDetail> {
    return this.http.get<BrandDetail>(`${this.baseUrl}/brands/${id}`);

    // dummy data
    // return of(brandDetail).pipe(delay(1000));
  }

  getBrandDisplayOrders(): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.baseUrl}/brands/get-display-order-list`
    );
  }

  getBrandCategories(): Observable<BrandCategory[]> {
    return this.http.get<BrandCategory[]>(
      `${this.baseUrl}/brand-category/get-list`
    );

    // dummy data
    /* return of(brandCategories).pipe(delay(2000)); */
  }

  createBrandCategory(
    data: Partial<CreateEditBrandCategoryQueryParams>
  ): Observable<any> {
    return this.http.post<void>(`${this.baseUrl}/brand-category`, data);
    /* return of(null).pipe(delay(2000)); */
  }

  editBrandCategory(
    brandCategoryId: number,
    data: Partial<CreateEditBrandCategoryQueryParams>
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/brand-category/${brandCategoryId}`,
      data
    );
  }

  deleteBrandCategory(
    brandCategoryId: number,
    actionDoneBy: string
  ): Observable<Brand[]> {
    return this.http.delete<Brand[]>(
      `${this.baseUrl}/brand-category/${brandCategoryId}`,
      { params: { actionDoneBy } }
    );
  }
}
