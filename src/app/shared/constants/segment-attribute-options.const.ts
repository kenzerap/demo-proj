import { ValueCode } from '@app/shared/models/value-code.model';

export enum CustomerSegmentRuleAttribute {
  CUSTOMER_TYPE = 'CUSTOMER_TYPE',
  IS_BLOCK = 'IS_BLOCKED',
  IS_FRAUD = 'IS_FRAUD',
  PRODUCT_TYPE = 'PRODUCT_TYPE',
  CHANNEL_DESC = 'CHANNEL_DESC',
  PREMIUM_AMOUNT = 'PREMIUM_AMOUNT',
  PARTY_ID = 'PARTY_ID',
  PRODUCT_NAME = 'PRODUCT_NAME',
}

export const customerSegmentAttrOptions: ValueCode<CustomerSegmentRuleAttribute>[] =
  [
    {
      value: 'Customer Type',
      code: CustomerSegmentRuleAttribute.CUSTOMER_TYPE,
    },
    { value: 'Is Block', code: CustomerSegmentRuleAttribute.IS_BLOCK },
    { value: 'Is Fraud', code: CustomerSegmentRuleAttribute.IS_FRAUD },
    { value: 'Product Type', code: CustomerSegmentRuleAttribute.PRODUCT_TYPE },
    {
      value: 'Product Channel',
      code: CustomerSegmentRuleAttribute.CHANNEL_DESC,
    },
    { value: 'Party ID', code: CustomerSegmentRuleAttribute.PARTY_ID },
    { value: 'Product Name', code: CustomerSegmentRuleAttribute.PRODUCT_NAME },
  ];
