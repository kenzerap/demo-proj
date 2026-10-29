import { PolicyTypeCode } from 'src/app/shared/utils/enums/policy-type.enum';

export interface Claim {
  claim_id: number;
  claim_no: string;
  claim_status_code: string;
  demoproj365_claim_status: string;
  report_date: string;
  hospital_name: string;
  incurred_amount: number;
  paid_amount: number;
  benefit_no_of_day: number;
  client_no: string;
  system_id: PolicyTypeCode;
  client_cert_no: string;
  renew_no: number;
  plan_code: string;
  benefit_code: string;
  policy_no: string;
  received_date: string;
  payee_name: string;
  claim_type_code: string;
  approve_paid_date: string;
  insured_name: string;
  occurred_date: string;
}
