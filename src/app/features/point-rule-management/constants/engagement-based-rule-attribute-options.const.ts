import { ValueCode } from '@app/shared/models/value-code.model';

export enum EngagementBasedRuleAttributeCode {
  TaxCertificate = 'TAX_CERTIFICATE',
  Eclaim = 'E_CLAIM',
}

export const engagementBasedRuleAttributeOptions: ValueCode<EngagementBasedRuleAttributeCode>[] =
  [
    {
      value: 'Tax Certificate',
      code: EngagementBasedRuleAttributeCode.TaxCertificate,
    },
    { value: 'E-Claim', code: EngagementBasedRuleAttributeCode.Eclaim },
  ];
