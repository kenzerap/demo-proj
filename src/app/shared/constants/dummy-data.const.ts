import { PagedPrivilegeSettings } from '@app/features/privilege-setting/models/privilege-setting-model';
import { PagedData } from '../models/paged-data.model';
import { Privilege } from '../models/privilege.model';
import { SegmentGroup } from '../models/segment-group.model';
import { TargetGroup } from '../models/target-group.model';
import { TierGroup } from '../models/tier-group.model';
import { UserPermission } from '../models/user-permission.model';
import { ActionPermissionCode } from '../utils/enums/action-permission-code.enum';
import { FeaturePermissionCode } from '../utils/enums/feature-permission-code.enum';
import { TargetGroupUserCount } from '../models/target-group-user-count.model';
import { ValidateUploadPartyIdResponse } from '@app/features/customer-segmentation/models/validate-upload-party-id-response.model';
import { UploadPartyIdResponse } from '@app/features/customer-segmentation/models/upload-party-id-response.model';
import { DisabledClaimPolicy } from '@app/features/disabled-claim-by-policy-no/models/disabled-claim-policy.model';
import { ExcludePointPolicy } from '@app/features/exclude-point-by-policy-no/models/exclude-point-policy.model';

export const targetGroups: TargetGroup[] = [
  {
    id: 1,
    target_group_name: 'All Users',
    code: 1,
  },
  {
    id: 2,
    target_group_name: 'Insured',
    code: 2,
  },
  {
    id: 3,
    target_group_name: 'Public',
    code: 3,
  },
  {
    id: 4,
    target_group_name: 'Target Group',
    code: 4,
  },
];

export const tierGroups: PagedData<TierGroup> = {
  data: [
    {
      tier_id: 1,
      tier_group_id: 101,
      tier_name_english: 'Gold Tier',
      tier_name_thai: 'ระดับทอง1',
      detail: 'High-value customers',
      status: 'Active',
      color: '#FFD700',
      created_date: '2023-01-01T00:00:00Z',
      updated_date: '2023-01-10T00:00:00Z',
      created_by: 'admin',
      updated_by: 'admin',
      tier_rule_list: [
        {
          tier_rule_id: 1,
          attribute: 'PREMIUM_AMOUNT',
          rule_expression: '>',
          rule_value: '10000',
        },
      ],
    },
    {
      tier_id: 2,
      tier_group_id: 102,
      tier_name_english: 'Silver Tier',
      tier_name_thai: 'ระดับเงิน2',
      detail: 'Mid-value customers',
      status: 'Active',
      color: '#C0C0C0',
      created_date: '2023-01-05T00:00:00Z',
      updated_date: '2023-01-15T00:00:00Z',
      created_by: 'admin',
      updated_by: 'admin',
      tier_rule_list: [
        {
          tier_rule_id: 2,
          attribute: 'PREMIUM_AMOUNT',
          rule_expression: '>',
          rule_value: '5000',
        },
      ],
    },
    {
      tier_id: 3,
      tier_group_id: 103,
      tier_name_english: 'Bronze Tier',
      tier_name_thai: 'ระดับทองแดง',
      detail: 'Low-value customers',
      status: 'Active',
      color: '#CD7F32',
      created_date: '2023-01-10T00:00:00Z',
      updated_date: '2023-01-20T00:00:00Z',
      created_by: 'admin',
      updated_by: 'admin',
      tier_rule_list: [
        {
          tier_rule_id: 3,
          attribute: 'PREMIUM_AMOUNT',
          rule_expression: '<=',
          rule_value: '5000',
        },
      ],
    },
  ],
  pagination: {
    page: 1,
    totalPages: 1,
    totalItems: 2,
    size: 10,
  },
};

