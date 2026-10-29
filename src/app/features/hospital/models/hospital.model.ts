import { PagedData } from '@app/shared/models/paged-data.model';

export interface Hospital {
  hospital_id: number;
  hospital_name: string;
  display_order: number | null;
  is_published: boolean;
  name_th: string;
  name_en: string;
  amphur_name_th: string;
  amphur_name_en: string;
  province_name_th: string;
  province_name_en: string;
  updated_date: string;

  // fields for edit order
  pagePosition?: number;

  // fields for detail view
  description?: string;
  healthcare_packages?: string[];
  health_insurances?: string[];
  service_types?: string[];
  checkup_enable?: boolean;
  telephone?: string;
  latitude?: number;
  longitude?: number;
  amphur_id?: number;
  province_id?: number;
  address_th?: string;
  address_en?: string;
}

export interface PagedHospital extends PagedData<Hospital> {
  lastHospitalId: number;
  lastDisplayOrder: number;
}
