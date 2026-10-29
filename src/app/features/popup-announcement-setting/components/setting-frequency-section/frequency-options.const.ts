import { ValueCode } from '@app/shared/models/value-code.model';

export enum FrequencyPeriodCode {
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH',
}

export const frequencyPeriodOptions: ValueCode<FrequencyPeriodCode>[] = [
  { value: 'Day', code: FrequencyPeriodCode.Day },
  { value: 'Week', code: FrequencyPeriodCode.Week },
  { value: 'Month', code: FrequencyPeriodCode.Month },
];
