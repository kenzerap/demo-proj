import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { PagedData } from '@app/shared/models/paged-data.model';
import { SplashScreenManagementQueryParams } from '../models/splash-screen-management-query-params.model';
import {
  SplashScreenDetail,
  SplashScreenManagement,
} from '../models/splash-screen-management.model';
import { CreateEditSplashScreenQueryParams } from '../models/create-edit-splash-screen-query-params.model';

@Injectable({
  providedIn: 'root',
})
export class SplashScreenManagementService {
  readonly baseUrl = `${environment.apiBaseUrl}/content`;
  private readonly http: HttpClient = inject(HttpClient);

  getSplashScreenManagements(
    params: Partial<SplashScreenManagementQueryParams>
  ): Observable<PagedData<SplashScreenManagement>> {
    return this.http.post<PagedData<SplashScreenManagement>>(
      `${this.baseUrl}/splash-screen/search`,
      params
    );
  }

  createSplashScreen(
    data: Partial<CreateEditSplashScreenQueryParams>,
    file: File
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('input', JSON.stringify(data));

    return this.http.post<void>(`${this.baseUrl}/splash-screen`, formData);
  }

  editSplashScreen(
    id: number,
    data: Partial<CreateEditSplashScreenQueryParams>,
    file: File
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('input', JSON.stringify(data));

    return this.http.put<void>(
      `${this.baseUrl}/splash-screen/${id}`,
      formData
    );
  }

  getSplashScreenDetail(id: number): Observable<SplashScreenDetail> {
    return this.http.get<SplashScreenDetail>(
      `${this.baseUrl}/splash-screen/${id}`
    );
  }

  getSplashScreenDisplayOrders(): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.baseUrl}/splash-screen/display-order/used`
    );
  }
}
