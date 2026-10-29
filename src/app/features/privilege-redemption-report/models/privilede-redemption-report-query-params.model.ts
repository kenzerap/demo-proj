export interface PrivilegeRedemptionReportQueryParams {
  page: number;
  size: number;
  keyword: string;
  privilege_types: Array<string> | [];
  from_date_time: string;
  to_date_time: string;
  expected_zone_id: string;
}
