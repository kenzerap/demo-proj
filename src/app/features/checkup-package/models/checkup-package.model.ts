import { PagedData } from '@app/shared/models/paged-data.model';

export interface CheckupPackage {
  id: number;
  package_name: string;
  description: string;
  is_published: boolean;
  package_name_en: string;
  package_name_th: string;
  created_by: string;
  updated_date: string;
  display_order: number | null;
  name?: string;

  // fields for edit order
  pagePosition?: number;
}

export interface PagedCheckupPackage extends PagedData<CheckupPackage> {
  lastChekupPackageId: number;
  lastDisplayOrder: number;
}
