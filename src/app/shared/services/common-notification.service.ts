import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SegmentSummaryUser } from '../models/segment-summary-user.model';
import { TargetGroup } from '../models/target-group.model';
import { TargetGroupUserCount } from '../models/target-group-user-count.model';
import { TimePeriodType } from '../utils/enums/time-period-type.enum';
import { PagedData } from '../models/paged-data.model';

@Injectable({
  providedIn: 'root',
})
export class CommonNotificationService {
  readonly baseUrl = `${environment.apiBaseUrl}/notification`;
  private readonly http: HttpClient = inject(HttpClient);

  getSegmentSummaryUsers(): Observable<SegmentSummaryUser[]> {
    return this.http.get<SegmentSummaryUser[]>(
      `${this.baseUrl}/segments/summary-users`
    );
  }

  getTargetGroups(): Observable<TargetGroup[]> {
    return this.http.get<TargetGroup[]>(`${this.baseUrl}/target-groups/list`);

    // dummy data
    /* return of(targetGroups).pipe(delay(1000)); */
  }

  getTargetGroupUserCount(
    sendTimeType: TimePeriodType,
    page: number
  ): Observable<PagedData<TargetGroupUserCount>> {
    return this.http.get<PagedData<TargetGroupUserCount>>(
      `${this.baseUrl}/notifications/get-target-group-user-count`,
      {
        params: {
          sendTimeType,
          page,
        },
      }
    );
  }
}
