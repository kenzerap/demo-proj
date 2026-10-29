export interface SplashScreenManagement {
  splash_screen_id: number;
  display_order: number | null;
  name_en: string;
  name_th: string;
  description_en: string;
  description_th: string;
  status: 'ACTIVE' | 'INACTIVE';
  start_date_time: string;
  end_date_time: string;
  updated_date: string;
  image: string;
  image_data: string;
  publish_type: string;
  created_by: string;
  created_date: string;
}

export interface SplashScreenDetail {
  splash_screen_id: number;
  name_en: string;
  name_th: string;
  description_en: string;
  description_th: string;
  image: string;
  image_data: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  display_order: number;
  publish_type: string;
  start_date_time: string;
  end_date_time: string;
  created_by: string;
  updated_by: string | null;
  created_date: string;
  updated_date: string;
}
