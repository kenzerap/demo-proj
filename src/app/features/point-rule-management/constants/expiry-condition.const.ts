import { ValueCode } from '@app/shared/models/value-code.model';

export enum ExpiryConditionCode {
  EndOfNextCalendarYear = 'END_NEXT_CALENDAR_YEAR',
  SetExpiryValue = 'EXPIRY_VALUE_DURATION',
}

export const expiryConditionOptions: ValueCode<ExpiryConditionCode>[] = [
  {
    value: 'End of next calendar year',
    code: ExpiryConditionCode.EndOfNextCalendarYear,
  },
  {
    value: 'Set Expiry Value',
    code: ExpiryConditionCode.SetExpiryValue,
  },
];
