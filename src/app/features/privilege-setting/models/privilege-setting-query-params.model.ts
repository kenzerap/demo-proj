import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';

export interface PrivilegeSettingQueryParams {
  sendTimeType: TimePeriodType;
  page: number;
  size: number;
  isSent: boolean;
  target_group_ids: number[];
}
