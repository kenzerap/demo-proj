import {
  PromocodeCode,
  PromocodeEarningPoint,
  PromocodeRedeemLimit,
} from './create-edit-promocode-query-params.model';

export interface PromoCode {
  promocode_id: number;
  name: string;
  start_date_time: string;
  end_date_time: string;
  privilege_id: number;
  privilege_name: string;
  earning_point: PromocodeEarningPoint[];
  codes: string[];
  is_point: boolean;
  is_privilege: boolean;
  description: string;
  updated_by: string;
  updated_date: string;
  status: string;
  quota: number;
  redemption: number;
}

export interface PromocodeDetail {
  promocode_id: number;
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
  fraud_condition_point_expire_date: string;
  is_advance_limit: boolean;
  is_advance_reward: boolean;
  redeem_limit: PromocodeRedeemLimit[];
  status: string;
  codes: PromocodeCode[];
  created_by: string;
  privilege_details: {
    privilegeId: number;
    privilegeName: string;
    promoCodeId: number | null;
    promoCodeName: string | null;
    promoCode: string | null;
    codeExpiryDate: string | null;
    privilegeImage: string | null;
    bookingType: string | null;
    redeemType: string | null;
    quota: number;
    endDateTime: string;
    thumbnailImage: string | null;
    description: string | null;
    segmentName: string;
    targetGroupId: number;
  };
}
