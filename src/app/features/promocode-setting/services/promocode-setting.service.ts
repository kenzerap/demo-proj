import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { CreateEditPromocodesQueryParams } from '../models/create-edit-promocode-query-params.model';
import { CreateEditPromocodesResponse } from '../models/create-edit-promocode-response.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { PromoCode, PromocodeDetail } from '../models/promocode-model';

@Injectable({
  providedIn: 'root',
})
export class PromocodeSettingService {
  readonly baseUrl = `${environment.apiBaseUrl}/privilege`;
  private readonly http: HttpClient = inject(HttpClient);

  getPromoCodes(
    params: Partial<CommonListQueryParams>
  ): Observable<PagedData<PromoCode>> {
    return this.http.post<PagedData<PromoCode>>(
      `${this.baseUrl}/promocode/search`,
      params
    );
  }

  getPromocodeDetail(promocodeId: number): Observable<PromocodeDetail> {
    /* return of({
      promocode_id: 833,
      name: 'hoangtest 11/6',
      start_date_time: '2025-06-11T15:11:00Z',
      end_date_time: '2025-06-19T15:12:00Z',
      is_share_quota_allocation: false,
      is_point: true,
      is_privilege: false,
      description: 'hoangtest 11/6 trtryy',
      earning_point: [
        {
          tier_id: null,
          expire_date: '2025-06-11T17:00:00Z',
          point: 1,
        },
      ],
      is_special_condition_fraud_user: false,
      fraud_condition_point: 0,
      is_advance_limit: false,
      redeem_limit: [
        {
          redeem_limit_id: null,
          redeem_quota: 1,
          tier_id: null,
          redeem_condition: 'ON_WEEKLY_REDEEM',
        },
      ],
      status: 'ACTIVE',
      codes: [
        {
          code: 'uywqgyeuqy',
          channel: ['Other Channels'],
          status: null,
          quota: 100,
          redeemed_quota: 20,
        },
        {
          code: 'fddgertert',
          channel: ['Bancassurance'],
          status: null,
          quota: 2,
          redeemed_quota: 0,
        },
        {
          code: 'qiywqeqweq',
          channel: ['Broker VAT'],
          status: null,
          quota: 3,
          redeemed_quota: 0,
        },
      ],
      created_by: 'nhan.vophamthanh@positivethinking.tech',
    } as any).pipe(delay(1000)); */
    /* return of({
      promocode_id: 859,
      name: 'hoangtest12/6',
      start_date_time: '2025-06-12T11:50:00Z',
      end_date_time: '2025-06-20T11:51:00Z',
      is_share_quota_allocation: true,
      is_point: true,
      is_privilege: false,
      description: 'hoangtest12/6 seee',
      earning_point: [
        {
          tier_id: null,
          expire_date: '2025-06-17T17:00:00Z',
          point: 11,
        },
      ],
      is_special_condition_fraud_user: false,
      fraud_condition_point: 0,
      is_advance_limit: false,
      redeem_limit: [
        {
          redeem_limit_id: null,
          redeem_quota: 2,
          tier_id: null,
          redeem_condition: 'ON_WEEKLY_REDEEM',
        },
      ],
      status: 'ACTIVE',
      codes: [
        {
          code: 'qwqwrwewrw',
          channel: [''],
          status: null,
          quota: 50,
          redeemed_quota: 20,
        },
      ],
      created_by: 'nhan.vophamthanh@positivethinking.tech',
    } as any).pipe(delay(1000)); */
    return this.http.get<PromocodeDetail>(
      `${this.baseUrl}/promocode/${promocodeId}`
    );
  }

  createPromocode(
    data: Partial<CreateEditPromocodesQueryParams>
  ): Observable<any> {
    return this.http.post<CreateEditPromocodesResponse>(
      `${this.baseUrl}/promocode/save`,
      data
    );
  }

  updatePromocode(
    data: Partial<CreateEditPromocodesQueryParams>
  ): Observable<CreateEditPromocodesResponse> {
    return this.http.put<CreateEditPromocodesResponse>(
      `${this.baseUrl}/promocode/${data.id}`,
      data
    );
  }
}
