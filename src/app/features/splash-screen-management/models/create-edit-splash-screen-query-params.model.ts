export interface CreateEditSplashScreenQueryParams {
  id: number;
  name_en: string;
  name_th: string;
  description_en: string;
  description_th: string;
  status: 'ACTIVE' | 'INACTIVE';
  display_order: number;
  publish_type: string;
  start_date_time: string;
  end_date_time: string;
  created_by: string;
}
