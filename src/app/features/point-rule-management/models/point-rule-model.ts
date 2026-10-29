import { CategoryCode } from '../constants/category-options.const';
import {
  CriteriaFeatureEngagementRules,
  WelcomePointRuleCondition,
} from './create-edit-point-rule-query-params.model';

export interface PointRule {
  point_rule_id: number;
  created_date: string;
  start_date: string;
  end_date: string;
  name: string;
  description: string;
  product_name: string;
  category: CategoryCode;
  attributes: string[];
}

export interface PointRuleDetail {
  point_rule_id: number;
  name: string;
  description: string;
  category: string;
  is_published: boolean;
  start_date_time: string;
  end_date_time: string | null;
  set_point: number;
  action_done_by: string;
  expiry_date_duration: number;
  count_expiry_from: string;
  expiry_condition: string;
  welcome_point_rules: {
    earning_point: number;
    rule_conditions: WelcomePointRuleCondition[];
  }[];
  criteria_based_rule: {
    criteria_based_rule_id: number;
    criteria_type: string;
    criteria_reset_period: string;
    criteria_checkin_rules: {
      earning_point: number;
      checkin_day: number;
      criteria_checkin_rule_id: number;
    }[];
    criteria_feature_engagement_rules: CriteriaFeatureEngagementRules[];
  };
  product_based_rule: {
    product_based_rule_id: number;

    product_name: string;
    plan_code: string;
    marketing_name_en: string;
    marketing_name_th: string;
    rule_product_name: string;
    channel_rules: {
      product_based_rule_channel_id: number;
      channel: string;
      point_rate: number;
      free_look_period: number;
      channel_code: string;
      system_id: string;
    }[];
  };
}
