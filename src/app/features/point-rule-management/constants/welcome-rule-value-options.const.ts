import { ValueCode } from '@app/shared/models/value-code.model';
import { WelcomeRuleValueCode } from '../utils/welcome-rule-value-code.enum';

export const welcomeRuleValueOptions: ValueCode<WelcomeRuleValueCode>[] = [
  { value: 'Customer', code: WelcomeRuleValueCode.Customer },
  { value: 'Prospect', code: WelcomeRuleValueCode.Prospect },
];
