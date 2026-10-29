import { ValueCode } from '@app/shared/models/value-code.model';
import { PrivilegeTypeEnum } from '../../../shared/utils/enums/privilege-type.enums';

export const privilegeTypes: ValueCode[] = [
  { value: 'E-Voucher', code: PrivilegeTypeEnum.E_VOUCHER },
  { value: 'Delivery', code: PrivilegeTypeEnum.DELIVERY },
  { value: 'Booking', code: PrivilegeTypeEnum.BOOKING },
  { value: 'Healthcare', code: PrivilegeTypeEnum.HEALTH_CARE },
];
