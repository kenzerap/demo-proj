import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { DisabledClaimPolicy } from '../models/disabled-claim-policy.model';
import { disabledClaimPolicies } from '@app/shared/constants/dummy-data.const';

@Injectable({
  providedIn: 'root',
})
export class DisabledClaimByPolicyNoService {
  readonly baseUrl = `${environment.apiBaseUrl}/customer-management`;
  private readonly http: HttpClient = inject(HttpClient);

  getDisabledClaimPolicies(
    params: Partial<CommonListQueryParams>,
  ): Observable<PagedData<DisabledClaimPolicy>> {
    // dummy data
    // return of(disabledClaimPolicies).pipe(delay(1000));

    return this.http.get<PagedData<DisabledClaimPolicy>>(
      `${this.baseUrl}/disabled-claim-policy`,
      { params },
    );
  }

  addPolicyToDisabledClaim(body: {
    policy_no: string;
    action_by?: string;
  }): Observable<DisabledClaimPolicy> {
    return this.http.post<DisabledClaimPolicy>(
      `${this.baseUrl}/disabled-claim-policy`,
      body,
    );
  }

  deleteDisabledClaimPolicy(disabledClaimPolicyId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/disabled-claim-policy/${disabledClaimPolicyId}`,
    );
  }
}
