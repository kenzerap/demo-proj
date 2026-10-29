export interface PrivilegeSection {
  attribute: string;
  operator: string;
  value: string;
  privilegeConditionsId: number;
  homeScreenSectionId: number;
}

export interface ShortcutHighlight {
  id: number;
  order_number: number;
  name_english: string;
  name_thai: string;
  destination_type: string;
  destination_value: string | null;
}

export interface CreateEditHomeScreenQueryParams {
  id: number;
  section_name: string;
  description: string;
  category_type: string;
  is_published: boolean;
  start_date_time: string;
  end_date_time: string;
  title_thai: string;
  title_english: string;
  action_by: string;
  privilege_section_list: PrivilegeSection[];
  shortcuts_highlights_list: ShortcutHighlight[];
}
