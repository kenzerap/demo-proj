import { PolicyTypeCode } from 'src/app/shared/utils/enums/policy-type.enum';

export interface Policy {
  system_id: PolicyTypeCode;
  policy_id: number;
  policy_no: string;
  policy_status: string;
  last_policy_status: string;
  policy_holder: string | null;
  product_name: string | null;
  client_cert_no: string | null;
  insured_name: string;
  premium_amount: number | null;
  sum_insured_amount: number;
  show_payment: boolean;
  paid_to_date: string | null;
  is_dependent?: boolean;
  paid_due_date?: string | null;
}

export interface PolicyDetail {
  policy_id: number;
  policy_no: string;
  product_name: string | null;
  policy_status: string;
  insured_name: string;
  policy_sum_insured_amount: number;
  policy_effect_date: string;
  policy_expired_date: string;
  premium_payment_period: string;
  address: string;
  system: string;
  system_id: PolicyTypeCode;
  client_cert_no: string | null;
  policy_holder: string | null;
  product_type: string;
  policy_payer_name: string;
  premium_amount: number | null;
  premium_term: string;
  billing_frequency_code: string;
  coverage_term: string;
  client_no: string;
}
