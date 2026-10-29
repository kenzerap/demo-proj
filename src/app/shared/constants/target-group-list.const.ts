import { ValueCode } from '@app/shared/models/value-code.model';
import { TargetGroupType } from '../components/target-group-section/target-group-type.enum';

export const targetGroupList: ValueCode<TargetGroupType>[] = [
  { value: 'All Users', code: TargetGroupType.ALL },
  { value: 'Public', code: TargetGroupType.PUBLIC },
  { value: 'Insured', code: TargetGroupType.INSURED },
  { value: 'Target Group', code: TargetGroupType.TARGET_GROUP },
];
