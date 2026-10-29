import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedData } from '@app/shared/models/paged-data.model';
import {
  PagedBannerSettings,
  BannerSetting,
  BannerSettingDetail,
} from '../models/banner-setting-model';
import { environment } from '@env/environment';
import { BannerSettingsQueryParams } from '../models/banner-settings-query-params.model';
import { BannerSettingTab } from '../models/banner-setting-tabs.model';
import { BannerSettingTargetGroup } from '../models/banner-setting-target-group.model';
import { PreviewImageDataList } from '../models/preview-image.model';
import { CreateEditBannerSettingQueryParams } from '../models/create-edit-banner-setting-query-params.model';

@Injectable({
  providedIn: 'root',
})
export class BannerSettingService {
  readonly baseUrl = `${environment.apiBaseUrl}/content`;
  private readonly http: HttpClient = inject(HttpClient);

  getBannerSettings(
    params: Partial<BannerSettingsQueryParams>
  ): Observable<PagedBannerSettings> {
    return this.http.post<PagedBannerSettings>(
      `${this.baseUrl}/banner/search`,
      params
    );

    // dummy data
    // return of(notifications).pipe(delay(1000));
  }

  getBannerSettingTabs(): Observable<BannerSettingTab[]> {
    return this.http.get<BannerSettingTab[]>(`${this.baseUrl}/page/search`);

    // dummy data
    // return of(notifications).pipe(delay(1000));
  }

  getPublishedImages(params: {
    pageId: number;
    targetGroupIds?: number[];
    bannerType: string;
  }): Observable<PreviewImageDataList> {
    return this.http.post<PreviewImageDataList>(
      `${this.baseUrl}/common/get-published-images-list`,
      params
    );

    // dummy data
    // return of(notifications).pipe(delay(1000));
  }

  createBannerSetting(
    data: Partial<CreateEditBannerSettingQueryParams>,
    file: File
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('input', JSON.stringify(data));

    return this.http.post<void>(`${this.baseUrl}/banner/create`, formData);

    // dummy data
    // return of(notifications).pipe(delay(1000));
  }

  editBannerSetting(
    data: Partial<CreateEditBannerSettingQueryParams>,
    file: File
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('input', JSON.stringify(data));

    return this.http.put<void>(`${this.baseUrl}/banner/edit`, formData);

    // dummy data
    // return of(notifications).pipe(delay(1000));
  }

  getBannerSettingDetail(id: number): Observable<BannerSettingDetail> {
    return this.http.get<BannerSettingDetail>(`${this.baseUrl}/banner/${id}`);

    // dummy data
    /* return of(bannerSettingDetail).pipe(delay(1000)); */
  }

  reOrderBannerSettings(params: {
    on_items: number[];
    off_items: number[];
    updated_by: string;
    page_id: number;
  }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/banner/reorder-list`, params);
  }
}
