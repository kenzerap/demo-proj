import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducers } from './store/store';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CustomerProfileListEffects } from './features/customer-profile/stores/customer-profile-list/customer-profile-list.effects';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { CustomerProfileFilterEffects } from './features/customer-profile/stores/customer-profile-filter/customer-profile-filter.effects';
import { CustomerDetailEffects } from './features/customer-profile-detail/stores/customer-detail/customer-detail.effects';
import { AnalyticSummaryEffects } from './features/customer-profile-detail/stores/analytic-summary/analytic-summary.effects';
import { PolicyDetailEffects } from './features/customer-profile-detail/stores/policy-detail/policy-detail.effects';
import { ClaimHistoryEffects } from './features/customer-profile-detail/stores/claim-history/claim-history.effects';
import { EClaimSubmitEffects } from './features/customer-profile-detail/stores/e-claim-submit/e-claim-submit.effects';
import { MessageHandlingEffects } from './store/message-handling/message-handling.effects';
import { PointHistoryEffects } from './features/customer-profile-detail/stores/point-history/point-history.effects';
import { RedeemHistoryEffects } from './features/customer-profile-detail/stores/redeem-history/redeem-history.effects';
import { NotificationsEffects } from './features/push-notification-setting/stores/notification/notification.effects';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { CUSTOM_DATE_PICKER_FORMATS } from './shared/constants/date-picker-format';
import { CreateEditPushNotificationEffects } from './features/push-notification-setting/stores/create-edit-push-notification/create-edit-push-notification.effects';
import { PopupAnnouncementEffects } from './features/popup-announcement-setting/stores/popup-announcement/popup-announcement.effects';
import { CreateEditPopupAnnouncementEffects } from './features/popup-announcement-setting/stores/create-edit-popup-announcement/create-edit-popup-announcement.effects';
import { BannerSettingEffects } from './features/banner-setting/stores/banner-setting/banner-setting.effects';
import { CreateEditBannerSettingEffects } from './features/banner-setting/stores/create-edit-banner-setting/create-edit-banner-setting.effects';
import { CreateEditCustomerSegmentationEffects } from './features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.effects';
import { CustomerSegmentationEffects } from './features/customer-segmentation/stores/customer-segmentation/customer-segmentation.effects';
import { AccountSettingsEffects } from './features/account-setting/stores/account-setting/account-setting.effects';
import { UserPermissionsEffects } from './store/user-permission/user-permission.effects';
import { CreateEditBrandEffects } from './features/brand-setting/stores/create-edit-brand/create-edit-brand.effects';
import { PrivilegeSettingEffects } from './features/privilege-setting/stores/privilege/privilege.effects';
import { BrandsListEffects } from './features/brand-setting/stores/brand-list/brand-list.effects';
import { InventoriesListEffects } from './features/inventory-setting/stores/inventory-list/inventory-list.effects';
import { CreateEditInventoryEffects } from './features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.effects';
import { CreateEditPrivilegeEffects } from './features/privilege-setting/stores/create-edit-privilege/create-edit-privilege.effects';
import { CreateEditPromocodeEffects } from './features/promocode-setting/stores/create-edit-promocode/create-edit-promocode.effects';
import { PromoCodesListEffects } from './features/promocode-setting/stores/promocode-list/promocode-list.effects';
import { CreateEditUnicodeEffects } from './features/unicode-setting/stores/create-edit-unicode/create-edit-unicode.effects';
import { UnicodesListEffects } from './features/unicode-setting/stores/unicode-list/unicode-list.effects';
import { CreateEditPointRuleEffects } from './features/point-rule-management/stores/create-edit-point-rule/create-edit-point-rule.effects';
import { PointRulesListEffects } from './features/point-rule-management/stores/point-rule-list/point-rule-list.effects';
import { PrivilegeRedemptionReportsEffects } from './features/privilege-redemption-report/stores/privilede-redemption-report-list/privilege-redemption-report-list.effects';
import { PointTransactionReportsEffects } from './features/point-transaction-report/stores/point-transaction-report-list/point-transaction-report-list.effects';
import { PrivilegeUsageReportEffects } from './features/privilege-usage-report/stores/privilege-usage-report-list/privilege-usage-report-list.effects';
import { UserAccountReportEffects } from './features/user-account-report/stores/user-account-report-list/user-account-report-list.effects';
import { HomeScreenManagementEffects } from './features/home-screen-management/stores/home-screen-management-list/home-screen-management-list.effects';
import { BannerSettingOrderEffects } from './features/banner-setting/stores/reorder-list/reorder-list.effects';
import { PopupAnnouncementOrderEffects } from './features/popup-announcement-setting/stores/reorder-list/reorder-list.effects';
import { CustomerSegmentationOrderEffects } from './features/customer-segmentation/stores/reorder-list/reorder-list.effects';
import { CreateEditHomeScreenEffects } from './features/home-screen-management/stores/create-edit-home-screen/create-edit-home-screen.effects';
import { HomeScreenManagementOrderEffects } from './features/home-screen-management/stores/reorder-list/reorder-list.effects';
import { SplashScreenManagementListEffects } from './features/splash-screen-management/stores/splash-screen-management-list/splash-screen-management-list.effects';
import { CreateEditSplashScreenEffects } from './features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.effects';
import { CheckupPackageEffects } from './features/checkup-package/stores/checkup-package-list/checkup-package-list.effects';
import { CheckupPackageOrderEffects } from './features/checkup-package/stores/reorder-list/reorder-list.effects';
import { CreateEditCheckupPackageEffects } from './features/checkup-package/stores/create-edit-checkup-package/create-edit-checkup-package.effects';
import { CreateEditHospitalEffects } from './features/hospital/stores/create-edit-hospital/create-edit-hospital.effects';
import { HospitalEffects } from './features/hospital/stores/hospital-list/hospital-list.effects';
import { HospitalOrderEffects } from './features/hospital/stores/reorder-list/reorder-list.effects';
import { FundTypesListEffects } from './features/fund-type/stores/fund-type-list/fund-type-list.effects';
import { CreateEditFundTypeEffects } from './features/fund-type/stores/create-edit-fund-type/create-edit-fund-type.effects';
import { OtpHistoryEffects } from './features/customer-profile-detail/stores/otp-history/otp-history.effects';
import { EclaimReportEffects } from './features/e-claim-report/stores/e-claim-report-list/e-claim-report-list.effects';
import { PointBulksListEffects } from './features/point-bulk/stores/point-bulk-list/point-bulk-list.effects';
import { CreateEditPointBulkEffects } from './features/point-bulk/stores/create-edit-point-bulk/create-edit-point-bulk.effects';
import { ManualCodeRedemptionEffects } from './features/manual-code-redemption/stores/manual-code-redemption/manual-code-redemption.effects';
import { DisabledClaimByPolicyNoListEffects } from './features/disabled-claim-by-policy-no/stores/disabled-claim-by-policy-no-list/disabled-claim-by-policy-no-list.effects';
import { ExcludePointByPolicyNoListEffects } from './features/exclude-point-by-policy-no/stores/exclude-point-by-policy-no-list/exclude-point-by-policy-no-list.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor])),
    provideMomentDateAdapter(CUSTOM_DATE_PICKER_FORMATS),
    provideStore(reducers),
    provideEffects([
      CustomerProfileListEffects,
      CustomerProfileFilterEffects,
      CustomerDetailEffects,
      AnalyticSummaryEffects,
      PolicyDetailEffects,
      ClaimHistoryEffects,
      EClaimSubmitEffects,
      MessageHandlingEffects,
      PointHistoryEffects,
      RedeemHistoryEffects,
      NotificationsEffects,
      CreateEditPushNotificationEffects,
      PopupAnnouncementEffects,
      CreateEditPopupAnnouncementEffects,
      BannerSettingEffects,
      CreateEditBannerSettingEffects,
      CreateEditCustomerSegmentationEffects,
      CustomerSegmentationEffects,
      AccountSettingsEffects,
      UserPermissionsEffects,
      CreateEditBrandEffects,
      PrivilegeSettingEffects,
      BrandsListEffects,
      InventoriesListEffects,
      CreateEditInventoryEffects,
      CreateEditPrivilegeEffects,
      CreateEditPromocodeEffects,
      PromoCodesListEffects,
      CreateEditUnicodeEffects,
      UnicodesListEffects,
      CreateEditPointRuleEffects,
      PointRulesListEffects,
      PrivilegeRedemptionReportsEffects,
      PointTransactionReportsEffects,
      PrivilegeUsageReportEffects,
      UserAccountReportEffects,
      HomeScreenManagementEffects,
      BannerSettingOrderEffects,
      PopupAnnouncementOrderEffects,
      CustomerSegmentationOrderEffects,
      CreateEditHomeScreenEffects,
      HomeScreenManagementOrderEffects,
      SplashScreenManagementListEffects,
      CreateEditSplashScreenEffects,
      CheckupPackageEffects,
      CheckupPackageOrderEffects,
      CreateEditCheckupPackageEffects,
      CreateEditHospitalEffects,
      HospitalEffects,
      HospitalOrderEffects,
      FundTypesListEffects,
      CreateEditFundTypeEffects,
      OtpHistoryEffects,
      EclaimReportEffects,
      PointBulksListEffects,
      CreateEditPointBulkEffects,
      ManualCodeRedemptionEffects,
      DisabledClaimByPolicyNoListEffects,
      ExcludePointByPolicyNoListEffects,
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
  ],
};
