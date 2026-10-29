import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { environment } from '@env/environment';
import { HomeScreenManagementQueryParams } from '../models/home-screen-management-query-params.model';
import {
  HomeScreenManagementDetail,
  PagedHomeScreen,
} from '../models/home-screen-management.model';
import { CreateEditHomeScreenQueryParams } from '../models/create-edit-home-screen-query-params.model';

@Injectable({
  providedIn: 'root',
})
export class HomeScreenManagementService {
  readonly baseUrl = `${environment.apiBaseUrl}/content`;
  private readonly http: HttpClient = inject(HttpClient);

  getHomeScreenManagement(
    params: Partial<HomeScreenManagementQueryParams>
  ): Observable<PagedHomeScreen> {
    return this.http.post<PagedHomeScreen>(
      `${this.baseUrl}/home-screen/search`,
      params
    );
  }

  getHomeScreenManagementDetail(
    homeScreenManagementId: number
  ): Observable<HomeScreenManagementDetail> {
    return this.http.get<HomeScreenManagementDetail>(
      `${this.baseUrl}/home-screen/${homeScreenManagementId}`
    );
  }

  createHomeScreen(
    data: Partial<CreateEditHomeScreenQueryParams>,
    files: File[]
  ): Observable<void> {
    const formData = new FormData();

    formData.append('input', JSON.stringify(data));
    files.forEach((file, index) => {
      formData.append(`${index + 1}`, file);
    });

    return this.http.post<void>(`${this.baseUrl}/home-screen/create`, formData);
  }

  updateHomeScreenManagement(
    data: Partial<CreateEditHomeScreenQueryParams>,
    files: File[]
  ): Observable<void> {
    const formData = new FormData();

    formData.append('input', JSON.stringify(data));
    files.forEach((file, index) => {
      formData.append(`${index + 1}`, file);
    });

    return this.http.put<void>(`${this.baseUrl}/home-screen/update`, formData);
  }

  reOrderHomeScreenManagements(params: {
    on_items: number[];
    off_items: number[];
    updated_by: string;
  }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/home-screen/reorder-list`, params);
  }
}
