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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { filter, map, merge, Observable, of, takeUntil } from 'rxjs';
import { ActivePeriodSectionComponent } from '../active-period-section/active-period-section.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TargetGroupType } from '../../../../shared/components/target-group-section/target-group-type.enum';
import * as CreateEditPrivilegeActions from '../../stores/create-edit-privilege/create-edit-privilege.actions';
import * as createEditPrivilegeSelectors from '../../stores/create-edit-privilege/create-edit-privilege.selectors';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { TargetGroup } from '../../../../shared/models/target-group.model';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { targetGroupList } from '../../../../shared/constants/target-group-list.const';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { noSpacesValidatorAsync } from '@app/shared/utils/no-spaces-validator';
import { TargetGroupSectionComponent } from '@app/shared/components/target-group-section/target-group-section.component';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';
import { VisiblePeriodSectionComponent } from '../visible-period-section/visible-period-section.component';
import { PrivilegeSettingSectionComponent } from '../privilege-setting-section/privilege-setting-section.component';
import { MessagesSectionComponent } from '../messages-section/messages-section.component';
import { RedeemSectionComponent } from '../redeem-section/redeem-section.component';
import { RedeemLimitSectionComponent } from '../redeem-limit-section/redeem-limit-section.component';
import { PointDiscountSectionComponent } from '../point-discount-section/point-discount-section.component';
import { PrivilegeTypeEnum } from '../../../../shared/utils/enums/privilege-type.enums';
import { CampaignType } from '../../../../shared/utils/enums/campaign-type.enums';
import { RedeemLimitCondition } from '../../../../shared/utils/enums/redeem-limit-condition.enums';
import { CreateEditPrivilegesQueryParams } from '../../models/create-edit-privilege-query-params.model';
import { HealthcarePackageSectionComponent } from '../healthcare-package-section/healthcare-package-section.component';
import { InventorySectionComponent } from '../inventory-section/inventory-section.component';
import { urlValidator } from '@app/shared/utils/url-validator';
import { PrivilegeDetail } from '../../models/privilege-setting-model';
import { SvgCopyComponent } from '../../../../shared/icons/svg-copy/svg-copy.component';
import { InventoryTabCode } from '../../constants/add-inventory-tabs.const';

