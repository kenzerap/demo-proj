import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { PrivilegeTypeEnum } from '../../../shared/utils/enums/privilege-type.enums';

export interface PrivilegeSettingsQueryParams extends Partial<CommonListQueryParams> {
  privilege_type: PrivilegeTypeEnum;
  target_group_ids: number[];
  page: number;
  size: number;
  privilegeId: string;
}