export const segmentGroups: PagedData<SegmentGroup> = {
  data: [
    {
      id: 1,
      priority: 1,
      segment_name: 'High Value Customers',
      status: 'ACTIVE',
      created_date: '2023-01-01T00:00:00Z',
      updated_date: '2023-01-10T00:00:00Z',
      segment_users_volume: 100,
      segment_rule_list: [
        {
          segment_rule_id: 1,
          segment_group_id: 1,
          type: 'ROLLING',
          logical_operator: 'AND',
          attribute: 'AGE',
          rule_expression: '>',
          rule_value: '30',
          rule_code: '',
        },
        {
          segment_rule_id: 2,
          segment_group_id: 1,
          type: 'FIXED',
          logical_operator: 'OR',
          attribute: 'INCOME',
          rule_expression: '>=',
          rule_value: '50000',
          rule_code: '',
        },
      ],
    },
    {
      id: 2,
      priority: 2,
      segment_name: 'Young Professionals',
      status: 'INACTIVE',
      created_date: '2023-02-01T00:00:00Z',
      updated_date: '2023-02-10T00:00:00Z',
      segment_users_volume: 100,
      segment_rule_list: [
        {
          segment_rule_id: 3,
          segment_group_id: 2,
          type: 'ROLLING',
          logical_operator: 'AND',
          attribute: 'AGE',
          rule_expression: '<=',
          rule_value: '35',
          rule_code: '',
        },
        {
          segment_rule_id: 4,
          segment_group_id: 2,
          type: 'FIXED',
          logical_operator: 'AND',
          attribute: 'EMPLOYMENT_STATUS',
          rule_expression: '=',
          rule_value: 'EMPLOYED',
          rule_code: '',
        },
      ],
    },
    {
      id: 3,
      priority: 3,
      segment_name: 'High Net Worth Individuals',
      status: 'ACTIVE',
      created_date: '2023-03-01T00:00:00Z',
      updated_date: '2023-03-10T00:00:00Z',
      segment_users_volume: 100,
      segment_rule_list: [
        {
          segment_rule_id: 5,
          segment_group_id: 3,
          type: 'ROLLING',
          logical_operator: 'AND',
          attribute: 'NET_WORTH',
          rule_expression: '>',
          rule_value: '1000000',
          rule_code: '',
        },
      ],
    },
  ],
  pagination: {
    page: 1,
    totalPages: 1,
    totalItems: 2,
    size: 10,
  },
};

export const privileges: Privilege[] = [
  {
    privilegeId: 1,
    privilegeName: 'Discount Voucher',
    promoCodeId: 101,
    promoCodeName: 'DISCOUNT10',
    promoCode: 'DISC10',
    codeExpiryDate: new Date('2023-12-31T23:59:59Z'),
    privilegeImage: 'https://example.com/images/discount-voucher.png',
    bookingType: 'Online',
    redeemType: 'Single Use',
  },
  {
    privilegeId: 2,
    privilegeName: 'Free Shipping',
    promoCodeId: 102,
    promoCodeName: 'FREESHIP',
    promoCode: 'SHIPFREE',
    codeExpiryDate: new Date('2024-01-31T23:59:59Z'),
    privilegeImage: 'https://example.com/images/free-shipping.png',
    bookingType: 'All',
    redeemType: 'Unlimited',
  },
  {
    privilegeId: 3,
    privilegeName: 'Loyalty Points',
    promoCodeId: 103,
    promoCodeName: 'LOYALTY50',
    promoCode: 'LOYAL50',
    codeExpiryDate: new Date('2023-11-30T23:59:59Z'),
    privilegeImage: 'https://example.com/images/loyalty-points.png',
    bookingType: 'In-Store',
    redeemType: 'Multiple Use',
  },
];

export const userPermission: {
  group_name: string;
  permissions: { [key: string]: string[] };
} = {
  group_name: 'Admin as Super user',
  permissions: {
    [FeaturePermissionCode.CustomerProfile]: [ActionPermissionCode.View],
    [FeaturePermissionCode.CustomerTier]: [ActionPermissionCode.View],
    [FeaturePermissionCode.CustomerSegmentation]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.BrandSetting]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.InventorySetting]: [ActionPermissionCode.View],
    [FeaturePermissionCode.PrivilegeSetting]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.PromocodeSetting]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.UnicodeSetting]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.PointRules]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.BannerSetting]: [ActionPermissionCode.View],
    [FeaturePermissionCode.PopupAnnouncementSetting]: [
      ActionPermissionCode.View,
    ],
    [FeaturePermissionCode.PushNotificationSetting]: [
      ActionPermissionCode.View,
    ],
    [FeaturePermissionCode.AccountSetting]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.PrivilegeRedemption]: [ActionPermissionCode.View],
    [FeaturePermissionCode.PointTransactionReport]: [ActionPermissionCode.View],
    [FeaturePermissionCode.PrivilegeUsageReport]: [
      ActionPermissionCode.View,
      ActionPermissionCode.Export,
    ],
    [FeaturePermissionCode.HomeScreenManagement]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.CheckupPackage]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.Hospital]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.PointBulkAction]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.DisabledClaimByPolicyNo]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
    [FeaturePermissionCode.ExcludePointByPolicyNo]: [
      ActionPermissionCode.View,
      ActionPermissionCode.CreateEdit,
    ],
  },
};

