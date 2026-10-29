import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { filter, merge, Observable, takeUntil } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as CreateEditUnicodeActions from '../../stores/create-edit-unicode/create-edit-unicode.actions';
import * as createEditUnicodeSelectors from '../../stores/create-edit-unicode/create-edit-unicode.selectors';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseSettingSectionComponent } from '../base-setting-section/base-setting-section.component';
import { RedeemLimitCondition } from '@app/shared/utils/enums/redeem-limit-condition.enums';
import { CodeSectionComponent } from '../code-section/code-section.component';
import { RedeemLimitSectionComponent } from '../redeem-limit-section/redeem-limit-section.component';
import { RewardsSectionComponent } from '../rewards-section/rewards-section.component';
import { CreateEditUnicodeQueryParams } from '../../models/create-edit-unicode-query-params.model';
import { UnicodeDetail } from '../../models/unicode-model';
import { v4 as uuidv4 } from 'uuid';
import { checkIsRedeemedCode } from '@shared/constants/check-is-redeemed-code.const';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { SvgExportComponent } from '../../../../shared/icons/svg-export/svg-export.component';

@Component({
  selector: 'app-create-edit-unicode',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    BaseSettingSectionComponent,
    CodeSectionComponent,
    RedeemLimitSectionComponent,
    RewardsSectionComponent,
    HasPermissionsDirective,
    SvgExportComponent,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-unicode.component.html',
  styleUrl: './create-edit-unicode.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditUnicodeComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private actions$ = inject(Actions);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);

  loading$ = this.store.select(selectIsLoading(`createEditUnicode`));
  exportLoading$ = this.store.select(selectIsLoading(`exportUnicode`));
  unicodeDetail$: Observable<UnicodeDetail | null> = this.store.select(
    createEditUnicodeSelectors.selectUnicodeDetail
  );

  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  unicodeId: WritableSignal<number> = signal(0);
  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  baseSettingForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    isActive: [''],
    start_date: [new Date()],
    start_time: [this.datePipe.transform(new Date(), 'HH:mm')],
    end_date: [''],
    end_time: [''],
  });

  codeForm: FormGroup = this.fb.group({
    is_share_quota_allocation: [false],
    sharedQuota: ['', [Validators.min(0), Validators.max(20000)]],
    sharedCode: [''],
    sharedRedeemedQuota: [''],
    codes: this.fb.array([
      this.fb.group({
        tempId: [uuidv4()],
        code: ['', Validators.required],
        channel: [''],
        quota: [
          '',
          [Validators.required, Validators.min(0), Validators.max(20000)],
        ],
        redeemed_quota: [''],
      }),
    ]),
  });

  rewardsForm: FormGroup = this.fb.group({
    is_point: [false],
    is_privilege: [false],
    earning_point: ['', [Validators.required, Validators.min(0)]],
    earning_point_expiry_date: ['', Validators.required],
    is_advance_reward: [{ value: false, disabled: true }],
    is_special_condition_fraud_user: [false],
    fraud_condition_point: ['', [Validators.required, Validators.min(0)]],
    fraud_condition_point_expire_date: ['', Validators.required],
    privilege: ['', Validators.required],
  });

  redeemLimitForm: FormGroup = this.fb.group({
    redeem_condition: [RedeemLimitCondition.PER_PRIVILEGE, Validators.required],
    redeem_quota: [1, [Validators.required, Validators.min(0)]],
    is_advance_limit: [{ value: false, disabled: true }],
  });

  /* istanbul ignore next */
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['unicode_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.unicodeId.set(params['unicode_id']);
        this.setFormMode('view');
        this.disableAllForm();
        this.store.dispatch(
          CreateEditUnicodeActions.getUnicodeDetail({
            unicodeId: this.unicodeId(),
          })
        );
      });
    this.unicodeDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((unicodeDetail) => !!unicodeDetail)
      )
      .subscribe((unicodeDetail: UnicodeDetail) => {
        this.baseSettingForm.patchValue({
          name: unicodeDetail?.name,
          description: unicodeDetail?.description,
          isActive: unicodeDetail.status,
          start_date: unicodeDetail?.start_date_time,
          start_time: this.datePipe.transform(
            unicodeDetail?.start_date_time,
            'HH:mm'
          ),
          end_date: unicodeDetail?.end_date_time,
          end_time: this.datePipe.transform(
            unicodeDetail?.end_date_time,
            'HH:mm'
          ),
        });

        let codes = [];
        if (unicodeDetail?.is_share_quota_allocation) {
          if (
            unicodeDetail.codes[0].channel.length === 0 &&
            unicodeDetail.codes[0].code
          ) {
            codes = [
              {
                code: '',
                channel: '',
                quota: '',
                redeemed_quota: unicodeDetail.codes[0].redeemed_quota || 0,
              },
            ];
          } else {
            codes = unicodeDetail.codes[0].channel.map((channel) => {
              return {
                code: '',
                channel,
                quota: '',
                redeemed_quota: unicodeDetail.codes[0].redeemed_quota || 0,
              };
            });
          }
        } else {
          codes = unicodeDetail.codes.map((item) => {
            return {
              code: item.code,
              channel: item.channel[0],
              quota: item.quota,
              redeemed_quota: item.redeemed_quota || 0,
            };
          });
        }
        this.codeForm.patchValue({
          is_share_quota_allocation: unicodeDetail?.is_share_quota_allocation,
          sharedQuota: unicodeDetail?.is_share_quota_allocation
            ? unicodeDetail.codes[0].quota
            : '',
          sharedCode: unicodeDetail?.is_share_quota_allocation
            ? unicodeDetail.codes[0].code
            : '',
          sharedRedeemedQuota: unicodeDetail?.is_share_quota_allocation
            ? unicodeDetail.codes[0].redeemed_quota || 0
            : '',
          codes,
        });

        this.rewardsForm.patchValue({
          is_point: unicodeDetail?.is_point,
          is_privilege: unicodeDetail?.is_privilege,
          earning_point: unicodeDetail?.point_data[0]?.point,
          earning_point_expiry_date:
            unicodeDetail?.point_data[0]?.point_expire_date,
          is_advance_reward: unicodeDetail?.is_advance_reward,
          is_special_condition_fraud_user:
            unicodeDetail?.is_special_condition_fraud_user,
          fraud_condition_point: unicodeDetail?.fraud_condition_point,
          fraud_condition_point_expire_date:
            unicodeDetail?.fraud_condition_point_expire_date,
          privilege: unicodeDetail?.privilege_details,
        });

        this.redeemLimitForm.patchValue({
          redeem_condition: unicodeDetail?.redeem_limit[0]?.redeem_condition,

          redeem_quota: unicodeDetail?.redeem_limit[0]?.redeem_quota,
          is_advance_limit: unicodeDetail?.is_advance_limit,
        });

        this.baseSettingForm.markAsPristine();
        this.codeForm.markAsPristine();
        this.rewardsForm.markAsPristine();
        this.redeemLimitForm.markAsPristine();
        this.codeForm.markAsUntouched();
        setTimeout(() => {
          this.store.dispatch(
            CreateEditUnicodeActions.setFormDirty({ isDirty: false })
          );
        }, 0);
      });

    merge(
      this.baseSettingForm.valueChanges,
      this.codeForm.valueChanges,
      this.rewardsForm.valueChanges,
      this.redeemLimitForm.valueChanges
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditUnicodeActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditUnicodeActions.createUnicodeSuccess,
          CreateEditUnicodeActions.updateUnicodeSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditUnicodeActions.setFormDirty({ isDirty: false })
        );
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The Code was created`
                : 'The Code was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['privilege-management', 'unicode-setting']);
        });
      });
  }

  /* istanbul ignore next */
  onSubmit() {
    const iscodeFormValid =
      this.codeForm.valid &&
      (this.codeForm.get('codes')?.getRawValue() || []).length > 0;

    const isRewardsFormValid =
      this.rewardsForm.valid &&
      (this.rewardsForm.get('is_point')?.value ||
        this.rewardsForm.get('is_privilege')?.value);
    // check validate
    const isValidForm =
      this.baseSettingForm.valid &&
      iscodeFormValid &&
      isRewardsFormValid &&
      this.redeemLimitForm.valid;
    if (!isValidForm) {
      this.baseSettingForm.markAllAsTouched();
      this.codeForm.markAllAsTouched();
      this.rewardsForm.markAllAsTouched();
      this.redeemLimitForm.markAllAsTouched();
      return;
    }

    // baseSettingForm
    const { start_date_time, end_date_time } = this.getStartDateTimeEndDateTime(
      this.baseSettingForm
    );

    // codeForm
    const codesValue = this.codeForm.get('codes')?.getRawValue() || [];
    let codeResult = [];

    if (!!this.codeForm.get('is_share_quota_allocation')?.getRawValue()) {
      codeResult.push({
        code: this.codeForm.get('sharedCode')?.getRawValue(),
        channel:
          codesValue.length === 1 && !codesValue[0].channel
            ? []
            : codesValue.map((item: any) => item.channel),
        quota: Number(this.codeForm.get('sharedQuota')?.getRawValue()),
        redeemed_quota: Number(
          this.codeForm.get('sharedRedeemedQuota')?.getRawValue() || 0
        ),
      });
    } else {
      codeResult = codesValue.map((codeData: any) => {
        return {
          ...codeData,
          channel: codeData.channel ? [codeData.channel] : [],
          quota: Number(codeData.quota),
          code: codeData.code,
          redeemed_quota: codeData.redeemed_quota
            ? Number(codeData.redeemed_quota)
            : 0,
        };
      });
    }

    const earningPointExpiryDate = this.rewardsForm
      .get('earning_point_expiry_date')
      ?.getRawValue()
      ? new Date(
          this.rewardsForm.get('earning_point_expiry_date')?.getRawValue()
        )
      : null;

    if (earningPointExpiryDate) {
      earningPointExpiryDate.setHours(23, 59, 59);
    }

    const fraudConditionPointExpireDate = this.rewardsForm
      .get('fraud_condition_point_expire_date')
      ?.getRawValue()
      ? new Date(
          this.rewardsForm
            .get('fraud_condition_point_expire_date')
            ?.getRawValue()
        )
      : null;

    if (fraudConditionPointExpireDate) {
      fraudConditionPointExpireDate.setHours(23, 59, 59);
    }

    const bodyQueryParams: Partial<CreateEditUnicodeQueryParams> = {
      name: this.baseSettingForm.get('name')?.getRawValue(),
      description: this.baseSettingForm.get('description')?.getRawValue(),
      status: !!this.baseSettingForm.get('isActive')?.getRawValue(),
      start_date_time: this.baseSettingForm.get('start_date')?.getRawValue()
        ? start_date_time.toISOString()
        : '',
      end_date_time: this.baseSettingForm.get('end_date')?.getRawValue()
        ? end_date_time?.toISOString()
        : '',
      is_share_quota_allocation: this.codeForm
        .get('is_share_quota_allocation')
        ?.getRawValue(),
      codes: codeResult,
      is_advance_reward: this.redeemLimitForm
        .get('is_advance_reward')
        ?.getRawValue(),
      is_point: this.rewardsForm.get('is_point')?.getRawValue(),
      is_privilege: this.rewardsForm.get('is_privilege')?.getRawValue(),
      point_data: this.rewardsForm.get('is_point')?.getRawValue()
        ? [
            {
              point: Number(
                this.rewardsForm.get('earning_point')?.getRawValue()
              ),
              point_expire_date: earningPointExpiryDate?.toISOString() || null,
            },
          ]
        : [],
      privilege_id: this.rewardsForm.get('privilege')?.getRawValue()
        ?.privilegeId,
      is_special_condition_fraud_user: this.rewardsForm
        .get('is_special_condition_fraud_user')
        ?.getRawValue(),
      fraud_condition_point: Number(
        this.rewardsForm.get('fraud_condition_point')?.getRawValue()
      ),
      fraud_condition_point_expire_date:
        fraudConditionPointExpireDate?.toISOString() || null,
      is_advance_limit: this.redeemLimitForm
        .get('is_advance_limit')
        ?.getRawValue(),
      redeem_limit: [
        {
          redeem_condition: this.redeemLimitForm
            .get('redeem_condition')
            ?.getRawValue(),
          redeem_quota: Number(
            this.redeemLimitForm.get('redeem_quota')?.getRawValue()
          ),
        },
      ],
    };

    if (this.formMode() === 'edit') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Update Code?',
          message:
            'If you confirm this change, the system will update the code, which will affect its redemption in DEMOPROJ365.',
          btnCloseText: 'Cancel',
          btnConfirmText: 'Confirm',
          type: 'warning',
        },
        width: '25rem',
      });
      dialogRef
        .afterClosed()
        .pipe(
          takeUntil(this.destroy$),
          filter((isConfirm) => !!isConfirm)
        )
        .subscribe(() => {
          this.store.dispatch(
            CreateEditUnicodeActions.updateUnicode({
              data: { ...bodyQueryParams, id: this.unicodeId() },
            })
          );
        });
    } else {
      this.store.dispatch(
        CreateEditUnicodeActions.createUnicode({
          queryParams: bodyQueryParams,
        })
      );
    }
  }

  setFormMode(mode: 'create' | 'edit' | 'view') {
    this.formMode.set(mode);
    if (mode === 'edit') {
      this.enableAllForm();
    }
    setTimeout(() => {
      this.store.dispatch(
        CreateEditUnicodeActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.baseSettingForm.disable({ emitEvent: false });
    this.codeForm.disable({ emitEvent: false });
    this.rewardsForm.disable({ emitEvent: false });
    this.redeemLimitForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.baseSettingForm.enable({ emitEvent: false });
    this.codeForm.enable({ emitEvent: false });
    this.rewardsForm.enable({ emitEvent: false });
    this.redeemLimitForm.enable({ emitEvent: false });

    this.rewardsForm.get('is_advance_reward')?.disable({ emitEvent: false });
    this.redeemLimitForm.get('is_advance_limit')?.disable({ emitEvent: false });

    if (checkIsRedeemedCode(this.codeForm)) {
      this.codeForm
        .get('is_share_quota_allocation')
        ?.disable({ emitEvent: false });
    }

    if (
      this.codeForm.get('is_share_quota_allocation')?.getRawValue() &&
      this.codeForm.get('sharedRedeemedQuota')?.getRawValue()
    ) {
      this.codeForm.get('sharedCode')?.disable({ emitEvent: false });
      this.codeForm.get('codes')?.disable({ emitEvent: false });
      return;
    }

    const codesArray = this.codeForm.get('codes') as FormArray;
    codesArray.controls.forEach((control) => {
      if (!!control.get('redeemed_quota')?.getRawValue()) {
        control.get('code')?.disable({ emitEvent: false });
        control.get('channel')?.disable({ emitEvent: false });
      }
    });
  }

  getStartDateTimeEndDateTime(formGroup: FormGroup): {
    start_date_time: Date;
    end_date_time: Date | null;
  } {
    const rawValue = formGroup.getRawValue();

    const startTime = rawValue?.start_time;
    const endTime = rawValue?.end_time;
    const startDate = rawValue?.start_date;
    const endDate = rawValue?.end_date;
    const [startHours, startMinutes] = (startTime || '00:00')
      .split(':')
      .map(Number);
    const start_date_time = new Date(startDate);
    start_date_time.setHours(startHours, startMinutes, 0, 0);
    const [endHours, endMinutes] = (endTime || '00:00').split(':').map(Number);
    const end_date_time = endDate ? new Date(endDate) : null;
    end_date_time?.setHours(endHours, endMinutes, 0, 0);

    return {
      start_date_time,
      end_date_time,
    };
  }

  exportToExcel() {
    this.store.dispatch(
      CreateEditUnicodeActions.exportUnicode({
        unicode_id: this.unicodeId(),
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditUnicodeActions.reset());
  }
}
