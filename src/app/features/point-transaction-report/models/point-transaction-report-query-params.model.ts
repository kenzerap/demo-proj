export interface PointTransactionReportQueryParams {
  page: number;
  size: number;
  from_date_time: string;
  to_date_time: string;
  transaction_type: string | null;
  expected_zone_id: string;
}
