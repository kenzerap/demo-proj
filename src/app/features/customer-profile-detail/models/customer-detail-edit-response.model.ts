export interface CustomerDetailEditResponse {
  success: boolean;
  duplicated: boolean;
  dup_mobile_no?: {
    first_name: string;
    last_name: string;
    party_id: string;
  };
  dup_security_no?: {
    first_name: string;
    last_name: string;
    party_id: string;
  };
  dup_email?: {
    first_name: string;
    last_name: string;
    party_id: string;
  };
}
