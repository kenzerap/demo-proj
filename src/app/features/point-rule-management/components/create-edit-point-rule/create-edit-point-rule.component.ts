import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { count, filter, map, merge, Observable, take, takeUntil } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as CreateEditPointRuleActions from '../../stores/create-edit-point-rule/create-edit-point-rule.actions';
import * as createEditPointRuleSelectors from '../../stores/create-edit-point-rule/create-edit-point-rule.selectors';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseSettingSectionComponent } from '../base-setting-section/base-setting-section.component';
import {
  CreateEditPointRulesQueryParams,
  CriteriaBasedRule,
} from '../../models/create-edit-point-rule-query-params.model';
import { CategoryCode } from '../../constants/category-options.const';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { WelcomeRuleSectionComponent } from '../welcome-rule-section/welcome-rule-section.component';
import { CriteriaCheckinRuleSectionComponent } from '../criteria-checkin-rule-section/criteria-checkin-rule-section.component';
import { CriteriaCode } from '../../constants/criteria-options.const';
import { CriteriaEngagementRuleSectionComponent } from '../criteria-engagement-rule-section/criteria-engagement-rule-section.component';
import {
  initCriteriaCheckinRuleForm,
  initCriteriaFeatureEngagementRuleForm,
  initProductBasedRuleForm,
  initWelcomeRuleForm,
} from '../../constants/init-forms.const';
import { PointRuleDetail } from '../../models/point-rule-model';
import { v4 as uuidv4 } from 'uuid';
import { EngagementBasedRuleAttributeCode } from '../../constants/engagement-based-rule-attribute-options.const';
import { ProductBasedRuleSectionComponent } from '../product-based-rule-section/product-based-rule-section.component';
import { ProductName } from '@app/shared/models/product-name.model';
import { ExpiryConditionCode } from '../../constants/expiry-condition.const';
import { CountExpiryFromCode } from '../../constants/count-expiry-from.const';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';

