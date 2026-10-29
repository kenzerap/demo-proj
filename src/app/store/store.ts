import { ActionReducerMap } from '@ngrx/store';
import * as fromCustomerProfileList from '../features/customer-profile/stores/customer-profile-list/customer-profile-list.reducer';
import * as fromLoading from './loading/loading.reducer';
import * as fromCustomerProfileFilter from '../features/customer-profile/stores/customer-profile-filter/customer-profile-filter.reducer';
import * as fromCustomerDetail from '../features/customer-profile-detail/stores/customer-detail/customer-detail.reducer';
import * as fromAnalyticSummary from '../features/customer-profile-detail/stores/analytic-summary/analytic-summary.reducer';
import * as fromPolicyDetail from '../features/customer-profile-detail/stores/policy-detail/policy-detail.reducer';
import * as fromClaimHistory from '../features/customer-profile-detail/stores/claim-history/claim-history.reducer';
import * as fromEClaim from '../features/customer-profile-detail/stores/e-claim-submit/e-claim-submit.reducer';
import * as fromPointHistory from '../features/customer-profile-detail/stores/point-history/point-history.reducer';
import * as fromRedeemHistory from '../features/customer-profile-detail/stores/redeem-history/redeem-history.reducer';
import * as fromOtpHistory from '../features/customer-profile-detail/stores/otp-history/otp-history.reducer';
import * as fromNotificationList from '@app/features/push-notification-setting/stores/notification/notification.reducer';
import * as fromCreateEditPushNotification from '../features/push-notification-setting/stores/create-edit-push-notification/create-edit-push-notification.reducer';
import * as fromPopupAnnouncement from '../features/popup-announcement-setting/stores/popup-announcement/popup-announcement.reducer';
import * as fromPopupAnnouncementOrder from '../features/popup-announcement-setting/stores/reorder-list/reorder-list.reducer';
import * as fromCreateEditPopupAnnouncement from '../features/popup-announcement-setting/stores/create-edit-popup-announcement/create-edit-popup-announcement.reducer';
import * as fromBannerSetting from '../features/banner-setting/stores/banner-setting/banner-setting.reducer';
import * as fromCreateEditBannerSetting from '../features/banner-setting/stores/create-edit-banner-setting/create-edit-banner-setting.reducer';
import * as fromBannerSettingOrder from '../features/banner-setting/stores/reorder-list/reorder-list.reducer';
import * as fromCreateEditCustomerSegmentation from '../features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.reducer';
import * as fromCustomerSegmentation from '../features/customer-segmentation/stores/customer-segmentation/customer-segmentation.reducer';
import * as fromCustomerSegmentationOrder from '../features/customer-segmentation/stores/reorder-list/reorder-list.reducer';
import * as fromAccountSetting from '../features/account-setting/stores/account-setting/account-setting.reducer';
import * as fromUserPermission from './user-permission/user-permission.reducer';
import * as fromCreateEditBrand from '../features/brand-setting/stores/create-edit-brand/create-edit-brand.reducer';
import * as fromPrivilegeSettings from '../features/privilege-setting/stores/privilege/privilege.reducer';
import * as fromBrandList from '../features/brand-setting/stores/brand-list/brand-list.reducer';
import * as fromInventoryList from '../features/inventory-setting/stores/inventory-list/inventory-list.reducer';
import * as fromCreateEditInventory from '../features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.reducer';
import * as fromCreateEditPrivilege from '../features/privilege-setting/stores/create-edit-privilege/create-edit-privilege.reducer';
import * as fromCreateEditPromocode from '../features/promocode-setting/stores/create-edit-promocode/create-edit-promocode.reducer';
import * as fromPromoCodeList from '../features/promocode-setting/stores/promocode-list/promocode-list.reducer';
import * as fromCreateEditUnicode from '../features/unicode-setting/stores/create-edit-unicode/create-edit-unicode.reducer';
import * as fromUnicodeList from '../features/unicode-setting/stores/unicode-list/unicode-list.reducer';
import * as fromCreateEditPointRule from '../features/point-rule-management/stores/create-edit-point-rule/create-edit-point-rule.reducer';
import * as fromPointRuleList from '../features/point-rule-management/stores/point-rule-list/point-rule-list.reducer';
import * as fromPrivilegeRedemptionReports from '../features/privilege-redemption-report/stores/privilede-redemption-report-list/privilege-redemption-report-list.reducer';
import * as fromPointTransactionReports from '../features/point-transaction-report/stores/point-transaction-report-list/point-transaction-report-list.reducer';
import * as fromPrivilegeUsageReports from '../features/privilege-usage-report/stores/privilege-usage-report-list/privilege-usage-report-list.reducer';
import * as fromUserAccountReports from '../features/user-account-report/stores/user-account-report-list/user-account-report-list.reducer';
import * as fromClaimReports from '../features/e-claim-report/stores/e-claim-report-list/e-claim-report-list.reducer';
import * as fromHomeScreenManagement from '../features/home-screen-management/stores/home-screen-management-list/home-screen-management-list.reducer';
import * as fromCreateEditHomeScreenManagement from '../features/home-screen-management/stores/create-edit-home-screen/create-edit-home-screen.reducer';
import * as fromCreateEditHomeScreenManagementOrder from '../features/home-screen-management/stores/reorder-list/reorder-list.reducer';
import * as fromSplashScreenManagement from '../features/splash-screen-management/stores/splash-screen-management-list/splash-screen-management-list.reducer';
import * as fromCreateEditSplashScreen from '../features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.reducer';
import * as fromCheckupPackage from '../features/checkup-package/stores/checkup-package-list/checkup-package-list.reducer';
import * as fromCheckupPackageOrder from '../features/checkup-package/stores/reorder-list/reorder-list.reducer';
import * as fromCreateEditCheckupPackageOrder from '../features/checkup-package/stores/create-edit-checkup-package/create-edit-checkup-package.reducer';
import * as fromCreateEditHospital from '../features/hospital/stores/create-edit-hospital/create-edit-hospital.reducer';
import * as fromHospital from '../features/hospital/stores/hospital-list/hospital-list.reducer';
import * as fromHospitalOrder from '../features/hospital/stores/reorder-list/reorder-list.reducer';
import * as fromFundTypeList from '../features/fund-type/stores/fund-type-list/fund-type-list.reducer';
import * as fromCreateEditFundType from '../features/fund-type/stores/create-edit-fund-type/create-edit-fund-type.reducer';
import * as fromPointBulk from '../features/point-bulk/stores/point-bulk-list/point-bulk-list.reducer';
import * as fromCreateEditPointBulk from '../features/point-bulk/stores/create-edit-point-bulk/create-edit-point-bulk.reducer';
import * as fromManualCodeRedemption from '../features/manual-code-redemption/stores/manual-code-redemption/manual-code-redemption.reducer';
import * as fromDisabledClaimByPolicyNo from '../features/disabled-claim-by-policy-no/stores/disabled-claim-by-policy-no-list/disabled-claim-by-policy-no-list.reducer';
import * as fromExcludePointByPolicyNo from '../features/exclude-point-by-policy-no/stores/exclude-point-by-policy-no-list/exclude-point-by-policy-no-list.reducer';

