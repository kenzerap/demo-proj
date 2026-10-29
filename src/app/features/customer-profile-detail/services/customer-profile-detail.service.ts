import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer.model';
import {
  claimHistories,
  customerDetail,
  customerDetailEditResponse,
  customerPolicy,
  eClaimImageUrls,
  eClaimSubmits,
  policyDetail,
} from '../constants/dummy-data.const';
import { CustomerPolicy } from '../models/customer-policy.model';
import { PolicyDetail } from '../models/policy.model';
import { ClaimHistoriesQueryParams } from '../models/claim-histories-query-params.model';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { Claim } from '../models/claim.model';
import { EClaimSubmitQueryParams } from '../models/e-claim-submit-query-params.model';
import { EClaim } from '../models/e-claim.model';
import { EClaimImageUrls } from '../models/e-claim-image-urls.model';
import { CustomerDetailEditResponse } from '../models/customer-detail-edit-response.model';
import { OtpHistoriesQueryParams } from '../models/otp-histories-query-params.model';
import { OtpHistory } from '../models/otp-history.model';
import { CustomerClient } from '../models/customer-client.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerProfileDetailService {
  readonly baseUrl = `${environment.apiBaseUrl}/customer-management`;
  private readonly http: HttpClient = inject(HttpClient);

  getCustomerProfileDetail(partyId: string): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.baseUrl}/customers/${partyId}/profile`
    );

    // dummy data
    /* return of(customerDetail).pipe(delay(1000)); */
  }

  getCustomerPolicy(partyId: string): Observable<CustomerPolicy> {
    return this.http.get<CustomerPolicy>(
      `${this.baseUrl}/customers/${partyId}/policies/search`
    );

    // dummy data
    /* return of(customerPolicy).pipe(delay(1000)); */
  }

  markCustomerFraudOrBlock(
    partyId: string,
    params: { is_fraud?: boolean; is_blocked?: boolean; updated_by?: string }
  ): Observable<any> {
    return this.http.put<void>(
      `${this.baseUrl}/customers/${partyId}/status`,
      params
    );

    // dummy data
    /* return of(true).pipe(delay(1000)); */
  }

  getPolicyDetail(partyId: string, policyId: number): Observable<PolicyDetail> {
    return this.http.get<PolicyDetail>(
      `${this.baseUrl}/customers/${partyId}/policies/${policyId}`
    );

    // dummy data
    /* return of(policyDetail).pipe(delay(1000)); */
  }

  getClaimHistories(
    partyId: string,
    params: Partial<ClaimHistoriesQueryParams>
  ): Observable<PagedData<Claim>> {
    return this.http.post<PagedData<Claim>>(
      `${this.baseUrl}/customers/${partyId}/claims/search`,
      params
    );

    // dummy data
    /* return of(claimHistories).pipe(delay(1000)); */
  }

  getEClaimSubmits(
    partyId: string,
    policyId: number,
    params: Partial<EClaimSubmitQueryParams>
  ): Observable<PagedData<EClaim>> {
    return this.http.get<PagedData<EClaim>>(
      `${this.baseUrl}/customers/${partyId}/e-claims/search`,
      { params: { ...params, policyId } }
    );

    // dummy data
    /* return of(eClaimSubmits).pipe(delay(1000)); */
  }

  getEClaimImageUrls(
    partyId: string,
    params: { key_names: string[] }
  ): Observable<EClaimImageUrls> {
    return this.http.post<EClaimImageUrls>(
      `${this.baseUrl}/customers/${partyId}/e-claims/image-url`,
      params
    );

    // dummy data
    /* return of(eClaimImageUrls).pipe(delay(1000)); */
  }

  updateCustomerDetail(
    partyId: string,
    customerDetail: Partial<Customer>
  ): Observable<CustomerDetailEditResponse> {
    return this.http.put<CustomerDetailEditResponse>(
      `${this.baseUrl}/customers/${partyId}/profile`,
      customerDetail
    );

    /* return of(customerDetailEditResponse).pipe(delay(1000)); */
  }

  getOtpHistories(
    params: Partial<OtpHistoriesQueryParams>
  ): Observable<PagedData<OtpHistory>> {
    return this.http.get<PagedData<OtpHistory>>(
      `${this.baseUrl}/customers/otp/search`,
      { params }
    );
  }

  getClientsInfoSvoc(partyId: string): Observable<CustomerClient[]> {
    return this.http.get<CustomerClient[]>(
      `${this.baseUrl}/customers/${partyId}/clients-of-party`
    );

    // dummy data
    /* return of(customerPolicy).pipe(delay(1000)); */
  }

  deleteCustomerProfile(partyId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/customers/delete/${partyId}`
    );

    // dummy data
    // return of(undefined).pipe(delay(1000));
  }
}
