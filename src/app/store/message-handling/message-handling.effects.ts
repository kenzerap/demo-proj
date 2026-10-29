import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import { ToastMessageData } from 'src/app/shared/models/toast-message-data.model';
import * as CustomerProfilesActions from 'src/app/features/customer-profile/stores/customer-profile-list/customer-profile-list.actions';
import * as CustomerPolicyActions from 'src/app/features/customer-profile-detail/stores/analytic-summary/analytic-summary.actions';
import * as ClaimHistoriesActions from 'src/app/features/customer-profile-detail/stores/claim-history/claim-history.actions';
import * as CustomerDetailActions from 'src/app/features/customer-profile-detail/stores/customer-detail/customer-detail.actions';
import * as EClaimSubmitActions from 'src/app/features/customer-profile-detail/stores/e-claim-submit/e-claim-submit.actions';
import * as PointHistoryActions from 'src/app/features/customer-profile-detail/stores/point-history/point-history.actions';
import * as RedeemHistoryActions from 'src/app/features/customer-profile-detail/stores/redeem-history/redeem-history.actions';
import * as OtpHistoryActions from 'src/app/features/customer-profile-detail/stores/otp-history/otp-history.actions';
import * as PolicyDetailActions from 'src/app/features/customer-profile-detail/stores/policy-detail/policy-detail.actions';
import * as MessageHandlingActions from './message-handling.actions';
import { ToastMessageType } from 'src/app/shared/utils/enums/toast-message-type.enum';
import { of } from 'rxjs';
import * as NotificationsActions from '@app/features/push-notification-setting/stores/notification/notification.actions';
import * as CreateEditPushNotificationActions from '@app/features/push-notification-setting/stores/create-edit-push-notification/create-edit-push-notification.actions';
import * as PopupAnnouncementActions from '@app/features/popup-announcement-setting/stores/popup-announcement/popup-announcement.actions';
import * as PopupAnnouncementOrderActions from '@app/features/popup-announcement-setting/stores/reorder-list/reorder-list.actions';
import * as CreateEditPopupAnnouncementActions from '@app/features/popup-announcement-setting/stores/create-edit-popup-announcement/create-edit-popup-announcement.actions';
import * as BannerSettingActions from '@app/features/banner-setting/stores/banner-setting/banner-setting.actions';
import * as BannerSettingOrderActions from '@app/features/banner-setting/stores/reorder-list/reorder-list.actions';
import * as CreateEditBannerSettingActions from '@app/features/banner-setting/stores/create-edit-banner-setting/create-edit-banner-setting.actions';
import * as CustomerSegmentationActions from '@app/features/customer-segmentation/stores/customer-segmentation/customer-segmentation.actions';
import * as CustomerSegmentationOrderActions from '@app/features/customer-segmentation/stores/reorder-list/reorder-list.actions';
import * as CreateEditCustomerSegmentationActions from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.actions';
import * as AccountSettingActions from '@app/features/account-setting/stores/account-setting/account-setting.actions';
import * as CreateEditBrandActions from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.actions';
import * as UserPermissionActions from '@app/store/user-permission/user-permission.actions';
import * as BrandListActions from '@app/features/brand-setting/stores/brand-list/brand-list.actions';
import * as InventoryListActions from '@app/features/inventory-setting/stores/inventory-list/inventory-list.actions';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import * as CreateEditPrivilegeActions from '@app/features/privilege-setting/stores/create-edit-privilege/create-edit-privilege.actions';
import * as PrivilegeSettingActions from '@app/features/privilege-setting/stores/privilege/privilege.actions';
import * as PromocodeSettingActions from '@app/features/promocode-setting/stores/create-edit-promocode/create-edit-promocode.actions';
import * as PromoCodeListActions from '@app/features/promocode-setting/stores/promocode-list/promocode-list.actions';
import * as UnicodeSettingActions from '@app/features/unicode-setting/stores/create-edit-unicode/create-edit-unicode.actions';
import * as UnicodeListActions from '@app/features/unicode-setting/stores/unicode-list/unicode-list.actions';
import * as CreateEditPointRuleActions from '@app/features/point-rule-management/stores/create-edit-point-rule/create-edit-point-rule.actions';
import * as PointRuleListActions from '@app/features/point-rule-management/stores/point-rule-list/point-rule-list.actions';
import * as PrivilegeRedemptionReportActions from '@app/features/privilege-redemption-report/stores/privilede-redemption-report-list/privilege-redemption-report-list.actions';
import * as UserAccountReportActions from '@app/features/user-account-report/stores/user-account-report-list/user-account-report-list.actions';
import * as EclaimReportActions from '@app/features/e-claim-report/stores/e-claim-report-list/e-claim-report-list.actions';
import * as HomeScreenManagementActions from '@app/features/home-screen-management/stores/home-screen-management-list/home-screen-management-list.actions';
import * as CreateEditHomeScreenManagementActions from '@app/features/home-screen-management/stores/create-edit-home-screen/create-edit-home-screen.actions';
import * as CreateEditHomeScreenManagementOrderActions from '@app/features/home-screen-management/stores/reorder-list/reorder-list.actions';
import * as SplashScreenManagementActions from '@app/features/splash-screen-management/stores/splash-screen-management-list/splash-screen-management-list.actions';
import * as CreateEditSplashScreenActions from '@app/features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.actions';
import * as CheckupPackageActions from '@app/features/checkup-package/stores/checkup-package-list/checkup-package-list.actions';
import * as CheckupPackageOrderActions from '@app/features/checkup-package/stores/reorder-list/reorder-list.actions';
import * as CreateEditCheckupPackageOrderActions from '@app/features/checkup-package/stores/create-edit-checkup-package/create-edit-checkup-package.actions';
import * as CreateEditHospitalActions from '@app/features/hospital/stores/create-edit-hospital/create-edit-hospital.actions';
import * as HospitalActions from '@app/features/hospital/stores/hospital-list/hospital-list.actions';
import * as HospitalOrderActions from '@app/features/hospital/stores/reorder-list/reorder-list.actions';
import * as PointBulkActions from '@app/features/point-bulk/stores/point-bulk-list/point-bulk-list.actions';
import * as CreateEditPointBulkActions from '@app/features/point-bulk/stores/create-edit-point-bulk/create-edit-point-bulk.actions';
import * as ManualCodeRedemptionActions from '@app/features/manual-code-redemption/stores/manual-code-redemption/manual-code-redemption.actions';
import * as DisabledClaimByPolicyNoActions from '@app/features/disabled-claim-by-policy-no/stores/disabled-claim-by-policy-no-list/disabled-claim-by-policy-no-list.actions';
import * as ExcludePointByPolicyNoActions from '@app/features/exclude-point-by-policy-no/stores/exclude-point-by-policy-no-list/exclude-point-by-policy-no-list.actions';
import * as FundTypeListActions from '@app/features/fund-type/stores/fund-type-list/fund-type-list.actions';
import * as CreateEditFundTypeActions from '@app/features/fund-type/stores/create-edit-fund-type/create-edit-fund-type.actions';

