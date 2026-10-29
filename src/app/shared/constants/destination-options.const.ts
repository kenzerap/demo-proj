import { ValueCode } from '@app/shared/models/value-code.model';

export enum DestinationCode {
  Privilege = 'privilege',
  Home = 'home',
  IndividualPolicyService = 'group_policy',
  GroupPolicyService = 'my_policy',
  GenPay = 'genpay',
  Claim = 'claim',
  TaxCertificate = 'tax_certificate',
  AddPoint = 'add_point',
  PromoCode = 'promocode',
  URL = 'url',
  PrivilegeList = 'privilege_list',
}

export const destinationOptions: ValueCode<DestinationCode>[] = [
  { value: 'Privilege', code: DestinationCode.Privilege },
  { value: 'Home', code: DestinationCode.Home },
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
