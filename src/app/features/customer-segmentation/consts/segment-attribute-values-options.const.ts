import { ValueCode } from '@app/shared/models/value-code.model';
import { SegmentationSourceCode } from '@app/shared/utils/enums/segmentation-source-code.enum';

export const segmentCustomerTypeValuesOptions: ValueCode<string>[] = [
  { value: 'Customer', code: 'CUSTOMER' },
  { value: 'Prospect', code: 'NON_CUSTOMER' },
];

export const segmentIsBlockValuesOptions: ValueCode<boolean>[] = [
  { value: 'Blocked', code: true },
  { value: 'Not blocked', code: false },
];

export const segmentIsFraudValuesOptions: ValueCode<boolean>[] = [
  { value: 'Fraud', code: true },
  { value: 'Not fraud', code: false },
];

export const segmentationSourceValuesOptions: ValueCode<string>[] = [
  { value: 'Setting by manual', code: SegmentationSourceCode.MANUAL },
  { value: 'Import file', code: SegmentationSourceCode.UPLOAD },
];
