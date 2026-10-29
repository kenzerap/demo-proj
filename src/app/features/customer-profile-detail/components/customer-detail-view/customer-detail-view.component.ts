import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { SvgUsersComponent } from 'src/app/shared/icons/svg-users/svg-users.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SvgVerifiedUserComponent } from 'src/app/shared/icons/svg-verified-user/svg-verified-user.component';
import { SvgCompassComponent } from '../../../../shared/icons/svg-compass/svg-compass.component';
import { SvgPhoneComponent } from '../../../../shared/icons/svg-phone/svg-phone.component';
import { SvgBirthdayCakeComponent } from '../../../../shared/icons/svg-birthday-cake/svg-birthday-cake.component';
import { SvgBatteryComponent } from '../../../../shared/icons/svg-battery/svg-battery.component';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { SvgDeleteComponent } from '../../../../shared/icons/svg-delete/svg-delete.component';
import { SvgGlobeComponent } from '../../../../shared/icons/svg-globe/svg-globe.component';
import { Store } from '@ngrx/store';
import { filter, Observable, take, takeUntil } from 'rxjs';
import { Customer } from '../../models/customer.model';
import * as customerDetailSelectors from '../../stores/customer-detail/customer-detail.selectors';
import * as customerDetailActions from '../../stores/customer-detail/customer-detail.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { PhoneFormatPipe } from 'src/app/shared/pipes/phone-format.pipe';
import { SecurityNoFormatPipe } from 'src/app/shared/pipes/security-no-format.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { checkCustomerStatus } from 'src/app/shared/utils/check-customer-status';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerDetailEditComponent } from '../customer-detail-edit/customer-detail-edit.component';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { Actions, ofType } from '@ngrx/effects';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { MatDialog } from '@angular/material/dialog';
import { CustomerDetailWarningDialogComponent } from '../customer-detail-warning-dialog/customer-detail-warning-dialog.component';
import { CustomerDetailEditResponse } from '../../models/customer-detail-edit-response.model';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customer-detail-view',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatExpansionModule,
    SvgUsersComponent,
    MatDividerModule,
    MatListModule,
    SvgVerifiedUserComponent,
    SvgCompassComponent,
    SvgPhoneComponent,
    SvgBirthdayCakeComponent,
    SvgBatteryComponent,
    MatSlideToggleModule,
    SvgDeleteComponent,
    SvgGlobeComponent,
    PhoneFormatPipe,
    SecurityNoFormatPipe,
    MatProgressSpinnerModule,
    MatTooltipModule,
    CustomerDetailEditComponent,
    HasPermissionsDirective,
  ],
  templateUrl: './customer-detail-view.component.html',
  styleUrl: './customer-detail-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailViewComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  private actions$ = inject(Actions);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  customerDetail$: Observable<Customer | null> = this.store.select(
    customerDetailSelectors.selectCustomerDetail,
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getCustomerDetail'),
  );

  isSaving$: Observable<boolean> = this.store.select(
    selectIsLoading('updateCustomerDetail'),
  );

  isDeleting$: Observable<boolean> = this.store.select(
    selectIsLoading('deleteCustomer'),
  );

  isSidebarColapsed: WritableSignal<boolean> = signal(false);
  partyId: WritableSignal<string> = signal('');
  isEditMode: WritableSignal<boolean> = signal(false);
  isSaveCustomerProfile: WritableSignal<boolean> = signal(false);

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;
  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.CustomerProfile,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  ngOnInit(): void {
    this.activatedRoute.parent?.params
      .pipe(
        filter((params) => !!params['party_id']),
        takeUntil(this.destroy$),
      )
      .subscribe((params) => {
        this.partyId.set(params['party_id']);
        this.store.dispatch(
          customerDetailActions.getCustomerDetail({ partyId: this.partyId() }),
        );
      });

    this.actions$
      .pipe(
        ofType(customerDetailActions.updateCustomerDetailSuccess),
        takeUntil(this.destroy$),
      )
      .subscribe(({ dataResponse, requestBody }) => {
        this.store.dispatch(
          customerDetailActions.setEditFormDirty({ isDirty: false }),
        );

        if (dataResponse.success) {
          this.handleUpdateCustomerDetailSuccess();
          return;
        }

        if (dataResponse.duplicated) {
          this.handleUpdateDupplicated(dataResponse, requestBody);
        }
      });

    this.actions$
      .pipe(
        ofType(customerDetailActions.deleteCustomerSuccess),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: `The user was deleted successfully`,
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['user-management', 'customer-profile']);
        });
      });
  }

  toggleSidebarColapsed() {
    this.isSidebarColapsed.update((value) => !value);

    if (this.isSidebarColapsed()) {
      this.isEditMode.set(false);
    }
  }

  getCustomerStatus(customerDetail: Customer): string {
    return customerDetail.party_status === 'UNCONFIRMED'
      ? 'Unconfirmed'
      : checkCustomerStatus(customerDetail);
  }

  onFraudToggle(value: MatSlideToggleChange) {
    this.store.dispatch(
      customerDetailActions.markCustomerFraudOrBlock({
        partyId: this.partyId(),
        is_fraud: value.checked,
      }),
    );
  }

  onBlockToggle(value: MatSlideToggleChange) {
    this.store.dispatch(
      customerDetailActions.markCustomerFraudOrBlock({
        partyId: this.partyId(),
        is_blocked: value.checked,
      }),
    );
  }

  getCustomerAddress(customerDetail: Customer): string {
    const address = `${customerDetail?.address ?? ''} ${
      customerDetail?.district?.district_th ?? ''
    } ${customerDetail?.sub_district?.sub_district_th ?? ''} ${
      customerDetail?.province?.province_th ?? ''
    } ${customerDetail?.postcode_info?.postcode ?? ''}`;

    if (this.hasEditPermission) {
      return address;
    }

    return this.maskLast(address, 5);
  }

  maskLast(text: string, keep: number): string {
    if (!text) return text;
    if (text.length <= keep) return text;
    return 'x'.repeat(text.length - keep) + text.slice(-keep);
  }

  setEditMode(isEdit: boolean) {
    this.isEditMode.set(isEdit);
  }

  saveCustomerProfile() {
    this.isSaveCustomerProfile.update((value) => !value);
  }

  updateCustomerProfile(customerDetail: Partial<Customer>) {
    this.store.dispatch(
      customerDetailActions.updateCustomerDetail({
        partyId: this.partyId(),
        customerDetail: customerDetail,
      }),
    );
  }

  onDeleteCustomer() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this user?',
        btnConfirmText: 'Delete',
        btnCloseText: 'Cancel',
        type: 'warning',
      },
      width: '25rem',
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((isConfirmed) => !!isConfirmed),
        take(1),
      )
      .subscribe(() => {
        this.store.dispatch(
          customerDetailActions.deleteCustomer({ partyId: this.partyId() }),
        );
      });
  }

  handleUpdateCustomerDetailSuccess() {
    this.setEditMode(false);

    this.store.dispatch(
      customerDetailActions.getCustomerDetail({ partyId: this.partyId() }),
    );

    const messageData: ToastMessageData = {
      title: 'Customer profile update',
      message: `Your updates saved successfully.`,
      type: ToastMessageType.SUCCESS,
    };
    this.store.dispatch(pushMessage({ messageData, duration: 3000 }));
  }

  handleUpdateDupplicated(
    dataResponse: CustomerDetailEditResponse,
    requestBody: Partial<Customer>,
  ) {
    const ref = this.dialog.open(CustomerDetailWarningDialogComponent, {
      data: {
        mobile_no: requestBody.mobile_no,
        dup_mobile_no: dataResponse.dup_mobile_no,
        security_no: requestBody.security_no,
        dup_security_no: dataResponse.dup_security_no,
        email: requestBody.email,
        dup_email: dataResponse.dup_email,
      },
      autoFocus: false,
      width: '30rem',
    });

    ref.afterClosed().subscribe((result) => {
      if (result === 'exitEditMode') {
        this.setEditMode(false);
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(customerDetailActions.reset());
  }
}
