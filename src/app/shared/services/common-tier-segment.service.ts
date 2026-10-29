import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { TierGroup } from '../models/tier-group.model';
import { SegmentGroup } from '../models/segment-group.model';
import { segmentGroups, tierGroups } from '../constants/dummy-data.const';
import {
  TargetGroupsUserSummary,
  TargetGroupsUserSummaryQueryParams,
} from '../models/target-groups-user-summary.model';

@Injectable({
  providedIn: 'root',
})
export class CommonTierSegmentService {
  readonly baseUrl = `${environment.apiBaseUrl}/tier-segment`;
  private readonly http: HttpClient = inject(HttpClient);

  getTierGroupList(
    page: number,
    size: number
  ): Observable<PagedData<TierGroup>> {
    return this.http.post<PagedData<TierGroup>>(
      `${this.baseUrl}/tier-group/tier/get-list`,
      { page, size }
    );

    // dummy data
    /* return of(tierGroups).pipe(delay(1000)); */
  }

  getSegmentGroupList(
    page: number,
    size: number
  ): Observable<PagedData<SegmentGroup>> {
    return this.http.post<PagedData<SegmentGroup>>(
      `${this.baseUrl}/segments/get-list`,
      { page, size }
    );

    // dummy data
    /* return of(segmentGroups).pipe(delay(1000)); */
  }

  getTargetGroupsUserSummary(
    params: Partial<TargetGroupsUserSummaryQueryParams>
  ): Observable<TargetGroupsUserSummary> {
    return this.http.post<TargetGroupsUserSummary>(
      `${this.baseUrl}/target-groups/user-summary`,
      params
    );

    // dummy data
    // return of(segmentGroups).pipe(delay(1000));
  }
}
