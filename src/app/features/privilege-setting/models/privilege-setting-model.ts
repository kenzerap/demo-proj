import { PagedData } from '@app/shared/models/paged-data.model';
import { PrivilegeTypeEnum } from '../../../shared/utils/enums/privilege-type.enums';
import { CampaignType } from '../../../shared/utils/enums/campaign-type.enums';
import { RedeemLimitCondition } from '../../../shared/utils/enums/redeem-limit-condition.enums';
import { Inventory } from '@app/shared/models/inventory-model';

export interface PrivilegeSetting {
  privilege_id: number;
  privilege_name_th: string;
  privilege_name_en: string;
  segment_name: string;
  brand_name_th: string;
  brand_name_en: string;
  quantity: number;
  redeemed_quantity: number;
  is_published: boolean;
  display_order: number;
}

export interface PagedPrivilegeSettings extends PagedData<PrivilegeSetting> {
  privilegeId: number;
  lastDisplayOrder: number;
}

export interface PrivilegeSettingTable extends PrivilegeSetting {
  targetGroupName: string;
}

export interface PrivilegeDetail {
  id: number;
  name_th: string;
  name_en: string;
  message_body_th: string;
  message_body_en: string;
  privilege_type: PrivilegeTypeEnum;
  campaign_type: CampaignType;
  brand_id: number;
  website: string;
  telephone: string;
  target_group_id: number;
  thumbnail_image: string;
  thumbnail_name_image: string;
  privilege_detail_image: string;
  detail_name_image: string;
  code_is_out: boolean;
  booking_url: string;
  tier_list: {
    id: number;
    is_included: boolean;
    name: string;
  }[];
  segment_list: {
    id: number;
    is_included: boolean;
    name: string;
  }[];
  active_end_date_time: string;
  active_start_date_time: string;
  visible_end_date_time: string;
  visible_start_date_time: string;
  inventory: {
    inventory_id: number;
    quantity: number;
    invalid: boolean;
    inventory_details: Inventory;
  };
  redeem: RedeemDetail;
  discount: DiscountDetail;
  redeem_limit: RedeemLimitDetail;
  health_care_package_ids: number[];
  is_published: boolean;
  is_visible: boolean;
}

export interface RedeemDetail {
  redeem_id: number;
  value: string;
  unit: string;
  advance_items: {
    redeem_id: number;
    redeem_value: number;
    tier_id: number;
    redeem_unit: string;
  }[];
  is_only_promotion_or_unicode: boolean;
  is_advance: boolean;
}

export interface DiscountDetail {
  discount_id: number;
  value: string;
  unit: string;
  advance_items: Array<{
    discount_id: number;
    discount_value: number;
    tier_id: number;
    discount_unit: string;
    discount_condition: string;
  }>;
  is_advance: boolean;
}

export interface RedeemLimitDetail {
  redeem_limit_id: number;
  condition: RedeemLimitCondition;
  quota: number;
  advance_items: {
    redeem_limit_id: number;
    redeem_quota: number;
    tier_id: number;
    redeem_condition: string;
  }[];
  is_advance: boolean;
}
