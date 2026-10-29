import { PagedData } from '@app/shared/models/paged-data.model';

export interface BannerSetting {
  banner_id: number;
  banner_name: string;
  image: string;
  banner_type: string;
  is_published: boolean;
  display_order: number | null;
  publish_type: string;
  start_date_time: string;
  start_time: string;
  end_date_time: string;
  destination_type: string;
  destination_value: string;
  created_by: string;
  created_date: string;
  updated_date: string;
  target_group_id: number;
  page_name: string;
  image_data: string;
  page_id: number;
  pagePosition?: number;
}

export interface PagedBannerSettings extends PagedData<BannerSetting> {
  bannerId: number;
  lastDisplayOrder: number;
}

export interface BannerSettingTable extends BannerSetting {
  targetGroupName: string;
}
