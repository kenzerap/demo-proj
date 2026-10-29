import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';

export interface Notification {
  id: number;
  message_title_thai: string;
  message_title_en: string;
  message_body_thai: string;
  message_body_en: string;
  send_time_type: TimePeriodType;
  send_time_type_display: string;
  start_date_time: string;
  end_date_time: string;
  updated_date: string;
  published: boolean;
  segment_name: string;
  trigger_event_type: string;
  trigger_event_type_display: string;
}

export interface NotificationDetail {
  id: number;
  message_title_thai: string;
  message_title_en: string;
  message_body_thai: string;
  message_body_en: string;
  send_time_type: TimePeriodType;
  start_date_time: string;
  end_date_time: string;
  target_group_id: number;
  platform: string;
  shown_in_message_box: boolean;
  destination_type: string;
  destination_value: string;
  trigger_event_type: string;
  trigger_event_condition: string;
  trigger_event_value: string;
  trigger_event_unit: string;
  published: boolean;
  tier_list: { id: number; name: string; is_included: boolean }[];
  segment_list: { id: number; name: string; is_included: boolean }[];
}
