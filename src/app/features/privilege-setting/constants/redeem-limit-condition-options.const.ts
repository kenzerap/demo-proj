import { ValueCode } from '@app/shared/models/value-code.model';
import { RedeemLimitCondition } from '../../../shared/utils/enums/redeem-limit-condition.enums';

export const redeemLimitConditions: ValueCode[] = [
  { value: 'One-time Redeem', code: RedeemLimitCondition.ONE_TIME_REDEEM },
  {
    value: 'On Each Month Redeem',
    code: RedeemLimitCondition.ON_EACH_MONTH_REDEEM,
  },
  { value: 'Unlimited Redeem', code: RedeemLimitCondition.UNLIMITED_REDEEM },
  {
    value: 'On Daily Redeem',
    code: RedeemLimitCondition.ON_DAILY_REDEEM,
  },
  { value: 'On Weekly Redeem', code: RedeemLimitCondition.ON_WEEKLY_REDEEM },
  { value: 'X Time Redeem', code: RedeemLimitCondition.X_TIME_REDEEM },
];
