export interface ManualCodeRedemptionQueryParams {
  page: number;
  size: number;
  search_text: string;
  action_by: string;
}

export interface UpdateStatusQueryParams {
  id: number;
  action_done_by: string | undefined;
  type: string;
}
