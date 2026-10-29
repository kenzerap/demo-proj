import { DeleteStatus } from 'src/app/shared/utils/enums/delete-status.enum';
import { PartyType } from 'src/app/shared/utils/enums/party-type.enum';

export interface CustomerProfile {
  party_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  party_type: PartyType;
  delete_status: DeleteStatus;
  is_fraud: boolean;
  is_blocked: boolean;
  security_no: string;
  created_date: string;
  party_status: string;
}

export interface CustomerProfileDataTable extends CustomerProfile {
  customerStatus: string;
  userType: string;
}
