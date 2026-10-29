import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import {
  PagedPrivilegeSettings,
  PrivilegeDetail,
} from '../models/privilege-setting-model';
import { PrivilegeTypeEnum } from '../../../shared/utils/enums/privilege-type.enums';
import { BrandCommon } from '@app/features/inventory-setting/models/brand-common.model';
import { CreateEditPrivilegesQueryParams } from '../models/create-edit-privilege-query-params.model';
import { HealthcarePackage } from '../models/healthcare-package.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import {
  pagedPrivilegeSettings,
  pagedTargetGroupUserCount,
} from '@app/shared/constants/dummy-data.const';

@Injectable({
  providedIn: 'root',
})
export class PrivilegeSettingService {
  readonly baseUrl = `${environment.apiBaseUrl}/privilege`;
  private readonly http: HttpClient = inject(HttpClient);

  getPrivilegeSettings(params: any): Observable<PagedPrivilegeSettings> {
    return this.http.get<PagedPrivilegeSettings>(
      `${this.baseUrl}/privileges/search`,
      { params },
    );

    // dummy data
    // return of(pagedPrivilegeSettings);
  }

  getPrivilegeDetail(privilegeId: number): Observable<PrivilegeDetail> {
    return this.http.get<PrivilegeDetail>(
      `${this.baseUrl}/privileges/${privilegeId}`,
    );
  }

  getTargetGroupUserCount(
    privilegeType: PrivilegeTypeEnum,
    page: number,
  ): Observable<PagedData<TargetGroupUserCount>> {
    return this.http.get<PagedData<TargetGroupUserCount>>(
      `${this.baseUrl}/privileges/target-group-user-summary?privilegeType=${privilegeType}&page=${page}`,
    );

    // dummy data
    // return of(pagedTargetGroupUserCount);
  }

  getBrandsDropdown(): Observable<BrandCommon[]> {
    return this.http.get<BrandCommon[]>(
      `${this.baseUrl}/brands/brands-dropdown`,
    );

    /* return of(brands).pipe(delay(1000)); */
  }

  getHealthcarePackagesDropdown(): Observable<HealthcarePackage[]> {
    return this.http.get<HealthcarePackage[]>(
      `${this.baseUrl}/healthcare-packages/dropdown`,
    );
  }

  createPrivilege(
    data: Partial<CreateEditPrivilegesQueryParams>,
    thumbnailFile: File | null,
    detailFile: File | null,
  ): Observable<any> {
    const formData = new FormData();
    formData.append('thumbnailFile', thumbnailFile || '');
    formData.append('detailFile', detailFile || '');
    formData.append('input', JSON.stringify(data));

    return this.http.post<void>(`${this.baseUrl}/privileges`, formData);
  }

  updatePrivilege(
    data: Partial<CreateEditPrivilegesQueryParams>,
    thumbnailFile: File,
    detailFile: File,
  ): Observable<any> {
    const formData = new FormData();
    formData.append('thumbnailFile', thumbnailFile);
    formData.append('detailFile', detailFile);
    formData.append('input', JSON.stringify(data));

    return this.http.put<void>(
      `${this.baseUrl}/privileges/${data.id}`,
      formData,
    );
  }

  updatePublishedPrivilege(
    is_published: boolean,
    privilege_id: number,
    action_done_by: string,
  ): Observable<any> {
    return this.http.patch<void>(`${this.baseUrl}/privileges/${privilege_id}`, {
      is_published,
      action_done_by,
    });
  }
}
