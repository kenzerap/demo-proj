import { ValueCode } from '@app/shared/models/value-code.model';

export enum ResetPeriodCode {
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY',
}

export const resetPeriodOptions: ValueCode<ResetPeriodCode>[] = [
  { value: 'Daily', code: ResetPeriodCode.Daily },
  { value: 'Weekly', code: ResetPeriodCode.Weekly },
  { value: 'Monthly', code: ResetPeriodCode.Monthly },
  { value: 'Yearly', code: ResetPeriodCode.Yearly },
];
