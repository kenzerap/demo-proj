export interface CreateEditPromocodesQueryParams {
  id: number;
  name: string;
  code: string;
  start_date_time: string;
  end_date_time: string;
  is_share_quota_allocation: boolean;
  privilege_id: number;
  is_point: boolean;
  is_privilege: boolean;
  description: string;
  earning_point: PromocodeEarningPoint[];
  is_special_condition_fraud_user: boolean;
  fraud_condition_point: number;
  fraud_condition_point_expire_date: string | null;
  is_advance_limit: boolean;
  is_advance_reward: boolean;
  redeem_limit: PromocodeRedeemLimit[];
  status: string;
  codes: PromocodeCode[];
  created_by: string;
  updated_by: string;
}

export interface PromocodeEarningPoint {
  point: number;
  expire_date: string | null;
}

export interface PromocodeRedeemLimit {
  redeem_condition: string;
  redeem_quota: number;
  redeem_limit_id?: number | null;
  tier_id?: number | null;
}

export interface PromocodeCode {
  code: string;
  channel: string[];
  quota: number;
  status?: string | null;
  redeemed_quota: number | null;
  tempId?: string;
}
