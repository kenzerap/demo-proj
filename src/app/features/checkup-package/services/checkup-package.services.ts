import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { CheckupPackageQueryParams } from '../models/checkup-package-query-params.model';
import {
  CheckupPackage,
  PagedCheckupPackage,
} from '../models/checkup-package.model';
import { CreateEditCheckupPackageQueryParams } from '../models/create-edit-checkup-package-query-params.model';
import { ReorderCheckupPackageQueryParams } from '../models/reorder-checkup-package-query-params.model';

@Injectable({
  providedIn: 'root',
})
export class CheckupPackageService {
  readonly baseUrl = `${environment.apiBaseUrl}/privilege`;
  private readonly http: HttpClient = inject(HttpClient);

  getCheckupPackages(
    params: Partial<CheckupPackageQueryParams>
  ): Observable<PagedCheckupPackage> {
    return this.http.get<PagedCheckupPackage>(
      `${this.baseUrl}/healthcare-packages/search`,
      { params }
    );
  }

  getCheckupPackageDetail(id: number): Observable<CheckupPackage> {
    return this.http.get<CheckupPackage>(
      `${this.baseUrl}/healthcare-packages/${id}`
    );
  }

  createCheckupPackage(
    data: Partial<CreateEditCheckupPackageQueryParams>
  ): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/healthcare-packages`, data);
  }

  updateCheckupPackage(
    data: Partial<CreateEditCheckupPackageQueryParams>
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/healthcare-packages/${data.id}`,
      data
    );
  }

  reOrderCheckupPackages(
    params: ReorderCheckupPackageQueryParams
  ): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/healthcare-packages`, params);
  }
}
