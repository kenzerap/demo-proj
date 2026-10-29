import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { WelcomeRuleConditionCode } from '../utils/welcome-rule-condition-code.enum';
import { WelcomeRuleValueCode } from '../utils/welcome-rule-value-code.enum';
import { EngagementBasedRuleAttributeCode } from '../constants/engagement-based-rule-attribute-options.const';
import { CriteriaCode } from '../constants/criteria-options.const';

export interface CreateEditPointRulesQueryParams {
  id: number | null;
  name: string;
  description: string;
  category: string;
  is_published: boolean;
  start_date_time: string;
  end_date_time: string;
  set_point: number;
  action_done_by: string;
  expiry_date_duration: number;
  count_expiry_from: string;
  expiry_condition: string;
  welcome_point_rules: {
    earning_point: number;
    rule_conditions: WelcomePointRuleCondition[];
  }[];
  criteria_based_rule: CriteriaBasedRule;
  product_based_rule: {
    product_based_rule_id: number;
    product_name: string;
    plan_code: string;
    marketing_name_en: string;
    marketing_name_th: string;
    channel_rules: {
      product_based_rule_channel_id: number;
      channel: string;
      point_rate: number;
      free_look_period?: number;
      channel_code: string;
      system_id: string;
    }[];
  };
}

export interface WelcomePointRuleCondition {
  attribute: WelcomeRuleConditionCode;
  condition: CompareConditionType;
  value: WelcomeRuleValueCode;
  group_condition: string | null;
  welcome_rule_condition_id: number | null;
}

export interface CriteriaBasedRule {
  criteria_type: CriteriaCode;
  criteria_reset_period: string;
  criteria_checkin_rules: {
    checkin_day: number;
    earning_point: number;
  }[];
  criteria_feature_engagement_rules: CriteriaFeatureEngagementRules[];
}

export interface CriteriaFeatureEngagementRules {
  attribute: EngagementBasedRuleAttributeCode;
  condition: CompareConditionType;
  value: string;
  unlimited_value: boolean;
  earning_point: number;
  criteria_engagement_rule_id: number | null;
}
