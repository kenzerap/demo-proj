export interface PrivilegeUsageReport {
  id: string;
  privilege_id: string;
  privilege_name: string;
  privilege_type: string;
  brand: string;
  status: boolean;
  start_date: string;
  end_date: string;
  target_group_items: TargetItem[];
  used_by_points: number;
  used_by_promo_code: number;
  used_by_unicode: number;
  quota: number;
  engagement_percentage: number;
}

export interface TargetItem {
  type: string;
  name: string;
  is_include: boolean;
}

export interface PrivilegeUsageReportFormatted
  extends Omit<
    PrivilegeUsageReport,
    'formatted_status' | 'target_group_names'
  > {
  id: string;
  formatted_status: string;
  target_group_names: string;
}
