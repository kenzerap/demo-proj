import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { ExcludePointPolicy } from '../models/exclude-point-policy.model';
import { excludePointPolicies } from '@app/shared/constants/dummy-data.const';

@Injectable({
  providedIn: 'root',
})
export class ExcludePointByPolicyNoService {
  readonly baseUrl = `${environment.apiBaseUrl}/point`;
  private readonly http: HttpClient = inject(HttpClient);

  getExcludePointPolicies(
    params: Partial<CommonListQueryParams>,
  ): Observable<PagedData<ExcludePointPolicy>> {
    // dummy data
    // return of(excludePointPolicies).pipe(delay(1000));

    return this.http.get<PagedData<ExcludePointPolicy>>(
      `${this.baseUrl}/excluded-policies`,
      { params },
    );
  }

  addPolicyToExcludePoint(body: {
    policy_no: string;
    action_by?: string;
  }): Observable<ExcludePointPolicy> {
    return this.http.post<ExcludePointPolicy>(
      `${this.baseUrl}/excluded-policies`,
      body,
    );
  }

  deleteExcludePointPolicy(excludePointPolicyId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/excluded-policies/${excludePointPolicyId}`,
    );
  }
}
