import { ValueCode } from '@app/shared/models/value-code.model';
import { RedeemLimitCondition } from '@app/shared/utils/enums/redeem-limit-condition.enums';

export const RewardsredeemLimitConditions: ValueCode[] = [
  {
    value: 'Per Privilege',
    code: RedeemLimitCondition.PER_PRIVILEGE,
  },
  {
    value: 'Per Day',
    code: RedeemLimitCondition.ON_DAILY_REDEEM,
  },
  {
    value: 'Per Week',
    code: RedeemLimitCondition.ON_WEEKLY_REDEEM,
  },
  {
    value: 'Per Month',
    code: RedeemLimitCondition.ON_EACH_MONTH_REDEEM,
  },
  {
    value: 'Unlimited',
    code: RedeemLimitCondition.UNLIMITED_REDEEM,
  },
];
