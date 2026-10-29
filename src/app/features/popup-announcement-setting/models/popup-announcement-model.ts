import { PagedData } from '@app/shared/models/paged-data.model';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { FrequencyPeriodCode } from '../components/setting-frequency-section/frequency-options.const';

export interface PopupAnnouncement {
  bannerId: number;
  bannerName: string;
  image: string;
  imageData: string | null;
  bannerType: string;
  description: string;
  displayOrder: number | null;
  targetGroupId: number;
  isPublished: boolean;
  publishType: string;
  dontShowButton: boolean;
  destinationType: string;
  destinationValue: string;
  frequencyCap: number;
  frequencyPeriod: string;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  pageId: number;
  pageName: string;
  startDateTime: string;
  endDateTime: string;
  pagePosition?: number;
}

export interface PopupAnnouncementDetail {
  banner_id: number;
  banner_name: string;
  image: string;
  image_data: string | null;
  banner_type: string;
  description: string;
  start_date_time: string;
  end_date_time: string;
  display_order: number;
  target_group_id: number;
  is_published: boolean;
  publish_type: string;
  dont_show_button: boolean;
  destination_type: string;
  destination_value: string;
  frequency_cap: number;
  frequency_period: string;
  created_by: string;
  updated_by: string | null;
  created_date: string;
  updated_date: string;
  page_id: number;
  page_name: string;
  tier_list: { id: number; name: string; is_included: boolean }[];
  segment_list: { id: number; name: string; is_included: boolean }[];
}

export interface PagedPopupAnnouncements extends PagedData<PopupAnnouncement> {
  bannerId: number;
  lastDisplayOrder: number | null;
}

export interface PopupAnnouncementTable extends PopupAnnouncement {
  targetGroupName: string;
  dragDisabled: boolean;
}
