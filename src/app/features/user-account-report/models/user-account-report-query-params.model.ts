export interface UserAccountReportQueryParams {
  page: number;
  size: number;
  from_date_time: string;
  to_date_time: string;
  user_types: Array<string> | [];
  expected_zone_id: string;
}
