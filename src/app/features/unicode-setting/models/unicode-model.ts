import {
  UnicodeCode,
  UnicodeEarningPoint,
  UnicodeRedeemLimit,
} from './create-edit-unicode-query-params.model';

export interface Unicode {
  unicode_id: number;
  name: string;
  start_date_time: string;
  end_date_time: string;
  privilege_id: number;
  privilege_name: string;
  earning_point: {
    point: number;
    expire_date: string;
  }[];
  codes: string[];
  is_point: boolean;
  is_privilege: boolean;
  unicode_description: string;
  updated_by: string;
  updated_date: string;
  status: string;
  quota: number;
  redemption: number;
}

export interface UnicodeDetail {
  unicode_id: number;
  name: string;
  description: string | null;
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
  fraud_condition_point_expire_date: string;
  is_advance_limit: boolean;
  redeem_limit: UnicodeRedeemLimit[];
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
    endDateTime: string | null;
    thumbnailImage: string | null;
    description: string | null;
    segmentName: string;
    targetGroupId: number | null;
  };
}
