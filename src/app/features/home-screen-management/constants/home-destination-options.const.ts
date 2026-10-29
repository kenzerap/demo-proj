import { DestinationCode } from '@app/shared/constants/destination-options.const';
import { ValueCode } from '@app/shared/models/value-code.model';

export const homeDestinationOptions: ValueCode<DestinationCode>[] = [
  { value: 'Privilege', code: DestinationCode.PrivilegeList },
  {
    value: 'Individual Policy Service',
    code: DestinationCode.IndividualPolicyService,
  },
  { value: 'Group Policy Service', code: DestinationCode.GroupPolicyService },
  { value: 'Gen Pay', code: DestinationCode.GenPay },
  { value: 'Claim', code: DestinationCode.Claim },
  { value: 'Tax Certificate', code: DestinationCode.TaxCertificate },
  { value: 'Add Point', code: DestinationCode.AddPoint },
  { value: 'Promo Code', code: DestinationCode.PromoCode },
  { value: 'URL', code: DestinationCode.URL },
];