@Component({
  selector: 'app-create-edit-point-rule',
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
    DemoprojInputComponent,
    WelcomeRuleSectionComponent,
    CriteriaCheckinRuleSectionComponent,
    CriteriaEngagementRuleSectionComponent,
    ProductBasedRuleSectionComponent,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-point-rule.component.html',
  styleUrl: './create-edit-point-rule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditPointRuleComponent
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
  private changeDetector = inject(ChangeDetectorRef);

  loading$ = this.store.select(selectIsLoading(`createEditPointRule`));
  pointRuleDetail$: Observable<PointRuleDetail | null> = this.store.select(
    createEditPointRuleSelectors.selectPointRuleDetail
  );

  productNames: WritableSignal<ProductName[]> = signal([]);

  productNames$: Observable<ProductName[]> = this.store.select(
    createEditPointRuleSelectors.selectProductNames
  );

  channelOptions: (PolicyChannel & { key: string; })[] = [];
  channelOptions$: Observable<(PolicyChannel & { key: string; })[]> =
    this.store.select(createEditPointRuleSelectors.selectPolicyChannels).pipe(
      map((policyChannels) => {
        return policyChannels.map((item) => {
          const key = `${item.system_id} - ${item.name} (${item.channel_code})`;
          return {
            ...item,
            key: key,
          };
        });
      })
    );

  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  pointRuleId: WritableSignal<number> = signal(0);
  categoryCode = CategoryCode;
  criteriaCode = CriteriaCode;

  baseSettingForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    is_published: [false],
    category: [CategoryCode.WelcomeRule],
    count_expiry_from: [CountExpiryFromCode.EarningPointDate],
    expiry_condition: [ExpiryConditionCode.EndOfNextCalendarYear],
    criteria_type: [''],
    expiry_date_duration: ['', [Validators.required, Validators.min(1)]],
    criteria_reset_period: [''],
    start_date: [new Date()],
    start_time: [this.datePipe.transform(new Date(), 'HH:mm')],
    end_date: [''],
    end_time: [''],
    isSetEndDate: [false],
  });

  welcomeRuleDefaultPointForm: FormGroup = this.fb.group({
    set_point: [
      '',
      [Validators.required, Validators.min(0), Validators.max(999999)],
    ],
  });

  welcomeRuleForm: FormGroup = initWelcomeRuleForm(this.fb);

  criteriaCheckinRuleForm: FormGroup = initCriteriaCheckinRuleForm(this.fb);

  criteriaFeatureEngagementRuleForm: FormGroup =
    initCriteriaFeatureEngagementRuleForm(this.fb);

  productBasedRuleForm: FormGroup = initProductBasedRuleForm(this.fb);

  /* istanbul ignore next */
  ngOnInit(): void {
    this.channelOptions$
      .pipe(
        filter((options) => options.length > 0),
        take(1)
      )
      .subscribe((options) => {
        this.channelOptions = options;
      });

    this.productNames$
      .pipe(
        takeUntil(this.destroy$),
        filter((productNames) => productNames.length > 0)
      )
      .subscribe((productNames) => {
        this.productNames.set(productNames);
      });

    this.baseSettingForm
      .get('category')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() === 'create')
      )
      .subscribe((category) => {
        switch (category) {
          case CategoryCode.WelcomeRule:
            this.welcomeRuleDefaultPointForm.reset();
            this.welcomeRuleForm = initWelcomeRuleForm(this.fb);
            break;
          case CategoryCode.ProductBasedRule:
            this.productBasedRuleForm = initProductBasedRuleForm(this.fb);
            break;

          default:
            break;
        }
      });

    this.baseSettingForm
      .get('criteria_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((criteriaType) => {
        switch (criteriaType) {
          case CriteriaCode.DailyCheckIn:
            this.criteriaCheckinRuleForm = initCriteriaCheckinRuleForm(this.fb);
            break;

          case CriteriaCode.FeatureEngagement:
            this.criteriaFeatureEngagementRuleForm =
              initCriteriaFeatureEngagementRuleForm(this.fb);
            break;

          default:
            break;
        }
      });
    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['point_rule_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.pointRuleId.set(params['point_rule_id']);
        this.setFormMode('view');
        this.disableAllForm();
        this.store.dispatch(
          CreateEditPointRuleActions.getPointRuleDetail({
            pointRuleId: this.pointRuleId(),
          })
        );
      });

    this.pointRuleDetail$
      .pipe(
        filter((pointRuleDetail) => !!pointRuleDetail),
        take(1)
      )
      .subscribe((pointRuleDetail: PointRuleDetail) => {
        this.baseSettingForm.patchValue(
          {
            name: pointRuleDetail?.name,
            description: pointRuleDetail?.description,
            is_published: pointRuleDetail.is_published,
            category: pointRuleDetail?.category,
            criteria_type: pointRuleDetail?.criteria_based_rule?.criteria_type,
            expiry_date_duration: pointRuleDetail?.expiry_date_duration,
            count_expiry_from: pointRuleDetail?.count_expiry_from,
            expiry_condition: pointRuleDetail?.expiry_condition,
            criteria_reset_period:
              pointRuleDetail?.criteria_based_rule?.criteria_reset_period,
            start_date: pointRuleDetail?.start_date_time,
            start_time: this.datePipe.transform(
              pointRuleDetail?.start_date_time,
              'HH:mm'
            ),
            end_date: pointRuleDetail?.end_date_time,
            end_time: this.datePipe.transform(
              pointRuleDetail?.end_date_time,
              'HH:mm'
            ),
            isSetEndDate: !!pointRuleDetail.end_date_time,
          },
          { emitEvent: false }
        );

        this.welcomeRuleDefaultPointForm.patchValue(
          {
            set_point: pointRuleDetail?.set_point,
          },
          { emitEvent: false }
        );

        this.setValueWelcomeRuleForm(pointRuleDetail);
        this.setValueCriteriaCheckinRuleForm(pointRuleDetail);
        this.setValueCriteriaFeatureEngagementRuleForm(pointRuleDetail);
        this.setValueProductBasedRuleForm(pointRuleDetail);

        this.baseSettingForm.markAsPristine();
        this.welcomeRuleDefaultPointForm.markAsPristine();
        this.welcomeRuleForm.markAsPristine();
        this.criteriaCheckinRuleForm.markAsPristine();
        this.criteriaFeatureEngagementRuleForm.markAsPristine();
        this.productBasedRuleForm.markAsPristine();

        setTimeout(() => {
          this.changeDetector.detectChanges();
          this.store.dispatch(
            CreateEditPointRuleActions.setFormDirty({ isDirty: false })
          );
        }, 0);
      });

    merge(
      this.baseSettingForm.valueChanges,
      this.welcomeRuleDefaultPointForm.valueChanges,
      this.welcomeRuleForm.valueChanges,
      this.criteriaCheckinRuleForm.valueChanges,
      this.criteriaFeatureEngagementRuleForm.valueChanges,
      this.productBasedRuleForm.valueChanges
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditPointRuleActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditPointRuleActions.createPointRuleSuccess,
          CreateEditPointRuleActions.updatePointRuleSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditPointRuleActions.setFormDirty({ isDirty: false })
        );
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The Point Rule was created`
                : 'The Point Rule was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([
            'point-management',
            'point-rule-management',
            'list',
          ]);
        });
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditPointRuleActions.createPointRuleFailure,
          CreateEditPointRuleActions.updatePointRuleFailure
        ),
        takeUntil(this.destroy$),
        filter(({ duplicated }) => !!duplicated)
      )
      .subscribe(({ messageData }) => {
        this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: messageData.title,
            message: messageData.message,
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'warning',
          },
          width: '25rem',
        });
      });

    this.store.dispatch(
      CreateEditPointRuleActions.getTierGroups({
        page: 0,
        size: 999,
      })
    );

    this.store.dispatch(CreateEditPointRuleActions.getPolicyChannels());
    this.store.dispatch(CreateEditPointRuleActions.getProductNames());
  }

  setValueCriteriaCheckinRuleForm(pointRuleDetail: PointRuleDetail) {
    const rulesFormArray = this.criteriaCheckinRuleForm.get(
      'criteria_checkin_rules'
    ) as FormArray;
    rulesFormArray.clear();
    const newRulesFormArray: FormArray = this.fb.array([]);

    const criteriaCheckinRules =
      pointRuleDetail?.criteria_based_rule?.criteria_checkin_rules || [];
    criteriaCheckinRules.forEach((rule) => {
      newRulesFormArray.push(
        this.fb.group({
          checkin_day: [
            { value: rule.checkin_day, disabled: true },
            [Validators.required, Validators.min(1)],
          ],
          earning_point: [
            rule.earning_point,
            [Validators.required, Validators.min(1)],
          ],
        })
      );
    });

    this.criteriaCheckinRuleForm.setControl(
      'criteria_checkin_rules',
      newRulesFormArray
    );
    this.criteriaCheckinRuleForm.disable({ emitEvent: false });
  }

  setValueWelcomeRuleForm(pointRuleDetail: PointRuleDetail) {
    const rulesFormArray = this.welcomeRuleForm.get('rules') as FormArray;
    rulesFormArray.clear();

    const newRulesFormArray: FormArray = this.fb.array([]);
    (pointRuleDetail.welcome_point_rules || []).forEach((rule) => {
      const ruleGroup = this.fb.group({
        earning_point: [
          rule.earning_point,
          [Validators.required, Validators.min(0)],
        ],
        rule_conditions: this.fb.array(
          rule.rule_conditions.map((condition) => {
            return this.fb.group({
              attribute: [condition.attribute, Validators.required],
              condition: [condition.condition, Validators.required],
              value: [condition.value, [Validators.required]],
              group_condition: [condition.group_condition],
            });
          })
        ),
      });
      newRulesFormArray.push(ruleGroup);
    });
    this.welcomeRuleForm.setControl('rules', newRulesFormArray);
    rulesFormArray.updateValueAndValidity();
    this.welcomeRuleForm.disable({ emitEvent: false });
  }

  setValueCriteriaFeatureEngagementRuleForm(pointRuleDetail: PointRuleDetail) {
    const rulesFormArray = this.criteriaFeatureEngagementRuleForm.get(
      'criteria_feature_engagement_rules'
    ) as FormArray;
    rulesFormArray.clear();
    const newRulesFormArray: FormArray = this.fb.array([]);
    const engagementRules = [
      ...(pointRuleDetail?.criteria_based_rule
        ?.criteria_feature_engagement_rules || []),
    ];
    // get and remove first element in engagementRules
    const defaultRule = engagementRules.shift();
    engagementRules.forEach((rule) => {
      newRulesFormArray.push(
        this.fb.group({
          virtualId: [uuidv4(), [Validators.required]],
          attribute: [rule.attribute, Validators.required],
          condition: [rule.condition, Validators.required],
          value: [
            rule.unlimited_value ? 'Unlimited' : rule.value,
            [Validators.required],
          ],
          unlimited_value: [rule.unlimited_value],
          earning_point: [
            rule.earning_point,
            [Validators.required, Validators.min(1)],
          ],
        })
      );
    });

    this.criteriaFeatureEngagementRuleForm.setControl(
      'criteria_feature_engagement_rules',
      newRulesFormArray
    );
    this.criteriaFeatureEngagementRuleForm.patchValue({
      default_attribute: defaultRule?.attribute,
      default_condition: defaultRule?.condition,
      default_value: defaultRule?.value,
      default_earning_point: defaultRule?.earning_point,
      is_unlimited_value: (
        pointRuleDetail?.criteria_based_rule
          ?.criteria_feature_engagement_rules || []
      ).some((rule) => rule.unlimited_value),
    });

    this.criteriaFeatureEngagementRuleForm.disable({ emitEvent: false });
  }

  setValueProductBasedRuleForm(pointRuleDetail: PointRuleDetail) {
    const rulesFormArray = this.productBasedRuleForm.get(
      'channel_rules'
    ) as FormArray;
    rulesFormArray.clear();
    const newRulesFormArray: FormArray = this.fb.array([]);
    (pointRuleDetail.product_based_rule?.channel_rules || []).forEach(
      (rule) => {
        const channelValue = `${rule.system_id} - ${rule.channel} (${rule.channel_code})`;

        const ruleGroup = this.fb.group({
          product_based_rule_channel_id: [
            rule.product_based_rule_channel_id || null,
          ],
          channel: [channelValue, [Validators.required]],
          point_rate: [
            rule.point_rate,
            [Validators.required, Validators.min(0.01), Validators.max(999)],
          ],
        });
        newRulesFormArray.push(ruleGroup);
      }
    );
    this.productBasedRuleForm.setControl('channel_rules', newRulesFormArray);
    rulesFormArray.updateValueAndValidity();
    this.productBasedRuleForm.disable({ emitEvent: false });

    this.productBasedRuleForm.patchValue({
      product_based_rule_id:
        pointRuleDetail?.product_based_rule?.product_based_rule_id || null,
      product_name: pointRuleDetail?.product_based_rule?.product_name,
      plan_code: pointRuleDetail?.product_based_rule?.plan_code,
      marketing_name_en: pointRuleDetail?.product_based_rule?.marketing_name_en,
      marketing_name_th: pointRuleDetail?.product_based_rule?.marketing_name_th,
    });
  }

  validateProductBasedRuleForm(form: FormGroup): boolean {
    const validChannels = this.channelOptions.map((opt) => opt.key);
    const validProductCodes = this.productNames().map((p) => p.product_code);
    const rulesFormArray = form.get('channel_rules') as FormArray;
    const planCode = form.get('plan_code')?.value;
    const productNameControl = form.get('product_name');

    let hasInvalidChannel = false;
    rulesFormArray.controls.forEach((control) => {
      const channel = control.get('channel')?.value;
      if (!validChannels.includes(channel)) {
        control.get('channel')?.setValue('');
        hasInvalidChannel = true;
      }
      control.get('channel')?.markAsTouched();
    });

    let hasInvalidProductName = false;
    if (planCode && !validProductCodes.includes(planCode)) {
      if (productNameControl) {
        productNameControl.setValue('');
        hasInvalidProductName = true;
      }
    }

    if (hasInvalidChannel || hasInvalidProductName) {
      form.markAllAsTouched();
      return false;
    }
    return true;
  }

  /* istanbul ignore next */
  onSubmit() {
    if (
      this.formMode() === 'edit' &&
      this.baseSettingForm.get('category')?.value ===
        CategoryCode.ProductBasedRule
    ) {
      const isValid = this.validateProductBasedRuleForm(
        this.productBasedRuleForm
      );
      if (!isValid) return;
    }

    this.baseSettingForm.get('start_time')?.updateValueAndValidity();

    let secondSectionValid = false;

    if (
      this.baseSettingForm.get('category')?.value === CategoryCode.WelcomeRule
    ) {
      const welcomeRules: any[] =
        this.welcomeRuleForm.getRawValue()?.rules || [];
      const isValidRuleCondition =
        (welcomeRules.length > 0 &&
          welcomeRules.every((rule) => rule.rule_conditions.length > 0)) ||
        welcomeRules.length === 0;

      secondSectionValid =
        this.welcomeRuleDefaultPointForm.valid &&
        this.welcomeRuleForm.valid &&
        isValidRuleCondition;
    }

    if (
      this.baseSettingForm.get('category')?.value ===
      CategoryCode.ProductBasedRule
    ) {
      const channelRules: any[] =
        this.productBasedRuleForm.getRawValue()?.channel_rules || [];
      const isValidRuleCondition = channelRules.length > 0;

      secondSectionValid =
        this.productBasedRuleForm.valid && isValidRuleCondition;
    }

    if (
      this.baseSettingForm.get('category')?.value ===
        CategoryCode.CriteriaBasedRule &&
      this.baseSettingForm.get('criteria_type')?.value ===
        CriteriaCode.DailyCheckIn
    ) {
      secondSectionValid = this.criteriaCheckinRuleForm.valid;
    }

    if (
      this.baseSettingForm.get('category')?.value ===
        CategoryCode.CriteriaBasedRule &&
      this.baseSettingForm.get('criteria_type')?.value ===
        CriteriaCode.FeatureEngagement
    ) {
      secondSectionValid = this.criteriaFeatureEngagementRuleForm.valid;
    }

    // check validate
    const isValidForm = this.baseSettingForm.valid && secondSectionValid;
    if (!isValidForm) {
      this.baseSettingForm.markAllAsTouched();

      this.welcomeRuleDefaultPointForm.markAllAsTouched();
      this.welcomeRuleForm.markAllAsTouched();
      this.criteriaCheckinRuleForm.markAllAsTouched();
      this.criteriaFeatureEngagementRuleForm.markAllAsTouched();
      this.productBasedRuleForm.markAllAsTouched();
      return;
    }

    // baseSettingForm
    const { start_date_time, end_date_time } = this.getStartDateTimeEndDateTime(
      this.baseSettingForm
    );

    const baseSettingFormValue = this.baseSettingForm.getRawValue();
    const welcomeRuleDefaultPointFormValue =
      this.welcomeRuleDefaultPointForm.getRawValue();
    const welcomeRuleFormValue = this.welcomeRuleForm.getRawValue();
    const criteriaCheckinRuleFormValue =
      this.criteriaCheckinRuleForm.getRawValue();
    const criteriaFeatureEngagementRuleFormValue =
      this.criteriaFeatureEngagementRuleForm.getRawValue();
    const productBasedRuleFormValue = this.productBasedRuleForm.getRawValue();

    const welcomePointRules =
      baseSettingFormValue?.category === CategoryCode.WelcomeRule
        ? welcomeRuleFormValue.rules.map((rule: any) => {
            return {
              earning_point: Number(rule.earning_point),
              rule_conditions: rule.rule_conditions.map((condition: any) => {
                return {
                  attribute: condition.attribute,
                  condition: condition.condition,
                  value: condition.value,
                  group_condition: condition.group_condition,
                };
              }),
            };
          })
        : [];

    let criteriaBasedRule: CriteriaBasedRule = {
      criteria_type: baseSettingFormValue?.criteria_type,
      criteria_reset_period: baseSettingFormValue?.criteria_reset_period,
      criteria_checkin_rules: [],
      criteria_feature_engagement_rules: [],
    };

    if (
      this.baseSettingForm.get('criteria_type')?.value ===
      CriteriaCode.DailyCheckIn
    ) {
      criteriaBasedRule.criteria_checkin_rules =
        criteriaCheckinRuleFormValue?.criteria_checkin_rules;
    }

    if (
      this.baseSettingForm.get('criteria_type')?.value ===
      CriteriaCode.FeatureEngagement
    ) {
      criteriaBasedRule.criteria_feature_engagement_rules = [
        {
          attribute: criteriaFeatureEngagementRuleFormValue?.default_attribute,
          condition: criteriaFeatureEngagementRuleFormValue?.default_condition,
          value: criteriaFeatureEngagementRuleFormValue?.default_value,
          unlimited_value: false,
          earning_point:
            criteriaFeatureEngagementRuleFormValue?.default_earning_point,
        },
        ...criteriaFeatureEngagementRuleFormValue?.criteria_feature_engagement_rules.map(
          (rule: any) => {
            return {
              attribute: rule.attribute,
              condition: rule.condition,
              value: rule.value,
              unlimited_value: rule.unlimited_value,
              earning_point: rule.earning_point,
            };
          }
        ),
      ];
    }

    const productNameSplit = (
      productBasedRuleFormValue?.product_name || ''
    ).split(' - ');

    const productBasedRule = {
      product_based_rule_id:
        productBasedRuleFormValue?.product_based_rule_id || undefined,
      product_name: productBasedRuleFormValue?.product_name,
      plan_code: productBasedRuleFormValue?.plan_code,
      marketing_name_en: productBasedRuleFormValue?.marketing_name_en,
      marketing_name_th: productBasedRuleFormValue?.marketing_name_th,
      rule_product_name: productNameSplit[0] || '',
      channel_rules: productBasedRuleFormValue?.channel_rules.map(
        (channelRule: any) => {
          const channelOption = this.channelOptions.find(
            (opt) => opt.key === channelRule.channel
          );

          return {
            product_based_rule_channel_id:
              channelRule.product_based_rule_channel_id || undefined,
            channel: channelOption?.name || '',
            point_rate: channelRule.point_rate,
            free_look_period: channelOption?.free_look_period,
            channel_code: channelOption?.channel_code || '',
            system_id: channelOption?.system_id || '',
          };
        }
      ),
    };

    const bodyQueryParams: Partial<CreateEditPointRulesQueryParams> = {
      name: baseSettingFormValue?.name,
      description: baseSettingFormValue?.description,
      category: baseSettingFormValue?.category,
      count_expiry_from:
        baseSettingFormValue?.category === CategoryCode.ProductBasedRule
          ? baseSettingFormValue?.count_expiry_from
          : undefined,
      expiry_condition:
        baseSettingFormValue?.category === CategoryCode.ProductBasedRule
          ? baseSettingFormValue?.expiry_condition
          : undefined,
      is_published: baseSettingFormValue?.is_published,
      start_date_time: baseSettingFormValue?.start_date
        ? start_date_time.toISOString()
        : '',
      end_date_time:
        baseSettingFormValue?.isSetEndDate && baseSettingFormValue?.end_date
          ? end_date_time?.toISOString()
          : '',
      set_point:
        baseSettingFormValue?.category === CategoryCode.WelcomeRule
          ? Number(welcomeRuleDefaultPointFormValue?.set_point)
          : 1,
      expiry_date_duration: baseSettingFormValue?.expiry_date_duration
        ? Number(baseSettingFormValue?.expiry_date_duration)
        : 1,
      welcome_point_rules: welcomePointRules,
      criteria_based_rule:
        baseSettingFormValue?.category === CategoryCode.CriteriaBasedRule
          ? criteriaBasedRule
          : undefined,
      product_based_rule:
        baseSettingFormValue?.category === CategoryCode.ProductBasedRule
          ? productBasedRule
          : undefined,
    };

    if (this.formMode() === 'edit') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Update point rule?',
          message:
            'If you click to confirmed, the point rule will update. This change will affect future transactions only and cannot be applied retroactively.',
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
            CreateEditPointRuleActions.updatePointRule({
              data: { ...bodyQueryParams, id: this.pointRuleId() },
            })
          );
        });
    } else {
      this.store.dispatch(
        CreateEditPointRuleActions.createPointRule({
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
        CreateEditPointRuleActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.baseSettingForm.disable({ emitEvent: false });
    this.welcomeRuleDefaultPointForm.disable({ emitEvent: false });
    this.welcomeRuleForm.disable({ emitEvent: false });
    this.criteriaCheckinRuleForm.disable({ emitEvent: false });
    this.criteriaFeatureEngagementRuleForm.disable({ emitEvent: false });
    this.productBasedRuleForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.baseSettingForm.enable({ emitEvent: false });
    this.welcomeRuleDefaultPointForm.enable({ emitEvent: false });
    this.welcomeRuleForm.enable({ emitEvent: false });
    this.criteriaCheckinRuleForm.enable({ emitEvent: false });
    this.criteriaFeatureEngagementRuleForm.enable({ emitEvent: false });
    this.productBasedRuleForm.enable({ emitEvent: false });

    // disable un-editable controls
    this.baseSettingForm.get('category')?.disable({ emitEvent: false });

    const checkinRuleFormArray = this.criteriaCheckinRuleForm.get(
      'criteria_checkin_rules'
    ) as FormArray;
    checkinRuleFormArray.controls.forEach((control) => {
      control.get('checkin_day')?.disable({ emitEvent: false });
    });

    const engagementRuleFormArray = this.criteriaFeatureEngagementRuleForm.get(
      'criteria_feature_engagement_rules'
    ) as FormArray;
    engagementRuleFormArray.controls.forEach((control) => {
      control.get('attribute')?.disable({ emitEvent: false });
      if (control.get('unlimited_value')?.value) {
        control.get('value')?.disable({ emitEvent: false });
      }
    });

    const default_attribute = this.criteriaFeatureEngagementRuleForm
      .get('default_attribute')
      ?.getRawValue();
    if (default_attribute === EngagementBasedRuleAttributeCode.TaxCertificate) {
      this.criteriaFeatureEngagementRuleForm
        .get('is_unlimited_value')
        ?.disable({ emitEvent: false });
    }

    this.productBasedRuleForm.get('plan_code')?.disable({ emitEvent: false });
    this.productBasedRuleForm.get('marketing_name_en')?.disable({
      emitEvent: false,
    });
    this.productBasedRuleForm.get('marketing_name_th')?.disable({
      emitEvent: false,
    });
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditPointRuleActions.reset());
  }
}
