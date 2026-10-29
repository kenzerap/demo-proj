import { SidebarItem } from '../models/sidebar-item.model';
import { ActionPermissionCode } from '../utils/enums/action-permission-code.enum';
import { FeaturePermissionCode } from '../utils/enums/feature-permission-code.enum';

export const sidebarItemsMenu: SidebarItem[] = [
  {
    title: 'User Management',
    code: 'user-management',
    iconImg: 'users.svg',
    permissions: [
      {
        feature: FeaturePermissionCode.CustomerProfile,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.CustomerProfile,
        action: ActionPermissionCode.ViewWithMasking,
      },
      {
        feature: FeaturePermissionCode.CustomerSegmentation,
        action: ActionPermissionCode.View,
      },
    ],
    childrens: [
      {
        title: 'Customer Profile',
        code: 'customer-profile',
        permissions: [
          {
            feature: FeaturePermissionCode.CustomerProfile,
            action: ActionPermissionCode.View,
          },
          {
            feature: FeaturePermissionCode.CustomerProfile,
            action: ActionPermissionCode.ViewWithMasking,
          },
        ],
      },
      {
        title: 'Customer Segmentation',
        code: 'customer-segmentation',
        permissions: [
          {
            feature: FeaturePermissionCode.CustomerSegmentation,
            action: ActionPermissionCode.View,
          },
        ],
      },
      // {
      //   title: 'Report',
      //   code: 'report',
      // },
    ],
  },
  {
    title: 'Privilege Management',
    code: 'privilege-management',
    iconImg: '3d.svg',
    permissions: [
      {
        feature: FeaturePermissionCode.BrandSetting,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.InventorySetting,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.PrivilegeSetting,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.PromocodeSetting,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.UnicodeSetting,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.ManualCodeRedemption,
        action: ActionPermissionCode.View,
      },
    ],
    childrens: [
      {
        title: 'Brand Setting',
        code: 'brand-setting',
        permissions: [
          {
            feature: FeaturePermissionCode.BrandSetting,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Inventory Setting',
        code: 'inventory-setting',
        permissions: [
          {
            feature: FeaturePermissionCode.InventorySetting,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Privilege Setting',
        code: 'privilege-setting',
        permissions: [
          {
            feature: FeaturePermissionCode.PrivilegeSetting,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Promocode Setting',
        code: 'promocode-setting',
        permissions: [
          {
            feature: FeaturePermissionCode.PromocodeSetting,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Unicode Setting',
        code: 'unicode-setting',
        permissions: [
          {
            feature: FeaturePermissionCode.UnicodeSetting,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Manual Code Redemption',
        code: 'manual-code-redemption',
        permissions: [
          {
            feature: FeaturePermissionCode.ManualCodeRedemption,
            action: ActionPermissionCode.View,
          },
        ],
      },
    ],
  },
  {
    title: 'Point Management',
    code: 'point-management',
    iconImg: 'ticket.svg',
    permissions: [
      {
        feature: FeaturePermissionCode.PointRules,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.PointBulkAction,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.DisabledClaimByPolicyNo,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.ExcludePointByPolicyNo,
        action: ActionPermissionCode.View,
      },
    ],
    childrens: [
      {
        title: 'Point Rule Management',
        code: 'point-rule-management',
        permissions: [
          {
            feature: FeaturePermissionCode.PointRules,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Add Point in bulk action',
        code: 'point-bulk-action',
        permissions: [
          {
            feature: FeaturePermissionCode.PointBulkAction,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Disable Claim by Policy no.',
        code: 'disabled-claim-by-policy-no',
        permissions: [
          {
            feature: FeaturePermissionCode.DisabledClaimByPolicyNo,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Exclude Point by Policy no.',
        code: 'exclude-point-by-policy-no',
        permissions: [
          {
            feature: FeaturePermissionCode.ExcludePointByPolicyNo,
            action: ActionPermissionCode.View,
          },
        ],
      },
    ],
  },
  {
    title: 'Application Management',
    code: 'application-management',
    iconImg: 'data.svg',
    permissions: [
      {
        feature: FeaturePermissionCode.BannerSetting,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.PopupAnnouncementSetting,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.PushNotificationSetting,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.HomeScreenManagement,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.SplashScreenManagement,
        action: ActionPermissionCode.View,
      },
    ],
    childrens: [
      {
        title: 'Banner Setting',
        code: 'banner-setting',
        permissions: [
          {
            feature: FeaturePermissionCode.BannerSetting,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Popup Announcement Setting',
        code: 'popup-announcement-setting',
        permissions: [
          {
            feature: FeaturePermissionCode.PopupAnnouncementSetting,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Push Notification Setting',
        code: 'push-notification-setting',
        permissions: [
          {
            feature: FeaturePermissionCode.PushNotificationSetting,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Home Screen Management',
        code: 'home-screen-management',
        permissions: [
          {
            feature: FeaturePermissionCode.HomeScreenManagement,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Splash Screen Management',
        code: 'splash-screen-management',
        permissions: [
          {
            feature: FeaturePermissionCode.SplashScreenManagement,
            action: ActionPermissionCode.View,
          },
        ],
      },
      // {
      //   title: 'In-App Message Setting',
      //   code: 'in-app-message-setting',
      // },
      // {
      //   title: 'Frame Setting',
      //   code: 'frame-setting',
      // },
    ],
  },
  {
    title: 'Master Data Management',
    code: 'master-data-management',
    iconImg: 'grid.svg',
    permissions: [
      {
        feature: FeaturePermissionCode.CheckupPackage,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.Hospital,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.FundType,
        action: ActionPermissionCode.View,
      },
    ],
    childrens: [
      {
        title: 'Checkup Package',
        code: 'checkup-package',
        permissions: [
          {
            feature: FeaturePermissionCode.CheckupPackage,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Hospital',
        code: 'hospital',
        permissions: [
          {
            feature: FeaturePermissionCode.Hospital,
            action: ActionPermissionCode.View,
          },
        ],
      },
      {
        title: 'Fund Type',
        code: 'fund-type',
        permissions: [
          {
            feature: FeaturePermissionCode.FundType,
            action: ActionPermissionCode.View,
          },
        ],
      },
    ],
  },
  {
    title: 'Permission Management',
    code: 'permission-management',
    iconImg: 'hexagonal-user.svg',
    permissions: [
      {
        feature: FeaturePermissionCode.AccountSetting,
        action: ActionPermissionCode.View,
      },
    ],
    childrens: [
      // {
      //   title: 'Group Role Setting',
      //   code: 'group-role-setting',
      // },
      {
        title: 'Account Setting',
        code: 'account-setting',
        permissions: [
          {
            feature: FeaturePermissionCode.AccountSetting,
            action: ActionPermissionCode.View,
          },
        ],
      },
    ],
  },
];