export interface AppState {
  [fromCustomerProfileList.featureKey]: fromCustomerProfileList.State;
  [fromLoading.featureKey]: fromLoading.LoadingState;
  [fromCustomerProfileFilter.featureKey]: fromCustomerProfileFilter.State;
  [fromCustomerDetail.featureKey]: fromCustomerDetail.State;
  [fromAnalyticSummary.featureKey]: fromAnalyticSummary.State;
  [fromPolicyDetail.featureKey]: fromPolicyDetail.State;
  [fromClaimHistory.featureKey]: fromClaimHistory.State;
  [fromEClaim.featureKey]: fromEClaim.State;
  [fromPointHistory.featureKey]: fromPointHistory.State;
  [fromRedeemHistory.featureKey]: fromRedeemHistory.State;
  [fromOtpHistory.featureKey]: fromOtpHistory.State;
  [fromNotificationList.featureKey]: fromNotificationList.State;
  [fromCreateEditPushNotification.featureKey]: fromCreateEditPushNotification.State;
  [fromPopupAnnouncement.featureKey]: fromPopupAnnouncement.State;
  [fromPopupAnnouncementOrder.featureKey]: fromPopupAnnouncementOrder.State;
  [fromCreateEditPopupAnnouncement.featureKey]: fromCreateEditPopupAnnouncement.State;
  [fromBannerSetting.featureKey]: fromBannerSetting.State;
  [fromCreateEditBannerSetting.featureKey]: fromCreateEditBannerSetting.State;
  [fromBannerSettingOrder.featureKey]: fromBannerSettingOrder.State;
  [fromCreateEditCustomerSegmentation.featureKey]: fromCreateEditCustomerSegmentation.State;
  [fromCustomerSegmentation.featureKey]: fromCustomerSegmentation.State;
  [fromCustomerSegmentationOrder.featureKey]: fromCustomerSegmentationOrder.State;
  [fromAccountSetting.featureKey]: fromAccountSetting.State;
  [fromUserPermission.featureKey]: fromUserPermission.State;
  [fromCreateEditBrand.featureKey]: fromCreateEditBrand.State;
  [fromPrivilegeSettings.featureKey]: fromPrivilegeSettings.State;
  [fromBrandList.featureKey]: fromBrandList.State;
  [fromInventoryList.featureKey]: fromInventoryList.State;
  [fromCreateEditInventory.featureKey]: fromCreateEditInventory.State;
  [fromCreateEditPrivilege.featureKey]: fromCreateEditPrivilege.State;
  [fromCreateEditPromocode.featureKey]: fromCreateEditPromocode.State;
  [fromPromoCodeList.featureKey]: fromPromoCodeList.State;
  [fromCreateEditUnicode.featureKey]: fromCreateEditUnicode.State;
  [fromUnicodeList.featureKey]: fromUnicodeList.State;
  [fromCreateEditPointRule.featureKey]: fromCreateEditPointRule.State;
  [fromPointRuleList.featureKey]: fromPointRuleList.State;
  [fromPrivilegeRedemptionReports.featureKey]: fromPrivilegeRedemptionReports.State;
  [fromPointTransactionReports.featureKey]: fromPointTransactionReports.State;
  [fromHomeScreenManagement.featureKey]: fromHomeScreenManagement.State;
  [fromCreateEditHomeScreenManagement.featureKey]: fromCreateEditHomeScreenManagement.State;
  [fromPrivilegeUsageReports.featureKey]: fromPrivilegeUsageReports.State;
  [fromUserAccountReports.featureKey]: fromUserAccountReports.State;
  [fromClaimReports.featureKey]: fromClaimReports.State;
  [fromCreateEditHomeScreenManagementOrder.featureKey]: fromCreateEditHomeScreenManagementOrder.State;
  [fromSplashScreenManagement.featureKey]: fromSplashScreenManagement.State;
  [fromCreateEditSplashScreen.featureKey]: fromCreateEditSplashScreen.State;
  [fromCheckupPackage.featureKey]: fromCheckupPackage.State;
  [fromCheckupPackageOrder.featureKey]: fromCheckupPackageOrder.State;
  [fromCreateEditCheckupPackageOrder.featureKey]: fromCreateEditCheckupPackageOrder.State;
  [fromCreateEditHospital.featureKey]: fromCreateEditHospital.State;
  [fromCheckupPackage.featureKey]: fromCheckupPackage.State;
  [fromCheckupPackageOrder.featureKey]: fromCheckupPackageOrder.State;
  [fromCreateEditCheckupPackageOrder.featureKey]: fromCreateEditCheckupPackageOrder.State;
  [fromHospital.featureKey]: fromHospital.State;
  [fromHospitalOrder.featureKey]: fromHospitalOrder.State;
  [fromFundTypeList.featureKey]: fromFundTypeList.State;
  [fromCreateEditFundType.featureKey]: fromCreateEditFundType.State;
  [fromPointBulk.featureKey]: fromPointBulk.State;
  [fromCreateEditPointBulk.featureKey]: fromCreateEditPointBulk.State;
  [fromManualCodeRedemption.featureKey]: fromManualCodeRedemption.State;
  [fromDisabledClaimByPolicyNo.featureKey]: fromDisabledClaimByPolicyNo.State;
  [fromExcludePointByPolicyNo.featureKey]: fromExcludePointByPolicyNo.State;
}

