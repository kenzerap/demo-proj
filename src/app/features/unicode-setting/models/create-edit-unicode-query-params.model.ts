export interface CreateEditUnicodeQueryParams {
  id: number;
  name: string;
  description: string;
  start_date_time: string;
  end_date_time: string;
  status: boolean;
  is_share_quota_allocation: boolean;
  codes: UnicodeCode[];
  is_privilege: boolean;
  privilege_id: number;
  is_advance_reward: boolean;
  is_point: boolean;
  point_data: UnicodeEarningPoint[];
  is_special_condition_fraud_user: boolean;
  fraud_condition_point: number;
  fraud_condition_point_expire_date: string | null;
  is_advance_limit: boolean;
  redeem_limit: UnicodeRedeemLimit[];
  action_done_by: string;
}

export interface UnicodeEarningPoint {
  tier_id?: number;
  point: number;
  point_expire_date: string | null;
}

export interface UnicodeRedeemLimit {
  tier_id?: number;
  redeem_condition: string;
  redeem_quota: number;
}

export interface UnicodeCode {
  code: string;
  channel: string[];
  status?: string;
  quota: number;
  redeemed_quota: number | null;
  tempId?: string;
}
