import { PagedData } from '@app/shared/models/paged-data.model';

export interface HealthcarePackage {
  id: number;
  name: string;
  description: string;
  is_published: boolean;
  package_name_th: string;
  package_name_en: string;
  created_by: string;
  updated_date: string;
  display_order: number | null;
}

export interface PagedHealthcarePackage extends PagedData<HealthcarePackage> {
  lastChekupPackageId: number;
  lastDisplayOrder: number;
}