export const initialAppState: AppState = {
  [fromCustomerProfileList.featureKey]: fromCustomerProfileList.initialState,
  [fromLoading.featureKey]: fromLoading.initialState,
  [fromCustomerProfileFilter.featureKey]:
    fromCustomerProfileFilter.initialState,
  [fromCustomerDetail.featureKey]: fromCustomerDetail.initialState,
  [fromAnalyticSummary.featureKey]: fromAnalyticSummary.initialState,
  [fromPolicyDetail.featureKey]: fromPolicyDetail.initialState,
  [fromClaimHistory.featureKey]: fromClaimHistory.initialState,
  [fromEClaim.featureKey]: fromEClaim.initialState,
  [fromPointHistory.featureKey]: fromPointHistory.initialState,
  [fromRedeemHistory.featureKey]: fromRedeemHistory.initialState,
  [fromOtpHistory.featureKey]: fromOtpHistory.initialState,
  [fromNotificationList.featureKey]: fromNotificationList.initialState,
  [fromCreateEditPushNotification.featureKey]:
    fromCreateEditPushNotification.initialState,
  [fromPopupAnnouncement.featureKey]: fromPopupAnnouncement.initialState,
  [fromPopupAnnouncementOrder.featureKey]:
    fromPopupAnnouncementOrder.initialState,
  [fromCreateEditPopupAnnouncement.featureKey]:
    fromCreateEditPopupAnnouncement.initialState,
  [fromBannerSetting.featureKey]: fromBannerSetting.initialState,
  [fromCreateEditBannerSetting.featureKey]:
    fromCreateEditBannerSetting.initialState,
  [fromBannerSettingOrder.featureKey]: fromBannerSettingOrder.initialState,
  [fromCreateEditCustomerSegmentation.featureKey]:
    fromCreateEditCustomerSegmentation.initialState,
  [fromCustomerSegmentation.featureKey]: fromCustomerSegmentation.initialState,
  [fromCustomerSegmentationOrder.featureKey]:
    fromCustomerSegmentationOrder.initialState,
  [fromAccountSetting.featureKey]: fromAccountSetting.initialState,
  [fromUserPermission.featureKey]: fromUserPermission.initialState,
  [fromCreateEditBrand.featureKey]: fromCreateEditBrand.initialState,
  [fromPrivilegeSettings.featureKey]: fromPrivilegeSettings.initialState,
  [fromBrandList.featureKey]: fromBrandList.initialState,
  [fromInventoryList.featureKey]: fromInventoryList.initialState,
  [fromCreateEditInventory.featureKey]: fromCreateEditInventory.initialState,
  [fromCreateEditPrivilege.featureKey]: fromCreateEditPrivilege.initialState,
  [fromCreateEditPromocode.featureKey]: fromCreateEditPromocode.initialState,
  [fromPromoCodeList.featureKey]: fromPromoCodeList.initialState,
  [fromCreateEditUnicode.featureKey]: fromCreateEditUnicode.initialState,
  [fromUnicodeList.featureKey]: fromUnicodeList.initialState,
  [fromCreateEditPointRule.featureKey]: fromCreateEditPointRule.initialState,
  [fromPointRuleList.featureKey]: fromPointRuleList.initialState,
  [fromPrivilegeRedemptionReports.featureKey]:
    fromPrivilegeRedemptionReports.initialState,
  [fromPointTransactionReports.featureKey]:
    fromPointTransactionReports.initialState,
  [fromHomeScreenManagement.featureKey]: fromHomeScreenManagement.initialState,
  [fromPrivilegeUsageReports.featureKey]:
    fromPrivilegeUsageReports.initialState,
  [fromUserAccountReports.featureKey]: fromUserAccountReports.initialState,
  [fromClaimReports.featureKey]: fromClaimReports.initialState,
  [fromCreateEditHomeScreenManagement.featureKey]:
    fromCreateEditHomeScreenManagement.initialState,
  [fromCreateEditHomeScreenManagementOrder.featureKey]:
    fromCreateEditHomeScreenManagementOrder.initialState,
  [fromSplashScreenManagement.featureKey]:
    fromSplashScreenManagement.initialState,
  [fromCreateEditSplashScreen.featureKey]:
    fromCreateEditSplashScreen.initialState,
  [fromCheckupPackage.featureKey]: fromCheckupPackage.initialState,
  [fromCheckupPackageOrder.featureKey]: fromCheckupPackageOrder.initialState,
  [fromCreateEditCheckupPackageOrder.featureKey]:
    fromCreateEditCheckupPackageOrder.initialState,
  [fromCreateEditHospital.featureKey]: fromCreateEditHospital.initialState,
  [fromHospital.featureKey]: fromHospital.initialState,
  [fromHospitalOrder.featureKey]: fromHospitalOrder.initialState,
  [fromFundTypeList.featureKey]: fromFundTypeList.initialState,
  [fromCreateEditFundType.featureKey]: fromCreateEditFundType.initialState,
  [fromPointBulk.featureKey]: fromPointBulk.initialState,
  [fromCreateEditPointBulk.featureKey]: fromCreateEditPointBulk.initialState,
  [fromManualCodeRedemption.featureKey]: fromManualCodeRedemption.initialState,
  [fromDisabledClaimByPolicyNo.featureKey]:
    fromDisabledClaimByPolicyNo.initialState,
  [fromExcludePointByPolicyNo.featureKey]:
    fromExcludePointByPolicyNo.initialState,
};

