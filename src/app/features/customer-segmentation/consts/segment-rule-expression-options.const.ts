import { ValueCode } from '@app/shared/models/value-code.model';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';

export const segmentRuleExpressionOptions: ValueCode<CompareConditionType>[] = [
  { value: 'Is', code: CompareConditionType.EQUAL },
];
