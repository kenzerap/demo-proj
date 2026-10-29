import { PagedData } from '@app/shared/models/paged-data.model';
import { PrivilegeSection } from './create-edit-home-screen-query-params.model';

export interface HomeScreenManagement {
  id: number;
  section_name: string;
  is_published: boolean;
  start_date_time: string;
  end_date_time: string;
  updated_date: string;
  display_order: number | null;

  // fields for edit order
  pagePosition?: number;
}

export interface ShortcutHighlightDetail {
  shortcut_id: number;
  order_number: number;
  name_english: string;
  name_thai: string;
  image: string;
  image_data: string | null;
  destination_type: string;
  destination_value: string;
}

export interface HomeScreenManagementDetail {
  id: number;
  section_name: string;
  description: string;
  category_type: string;
  is_published: boolean;
  start_date_time: string;
  end_date_time: string;
  title_thai: string;
  title_english: string;
  privilege_section_list: PrivilegeSection[];
  shortcuts_highlights_list: ShortcutHighlightDetail[];
  created_by: string;
  updated_by: string | null;
  created_date: string;
  updated_date: string;
}

export interface PagedHomeScreen extends PagedData<HomeScreenManagement> {
  lastHomeScreenId: number;
  lastDisplayOrder: number;
}
