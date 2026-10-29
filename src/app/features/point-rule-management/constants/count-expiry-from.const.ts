import { ValueCode } from '@app/shared/models/value-code.model';

export enum CountExpiryFromCode {
  EarningPointDate = 'EARNING_POINT_DATE',
  PremiumPaidDate = 'PREMIUM_PAID_DATE',
}

export const countExpiryFromOptions: ValueCode<CountExpiryFromCode>[] = [
  { value: 'Earning Point Date', code: CountExpiryFromCode.EarningPointDate },
  { value: 'Premium Paid Date', code: CountExpiryFromCode.PremiumPaidDate },
];
