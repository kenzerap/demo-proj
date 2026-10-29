import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { environment } from 'src/environments/environment';
import { CustomerProfileQueryParams } from '../models/customer-profile-query-params.model';
import { customerProfilePagedList } from '../constants/dummy-data.const';
import { CustomerProfile } from '../models/customer-profile.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerProfileService {
  readonly baseUrl = environment.apiBaseUrl;
  private readonly http: HttpClient = inject(HttpClient);

  getCustomerProfiles(
    params: Partial<CustomerProfileQueryParams>
  ): Observable<PagedData<CustomerProfile>> {
    return this.http.post<PagedData<CustomerProfile>>(
      `${this.baseUrl}/customer-management/customers/search`,
      params
    );

    // dummy data
    /* return of(customerProfilePagedList).pipe(delay(1000)); */
  }
}
