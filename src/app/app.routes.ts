import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UnsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { AuthorizeGuard } from './core/guards/authorize.guard';
import { InventoryTabCode } from './features/inventory-setting/constants/inventory-tabs.const';
import { PointRuleTabCode } from './features/point-rule-management/constants/point-rule-tabs.const';
import { HasPermissionsGuard } from './core/guards/has-permissions.guard';
import { FeaturePermissionCode } from './shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from './shared/utils/enums/action-permission-code.enum';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthorizeGuard],
    children: [
      {
        path: 'user-management',
        children: [
          {
            path: 'customer-profile',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './features/customer-profile/components/customer-profile-list/customer-profile-list.component'
                  ).then((m) => m.CustomerProfileListComponent),
                data: {
                  breadcrumb: {
                    title: 'Customer Profile',
                    subTitle: 'Customer Profile dashboard',
                  },
                  hasPermissions: [
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
                canActivate: [HasPermissionsGuard],
              },
              {
                path: ':party_id',
                loadComponent: () =>
                  import(
                    './features/customer-profile-detail/components/customer-profile-detail-layout/customer-profile-detail-layout.component'
                  ).then((m) => m.CustomerProfileDetailLayoutComponent),
                data: {
                  breadcrumb: {
                    title: 'User Management',
                    url: 'user-management/customer-profile',
                  },
                  hasPermissions: [
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
                canActivate: [HasPermissionsGuard],
                children: [
                  {
                    path: 'overview',
                    loadComponent: () =>
                      import(
                        './features/customer-profile-detail/components/detail-overview/detail-overview.component'
                      ).then((m) => m.DetailOverviewComponent),
                    data: {
                      breadcrumb: {
                        title: 'Customers Profile',
                      },
                      unsaveChangeKey: 'customerDetail',
                      hasPermissions: [
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
                    canActivate: [HasPermissionsGuard],
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: 'point-history',
                    loadComponent: () =>
                      import(
                        './features/customer-profile-detail/components/point-history/point-history.component'
                      ).then((m) => m.PointHistoryComponent),
                    data: {
                      breadcrumb: {
                        title: 'Customers Profile',
                      },
                      hasPermissions: [
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
                    canActivate: [HasPermissionsGuard],
                    children: [
                      {
                        path: 'history',
                        loadComponent: () =>
                          import(
                            './features/customer-profile-detail/components/point-history-list/point-history-list.component'
                          ).then((m) => m.PointHistoryListComponent),
                        data: {
                          hasPermissions: [
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
                        canActivate: [HasPermissionsGuard],
                      },
                      {
                        path: 'expire',
                        loadComponent: () =>
                          import(
                            './features/customer-profile-detail/components/point-expire-list/point-expire-list.component'
                          ).then((m) => m.PointExpireListComponent),
                        data: {
                          hasPermissions: [
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
                        canActivate: [HasPermissionsGuard],
                      },
                      {
                        path: '',
                        redirectTo: 'history',
                        pathMatch: 'full',
                      },
                    ],
                  },
                  {
                    path: 'redeem-history',
                    loadComponent: () =>
                      import(
                        './features/customer-profile-detail/components/redeem-history/redeem-history.component'
                      ).then((m) => m.RedeemHistoryComponent),
                    data: {
                      breadcrumb: {
                        title: 'Redeem History',
                      },
                      hasPermissions: [
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
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: 'privilege-engagement',
                    loadComponent: () =>
                      import(
                        './features/customer-profile-detail/components/privilege-engagement/privilege-engagement.component'
                      ).then((m) => m.PrivilegeEngagementComponent),
                    data: {
                      breadcrumb: {
                        title: 'Customers Profile',
                      },
                      hasPermissions: [
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
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: 'otp-history',
                    loadComponent: () =>
                      import(
                        './features/customer-profile-detail/components/otp-history/otp-history.component'
                      ).then((m) => m.OtpHistoryComponent),
                    data: {
                      breadcrumb: {
                        title: 'Customers Profile',
                      },
                      hasPermissions: [
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
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: '',
                    redirectTo: 'overview',
                    pathMatch: 'full',
                  },
                ],
              },
            ],
          },
          {
            path: 'customer-segmentation',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/customer-segmentation/components/customer-segmentation-list/customer-segmentation-list.component'
                  ).then((m) => m.CustomerSegmentationListComponent),
                data: {
                  breadcrumb: {
                    title: 'Customer Segmentation',
                    subTitle: 'Customer Segmentation Information',
                  },
                  unsaveChangeKey: 'orderCustomerSegmentationList',
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.CustomerSegmentation,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canDeactivate: [UnsavedChangesGuard],
                canActivate: [HasPermissionsGuard],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'Customer Segmentation',
                    url: 'user-management/customer-segmentation',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.CustomerSegmentation,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/customer-segmentation/components/create-edit-customer-segmentation/create-edit-customer-segmentation.component'
                      ).then((m) => m.CreateEditCustomerSegmentationComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Customer Segmentation',
                      },
                      unsaveChangeKey: 'createCustomerSegmentation',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':id/view-edit',
                    loadComponent: () =>
                      import(
                        './features/customer-segmentation/components/create-edit-customer-segmentation/create-edit-customer-segmentation.component'
                      ).then((m) => m.CreateEditCustomerSegmentationComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Customer Segmentation',
                      },
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
                canActivateChild: [HasPermissionsGuard],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
      {
        path: 'application-management',
        children: [
          {
            path: 'push-notification-setting',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './features/push-notification-setting/components/notifications-layout/notifications-layout.component'
                  ).then((m) => m.NotificationsLayoutComponent),
                data: {
                  breadcrumb: {
                    title: 'Push Notification Setting',
                    subTitle: 'All Push Notification Information',
                  },
                },
                children: [
                  {
                    path: 'scheduled',
                    loadComponent: () =>
                      import(
                        './features/push-notification-setting/components/scheduled-list/scheduled-list.component'
                      ).then((m) => m.ScheduledListComponent),
                    data: {
                      hasPermissions: [
                        {
                          feature:
                            FeaturePermissionCode.PushNotificationSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: 'trigger-event-based',
                    loadComponent: () =>
                      import(
                        './features/push-notification-setting/components/trigger-event-based-list/trigger-event-based-list.component'
                      ).then((m) => m.TriggerEventBasedListComponent),
                    data: {
                      hasPermissions: [
                        {
                          feature:
                            FeaturePermissionCode.PushNotificationSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: 'sent',
                    loadComponent: () =>
                      import(
                        './features/push-notification-setting/components/sent-list/sent-list.component'
                      ).then((m) => m.SentListComponent),
                    data: {
                      hasPermissions: [
                        {
                          feature:
                            FeaturePermissionCode.PushNotificationSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: '',
                    redirectTo: 'scheduled',
                    pathMatch: 'full',
                  },
                ],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'Push Notification Setting',
                    url: 'application-management/push-notification-setting',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.PushNotificationSetting,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/push-notification-setting/components/create-edit-push-notification/create-edit-push-notification.component'
                      ).then((m) => m.CreateEditPushNotificationComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Notification Setting',
                      },
                      unsaveChangeKey: 'createNotificationSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':notification_id/view-edit',
                    loadComponent: () =>
                      import(
                        './features/push-notification-setting/components/create-edit-push-notification/create-edit-push-notification.component'
                      ).then((m) => m.CreateEditPushNotificationComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Notification Setting',
                      },
                      unsaveChangeKey: 'createNotificationSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
            ],
          },
          {
            path: 'popup-announcement-setting',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/popup-announcement-setting/components/popup-announcement-layout/popup-announcement-layout.component'
                  ).then((m) => m.PopupAnnouncementLayoutComponent),
                data: {
                  unsaveChangeKey: 'orderPopupAnnouncementLayout',
                },
                canDeactivate: [UnsavedChangesGuard],
                children: [
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './features/popup-announcement-setting/components/popup-announcement-list/popup-announcement-list.component'
                      ).then((m) => m.PopupAnnouncementListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Popup Announcement Setting',
                        subTitle: 'All Popup Announcement Information',
                      },
                      hasPermissions: [
                        {
                          feature:
                            FeaturePermissionCode.PopupAnnouncementSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: ':tabId',
                    loadComponent: () =>
                      import(
                        './features/popup-announcement-setting/components/popup-announcement-list/popup-announcement-list.component'
                      ).then((m) => m.PopupAnnouncementListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Popup Announcement Setting',
                        subTitle: 'All Popup Announcement Information',
                      },
                      hasPermissions: [
                        {
                          feature:
                            FeaturePermissionCode.PopupAnnouncementSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                ],
              },
              {
                path: 'form-announcement',
                data: {
                  breadcrumb: {
                    title: 'Popup Announcement Setting',
                    url: 'application-management/popup-announcement-setting',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.PopupAnnouncementSetting,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/popup-announcement-setting/components/create-edit-popup-announcement/create-edit-popup-announcement.component'
                      ).then((m) => m.CreateEditPopupAnnouncementComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Popup Announcement',
                      },
                      unsaveChangeKey: 'createPopupAnnouncementSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':popupAnnouncementId/view-edit',
                    loadComponent: () =>
                      import(
                        './features/popup-announcement-setting/components/create-edit-popup-announcement/create-edit-popup-announcement.component'
                      ).then((m) => m.CreateEditPopupAnnouncementComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Notification Setting',
                      },
                      unsaveChangeKey: 'createPopupAnnouncementSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'banner-setting',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/banner-setting/components/banner-setting-layout/banner-setting-layout.component'
                  ).then((m) => m.BannerSettingLayoutComponent),
                data: {
                  unsaveChangeKey: 'orderBannerSettingLayout',
                },
                canDeactivate: [UnsavedChangesGuard],
                children: [
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './features/banner-setting/components/banner-setting-list/banner-setting-list.component'
                      ).then((m) => m.BannerSettingListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Banner Setting',
                        subTitle: 'All Banner Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.BannerSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: ':tabId',
                    loadComponent: () =>
                      import(
                        './features/banner-setting/components/banner-setting-list/banner-setting-list.component'
                      ).then((m) => m.BannerSettingListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Banner Setting',
                        subTitle: 'All Banner Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.BannerSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                ],
              },
              {
                path: 'form-banner',
                data: {
                  breadcrumb: {
                    title: 'Banner Setting',
                    url: 'application-management/banner-setting',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.BannerSetting,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/banner-setting/components/create-edit-banner-setting/create-edit-banner-setting.component'
                      ).then((m) => m.CreateEditBannerSettingComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Banner',
                      },
                      unsaveChangeKey: 'createBannerSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':bannerSettingId/view-edit',
                    loadComponent: () =>
                      import(
                        './features/banner-setting/components/create-edit-banner-setting/create-edit-banner-setting.component'
                      ).then((m) => m.CreateEditBannerSettingComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Banner',
                      },
                      unsaveChangeKey: 'createBannerSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'home-screen-management',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/home-screen-management/components/home-screen-management-list/home-screen-management-list.component'
                  ).then((m) => m.HomeScreenManagementListComponent),
                data: {
                  breadcrumb: {
                    title: 'Home Screen Management',
                    subTitle: 'DEMOPROJ365 Home Screen Management',
                  },
                  unsaveChangeKey: 'orderHomeScreenManagementList',
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.HomeScreenManagement,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
                canDeactivate: [UnsavedChangesGuard],
              },
              {
                path: 'form-home',
                data: {
                  breadcrumb: {
                    title: 'Home Screen Management',
                    url: 'application-management/home-screen-management',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.HomeScreenManagement,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/home-screen-management/components/create-edit-home-screen/create-edit-home-screen.component'
                      ).then((m) => m.CreateEditHomeScreenComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Section',
                      },
                      unsaveChangeKey: 'createHomeScreen',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':homeScreenId/view-edit',
                    loadComponent: () =>
                      import(
                        './features/home-screen-management/components/create-edit-home-screen/create-edit-home-screen.component'
                      ).then((m) => m.CreateEditHomeScreenComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Section',
                      },
                      unsaveChangeKey: 'createHomeScreen',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'splash-screen-management',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/splash-screen-management/components/splash-screen-management-list/splash-screen-management-list.component'
                  ).then((m) => m.SplashScreenManagementListComponent),
                data: {
                  breadcrumb: {
                    title: 'Splash Screen Management',
                    subTitle: 'All splash screen information',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.SplashScreenManagement,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'Splash Screen Management',
                    url: 'application-management/splash-screen-management',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.SplashScreenManagement,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/splash-screen-management/components/create-edit-splash-screen/create-edit-splash-screen.component'
                      ).then((m) => m.CreateEditSplashScreenComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Splash Screen',
                      },
                      unsaveChangeKey: 'createSplashScreenManagement',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':splashScreenId/view-edit',
                    loadComponent: () =>
                      import(
                        './features/splash-screen-management/components/create-edit-splash-screen/create-edit-splash-screen.component'
                      ).then((m) => m.CreateEditSplashScreenComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Splash Screen',
                      },
                      unsaveChangeKey: 'createSplashScreenManagement',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
      {
        path: 'master-data-management',
        children: [
          {
            path: 'checkup-package',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/checkup-package/components/checkup-package-list/checkup-package-list.component'
                  ).then((m) => m.CheckupPackageListComponent),
                data: {
                  breadcrumb: {
                    title: 'Checkup Package',
                    subTitle: 'All checkup package master data list',
                  },
                  unsaveChangeKey: 'orderCheckupPackageList',
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.CheckupPackage,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
                canDeactivate: [UnsavedChangesGuard],
              },
              {
                path: 'form-checkup-package',
                data: {
                  breadcrumb: {
                    title: 'Checkup Package',
                    url: 'master-data-management/checkup-package',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.CheckupPackage,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/checkup-package/components/create-edit-checkup-package/create-edit-checkup-package.component'
                      ).then((m) => m.CreateEditCheckupPackageomponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Package',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.CheckupPackage,
                          action: ActionPermissionCode.CreateEdit,
                        },
                      ],
                      unsaveChangeKey: 'createCheckupPackage',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':checkupPackageId/view-edit',
                    loadComponent: () =>
                      import(
                        './features/checkup-package/components/create-edit-checkup-package/create-edit-checkup-package.component'
                      ).then((m) => m.CreateEditCheckupPackageomponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Package',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.CheckupPackage,
                          action: ActionPermissionCode.View,
                        },
                      ],
                      unsaveChangeKey: 'createCheckupPackage',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'hospital',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/hospital/components/hospital-list/hospital-list.component'
                  ).then((m) => m.HospitalListComponent),
                data: {
                  breadcrumb: {
                    title: 'Hospital',
                    subTitle: 'All hospital master data list',
                  },
                  unsaveChangeKey: 'orderHospitalList',
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.Hospital,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
                canDeactivate: [UnsavedChangesGuard],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'Hospital',
                    url: 'master-data-management/hospital',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.Hospital,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/hospital/components/create-edit-hospital/create-edit-hospital.component'
                      ).then((m) => m.CreateEditHospitalComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Hospital',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.Hospital,
                          action: ActionPermissionCode.CreateEdit,
                        },
                      ],
                      unsaveChangeKey: 'createHospital',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':hospitalId/view-edit',
                    loadComponent: () =>
                      import(
                        './features/hospital/components/create-edit-hospital/create-edit-hospital.component'
                      ).then((m) => m.CreateEditHospitalComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Hospital',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.Hospital,
                          action: ActionPermissionCode.View,
                        },
                      ],
                      unsaveChangeKey: 'createHospital',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'fund-type',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/fund-type/components/fund-type-list/fund-type-list.component'
                  ).then((m) => m.FundTypeListComponent),
                data: {
                  breadcrumb: {
                    title: 'Fund Type',
                    subTitle: 'All Fund Type Information',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.FundType,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'Fund Type',
                    url: 'master-data-management/fund-type',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.FundType,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/fund-type/components/create-edit-fund-type/create-edit-fund-type.component'
                      ).then((m) => m.CreateEditFundTypeComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Fund Type',
                      },
                      unsaveChangeKey: 'createFundType',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':fundId/view-edit',
                    loadComponent: () =>
                      import(
                        './features/fund-type/components/create-edit-fund-type/create-edit-fund-type.component'
                      ).then((m) => m.CreateEditFundTypeComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Fund Type',
                      },
                      unsaveChangeKey: 'createFundType',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
      {
        path: 'permission-management',
        children: [
          {
            path: 'account-setting',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/account-setting/components/account-setting-list/account-setting-list.component'
                  ).then((m) => m.AccountSettingListComponent),
                data: {
                  breadcrumb: {
                    title: 'Account Setting',
                    subTitle: 'All Account Setting',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.AccountSetting,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
      {
        path: 'privilege-management',
        children: [
          {
            path: 'brand-setting',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/brand-setting/components/brand-list/brand-list.component'
                  ).then((m) => m.BrandListComponent),
                data: {
                  breadcrumb: {
                    title: 'Brand Profile',
                    subTitle: 'All Brand Profile Information',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.BrandSetting,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'All Brand Profile Information',
                    url: 'privilege-management/brand-setting',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.BrandSetting,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/brand-setting/components/create-edit-brand/create-edit-brand.component'
                      ).then((m) => m.CreateEditBrandComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Profile Brand',
                      },
                      unsaveChangeKey: 'createBrandSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':brandId/view-edit',
                    loadComponent: () =>
                      import(
                        './features/brand-setting/components/create-edit-brand/create-edit-brand.component'
                      ).then((m) => m.CreateEditBrandComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Profile Brand',
                      },
                      unsaveChangeKey: 'createBrandSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'inventory-setting',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/inventory-setting/components/inventory-layout/inventory-layout.component'
                  ).then((m) => m.InventoryLayoutComponent),
                children: [
                  {
                    path: InventoryTabCode.UPLOAD_CODE,
                    loadComponent: () =>
                      import(
                        './features/inventory-setting/components/inventory-list/inventory-list.component'
                      ).then((m) => m.InventoryListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Inventory Management',
                        subTitle: 'All Inventory Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.InventorySetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  /* {
                    path: InventoryTabCode.GENERIC_CODE,
                    loadComponent: () =>
                      import('./shared/components/empty/empty.component').then(
                        (m) => m.EmptyComponent
                      ),
                    data: {
                      breadcrumb: {
                        title: 'Inventory Management',
                        subTitle: 'All Inventory Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.InventorySetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: InventoryTabCode.PREFIX_CODE,
                    loadComponent: () =>
                      import('./shared/components/empty/empty.component').then(
                        (m) => m.EmptyComponent
                      ),
                    data: {
                      breadcrumb: {
                        title: 'Inventory Management',
                        subTitle: 'All Inventory Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.InventorySetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  }, */
                  {
                    path: InventoryTabCode.PRODUCT,
                    loadComponent: () =>
                      import(
                        './features/inventory-setting/components/inventory-list-product/inventory-list-product.component'
                      ).then((m) => m.InventoryListProductComponent),
                    data: {
                      breadcrumb: {
                        title: 'Inventory Management',
                        subTitle: 'All Inventory Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.InventorySetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: '',
                    redirectTo: InventoryTabCode.UPLOAD_CODE,
                    pathMatch: 'full',
                  },
                ],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'Inventory Management',
                    url: 'privilege-management/inventory-setting',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.InventorySetting,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/inventory-setting/components/create-edit-inventory/create-edit-inventory.component'
                      ).then((m) => m.CreateEditInventoryComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Inventory',
                      },
                      unsaveChangeKey: 'createInventorySetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':inventory_id/view-edit',
                    loadComponent: () =>
                      import(
                        './features/inventory-setting/components/create-edit-inventory/create-edit-inventory.component'
                      ).then((m) => m.CreateEditInventoryComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Inventory',
                      },
                      unsaveChangeKey: 'createInventorySetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'privilege-setting',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './features/privilege-setting/components/privilege-layout/privilege-layout.component'
                  ).then((m) => m.PrivilegeLayoutComponent),
                data: {
                  unsaveChangeKey: 'orderPopupAnnouncementLayout',
                },
                canDeactivate: [UnsavedChangesGuard],
                children: [
                  {
                    path: 'e-voucher',
                    loadComponent: () =>
                      import(
                        './features/privilege-setting/components/evoucher-list/evoucher-list.component'
                      ).then((m) => m.EvoucherListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Privilege Setting',
                        subTitle: 'All Privilege Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.PrivilegeSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: 'delivery',
                    loadComponent: () =>
                      import(
                        './features/privilege-setting/components/delivery-list/delivery-list.component'
                      ).then((m) => m.DeliveryListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Privilege Setting',
                        subTitle: 'All Privilege Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.PrivilegeSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: 'booking',
                    loadComponent: () =>
                      import(
                        './features/privilege-setting/components/booking-list/booking-list.component'
                      ).then((m) => m.BookingListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Privilege Setting',
                        subTitle: 'All Privilege Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.PrivilegeSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: 'healthcare',
                    loadComponent: () =>
                      import(
                        './features/privilege-setting/components/healthcare-list/healthcare-list.component'
                      ).then((m) => m.HealthcareListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Privilege Setting',
                        subTitle: 'All Privilege Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.PrivilegeSetting,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: '',
                    redirectTo: 'e-voucher',
                    pathMatch: 'full',
                  },
                ],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'Privilege Management',
                    url: 'privilege-management/privilege-setting',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.PrivilegeSetting,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/privilege-setting/components/create-edit-privilege/create-edit-privilege.component'
                      ).then((m) => m.CreateEditPrivilegeComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Privilege',
                      },
                      unsaveChangeKey: 'createPrivilegeSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':privilege_id/view-edit',
                    loadComponent: () =>
                      import(
                        './features/privilege-setting/components/create-edit-privilege/create-edit-privilege.component'
                      ).then((m) => m.CreateEditPrivilegeComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Privilege',
                      },
                      unsaveChangeKey: 'createPrivilegeSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
            ],
          },
          {
            path: 'promocode-setting',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/promocode-setting/components/promocode-list/promocode-list.component'
                  ).then((m) => m.PromoCodeListComponent),
                data: {
                  breadcrumb: {
                    title: 'Promocode Setting',
                    subTitle: 'All Promo Code Information',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.PromocodeSetting,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'All Promo Code Information',
                    url: 'privilege-management/promocode-setting',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.PromocodeSetting,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/promocode-setting/components/create-edit-promocode/create-edit-promocode.component'
                      ).then((m) => m.CreateEditPromocodeComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Promo Code',
                      },
                      unsaveChangeKey: 'createPromocodeSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':promocode_id/view-edit',
                    loadComponent: () =>
                      import(
                        './features/promocode-setting/components/create-edit-promocode/create-edit-promocode.component'
                      ).then((m) => m.CreateEditPromocodeComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Promocode',
                      },
                      unsaveChangeKey: 'createPromocodeSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'unicode-setting',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/unicode-setting/components/unicode-list/unicode-list.component'
                  ).then((m) => m.UnicodeListComponent),
                data: {
                  breadcrumb: {
                    title: 'Unicode Setting',
                    subTitle: 'All Unicode Information',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.UnicodeSetting,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'All Unicode Information',
                    url: 'privilege-management/unicode-setting',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.UnicodeSetting,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/unicode-setting/components/create-edit-unicode/create-edit-unicode.component'
                      ).then((m) => m.CreateEditUnicodeComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Unicode',
                      },
                      unsaveChangeKey: 'createUnicodeSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':unicode_id/view-edit',
                    loadComponent: () =>
                      import(
                        './features/unicode-setting/components/create-edit-unicode/create-edit-unicode.component'
                      ).then((m) => m.CreateEditUnicodeComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Unicode',
                      },
                      unsaveChangeKey: 'createUnicodeSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'manual-code-redemption',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/manual-code-redemption/components/manual-code-redemption-list/manual-code-redemption-list.component'
                  ).then((m) => m.ManualCodeRedemptionComponent),
                data: {
                  breadcrumb: {
                    title: 'Manual Code Redemption',
                    subTitle: '',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.ManualCodeRedemption,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
      {
        path: 'point-management',
        children: [
          {
            path: 'point-rule-management',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/point-rule-management/components/point-rule-layout/point-rule-layout.component'
                  ).then((m) => m.PointRuleLayoutComponent),
                children: [
                  {
                    path: PointRuleTabCode.Welcome_Rule,
                    loadComponent: () =>
                      import(
                        './features/point-rule-management/components/welcome-rule-list/welcome-rule-list.component'
                      ).then((m) => m.WelcomeRuleListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Point rule Management',
                        subTitle: 'All Manage rules point Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.PointRules,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: PointRuleTabCode.Product_Based_Rule,
                    loadComponent: () =>
                      import(
                        './features/point-rule-management/components/product-based-rule-list/product-based-rule-list.component'
                      ).then((m) => m.ProductBasedRuleListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Point rule Management',
                        subTitle: 'All Manage rules point Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.PointRules,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: PointRuleTabCode.Criteria_Based_Rule,
                    loadComponent: () =>
                      import(
                        './features/point-rule-management/components/criteria-based-rule-list/criteria-based-rule-list.component'
                      ).then((m) => m.CriteriaBasedRuleListComponent),
                    data: {
                      breadcrumb: {
                        title: 'Point rule Management',
                        subTitle: 'All Manage rules point Information',
                      },
                      hasPermissions: [
                        {
                          feature: FeaturePermissionCode.PointRules,
                          action: ActionPermissionCode.View,
                        },
                      ],
                    },
                    canActivate: [HasPermissionsGuard],
                  },
                  {
                    path: '',
                    redirectTo: PointRuleTabCode.Welcome_Rule,
                    pathMatch: 'full',
                  },
                ],
              },
              {
                path: 'form',
                data: {
                  breadcrumb: {
                    title: 'Point rule Management',
                    url: 'point-management/point-rule-management',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.PointRules,
                      action: ActionPermissionCode.CreateEdit,
                    },
                  ],
                },
                canActivateChild: [HasPermissionsGuard],
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import(
                        './features/point-rule-management/components/create-edit-point-rule/create-edit-point-rule.component'
                      ).then((m) => m.CreateEditPointRuleComponent),
                    data: {
                      breadcrumb: {
                        title: 'Create Point Rule',
                      },
                      unsaveChangeKey: 'createPointRuleSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                  {
                    path: ':point_rule_id/view-edit',
                    loadComponent: () =>
                      import(
                        './features/point-rule-management/components/create-edit-point-rule/create-edit-point-rule.component'
                      ).then((m) => m.CreateEditPointRuleComponent),
                    data: {
                      breadcrumb: {
                        title: 'Edit Point Rule',
                      },
                      unsaveChangeKey: 'createPointRuleSetting',
                    },
                    canDeactivate: [UnsavedChangesGuard],
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'point-bulk-action',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/point-bulk/components/point-bulk-list/point-bulk-list.component'
                  ).then((m) => m.PointBulkListComponent),
                data: {
                  breadcrumb: {
                    title: 'Manual Add point',
                    subTitle: 'Add Point in bulk action',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.PointBulkAction,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'disabled-claim-by-policy-no',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/disabled-claim-by-policy-no/components/disabled-claim-by-policy-no-list/disabled-claim-by-policy-no-list.component'
                  ).then((m) => m.DisabledClaimByPolicyNoListComponent),
                data: {
                  breadcrumb: {
                    title: 'Disable Claim by Policy no.',
                    subTitle: 'Disable Claim by Policy no.',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.DisabledClaimByPolicyNo,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'exclude-point-by-policy-no',
            children: [
              {
                path: 'list',
                loadComponent: () =>
                  import(
                    './features/exclude-point-by-policy-no/components/exclude-point-by-policy-no-list/exclude-point-by-policy-no-list.component'
                  ).then((m) => m.ExcludePointByPolicyNoListComponent),
                data: {
                  breadcrumb: {
                    title: 'Exclude Point by Policy no.',
                    subTitle: 'Exclude Point by Policy no.',
                  },
                  hasPermissions: [
                    {
                      feature: FeaturePermissionCode.ExcludePointByPolicyNo,
                      action: ActionPermissionCode.View,
                    },
                  ],
                },
                canActivate: [HasPermissionsGuard],
              },
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
      {
        path: '',
        redirectTo: 'user-management/customer-profile',
        pathMatch: 'full',
      },
      {
        path: '404',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then(
            (m) => m.NotFoundComponent
          ),
      },
      {
        path: '**',
        redirectTo: '404',
      },
    ],
  },
];