export const pagedPrivilegeSettings: PagedPrivilegeSettings = {
  data: [
    {
      privilege_id: 1,
      privilege_name_th: 'สิทธิพิเศษ A',
      privilege_name_en: 'Privilege A',
      segment_name: 'Segment 1',
      brand_name_th: 'แบรนด์ X',
      brand_name_en: 'Brand X',
      quantity: 100,
      redeemed_quantity: 20,
      is_published: true,
      display_order: 1,
    },
    {
      privilege_id: 2,
      privilege_name_th: 'สิทธิพิเศษ B',
      privilege_name_en: 'Privilege B',
      segment_name: 'Segment 2',
      brand_name_th: 'แบรนด์ Y',
      brand_name_en: 'Brand Y',
      quantity: 200,
      redeemed_quantity: 50,
      is_published: false,
      display_order: 2,
    },
    {
      privilege_id: 3,
      privilege_name_th: 'สิทธิพิเศษ C',
      privilege_name_en: 'Privilege C',
      segment_name: 'Segment 1',
      brand_name_th: 'แบรนด์ Z',
      brand_name_en: 'Brand Z',
      quantity: 150,
      redeemed_quantity: 30,
      is_published: true,
      display_order: 3,
    },
  ],
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
  lastDisplayOrder: 0,
  privilegeId: 0,
};

export const pagedTargetGroupUserCount: PagedData<TargetGroupUserCount> = {
  pagination: {
    page: 0,
    size: 20,
    totalItems: 100,
    totalPages: 5,
  },
  data: [
    {
      id: '1',
      target_group_ids: [1],
      name: 'Target Group 1',
      count: 1000,
    },
    {
      id: '2',
      target_group_ids: [2],
      name: 'Target Group 2',
      count: 500,
    },
    {
      id: '3',
      target_group_ids: [3],
      name: 'Target Group 3',
      count: 200,
    },
  ],
};

export const validateUploadPartyIdResponse: ValidateUploadPartyIdResponse = {
  success: true,
  file: {
    file_name: 'party_id_upload_sample.csv',
    volume: 100,
  },
  total_errors: 0,
  errors: [],
};
// {
//   success: true,
//   file: {
//     file_name: 'party_file.csv',
//     volume: 2000,
//   },
//   total_errors: 3,
//   errors: [
//     { type: 'DUPLICATED_DATA', rows: [1, 2, 3] },
//     { type: 'INCORRECT_FORMAT', rows: [1, 2, 3] },
//     { type: 'INVALID_HEADER' },
//   ],
// };

export const uploadSegmentPartyIdResponse: UploadPartyIdResponse = {
  success: true,
  file: {
    id: 1,
    file_name: 'party_id_upload_sample.csv',
    volume: 100,
    status: 'PENDING',
    imported_date: '2026-07-24T08:06:21.856259703Z',
    imported_by: 'nhan.vophamthanh@positivethinking.tech',
    file_url:
      'https://demoproj-web-s3-dev.s3.ap-southeast-1.amazonaws.com/party-id-files/40142a61-1af8-4d23-b1c6-ee5452232678-party_id_upload_sample.csv?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDgaDmFwLXNvdXRoZWFzdC0xIkgwRgIhAI3CAsoVxg38B%2BgE%2F0%2B6FRsSZ%2BKjvgghYgfWs9OzF3yaAiEAoYPZ8Y2XXmN%2BCIFM39AEXnZ2%2BIGYabrgHLNrppC6vpUqgAQIARAEGgw1OTM5NDc0NjQ5NTgiDLDxlldHohck9MV01irdA5aIKZv%2BL%2BrSln6ywAJTDBujbwttk1LmfoB4Osy0a%2B8zY4rVFaC7rilQ9Ce8rCfxjZpTXTuRGgLK3baanghMDxrEfJKrzFqm00dEE387GodyatbdD2Jn%2F6Q%2F1%2FgpkdRYn1ZUhl2aUJCgAmi9RzuVIHi0pghRMs7pfMrZS8ZnN1k8Khy0MXSFr%2F%2FaaJKfIYfe674F4dtqlSv3bFqVv9umueGIFw9iMBQ%2BHn39V2XeXhq43wpRR2BncZ%2FARo1lZJp%2BfKEk8LXjAO0xJSJTcySvK5grxbRrcY3yQe9KgWoesdsWSEC3XShP3O6ywIxQSK9B2vGlLWOj%2Fn1YX2CeGw1EhFrFp651GC91tAOTjT2kFhlhkHuXMJyuS47elHN10kXk5W1meSte4FRLVdPRnOzHV6PRU0c4EEZSiTtsMJ9RX8FhY1e6ujQmNTxJxUKIaWiZ%2FVHmCNBWTG519DEhi9%2FFT6GeVzME0bIPdcPHn3e8cbyIFXFewt9BfMnQKIp%2F6al9RFKg%2B3CjDefWrAa0ziR4VsiJ7WUq2%2BlYkm2%2BPl%2BXTwvdDgsDJLI3zan9hrwxN1LFsYYTQJnIH7gNm7mC8OCnWKpAybHQWlv1X8Kbr1gvhEOXKufAdRltrpPByfeYuTChuIzTBjqkAYMfYlA1zFKJEsJUAmXpDyQMnTmbyRtTDFqu%2BZ2CBSkzVZIER2ej%2FpCKO7u5uPMeegVbcHux8GVxZz9%2FyDoEcokai%2FogzWQ20dbO0CeTvRCj4oZioYcqH%2FXMLIqSthZGxylmsohfSaFAZwxaaLS2B8pDPjiX7A6zrQtIbrDtuv4ck4QqhYPepxy56IS%2BBnpfRF4bMc7BC3wTXyk0LhAHhXJKfACM&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260724T080622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=179&X-Amz-Credential=ASIAYUSQHCT7PGPFD66P%2F20260724%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=63bbe3c9a2f9de3b36dfd5b03c1a1c3002b7046cfbf82d4a8d0fc4ab9e54216a',
  },
}

