export interface CreateEditHospitalQueryParams {
  id?: number;
  hospital_name: string;
  description: string;
  is_published: boolean | string;
  name_th: string;
  name_en: string;
  created_by: string;
  health_insurances: string[];
  service_types: string[];
  healthcare_packages: number[];
  telephone: number;
  latitude: number;
  longitude: number;
  province_id: number;
  amphur_id: number;
  checkup_enable: boolean;
  address_th: string;
  address_en: string;
}
