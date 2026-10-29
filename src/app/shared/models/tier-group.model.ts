export interface TierGroup {
  tier_id: number;
  tier_group_id: number;
  tier_name_english: string;
  tier_name_thai: string;
  detail: string;
  status: string;
  color: string;
  created_date: string;
  updated_date: string;
  created_by: string;
  updated_by: string;
  tier_rule_list: TierGroupRule[];
}

export interface TierGroupRule {
  tier_rule_id: number;
  attribute: string;
  rule_expression: string;
  rule_value: string;
}
