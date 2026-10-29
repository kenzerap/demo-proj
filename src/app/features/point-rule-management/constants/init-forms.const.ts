import { FormBuilder, Validators } from '@angular/forms';
import { WelcomeRuleConditionCode } from '../utils/welcome-rule-condition-code.enum';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { WelcomeRuleValueCode } from '../utils/welcome-rule-value-code.enum';
import { EngagementBasedRuleAttributeCode } from './engagement-based-rule-attribute-options.const';

export const initWelcomeRuleForm = (fb: FormBuilder) => {
  return fb.group({
    rules: fb.array([
      fb.group({
        earning_point: ['', [Validators.required, Validators.min(0)]],
        rule_conditions: fb.array([
          fb.group({
            attribute: [WelcomeRuleConditionCode.UserType, Validators.required],
            condition: [CompareConditionType.Is, Validators.required],
            value: [WelcomeRuleValueCode.Customer, [Validators.required]],
            group_condition: [null],
          }),
        ]),
      }),
    ]),
  });
};

export const initCriteriaCheckinRuleForm = (fb: FormBuilder) => {
  return fb.group({
    criteria_checkin_rules: fb.array([
      fb.group({
        checkin_day: [
          { value: 1, disabled: true },
          [Validators.required, Validators.min(1)],
        ],
        earning_point: ['', [Validators.required, Validators.min(1)]],
      }),
    ]),
  });
};

export const initCriteriaFeatureEngagementRuleForm = (fb: FormBuilder) => {
  return fb.group({
    default_attribute: [
      EngagementBasedRuleAttributeCode.Eclaim,
      [Validators.required],
    ],
    default_condition: [CompareConditionType.Is, [Validators.required]],
    default_value: ['', [Validators.required]],
    default_earning_point: ['', [Validators.required, Validators.min(1)]],
    is_unlimited_value: [false],

    criteria_feature_engagement_rules: fb.array([]),
  });
};

export const initProductBasedRuleForm = (fb: FormBuilder) => {
  return fb.group({
    product_based_rule_id: [''],
    product_name: ['', [Validators.required]],
    plan_code: [{ value: '', disabled: true }],
    marketing_name_en: [{ value: '', disabled: true }],
    marketing_name_th: [{ value: '', disabled: true }],
    channel_rules: fb.array([
      fb.group({
        product_based_rule_channel_id: [''],
        channel: ['', [Validators.required]],
        point_rate: [
          '',
          [Validators.required, Validators.min(0.01), Validators.max(999)],
        ],
      }),
    ]),
  });
};
