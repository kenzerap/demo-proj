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

export interface BannerSettingDetail {
  banner_id: number;
  banner_name: string;
  image: string;
  image_data: string | null;
  banner_type: string;
  is_published: boolean;
  display_order: number;
  publish_type: string;
  start_date_time: string;
  end_date_time: string;
  destination_type: string;
  destination_value: string;
  created_by: string;
  created_date: string;
  updated_date: string;
  target_group_id: number;
  page_name: string;
  page_id: number;
  tier_list: { id: number; name: string; is_included: boolean }[];
  segment_list: { id: number; name: string; is_included: boolean }[];
}

export interface PagedBannerSettings extends PagedData<BannerSetting> {
  bannerId: number;
  lastDisplayOrder: number;
}

export interface BannerSettingTable extends BannerSetting {
  targetGroupName: string;
  dragDisabled: boolean;
}
