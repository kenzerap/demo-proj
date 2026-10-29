export interface CreateEditCheckupPackageQueryParams {
  id: number;
  name: string;
  description: string;
  package_name_th: string;
  package_name_en: string;
  is_published: boolean;
  created_by: string;
}
