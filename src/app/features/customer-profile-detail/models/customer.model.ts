import { DeleteStatus } from 'src/app/shared/utils/enums/delete-status.enum';
import { PartyStatus } from 'src/app/shared/utils/enums/party-status.enum';

export interface District {
  district: string;
  district_en: string;
  district_th: string;
}

export interface SubDistrict {
  sub_district: string;
  sub_district_en: string;
  sub_district_th: string;
}

export interface Province {
  province: string;
  province_en: string;
  province_th: string;
}

export interface PostcodeInfo {
  postcode_id: number;
  postcode: number;
}

export interface Customer {
  party_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  delete_status: DeleteStatus;
  is_fraud: boolean;
  is_blocked: boolean;
  security_no: string;
  created_date: string;
  total_points: number;
  party_status: PartyStatus;
  districtId: number;
  subDistrictId: number;
  provinceId: number;
  postcode: number;
  address: string;
  full_address: string;
  avatar: string;
  updated_by: string;
  updated_date: string;
  line: string;
  facebook: string;
  terms_conditions_id: string;
  accepted_terms_conditions_date: string;
  marketing_id: string;
  accepted_marketing_date: string;
  pin_updated_date: string;
  pin_last_entered_date: string;
  birth_date: string;
  district: District;
  sub_district: SubDistrict;
  province: Province;
  postcode_info: PostcodeInfo;
  security_type: string;
  last_updated_by: string;
}
