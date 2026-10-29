import { ValueCode } from '@app/shared/models/value-code.model';
import { TriggerEventType } from '@app/shared/utils/enums/trigger-event-type.enum';

export const triggerEventOptions: ValueCode<TriggerEventType>[] = [
  { value: 'Payment Due Date', code: TriggerEventType.PaymentDueDate },
  { value: 'Points Expiry Date', code: TriggerEventType.PointsExpiryDate },
  { value: 'Claim Status', code: TriggerEventType.ClaimStatus },
];
