export interface CreateEditNotificationsQueryParams {
  push_message_id: number;
  message_title_thai: string;
  message_title_en: string;
  message_body_thai: string;
  message_body_en: string;
  send_time_type: string;
  platform: string;
  destination_type: string;
  destination_value: string;
  status: string;
  start_date_time: string;
  end_date_time: string;
  target_group_id: number;
  target_group_tiers: any;
  trigger_event_type: string;
  trigger_event_condition: string;
  trigger_event_value: string;
  trigger_event_unit: string;
  shown_in_message_box: boolean;
  published: boolean;
  created_by: string;
  updated_by: string;
  tier_list: { id: number; is_included: boolean }[];
  segment_list: { id: number; is_included: boolean }[];
}
