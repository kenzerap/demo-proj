export interface ClaimHistoriesQueryParams {
  size: number;
  page: number;
  from_date: string;
  to_date: string;
  policy_ids: number[];
}
