import { PrivilegeTypeEnum } from "@app/shared/utils/enums/privilege-type.enums";

export const privilegeSettingTabs: { label: string; url: string; privilegeType: PrivilegeTypeEnum }[] = [
  { label: 'E-voucher', url: 'e-voucher', privilegeType: PrivilegeTypeEnum.E_VOUCHER },
  { label: 'Delivery', url: 'delivery', privilegeType: PrivilegeTypeEnum.DELIVERY },
  { label: 'Booking', url: 'booking', privilegeType: PrivilegeTypeEnum.BOOKING },
  { label: 'Healthcare', url: 'healthcare', privilegeType: PrivilegeTypeEnum.HEALTH_CARE },
];
