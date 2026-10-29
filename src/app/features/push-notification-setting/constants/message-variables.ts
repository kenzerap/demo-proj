import { ValueCode } from '@app/shared/models/value-code.model';

export const defaultMessageVariables: ValueCode[] = [
  { value: 'User Name', code: `{{user_name}}` },
];

export const messageVariables: ValueCode[] = [
  { value: 'User Name', code: `{{user_name}}` },
  { value: 'Condition Value', code: `{{condition_value}}` },
  { value: 'Condition Unit', code: `{{condition_unit}}` },
  { value: 'Current Points', code: `{{current_points}}` },
  { value: 'Claim Status', code: `{{claim_status}}` },
  { value: 'Claim No', code: `{{claim_no}}` },
  { value: 'Payment Expiry Date', code: `{{payment_expiry_date}}` },
  { value: 'Paid Amount', code: `{{paid_amount}}` },
  { value: 'Point Expiry Date', code: `{{point_expiry_date}}` },
  { value: 'Expiring Points', code: `{{Expiring_Points}}` },
];
