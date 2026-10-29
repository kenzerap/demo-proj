import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { CreateEditHospitalQueryParams } from '../models/create-edit-hospital-query-params.model';
import { Province } from '../models/province.model';
import { District } from '../models/district.model';
import { HealthcarePackageQueryParams } from '../models/healthcare-package-query-params.model';
import { PagedHealthcarePackage } from '../models/healthcare-package.model';
import { HospitalQueryParams } from '../models/hospital-query-params.model';
import { Hospital, PagedHospital } from '../models/hospital.model';
import { ReorderHospitalQueryParams } from '../models/reorder-hospital-query-params.model';

const HOSPITAL_SORT_FIELD_MAP: Record<string, string> = {
  name_th: 'NAME_TH',
  name_en: 'NAME_EN',
  display_order: 'DISPLAY_ORDER',
  is_published: 'IS_PUBLISHED',
  updated_date: 'UPDATED_DATE',
};

const HOSPITAL_SORT_ORDER_MAP: Record<string, string> = {
  asc: 'ASC',
  desc: 'DESC',
};

type HospitalSearchQueryParams = Omit<
  Partial<HospitalQueryParams>,
  'sort_by' | 'sort_direction'
> & {
  sortField?: string;
  sortOrder?: string;
};

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  readonly baseUrl = `${environment.apiBaseUrl}/privilege`;
  private readonly http: HttpClient = inject(HttpClient);

  getHospitals(
    params: Partial<HospitalQueryParams>
  ): Observable<PagedHospital> {
    const { sort_by, sort_direction, ...rest } = params;

    const queryParams: HospitalSearchQueryParams = {
      ...rest,
      ...(sort_by && { sortField: HOSPITAL_SORT_FIELD_MAP[sort_by] }),
      ...(sort_direction && {
        sortOrder: HOSPITAL_SORT_ORDER_MAP[sort_direction],
      }),
    };

    return this.http.get<PagedHospital>(`${this.baseUrl}/hospitals/search`, {
      params: queryParams,
    });
  }
  createHospital(
    data: Partial<CreateEditHospitalQueryParams>
  ): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/hospitals`, data);
  }

  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(`${this.baseUrl}/provinces/dropdown`);
  }

  getDistricts(provinceId: number): Observable<District[]> {
    return this.http.get<District[]>(`${this.baseUrl}/amphurs/dropdown`, {
      params: { provinceId },
    });
  }

  getHealthcarePackages(
    params: Partial<HealthcarePackageQueryParams>
  ): Observable<PagedHealthcarePackage> {
    return this.http.get<PagedHealthcarePackage>(
      `${this.baseUrl}/healthcare-packages/search`,
      { params }
    );
  }

  reOrderHospitals(params: ReorderHospitalQueryParams): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/hospitals`, params);
  }

  getHospitalDetail(id: number): Observable<Hospital> {
    return this.http.get<Hospital>(`${this.baseUrl}/hospitals/${id}`);
  }

  updateHospital(
    data: Partial<CreateEditHospitalQueryParams>
  ): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/hospitals/${data.id}`, data);
  }
}
