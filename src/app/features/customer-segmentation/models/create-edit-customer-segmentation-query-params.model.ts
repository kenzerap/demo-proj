export interface CreateEditCustomerSegmentationQueryParams {
  status: string;
  name: string;
  description: string;
  segment_groups: CustomerSegmentationGroup[];
  created_by: string;
  updated_by: string;
}

export interface CustomerSegmentationGroup {
  group_name: string;
  logical_operator: string;
  segment_rules: SegmentRule[];
}

export interface SegmentRule {
  active_from_date: string;
  active_to_date: string;
  attribute: string;
  logical_operator: string;
  rule_expression: string;
  rule_value: string;
  type: string;
  rule_code: string;
  segmentation_source: string;
  file_id: number;
}
