import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { CreateEditPointRulesQueryParams } from '../models/create-edit-point-rule-query-params.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { PointRule, PointRuleDetail } from '../models/point-rule-model';
import { PointRuleListQueryParams } from '../models/point-rule-list-query-params.model';

@Injectable({
  providedIn: 'root',
})
export class PointRuleSettingService {
  readonly baseUrl = `${environment.apiBaseUrl}/point`;
  private readonly http: HttpClient = inject(HttpClient);

  getPointRules(
    params: Partial<PointRuleListQueryParams>
  ): Observable<PagedData<PointRule>> {
    return this.http.get<PagedData<PointRule>>(
      `${this.baseUrl}/points/rules/search`,
      { params }
    );
  }

  getPointRuleDetail(pointRuleId: number): Observable<PointRuleDetail> {
    return this.http.get<PointRuleDetail>(
      `${this.baseUrl}/points/rules/${pointRuleId}`
    );
  }

  createPointRule(
    data: Partial<CreateEditPointRulesQueryParams>
  ): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/points/rules`, data);
  }

  updatePointRule(
    data: Partial<CreateEditPointRulesQueryParams>
  ): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/points/rules/${data.id}`, data);
  }
}
