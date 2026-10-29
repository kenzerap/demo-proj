import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerTier } from '../models/cutomer-tier.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerTierService {
  readonly baseUrl = `${environment.apiBaseUrl}/tier-segment`;
  private readonly http: HttpClient = inject(HttpClient);

  getCustomerTier(partyId: string): Observable<CustomerTier> {
    return this.http.get<CustomerTier>(`${this.baseUrl}/tier-group/user-tier`, {
      params: { user_id: partyId },
    });
  }
}