export const disabledClaimPolicies: PagedData<DisabledClaimPolicy> = {
  pagination: {
    page: 0,
    size: 20,
    totalItems: 5,
    totalPages: 1,
  },
  data: [
    {
      disabled_claim_policy_id: 1,
      policy_no: 'POL-000001',
      product_name: 'Health Shield Plus',
      party_ids: ['1001', '1002', '1003'],
      created_by: 'SYSTEM',
      created_date: '2026-01-15T09:00:00.000Z',
      updated_date: '2026-01-15T09:00:00.000Z',
    },
    {
      disabled_claim_policy_id: 2,
      policy_no: 'POL-000002',
      product_name: 'Life Secure Gold',
      party_ids: ['1002'],
      created_by: 'SYSTEM',
      created_date: '2026-02-10T09:00:00.000Z',
      updated_date: '2026-02-10T09:00:00.000Z',
    },
    {
      disabled_claim_policy_id: 3,
      policy_no: 'POL-000003',
      product_name: 'Family Protector',
      party_ids: ['1003', '1004'],
      created_by: 'SYSTEM',
      created_date: '2026-03-05T09:00:00.000Z',
      updated_date: '2026-03-05T09:00:00.000Z',
    },
    {
      disabled_claim_policy_id: 4,
      policy_no: 'POL-000004',
      product_name: 'Critical Illness Cover',
      party_ids: ['1005'],
      created_by: 'SYSTEM',
      created_date: '2026-04-20T09:00:00.000Z',
      updated_date: '2026-04-20T09:00:00.000Z',
    },
    {
      disabled_claim_policy_id: 5,
      policy_no: 'POL-000005',
      product_name: 'Health Shield Plus',
      party_ids: ['1006'],
      created_by: 'SYSTEM',
      created_date: '2026-05-30T09:00:00.000Z',
      updated_date: '2026-05-30T09:00:00.000Z',
    },
  ],
};

export const excludePointPolicies: PagedData<ExcludePointPolicy> = {
  pagination: {
    page: 0,
    size: 20,
    totalItems: 5,
    totalPages: 1,
  },
  data: [
    {
      excluded_policy_id: 1,
      policy_no: 'POL-000001',
      product_name: 'Health Shield Plus',
      party_ids: ['1001', '1002', '1003'],
      created_by: 'SYSTEM',
      created_date: '2026-01-15T09:00:00.000Z',
      updated_date: '2026-01-15T09:00:00.000Z',
    },
    {
      excluded_policy_id: 2,
      policy_no: 'POL-000002',
      product_name: 'Life Secure Gold',
      party_ids: ['1002'],
      created_by: 'SYSTEM',
      created_date: '2026-02-10T09:00:00.000Z',
      updated_date: '2026-02-10T09:00:00.000Z',
    },
    {
      excluded_policy_id: 3,
      policy_no: 'POL-000003',
      product_name: 'Family Protector',
      party_ids: ['1003', '1004'],
      created_by: 'SYSTEM',
      created_date: '2026-03-05T09:00:00.000Z',
      updated_date: '2026-03-05T09:00:00.000Z',
    },
    {
      excluded_policy_id: 4,
      policy_no: 'POL-000004',
      product_name: 'Critical Illness Cover',
      party_ids: ['1005'],
      created_by: 'SYSTEM',
      created_date: '2026-04-20T09:00:00.000Z',
      updated_date: '2026-04-20T09:00:00.000Z',
    },
    {
      excluded_policy_id: 5,
      policy_no: 'POL-000005',
      product_name: 'Health Shield Plus',
      party_ids: ['1006'],
      created_by: 'SYSTEM',
      created_date: '2026-05-30T09:00:00.000Z',
      updated_date: '2026-05-30T09:00:00.000Z',
    },
  ],
};
