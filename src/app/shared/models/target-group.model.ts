import { TargetGroupType } from '../components/target-group-section/target-group-type.enum';

export interface TargetGroup {
  id: number;
  target_group_name: string;
  code: TargetGroupType;
}