export const reducers: ActionReducerMap<AppState> = {
  [fromCustomerProfileList.featureKey]: fromCustomerProfileList.reducer,
  [fromLoading.featureKey]: fromLoading.reducer,
  [fromCustomerProfileFilter.featureKey]: fromCustomerProfileFilter.reducer,
  [fromCustomerDetail.featureKey]: fromCustomerDetail.reducer,
  [fromAnalyticSummary.featureKey]: fromAnalyticSummary.reducer,
  [fromPolicyDetail.featureKey]: fromPolicyDetail.reducer,
  [fromClaimHistory.featureKey]: fromClaimHistory.reducer,
  [fromEClaim.featureKey]: fromEClaim.reducer,
  [fromPointHistory.featureKey]: fromPointHistory.reducer,
  [fromRedeemHistory.featureKey]: fromRedeemHistory.reducer,
  [fromOtpHistory.featureKey]: fromOtpHistory.reducer,
  [fromNotificationList.featureKey]: fromNotificationList.reducer,
  [fromCreateEditPushNotification.featureKey]:
    fromCreateEditPushNotification.reducer,
  [fromPopupAnnouncement.featureKey]: fromPopupAnnouncement.reducer,
  [fromPopupAnnouncementOrder.featureKey]: fromPopupAnnouncementOrder.reducer,
  [fromCreateEditPopupAnnouncement.featureKey]:
    fromCreateEditPopupAnnouncement.reducer,
  [fromBannerSetting.featureKey]: fromBannerSetting.reducer,
  [fromCreateEditBannerSetting.featureKey]: fromCreateEditBannerSetting.reducer,
  [fromBannerSettingOrder.featureKey]: fromBannerSettingOrder.reducer,
  [fromCreateEditCustomerSegmentation.featureKey]:
    fromCreateEditCustomerSegmentation.reducer,
  [fromCustomerSegmentation.featureKey]: fromCustomerSegmentation.reducer,
  [fromCustomerSegmentationOrder.featureKey]:
    fromCustomerSegmentationOrder.reducer,
  [fromAccountSetting.featureKey]: fromAccountSetting.reducer,
  [fromUserPermission.featureKey]: fromUserPermission.reducer,
  [fromCreateEditBrand.featureKey]: fromCreateEditBrand.reducer,
  [fromPrivilegeSettings.featureKey]: fromPrivilegeSettings.reducer,
  [fromBrandList.featureKey]: fromBrandList.reducer,
  [fromInventoryList.featureKey]: fromInventoryList.reducer,
  [fromCreateEditInventory.featureKey]: fromCreateEditInventory.reducer,
  [fromCreateEditPrivilege.featureKey]: fromCreateEditPrivilege.reducer,
  [fromCreateEditPromocode.featureKey]: fromCreateEditPromocode.reducer,
  [fromPromoCodeList.featureKey]: fromPromoCodeList.reducer,
  [fromCreateEditUnicode.featureKey]: fromCreateEditUnicode.reducer,
  [fromUnicodeList.featureKey]: fromUnicodeList.reducer,
  [fromCreateEditPointRule.featureKey]: fromCreateEditPointRule.reducer,
  [fromPointRuleList.featureKey]: fromPointRuleList.reducer,
  [fromPrivilegeRedemptionReports.featureKey]:
    fromPrivilegeRedemptionReports.reducer,
  [fromPointTransactionReports.featureKey]: fromPointTransactionReports.reducer,
  [fromPrivilegeUsageReports.featureKey]: fromPrivilegeUsageReports.reducer,
  [fromUserAccountReports.featureKey]: fromUserAccountReports.reducer,
  [fromClaimReports.featureKey]: fromClaimReports.reducer,
  [fromHomeScreenManagement.featureKey]: fromHomeScreenManagement.reducer,
  [fromCreateEditHomeScreenManagement.featureKey]:
    fromCreateEditHomeScreenManagement.reducer,
  [fromCreateEditHomeScreenManagementOrder.featureKey]:
    fromCreateEditHomeScreenManagementOrder.reducer,
  [fromSplashScreenManagement.featureKey]: fromSplashScreenManagement.reducer,
  [fromCreateEditSplashScreen.featureKey]: fromCreateEditSplashScreen.reducer,
  [fromCheckupPackage.featureKey]: fromCheckupPackage.reducer,
  [fromCheckupPackageOrder.featureKey]: fromCheckupPackageOrder.reducer,
  [fromCreateEditCheckupPackageOrder.featureKey]:
    fromCreateEditCheckupPackageOrder.reducer,
  [fromCreateEditHospital.featureKey]: fromCreateEditHospital.reducer,
  [fromHospital.featureKey]: fromHospital.reducer,
  [fromHospitalOrder.featureKey]: fromHospitalOrder.reducer,
  [fromFundTypeList.featureKey]: fromFundTypeList.reducer,
  [fromCreateEditFundType.featureKey]: fromCreateEditFundType.reducer,
  [fromPointBulk.featureKey]: fromPointBulk.reducer,
  [fromCreateEditPointBulk.featureKey]: fromCreateEditPointBulk.reducer,
  [fromManualCodeRedemption.featureKey]: fromManualCodeRedemption.reducer,
  [fromDisabledClaimByPolicyNo.featureKey]: fromDisabledClaimByPolicyNo.reducer,
  [fromExcludePointByPolicyNo.featureKey]: fromExcludePointByPolicyNo.reducer,
};
