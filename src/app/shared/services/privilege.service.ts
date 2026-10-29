import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Privilege } from '../models/privilege.model';
import { InventoriesQueryParams } from '../models/inventories-query-params.model';
import { PagedData } from '../models/paged-data.model';
import { Inventory } from '../models/inventory-model';

@Injectable({
  providedIn: 'root',
})
export class PrivilegeService {
  readonly baseUrl = `${environment.apiBaseUrl}/privilege`;
  private readonly http: HttpClient = inject(HttpClient);

  getPrivileges(): Observable<Privilege[]> {
    return this.http.get<Privilege[]>(`${this.baseUrl}/privileges`);
  }

  getInventories(
    params: Partial<InventoriesQueryParams>,
  ): Observable<PagedData<Inventory>> {
    const queryParams = {
      ...params,
      sort_by: params.sort_by ? params.sort_by.toLocaleUpperCase() : undefined,
      sort_direction: params.sort_direction
        ? params.sort_direction.toLocaleUpperCase()
        : undefined,
    };

    return this.http.post<PagedData<Inventory>>(
      `${this.baseUrl}/inventories/search`,
      queryParams,
    );
  }
}
