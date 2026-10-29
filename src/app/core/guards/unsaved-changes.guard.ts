import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate } from '@angular/router';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectIsEditFormDirty } from '@app/features/customer-profile-detail/stores/customer-detail/customer-detail.selectors';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { selectIsFormDirty } from '@app/features/push-notification-setting/stores/create-edit-push-notification/create-edit-push-notification.selectors';
import { selectIsFormDirty as popupAnnouncementFormDirty } from '@app/features/popup-announcement-setting/stores/create-edit-popup-announcement/create-edit-popup-announcement.selectors';
import { selectIsFormDirty as bannerSettingFormDirty } from '@app/features/banner-setting/stores/create-edit-banner-setting/create-edit-banner-setting.selectors';
import { selectIsOrderDirty as popupAnnouncementIsOrderDirty } from '@app/features/popup-announcement-setting/stores/reorder-list/reorder-list.selectors';
import { selectIsOrderDirty as bannerSettingIsOrderDirty } from '@app/features/banner-setting/stores/reorder-list/reorder-list.selectors';
import { selectIsOrderDirty as customerSegmentationIsOrderDirty } from '@app/features/customer-segmentation/stores/reorder-list/reorder-list.selectors';
import { selectIsFormDirty as brandFormDirty } from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.selectors';
import { selectIsFormDirty as inventoryFormDirty } from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.selectors';
import { segmentFormDirty } from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.selectors';
import { selectIsFormDirty as privilegeFormDirty } from '@app/features/privilege-setting/stores/create-edit-privilege/create-edit-privilege.selectors';
import { selectIsFormDirty as promocodeSettingFormDirty } from '@app/features/promocode-setting/stores/create-edit-promocode/create-edit-promocode.selectors';
import { selectIsFormDirty as unicodeSettingFormDirty } from '@app/features/unicode-setting/stores/create-edit-unicode/create-edit-unicode.selectors';
import { selectIsFormDirty as pointRuleFormDirty } from '@app/features/point-rule-management/stores/create-edit-point-rule/create-edit-point-rule.selectors';
import { selectIsFormDirty as homeScreenFormDirty } from '@app/features/home-screen-management/stores/create-edit-home-screen/create-edit-home-screen.selectors';
import { selectIsOrderDirty as homeScreenManagementIsOrderDirty } from '@app/features/home-screen-management/stores/reorder-list/reorder-list.selectors';
import { selectIsOrderDirty as checkupPackageIsOrderDirty } from '@app/features/checkup-package/stores/reorder-list/reorder-list.selectors';
import { selectIsFormDirty as checkupPackageFormDirty } from '@app/features/checkup-package/stores/create-edit-checkup-package/create-edit-checkup-package.selectors';
import { selectIsFormDirty as hospitalFormDirty } from '@app/features/hospital/stores/create-edit-hospital/create-edit-hospital.selectors';
import { selectIsOrderDirty as hospitalIsOrderDirty } from '@app/features/hospital/stores/reorder-list/reorder-list.selectors';
import { selectIsFormDirty as fundTypeFormDirty } from '@app/features/fund-type/stores/create-edit-fund-type/create-edit-fund-type.selectors';
import { selectIsFormDirty as splashScreenFormDirty } from '@app/features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.selectors';

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesGuard
  extends BaseComponent
  implements CanDeactivate<unknown>
{
  private store = inject(Store);
  private dialog = inject(MatDialog);

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const key = currentRoute.data['unsaveChangeKey'];
    let obser = of(false);
    switch (key) {
      case 'customerDetail':
        obser = this.store.select(selectIsEditFormDirty);
        break;
      case 'createNotificationSetting':
        obser = this.store.select(selectIsFormDirty);
        break;
      case 'createPopupAnnouncementSetting':
        obser = this.store.select(popupAnnouncementFormDirty);
        break;
      case 'createBannerSetting':
        obser = this.store.select(bannerSettingFormDirty);
        break;
      case 'orderPopupAnnouncementLayout':
        obser = this.store.select(popupAnnouncementIsOrderDirty);
        break;
      case 'orderBannerSettingLayout':
        obser = this.store.select(bannerSettingIsOrderDirty);
        break;
      case 'orderCustomerSegmentationList':
        obser = this.store.select(customerSegmentationIsOrderDirty);
        break;
      case 'createBrandSetting':
        obser = this.store.select(brandFormDirty);
        break;
      case 'createInventorySetting':
        obser = this.store.select(inventoryFormDirty);
        break;
      case 'createCustomerSegmentation':
        obser = this.store.select(segmentFormDirty);
        break;
      case 'createPrivilegeSetting':
        obser = this.store.select(privilegeFormDirty);
        break;
      case 'createPromocodeSetting':
        obser = this.store.select(promocodeSettingFormDirty);
        break;
      case 'createUnicodeSetting':
        obser = this.store.select(unicodeSettingFormDirty);
        break;
      case 'createPointRuleSetting':
        obser = this.store.select(pointRuleFormDirty);
        break;
      case 'createHomeScreen':
        obser = this.store.select(homeScreenFormDirty);
        break;
      case 'orderHomeScreenManagementList':
        obser = this.store.select(homeScreenManagementIsOrderDirty);
        break;
      case 'orderCheckupPackageList':
        obser = this.store.select(checkupPackageIsOrderDirty);
        break;
      case 'createCheckupPackage':
        obser = this.store.select(checkupPackageFormDirty);
        break;
      case 'createHospital':
        obser = this.store.select(hospitalFormDirty);
        break;
      case 'orderHospitalList':
        obser = this.store.select(hospitalIsOrderDirty);
        break;
      case 'createFundType':
        obser = this.store.select(fundTypeFormDirty);
        break;
      case 'createSplashScreenManagement':
        obser = this.store.select(splashScreenFormDirty);
        break;

      default:
        obser = of(false);
        break;
    }

    return obser.pipe(
      take(1),
      switchMap((isDirty) => {
        if (!isDirty) return of(true);

        const isChangeOrder =
          key === 'orderPopupAnnouncementLayout' ||
          key === 'orderBannerSettingLayout' ||
          key === 'orderCustomerSegmentationList' ||
          key === 'orderHomeScreenManagementList' ||
          key === 'orderCheckupPackageList' ||
          key === 'orderHospitalList';

        const data = isChangeOrder
          ? {
              title: 'Discard Changes?',
              message: `You have unsaved changes. If you cancel now, your changes will not be saved. Do you want to continue?`,
              btnConfirmText: 'Discard',
              btnCloseText: 'Cancel',
              type: 'warning',
            }
          : {
              message: `<div>You have unsaved changes on this page.</div> <div>If you click confirm, your changes will be lost.</div>`,
              btnCloseText: 'Cancel',
              btnConfirmText: 'Confirm',
              type: 'warning',
            };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data,
          width: '25rem',
        });
        return dialogRef.afterClosed().pipe(map((isConfirm) => !!isConfirm));
      }),
    );
  }
}
