export interface CreateEditPrivilegesQueryParams {
  id: number;
  name_th: string;
  name_en: string;
  message_body_th: string;
  message_body_en: string;
  privilege_type: string;
  campaign_type: string;
  brand_id: number;
  website: string;
  telephone: string;
  target_group_id: number;
  booking_url: string;

  is_code_out: boolean;
  tier_list: {
    id: number;
    is_included: boolean;
  }[];
  segment_list: {
    id: number;
    is_included: boolean;
  }[];
  created_by: string;
  updated_by: string;
  is_published: boolean;
  is_visible: boolean;
  active_end_date_time: string;
  active_start_date_time: string;
  visible_end_date_time: string;
  visible_start_date_time: string;
  inventory: {
    inventory_id: number;
    quantity: number;
  };
  redeem: RedeemPriviledge;
  redeem_limit: RedeemLimitPriviledge;
  discount: DiscountPriviledge;
  health_care_package_ids: number[];
}

export interface RedeemPriviledge {
  value: string;
  unit: string;
  is_only_promotion_or_unicode: boolean;
  is_advance: boolean;
  advance_items: {
    redeem_value: string;
    redeem_unit: string;
  }[];
}

export interface RedeemLimitPriviledge {
  quota: number;
  is_advance: boolean;
  condition: string;
  advance_items: {
    redeem_quota: number;
    redeem_condition: string;
  }[];
}

export interface DiscountPriviledge {
  value: string;
  unit: string;
  is_advance: boolean;
  advance_items: {
    discount_value: string;
    discount_unit: string;
    tier_id: number;
  }[];
}