@Injectable()
export class MessageHandlingEffects {
  private actions$ = inject(Actions);

  commonErrorMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CustomerProfilesActions.getCustomerProfilesFailure,
        CustomerPolicyActions.getCustomerPolicyFailure,
        CustomerPolicyActions.getCustomerPointFailure,
        CustomerPolicyActions.getClientsInfoSvocFailure,
        ClaimHistoriesActions.getClaimHistoriesFailure,
        CustomerDetailActions.getCustomerDetailFailure,
        EClaimSubmitActions.downloadImagesZipFailure,
        EClaimSubmitActions.getEClaimImageUrlsFailure,
        EClaimSubmitActions.getEClaimSubmitsFailure,
        PointHistoryActions.getPointExpiriesFailure,
        PointHistoryActions.getPointHistoriesFailure,
        RedeemHistoryActions.getRedeemHistoriesFailure,
        OtpHistoryActions.getOtpHistoriesFailure,
        PolicyDetailActions.getPolicyDetailFailure,
        NotificationsActions.getNotificationsFailure,
        NotificationsActions.getTargetGroupUserCountFailure,
        CreateEditPushNotificationActions.getPrivilegesFailure,
        PopupAnnouncementActions.getPopupAnnouncementsFailure,
        PopupAnnouncementActions.getPopupAnnouncementTabsFailure,
        PopupAnnouncementActions.getTargetGroupUserCountFailure,
        PopupAnnouncementOrderActions.getMissingPopupAnnouncementsFailure,
        CreateEditPopupAnnouncementActions.getPrivilegesFailure,
        CreateEditPopupAnnouncementActions.getTierGroupsFailure,
        CreateEditPopupAnnouncementActions.getSegmentGroupsFailure,
        BannerSettingActions.getBannerSettingsFailure,
        BannerSettingActions.getBannerSettingTabsFailure,
        BannerSettingActions.getTargetGroupUserCountFailure,
        BannerSettingOrderActions.getMissingBannerSettingsFailure,
        CreateEditBannerSettingActions.getPrivilegesFailure,
        CreateEditBannerSettingActions.getTierGroupsFailure,
        CreateEditBannerSettingActions.getSegmentGroupsFailure,
        CustomerSegmentationActions.getCustomerSegmentationsFailure,
        CustomerSegmentationOrderActions.getMissingCustomerSegmentationsFailure,
        CreateEditCustomerSegmentationActions.getCustomerSegmentationDetailFailure,
        AccountSettingActions.getAccountSettingsFailure,
        AccountSettingActions.getGroupsFailure,
        CreateEditBrandActions.getBrandCategoriesFailure,
        CreateEditBrandActions.getBrandDetailFailure,
        CreateEditBrandActions.getBrandDisplayOrdersFailure,
        UserPermissionActions.getUserPermissionsAPIFailure,
        BrandListActions.getBrandsFailure,
        InventoryListActions.getInventoriesFailure,
        CreateEditInventoryActions.getBrandOptionsFailure,
        CreateEditInventoryActions.getInventoryUploadCodeSummaryFailure,
        CreateEditInventoryActions.getInventoryDetailFailure,
        CreateEditPrivilegeActions.getBrandOptionsFailure,
        CreateEditPrivilegeActions.getSegmentGroupsFailure,
        CreateEditPrivilegeActions.getTierGroupsFailure,
        CreateEditPrivilegeActions.getPrivilegeDetailFailure,
        CreateEditPrivilegeActions.getHealthcarePackageOptionsFailure,
        CreateEditPrivilegeActions.getUploadCodeInventoriesFailure,
        PrivilegeSettingActions.getPrivilegeSettingsFailure,
        PrivilegeSettingActions.getTargetGroupUserCountFailure,
        PromocodeSettingActions.getPolicyChannelsFailure,
        PromocodeSettingActions.getPrivilegesFailure,
        PromocodeSettingActions.getPromocodeDetailFailure,
        PromoCodeListActions.getPromoCodesFailure,
        UnicodeSettingActions.getPolicyChannelsFailure,
        UnicodeSettingActions.getPrivilegesFailure,
        UnicodeSettingActions.getUnicodeDetailFailure,
        UnicodeListActions.getUnicodesFailure,
        CreateEditPointRuleActions.getTierGroupsFailure,
        CreateEditPointRuleActions.getPointRuleDetailFailure,
        PointRuleListActions.getPointRulesFailure,
        PrivilegeRedemptionReportActions.getPrivilegeRedemptionReportFailure,
        UserAccountReportActions.getUserAccountReportTotalsFailure,
        UserAccountReportActions.getUserAccountReportsFailure,
        EclaimReportActions.getEclaimReportsFailure,
        HomeScreenManagementActions.getHomeScreenManagementFailure,
        CreateEditHomeScreenManagementActions.getHomeScreenDetailFailure,
        CreateEditHomeScreenManagementOrderActions.getMissingHomeScreenManagementsFailure,
        SplashScreenManagementActions.getSplashScreenManagementsFailure,
        CreateEditSplashScreenActions.getSplashScreenDetailFailure,
        CreateEditSplashScreenActions.getSplashScreenDisplayOrdersFailure,
        CheckupPackageActions.getCheckupPackgageFailure,
        CheckupPackageOrderActions.getMissingCheckupPackagesFailure,
        CreateEditHospitalActions.getDistrictsFailure,
        CreateEditHospitalActions.getHealthcarePackageFailure,
        CreateEditHospitalActions.getProvincesFailure,
        HospitalActions.getHospitalFailure,
        HospitalOrderActions.getMissingHospitalsFailure,
        PointBulkActions.getPointBulksFailure,
        PointBulkActions.downloadFileTemplateFailure,
        ManualCodeRedemptionActions.getManualCodeRedemptionFailure,
        DisabledClaimByPolicyNoActions.getDisabledClaimPoliciesFailure,
        ExcludePointByPolicyNoActions.getExcludePointPoliciesFailure,
        FundTypeListActions.getFundTypesFailure,
        CreateEditFundTypeActions.getFundTypeDetailFailure,
        CreateEditFundTypeActions.getFundTypeOptionsFailure
      ),
      mergeMap(({ error }) => {
        const errorObjectMessage =
          error?.error?.errors && error?.error?.errors.length > 0
            ? error?.error?.errors?.[0]
            : null;
        const errorTitle = !errorObjectMessage
          ? 'API Undefined Error'
          : error?.title || 'System error';

        const messageData: ToastMessageData = {
          title: errorTitle,
          message: errorObjectMessage
            ? `${errorObjectMessage.error_code} - ${errorObjectMessage.message}`
            : 'Something went wrong - API Undefined error',
          type: ToastMessageType.ERROR,
        };

        return of(MessageHandlingActions.pushMessage({ messageData }));
      })
    )
  );

  customErrorMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PointHistoryActions.addPointFailure,
        PointHistoryActions.deletePointFailure,
        PointHistoryActions.exportPointToExcelFailure,
        RedeemHistoryActions.exportRedeemToExcelFailure,
        CustomerDetailActions.updateCustomerDetailFailure,
        CustomerDetailActions.deleteCustomerFailure,
        CreateEditPushNotificationActions.createPushNotificationFailure,
        CreateEditPushNotificationActions.updatePushNotificationFailure,
        PopupAnnouncementOrderActions.reOrderPopupAnnouncementsFailure,
        CreateEditPopupAnnouncementActions.createPopupAnnouncementFailure,
        CreateEditPopupAnnouncementActions.updatePopupAnnouncementFailure,
        BannerSettingOrderActions.reOrderBannerSettingsFailure,
        CreateEditBannerSettingActions.createBannerSettingFailure,
        CreateEditBannerSettingActions.updateBannerSettingFailure,
        CustomerSegmentationOrderActions.reOrderCustomerSegmentationsFailure,
        AccountSettingActions.createUserAccountFailure,
        CreateEditBrandActions.createBrandFailure,
        CreateEditBrandActions.updateBrandFailure,
        CreateEditBrandActions.createBrandCategoryFailure,
        CreateEditBrandActions.editBrandCategoryFailure,
        BrandListActions.updateStatusBrandFailure,
        CreateEditInventoryActions.createInventoryFailure,
        CreateEditInventoryActions.createInventoryAndUpdateDataFailure,
        CreateEditInventoryActions.uploadCodeFailure,
        CreateEditInventoryActions.validateUploadCodeFailure,
        CreateEditInventoryActions.deleteUploadCodeFailure,
        CreateEditInventoryActions.updateInventoryFailure,
        CreateEditInventoryActions.createEditProductStockFailure,
        CreateEditInventoryActions.deleteProductStockFailure,
        InventoryListActions.exportUploadCodeInventoryFailure,
        CreateEditPrivilegeActions.createPrivilegeFailure,
        CreateEditPrivilegeActions.updatePrivilegeFailure,
        CreateEditPrivilegeActions.updatePublishedPrivilegeFailure,
        PromocodeSettingActions.createPromocodeFailure,
        UnicodeSettingActions.createUnicodeFailure,
        UnicodeSettingActions.updateUnicodeFailure,
        UnicodeSettingActions.exportUnicodeFailure,
        CreateEditHomeScreenManagementActions.createHomeScreenFailure,
        CreateEditHomeScreenManagementActions.updateHomeScreenFailure,
        CreateEditHomeScreenManagementOrderActions.reOrderHomeScreenManagementsFailure,
        CreateEditSplashScreenActions.createSplashScreenFailure,
        CreateEditSplashScreenActions.updateSplashScreenFailure,
        CheckupPackageOrderActions.reOrderCheckupPackagesFailure,
        CreateEditCheckupPackageOrderActions.createCheckupPackageFailure,
        CreateEditHospitalActions.createHospitalFailure,
        HospitalOrderActions.reOrderHospitalsFailure,
        CreateEditPointBulkActions.validateUploadPointBulkFailure,
        CreateEditPointBulkActions.uploadPointBulkFailure,
        CreateEditCustomerSegmentationActions.createCustomerSegmentationFailure,
        ManualCodeRedemptionActions.exportManualCodeRedemptionFailure,
        DisabledClaimByPolicyNoActions.deleteDisabledClaimPolicyFailure,
        DisabledClaimByPolicyNoActions.addPolicyToDisabledClaimFailure,
        ExcludePointByPolicyNoActions.deleteExcludePointPolicyFailure,
        ExcludePointByPolicyNoActions.addPolicyToExcludePointFailure,
        CreateEditFundTypeActions.createFundTypeFailure,
        CreateEditFundTypeActions.updateFundTypeFailure
      ),
      mergeMap(({ messageData }) => {
        return of(MessageHandlingActions.pushMessage({ messageData }));
      })
    )
  );
}
