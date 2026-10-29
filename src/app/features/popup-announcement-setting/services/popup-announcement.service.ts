import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { PagedData } from '@app/shared/models/paged-data.model';
import {
  PagedPopupAnnouncements,
  PopupAnnouncement,
  PopupAnnouncementDetail,
} from '../models/popup-announcement-model';
import { environment } from '@env/environment';
import { PopupAnnouncementsQueryParams } from '../models/popup-announcements-query-params.model';
import { PopupAnnouncementTab } from '../models/popup-announcement-tabs.model';
import { PopupAnnouncementTargetGroup } from '../models/popup-announcement-target-group.model';
import { PreviewImageDataList } from '../models/preview-image.model';
import { CreateEditPopupAnnouncementQueryParams } from '../models/create-edit-popup-announcement-query-params.model';
import {
  popupAnnouncementDetail,
  popupAnnouncements,
} from '../constants/dummy-data.const';

@Injectable({
  providedIn: 'root',
})
export class PopupAnnouncementService {
  readonly baseUrl = `${environment.apiBaseUrl}/content`;
  private readonly http: HttpClient = inject(HttpClient);

  getPopupAnnouncements(
    params: Partial<PopupAnnouncementsQueryParams>
  ): Observable<PagedPopupAnnouncements> {
    return this.http.post<PagedPopupAnnouncements>(
      `${this.baseUrl}/popup-banner/search`,
      params
    );

    // dummy data
    /* const pagedItems = popupAnnouncements.slice(
      (params.page || 0) * (params.size || 10),
      (params.page || 0) * (params.size || 10) + (params.size || 10)
    );

    const data: PagedPopupAnnouncements = {
      data: pagedItems,
      bannerId: 2,
      lastDisplayOrder: 2,
      pagination: {
        page: params.page || 0,
        size: params.size || 10,
        totalItems: 30,
        totalPages: 6,
      },
    };
    return of(data).pipe(delay(1000)); */
  }

  getPopupAnnouncementTabs(): Observable<PopupAnnouncementTab[]> {
    return this.http.get<PopupAnnouncementTab[]>(`${this.baseUrl}/page/search`);

    // dummy data
    // return of([{ page_id: 1, page_name: 'Home' }, { page_id: 2, page_name: 'Test' }]).pipe(delay(1000));
  }

  getPopupAnnouncementTargetGroups(
    pageId: number
  ): Observable<PopupAnnouncementTargetGroup[]> {
    return this.http.get<PopupAnnouncementTargetGroup[]>(
      `${this.baseUrl}/popup-banner/get-target-group-count`,
      { params: { pageId: pageId.toString() } }
    );
    // dummy data
    /* return of([
      { targetGroupId: 1, targetGroupName: 'test group', count: 10 },
    ]).pipe(delay(1000)); */
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

  createPopupAnnouncement(
    data: Partial<CreateEditPopupAnnouncementQueryParams>,
    file: File
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('input', JSON.stringify(data));

    return this.http.post<void>(
      `${this.baseUrl}/popup-banner/create`,
      formData
    );

    // dummy data
    // return of(notifications).pipe(delay(1000));
  }

  editPopupAnnouncement(
    data: Partial<CreateEditPopupAnnouncementQueryParams>,
    file: File
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('input', JSON.stringify(data));

    return this.http.put<void>(`${this.baseUrl}/popup-banner/update`, formData);

    // dummy data
    // return of(notifications).pipe(delay(1000));
  }

  getPopupAnnouncementDetail(id: number): Observable<PopupAnnouncementDetail> {
    return this.http.get<PopupAnnouncementDetail>(
      `${this.baseUrl}/popup-banner/${id}`
    );

    // dummy data
    // return of(popupAnnouncementDetail).pipe(delay(1000));
  }

  reOrderPopupAnnouncements(params: {
    onItems: number[];
    offItems: number[];
    updatedBy: string;
    pageId: number;
  }): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/popup-banner/reorder-list`,
      params
    );
  }
}
