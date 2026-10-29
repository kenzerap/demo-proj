import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserPermission } from '../models/user-permission.model';
import { FeaturePermissionCode } from '../utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '../utils/enums/action-permission-code.enum';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionService {
  readonly baseUrl = `${environment.apiBaseUrl}/auth`;
  private readonly http: HttpClient = inject(HttpClient);

  getUserPermissions(): Observable<{
    data: string;
    status_code: number;
  }> {
    // dummy data userPermission
    /* return of({
      data: 'token',
      status_code: 200,
    }); */

    return this.http.get<{
      data: string;
      status_code: number;
    }>(`${this.baseUrl}/users/get-permissions`);
  }
}
