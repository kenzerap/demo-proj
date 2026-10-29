import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { FundType } from '../models/fund-type.model';
import { CreateEditFundTypeQueryParams } from '../models/create-edit-fund-type-query-params.model';
import { FundTypeOptions } from '../models/fund-type-options.model';

@Injectable({
  providedIn: 'root',
})
export class FundTypeService {
  readonly baseUrl = `${environment.apiBaseUrl}/content`;
  private readonly http: HttpClient = inject(HttpClient);

  getFundTypes(
    params: Partial<CommonListQueryParams>
  ): Observable<PagedData<FundType>> {
    return this.http.get<PagedData<FundType>>(
      `${this.baseUrl}/common/get-fund-type-list`,
      { params }
    );
  }

  createFundType(
    data: Partial<CreateEditFundTypeQueryParams>
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/common/fund-type`,
      data
    );
  }

  updateFundType(
    data: Partial<CreateEditFundTypeQueryParams>
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/common/fund-type/${data.fund_id}`,
      data
    );
  }

  getFundTypeDetail(id: number): Observable<FundType> {
    return this.http.get<FundType>(`${this.baseUrl}/common/fund-type/${id}`);
  }

  getFundTypeOptions(): Observable<FundTypeOptions> {
    return this.http.get<FundTypeOptions>(
      `${this.baseUrl}/common/fund-type/options`
    );
  }
}
