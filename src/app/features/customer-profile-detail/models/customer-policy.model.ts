import { CustomerType } from 'src/app/shared/utils/enums/customer-type.enum';
import { PolicyType } from 'src/app/shared/utils/enums/policy-type.enum';
import { Policy } from './policy.model';

export interface CustomerPolicy {
  customer_type: CustomerType;
  policy_types: PolicyType[];
  individual_cnt: number;
  group_cnt: number;
  all_policies_output: {
    owner_policies: Policy[];
    family_policies: Policy[];
  };
}
