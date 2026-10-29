export interface CreateEditBannerSettingQueryParams {
  banner_id: number;
  banner_name: string;
  description: string;
  display_order: number;
  is_published: boolean;
  target_group_id: number;
  page_id: number;
  destination_type: string;
  destination_value: string;
  start_date_time: string;
  end_date_time: string;
  created_by: string;
  updated_by: string;
  tier_list: { id: number; is_included: boolean }[];
  segment_list: { id: number; is_included: boolean }[];
}
