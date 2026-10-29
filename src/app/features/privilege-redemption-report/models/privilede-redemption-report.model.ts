export interface PrivilegeRedemptionReport {
  party_id: number;
  redeemtion_date_time: string;
  national_id: string;
  first_name: string;
  last_name: string;
  client_full_name: string;
  mobile_no: string;
  email: string;
  registration_address: {
    address: string;
    postcode: string;
    province: string;
    district: string;
    sub_district: string;
  };
  delivery_address: {
    address: string;
    postcode: string;
    province: string;
    district: string;
    sub_district: string;
  };
  policy_no: string[];
  privilege_id: number;
  privilege_name: string;
  privilege_type: string;
  redeemed_by: string;
  redeemed_point: number;
  promocode_code: string;
  package_name: string;
  hospital_name: string;
  rh_full_name: string;
  unicode_code: string;
  rh_month: number;
  rh_year: number;
}

export interface PrivilegeRedemptionReportFormatted
  extends Omit<
    PrivilegeRedemptionReport,
    'formatted_registration_address' | 'formatted_delivery_address'
  > {
  formatted_registration_address: string;
  formatted_delivery_address: string;
  policy_no_format: string;
}
