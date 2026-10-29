import { ValueCode } from '@app/shared/models/value-code.model';

export enum PointRuleTabCode {
  Welcome_Rule = 'welcome-rule',
  Product_Based_Rule = 'product-based-rule',
  Criteria_Based_Rule = 'criteria-based-rule',
}

export const PointRuleTabs: ValueCode[] = [
  { value: 'Welcome Rule', code: PointRuleTabCode.Welcome_Rule },
  { value: 'Product-Based Rule', code: PointRuleTabCode.Product_Based_Rule },
  { value: 'Criteria-Based Rule', code: PointRuleTabCode.Criteria_Based_Rule },
];
