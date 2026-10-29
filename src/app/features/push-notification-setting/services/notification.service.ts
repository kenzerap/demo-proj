import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { NotificationQueryParams } from '../models/notifications-query-params.model';
import { Notification, NotificationDetail } from '../models/notification.model';
import {
  notificationDetail,
  notifications,
  segmentSummaryUsers,
} from '../constants/dummy-data.const';
import { CreateEditNotificationsQueryParams } from '../models/create-edit-notifications-query-params.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly baseUrl = `${environment.apiBaseUrl}/notification`;
  private readonly http: HttpClient = inject(HttpClient);

  getNotifications(
    params: Partial<NotificationQueryParams>
  ): Observable<PagedData<Notification>> {
    return this.http.post<PagedData<Notification>>(
      `${this.baseUrl}/notifications/search`,
      {
        is_sent: params.isSent,
        send_time_type: params.sendTimeType,
        target_group_ids: params.target_group_ids,
        page: params.page,
        size: params.size,
      }
    );

    // dummy data
    // return of(notifications).pipe(delay(1000));
  }

  createNotifications(
    params: Partial<CreateEditNotificationsQueryParams>
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/notifications/create`, params);

    // dummy data
    // return of(true).pipe(delay(1000));
  }

  getNotificationDetail(
    notificationId: string
  ): Observable<NotificationDetail> {
    return this.http.get<NotificationDetail>(
      `${this.baseUrl}/notifications/${notificationId}`
    );

    // dummy data
    // return of(notificationDetail).pipe(delay(1000));
  }

  updateNotification(
    notificationId: string,
    dataBody: Partial<CreateEditNotificationsQueryParams>
  ): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/notifications/${notificationId}`,
      dataBody
    );
  }
}
