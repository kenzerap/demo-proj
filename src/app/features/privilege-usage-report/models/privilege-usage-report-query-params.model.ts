export interface PrivilegeUsageReportQueryParams {
  page: number;
  size: number;
  start_date_time_from: string;
  start_date_time_to: string;
  end_date_time_from: string;
  end_date_time_to: string;
  is_published: boolean;
  expected_zone_id: string;
}
