import { ValueCode } from '@app/shared/models/value-code.model';

export enum CategoryCode {
  WelcomeRule = 'WELCOME_RULE',
  CriteriaBasedRule = 'CRITERIA_BASED_RULE',
  ProductBasedRule = 'PRODUCT_BASED_RULE',
}

export const categoryOptions: ValueCode<CategoryCode>[] = [
  { value: 'Welcome Rule', code: CategoryCode.WelcomeRule },
  { value: 'Criteria-Based Rule', code: CategoryCode.CriteriaBasedRule },
  { value: 'Product-Based Rule', code: CategoryCode.ProductBasedRule },
];