@Component({
  selector: 'app-create-edit-privilege',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    TargetGroupSectionComponent,
    MatFormFieldModule,
    ActivePeriodSectionComponent,
    VisiblePeriodSectionComponent,
    PrivilegeSettingSectionComponent,
    MessagesSectionComponent,
    RedeemSectionComponent,
    RedeemLimitSectionComponent,
    PointDiscountSectionComponent,
    HealthcarePackageSectionComponent,
    InventorySectionComponent,
    SvgCopyComponent,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-privilege.component.html',
  styleUrl: './create-edit-privilege.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditPrivilegeComponent
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

  loading$ = this.store.select(selectIsLoading(`createEditPrivilege`));
  publishedLoading$ = this.store.select(
    selectIsLoading(`updatePublishedPrivilege`)
  );
  privilegeDetail$: Observable<PrivilegeDetail | null> = this.store.select(
    createEditPrivilegeSelectors.selectPrivilegeDetail
  );
  tierGroups$: Observable<TierGroup[]> = this.store.select(
    createEditPrivilegeSelectors.selectTierGroups
  );

  segmentGroups$: Observable<SegmentGroup[]> = this.store.select(
    createEditPrivilegeSelectors.selectSegmentGroups
  );

  targetGroups: WritableSignal<TargetGroup[]> = signal([]);
  privilegeType = PrivilegeTypeEnum;
  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  privilegeId: WritableSignal<number> = signal(0);
  tierSegmentIncludeExclude: WritableSignal<TierSegmentIncludeExclude[]> =
    signal([]);

  activePeriodForm: FormGroup = this.fb.group({
    start_date: [new Date()],
    start_time: [this.datePipe.transform(new Date(), 'HH:mm')],
    is_published: [false],
    end_date: [''],
    end_time: [''],
  });

  visiblePeriodForm: FormGroup = this.fb.group({
    start_date: [new Date()],
    start_time: [this.datePipe.transform(new Date(), 'HH:mm')],
    is_visible: [false],
    end_date: [''],
    end_time: [''],
    is_code_out: [false],
  });

  privilegeSettingForm: FormGroup = this.fb.group({
    name_th: ['', Validators.required, noSpacesValidatorAsync],
    name_en: ['', Validators.required, noSpacesValidatorAsync],
    privilege_type: [PrivilegeTypeEnum.E_VOUCHER, Validators.required],
    thumnailImageFile: ['', Validators.required],
    thumnailImageUrl: [''],
    thumnailImageName: [''],
    privilegeImageFile: ['', Validators.required],
    privilegeImageUrl: [''],
    privilegeImageName: [''],
    campaign_type: [CampaignType.NORMAL, Validators.required],
    brand_id: [0, Validators.required],
    telephone: [''],
    website: ['', urlValidator],
    booking_url: ['', urlValidator],
  });

  targetGroupForm: FormGroup = this.fb.group({
    target_group_type: [TargetGroupType.ALL, Validators.required],
    target_group_id: [''],
  });

  messagesForm: FormGroup = this.fb.group({
    message_body_thai: ['', Validators.required],
    message_body_thai_html_text: [''],
    message_body_en: ['', Validators.required],
    message_body_en_html_text: [''],
  });

  redeemForm: FormGroup = this.fb.group({
    value: ['', [Validators.required, Validators.min(0)]],
    unit: [{ value: 'POINT', disabled: true }, Validators.required],
    is_advance: [{ value: false, disabled: true }],
    is_only_promotion_or_unicode: [false],
  });

  redeemLimitForm: FormGroup = this.fb.group({
    condition: [RedeemLimitCondition.ONE_TIME_REDEEM, Validators.required],
    quota: [1, [Validators.required, Validators.min(0)]],
    is_advance: [{ value: false, disabled: true }],
  });

  pointDiscountForm: FormGroup = this.fb.group({
    value: ['', Validators.min(0)],
    unit: [{ value: 'POINT', disabled: true }, Validators.required],
    is_advance: [{ value: false, disabled: true }],
  });

  healthcarePackageForm: FormGroup = this.fb.group({
    health_care_package_ids: this.fb.array([
      this.fb.group({
        health_care_package_id: ['', Validators.required],
      }),
    ]),
  });

  inventoryForm: FormGroup = this.fb.group({
    inventory: ['', Validators.required],
    quantity: ['', Validators.required],
    codeType: [InventoryTabCode.CodeUploaded, Validators.required],
  });

  /* istanbul ignore next */
  ngOnInit(): void {
    this.activatedRoute.queryParams
      ?.pipe(
        filter((params) => !!params['privilege_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((queryParams) => {
        this.privilegeId.set(queryParams['privilege_id']);
        this.setFormMode('create');
        this.enableAllForm();
        this.store.dispatch(
          CreateEditPrivilegeActions.getPrivilegeDetail({
            privilegeId: this.privilegeId(),
          })
        );
      });

    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['privilege_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.privilegeId.set(params['privilege_id']);
        this.setFormMode('view');
        this.disableAllForm();
        this.store.dispatch(
          CreateEditPrivilegeActions.getPrivilegeDetail({
            privilegeId: this.privilegeId(),
          })
        );
      });
    this.privilegeDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((privilegeDetail) => !!privilegeDetail)
      )
      .subscribe((privilegeDetail: PrivilegeDetail) => {
        this.activePeriodForm.patchValue({
          start_date: privilegeDetail?.active_start_date_time,
          start_time: this.datePipe.transform(
            privilegeDetail?.active_start_date_time,
            'HH:mm'
          ),
          is_published: privilegeDetail?.is_published,
          end_date: privilegeDetail?.active_end_date_time,
          end_time: this.datePipe.transform(
            privilegeDetail?.active_end_date_time,
            'HH:mm'
          ),
        });

        this.visiblePeriodForm.patchValue({
          start_date: privilegeDetail?.visible_start_date_time,
          start_time: this.datePipe.transform(
            privilegeDetail?.visible_start_date_time,
            'HH:mm'
          ),
          is_visible: privilegeDetail?.is_visible,
          end_date: privilegeDetail?.visible_end_date_time,
          end_time: this.datePipe.transform(
            privilegeDetail?.visible_end_date_time,
            'HH:mm'
          ),
          is_code_out: privilegeDetail?.code_is_out,
        });

        this.privilegeSettingForm.patchValue({
          name_th: privilegeDetail?.name_th,
          name_en: privilegeDetail?.name_en,
          privilege_type: privilegeDetail?.privilege_type,
          campaign_type: privilegeDetail?.campaign_type,
          brand_id: privilegeDetail?.brand_id,
          telephone: privilegeDetail?.telephone,
          website: privilegeDetail?.website,
          booking_url: privilegeDetail?.booking_url,
          thumnailImageUrl: privilegeDetail?.thumbnail_image,
          thumnailImageFile: privilegeDetail?.thumbnail_image,
          thumnailImageName: privilegeDetail?.thumbnail_name_image,
          privilegeImageUrl: privilegeDetail?.privilege_detail_image,
          privilegeImageFile: privilegeDetail?.privilege_detail_image,
          privilegeImageName: privilegeDetail?.detail_name_image,
        });

        const target_group_id =
          privilegeDetail.target_group_id > 3
            ? 4
            : privilegeDetail.target_group_id;
        if (target_group_id === 4) {
          const items: TierSegmentIncludeExclude[] = [
            ...privilegeDetail.segment_list.map((segment) => {
              return {
                id: segment.id,
                type: 'segmentation',
                isInclude: segment.is_included,
                name: segment.name,
              };
            }),
            ...privilegeDetail.tier_list.map((tier) => {
              return {
                id: tier.id,
                type: 'tier',
                isInclude: tier.is_included,
                name: tier.name,
              };
            }),
          ];
          this.store.dispatch(
            CreateEditPrivilegeActions.setIncludeExcludeSegmentTier({
              items,
            })
          );
          this.tierSegmentIncludeExclude.set(items);
        }
        this.targetGroupForm.patchValue({
          target_group_id: target_group_id,
          target_group_type: this.targetGroups().find(
            (targetGroup) => targetGroup.id === target_group_id
          )?.code,
        });

        this.messagesForm.patchValue({
          message_body_thai_html_text: privilegeDetail?.message_body_th,
          message_body_en_html_text: privilegeDetail?.message_body_en,
          message_body_thai: privilegeDetail?.message_body_th,
          message_body_en: privilegeDetail?.message_body_en,
        });

        this.redeemForm.patchValue({
          value: privilegeDetail?.redeem?.value,
          unit: privilegeDetail?.redeem?.unit,
          is_advance: privilegeDetail?.redeem?.is_advance,
          is_only_promotion_or_unicode:
            privilegeDetail?.redeem?.is_only_promotion_or_unicode,
        });

        this.redeemLimitForm.patchValue({
          condition: privilegeDetail?.redeem_limit?.condition,
          quota: privilegeDetail?.redeem_limit?.quota,
          is_advance: privilegeDetail?.redeem_limit?.is_advance,
        });

        this.pointDiscountForm.patchValue({
          value: privilegeDetail?.discount?.value,
          unit: privilegeDetail?.discount?.unit,
          is_advance: privilegeDetail?.discount?.is_advance,
        });

        this.activePeriodForm.markAsPristine();
        this.visiblePeriodForm.markAsPristine();
        this.privilegeSettingForm.markAsPristine();
        this.targetGroupForm.markAsPristine();
        this.messagesForm.markAsPristine();
        this.redeemForm.markAsPristine();
        this.redeemLimitForm.markAsPristine();
        this.pointDiscountForm.markAsPristine();
        this.healthcarePackageForm.markAsPristine();
        this.inventoryForm.markAsPristine();
        setTimeout(() => {
          this.store.dispatch(
            CreateEditPrivilegeActions.setFormDirty({ isDirty: false })
          );
        }, 0);
      });
    const targetGroups: TargetGroup[] = [...targetGroupList].map(
      (targetGroup) => {
        return {
          id: targetGroup.code,
          target_group_name: targetGroup.value,
          code: targetGroup.code,
        };
      }
    );
    this.targetGroups.set(targetGroups);
    const groupId =
      this.targetGroupForm.get('target_group_id')?.getRawValue() || 1;
    this.targetGroupForm.patchValue(
      {
        ...this.targetGroupForm.getRawValue(),
        target_group_type: this.targetGroups().find(
          (targetGroup) => targetGroup.id === groupId
        )?.code,
      },
      { emitEvent: false }
    );
    this.store.dispatch(
      CreateEditPrivilegeActions.getTierGroups({
        page: 0,
        size: 999,
      })
    );
    this.store.dispatch(
      CreateEditPrivilegeActions.getSegmentGroups({
        page: 0,
        size: 999,
      })
    );
    merge(
      this.activePeriodForm.valueChanges,
      this.visiblePeriodForm.valueChanges,
      this.privilegeSettingForm.valueChanges,
      this.targetGroupForm.valueChanges,
      this.messagesForm.valueChanges,
      this.redeemForm.valueChanges,
      this.redeemLimitForm.valueChanges,
      this.pointDiscountForm.valueChanges,
      this.healthcarePackageForm.valueChanges,
      this.inventoryForm.valueChanges
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe((value) => {
        this.store.dispatch(
          CreateEditPrivilegeActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditPrivilegeActions.createPrivilegeSuccess,
          CreateEditPrivilegeActions.updatePrivilegeSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({ isPublished }) => {
        this.store.dispatch(
          CreateEditPrivilegeActions.setFormDirty({ isDirty: false })
        );
        const status = isPublished ? 'published' : 'updated';
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: `The privilege was ${status}`,
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['privilege-management', 'privilege-setting']);
        });
      });

    this.actions$
      .pipe(
        ofType(CreateEditPrivilegeActions.updatePublishedPrivilegeSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: 'Privilege unpublished successfully',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        this.activePeriodForm.patchValue(
          { is_published: false },
          {
            emitEvent: false,
          }
        );
      });
  }

  /* istanbul ignore next */
  onSubmit(isSaveDraft: boolean = false) {
    const hasIncludeItem = this.tierSegmentIncludeExclude().some(
      (item) => item.isInclude
    );
    const isTargetGroup =
      this.targetGroupForm.value.target_group_type ===
      TargetGroupType.TARGET_GROUP;
    const isValidTargetGroupForm = isTargetGroup
      ? hasIncludeItem && this.targetGroupForm.valid
      : this.targetGroupForm.valid;

    const isHealthcarePackageFormValid =
      this.privilegeSettingForm.get('privilege_type')?.value !==
        PrivilegeTypeEnum.HEALTH_CARE ||
      (
        this.healthcarePackageForm
          .get('health_care_package_ids')
          ?.getRawValue() || []
      ).length > 0;

    // check validate
    const isValidForm =
      this.activePeriodForm.valid &&
      this.visiblePeriodForm.valid &&
      this.privilegeSettingForm.valid &&
      isValidTargetGroupForm &&
      this.messagesForm.valid &&
      this.redeemForm.valid &&
      this.redeemLimitForm.valid &&
      this.pointDiscountForm.valid &&
      isHealthcarePackageFormValid &&
      this.inventoryForm.valid;
    if (!isSaveDraft && !isValidForm) {
      this.activePeriodForm.markAllAsTouched();
      this.visiblePeriodForm.markAllAsTouched();
      this.privilegeSettingForm.markAllAsTouched();
      this.targetGroupForm.markAllAsTouched();
      this.messagesForm.markAllAsTouched();
      this.redeemForm.markAllAsTouched();
      this.redeemLimitForm.markAllAsTouched();
      this.pointDiscountForm.markAllAsTouched();
      this.healthcarePackageForm.markAllAsTouched();
      this.inventoryForm.markAllAsTouched();
      return;
    }

    if (
      !isSaveDraft &&
      !this.activePeriodForm.get('is_published')?.getRawValue()
    ) {
      this.activePeriodForm
        .get('is_published')
        ?.setErrors({ publishBeforeSave: true });

      return;
    }

    // activePeriodForm
    const {
      start_date_time: active_start_date_time,
      end_date_time: active_end_date_time,
    } = this.getStartDateTimeEndDateTime(this.activePeriodForm);

    // visiblePeriodForm
    const {
      start_date_time: visible_start_date_time,
      end_date_time: visible_end_date_time,
    } = this.getStartDateTimeEndDateTime(this.visiblePeriodForm);

    const thumnailImageFile = this.privilegeSettingForm
      .get('thumnailImageFile')
      ?.getRawValue();

    const privilegeImageFile = this.privilegeSettingForm
      .get('privilegeImageFile')
      ?.getRawValue();

    const groupCode = targetGroupList.find(
      (targetGroup) =>
        targetGroup.code ===
        this.targetGroupForm.getRawValue().target_group_type
    )?.code;
    const tierList = this.tierSegmentIncludeExclude()
      .filter((item) => item.type === 'tier')
      .map((tier) => {
        return {
          id: tier.id,
          is_included: tier.isInclude,
        };
      });
    const segmentList = this.tierSegmentIncludeExclude()
      .filter((item) => item.type !== 'tier')
      .map((segment) => {
        return {
          id: segment.id,
          is_included: segment.isInclude,
        };
      });

    const healthcarePackageIds =
      this.privilegeSettingForm.get('privilege_type')?.value ===
      PrivilegeTypeEnum.HEALTH_CARE
        ? this.healthcarePackageForm
            .getRawValue()
            .health_care_package_ids.map(
              (item: any) => item.health_care_package_id
            )
        : [];

    const bodyQueryParams: Partial<CreateEditPrivilegesQueryParams> = {
      active_start_date_time: this.activePeriodForm
        .get('start_date')
        ?.getRawValue()
        ? active_start_date_time.toISOString()
        : '',
      active_end_date_time: this.activePeriodForm.get('end_date')?.getRawValue()
        ? active_end_date_time?.toISOString()
        : '',
      is_published: isSaveDraft
        ? false
        : this.activePeriodForm.get('is_published')?.getRawValue(),

      visible_start_date_time: this.visiblePeriodForm
        .get('start_date')
        ?.getRawValue()
        ? visible_start_date_time.toISOString()
        : '',
      visible_end_date_time: this.visiblePeriodForm
        .get('end_date')
        ?.getRawValue()
        ? visible_end_date_time?.toISOString()
        : '',
      is_visible: this.visiblePeriodForm.get('is_visible')?.getRawValue(),
      is_code_out: this.visiblePeriodForm.get('is_code_out')?.getRawValue(),
      name_th: this.privilegeSettingForm.get('name_th')?.getRawValue(),
      name_en: this.privilegeSettingForm.get('name_en')?.getRawValue(),
      privilege_type: this.privilegeSettingForm
        .get('privilege_type')
        ?.getRawValue(),
      campaign_type: this.privilegeSettingForm
        .get('campaign_type')
        ?.getRawValue(),
      brand_id: this.privilegeSettingForm.get('brand_id')?.getRawValue(),
      telephone: this.privilegeSettingForm.get('telephone')?.getRawValue(),
      website: this.privilegeSettingForm.get('website')?.getRawValue(),
      booking_url: this.privilegeSettingForm.get('booking_url')?.getRawValue(),

      target_group_id: groupCode || 1,
      tier_list: tierList,
      segment_list: segmentList,

      message_body_th: this.messagesForm
        .get('message_body_thai')
        ?.getRawValue(),
      message_body_en: this.messagesForm
        .get('message_body_en')
        ?.getRawValue(),

      redeem: {
        value: this.redeemForm.get('value')?.getRawValue(),
        unit: this.redeemForm.get('unit')?.getRawValue(),
        is_only_promotion_or_unicode: this.redeemForm
          .get('is_only_promotion_or_unicode')
          ?.getRawValue(),
        is_advance: this.redeemForm.get('is_advance')?.getRawValue(),
        advance_items: [],
      },

      redeem_limit: {
        condition: this.redeemLimitForm.get('condition')?.getRawValue(),
        quota: this.redeemLimitForm.get('quota')?.getRawValue(),
        is_advance: this.redeemLimitForm.get('is_advance')?.getRawValue(),
        advance_items: [],
      },

      discount: {
        value: this.pointDiscountForm.get('value')?.getRawValue(),
        unit: this.pointDiscountForm.get('unit')?.getRawValue(),
        is_advance: this.pointDiscountForm.get('is_advance')?.getRawValue(),
        advance_items: [],
      },
      inventory: {
        inventory_id: this.inventoryForm.get('inventory')?.getRawValue()
          ?.inventory_id,
        quantity: this.inventoryForm.get('quantity')?.getRawValue(),
      },
      health_care_package_ids: healthcarePackageIds,
    };
    if (this.formMode() === 'edit') {
      this.store.dispatch(
        CreateEditPrivilegeActions.updatePrivilege({
          data: { ...bodyQueryParams, id: this.privilegeId() },
          detailFile: privilegeImageFile.name ? privilegeImageFile : null,
          thumbnailFile: thumnailImageFile.name ? thumnailImageFile : null,
        })
      );
    } else {
      this.store.dispatch(
        CreateEditPrivilegeActions.createPrivilege({
          queryParams: bodyQueryParams,
          detailFile: privilegeImageFile.name ? privilegeImageFile : null,
          thumbnailFile: thumnailImageFile.name ? thumnailImageFile : null,
        })
      );
    }
  }

  unpublishPrivilege() {
    this.store.dispatch(
      CreateEditPrivilegeActions.updatePublishedPrivilege({
        privilege_id: this.privilegeId(),
        is_published: false,
      })
    );
  }

  setFormMode(mode: 'create' | 'edit' | 'view') {
    if (
      mode === 'edit' &&
      !!this.activePeriodForm.get('is_published')?.getRawValue()
    ) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: `The Privilege can't update`,
          message: `This privilege is currently published. To proceed with update, please unpublished the privilege first.`,
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'warning',
        },
        width: '25rem',
      });

      return;
    }

    this.formMode.set(mode);

    if (mode === 'edit') {
      this.enableAllForm();
    }

    setTimeout(() => {
      this.store.dispatch(
        CreateEditPrivilegeActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.activePeriodForm.disable({ emitEvent: false });
    this.visiblePeriodForm.disable({ emitEvent: false });
    this.privilegeSettingForm.disable({ emitEvent: false });
    this.targetGroupForm.disable({ emitEvent: false });
    this.messagesForm.disable({ emitEvent: false });
    this.redeemForm.disable({ emitEvent: false });
    this.redeemLimitForm.disable({ emitEvent: false });
    this.pointDiscountForm.disable({ emitEvent: false });
    this.healthcarePackageForm.disable({ emitEvent: false });
    this.inventoryForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.activePeriodForm.enable({ emitEvent: false });
    this.visiblePeriodForm.enable({ emitEvent: false });
    this.privilegeSettingForm.enable({ emitEvent: false });
    this.targetGroupForm.enable({ emitEvent: false });
    this.messagesForm.enable({ emitEvent: false });
    this.redeemForm.enable({ emitEvent: false });
    this.redeemLimitForm.enable({ emitEvent: false });
    this.pointDiscountForm.enable({ emitEvent: false });
    this.healthcarePackageForm.enable({ emitEvent: false });
    this.inventoryForm.enable({ emitEvent: false });

    this.redeemForm.get('unit')?.disable({ emitEvent: false });
    this.redeemForm.get('is_advance')?.disable({ emitEvent: false });
    this.redeemLimitForm.get('is_advance')?.disable({ emitEvent: false });
    this.pointDiscountForm.get('is_advance')?.disable({ emitEvent: false });
    this.pointDiscountForm.get('unit')?.disable({ emitEvent: false });
  }

  segmentTierListChange(items: TierSegmentIncludeExclude[]) {
    this.tierSegmentIncludeExclude.set(items);
    this.store.dispatch(
      CreateEditPrivilegeActions.setIncludeExcludeSegmentTier({ items })
    );

    this.store.dispatch(
      CreateEditPrivilegeActions.setFormDirty({
        isDirty: true,
      })
    );
  }

  getStartDateTimeEndDateTime(formGroup: FormGroup): {
    start_date_time: Date;
    end_date_time: Date | null;
  } {
    const rawValue = formGroup.getRawValue();

    const startTime = rawValue.start_time;
    const endTime = rawValue.end_time;
    const startDate = rawValue.start_date;
    const endDate = rawValue.end_date;
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

  clonePrivilege() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Clone Privilege?',
        message:
          'Are you sure you want to clone this privilege? All settings will be copied to a new draft.',
        btnCloseText: 'Cancel',
        btnConfirmText: 'Proceed',
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
        this.router.navigate(
          ['privilege-management', 'privilege-setting', 'form', 'create'],
          {
            queryParams: {
              privilege_id: this.privilegeId(),
            },
          }
        );
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditPrivilegeActions.reset());
  }
}
