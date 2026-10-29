export interface TargetGroupsUserSummaryQueryParams {
  target_group_id: number;
  included_tier_ids: number[];
  excluded_tier_ids: number[];
  included_segment_ids: number[];
  excluded_segment_ids: number[];
}

export interface TargetGroupsUserSummary {
  count: number;
  name: string;
  target_group_id: number[];
  percentage: number;
}
