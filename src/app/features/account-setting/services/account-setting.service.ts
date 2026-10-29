import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CreateUserQueryParams } from '../models/create-user-query-params.model';
import { GetUsersQueryParams } from '../models/get-users-query-params.model';
import { UserAccount } from '../models/user-account.model';
import { UserGroup } from '../models/user-group.model';

@Injectable({
  providedIn: 'root',
})
export class AccountSettingService {
  readonly baseUrl = `${environment.apiBaseUrl}/auth`;
  private readonly http: HttpClient = inject(HttpClient);

  getUserAccounts(
    params: Partial<GetUsersQueryParams>
  ): Observable<PagedData<UserAccount>> {
    return this.http.post<PagedData<UserAccount>>(
      `${this.baseUrl}/users/search`,
      params
    );
  }

  createUser(data: Partial<CreateUserQueryParams>): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/create`, data);
  }

  getGroups(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>(`${this.baseUrl}/users/get-group-list`);
  }
}
