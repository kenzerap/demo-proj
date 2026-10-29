import { ValueCode } from '@app/shared/models/value-code.model';
import { CampaignType } from '@app/shared/utils/enums/campaign-type.enums';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { PrivilegeTypeEnum } from '@app/shared/utils/enums/privilege-type.enums';

export enum AttributeCode {
  START_DATE = 'START_DATE',
  END_DATE = 'END_DATE',
  TIER = 'TIER',
  USER_REMAINING_POINT = 'USER_REMAINING_POINT',
  PRIVILEGE_TYPE = 'PRIVILEGE_TYPE',
  CAMPAIGN_TYPE = 'CAMPAIGN_TYPE',
}

export enum ValueOptionsCode {
  Today = 'TODAY',
  ThisWeek = 'THIS_WEEK',
  ThisMonth = 'THIS_MONTH',
}

export const privilegeAttributeOptions: ValueCode<string>[] = [
  { value: 'Start Date', code: AttributeCode.START_DATE },
  { value: 'End Date', code: AttributeCode.END_DATE },
  { value: 'Tier', code: AttributeCode.TIER },
  { value: 'User Remaining Point', code: AttributeCode.USER_REMAINING_POINT },
  { value: 'PrivilegeType', code: AttributeCode.PRIVILEGE_TYPE },
  { value: 'CampaignType', code: AttributeCode.CAMPAIGN_TYPE },
];

export const dateValuesOptions: ValueCode<string>[] = [
  { value: 'Today', code: ValueOptionsCode.Today },
  { value: 'This week', code: ValueOptionsCode.ThisWeek },
  { value: 'This month', code: ValueOptionsCode.ThisMonth },
];

export const privilegeTypeValuesOptions: ValueCode<string>[] = [
  { value: 'E-Voucher', code: PrivilegeTypeEnum.E_VOUCHER },
  { value: 'Delivery', code: PrivilegeTypeEnum.DELIVERY },
  { value: 'Booking', code: PrivilegeTypeEnum.BOOKING },
  { value: 'Healthcare', code: PrivilegeTypeEnum.HEALTH_CARE },
];

export const campaignTypeValuesOptions: ValueCode<string>[] = [
  { value: 'Normal', code: CampaignType.NORMAL },
  { value: 'Special Campaign', code: CampaignType.SPECIAL_CAMPAIGN },
  { value: 'Highlight Campaign', code: CampaignType.HIGHLIGHT_CAMPAIGN },
  {
    value: 'Exclusive Campaign',
    code: CampaignType.HEALTH_EXCLUSIVE_CAMPAIGNCARE,
  },
  { value: 'Happening Campaign', code: CampaignType.HAPPENING_CAMPAIGN },
];

export const conditionOptions: ValueCode[] = [
  { value: 'Is', code: CompareConditionType.Is },
  { value: 'More than', code: CompareConditionType.GREATER_THAN },
];
