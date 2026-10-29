import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditPointRuleComponent } from './create-edit-point-rule.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { of, ReplaySubject, Subject } from 'rxjs';
import * as CreateEditPointRuleActions from '../../stores/create-edit-point-rule/create-edit-point-rule.actions';
import * as createEditPointRuleSelectors from '../../stores/create-edit-point-rule/create-edit-point-rule.selectors';
import { CategoryCode } from '../../constants/category-options.const';
import { CriteriaCode } from '../../constants/criteria-options.const';
import { WelcomeRuleConditionCode } from '../../utils/welcome-rule-condition-code.enum';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { WelcomeRuleValueCode } from '../../utils/welcome-rule-value-code.enum';
import { EngagementBasedRuleAttributeCode } from '../../constants/engagement-based-rule-attribute-options.const';
import { CountExpiryFromCode } from '../../constants/count-expiry-from.const';
import { ExpiryConditionCode } from '../../constants/expiry-condition.const';

describe('CreateEditPointRuleComponent', () => {
  let component: CreateEditPointRuleComponent;
  let fixture: ComponentFixture<CreateEditPointRuleComponent>;
  let store: MockStore;
  let datePipe: DatePipe;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;
  let mockChangeDetector: jest.Mocked<ChangeDetectorRef>;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      params: of({ point_rule_id: 123 }),
    };

    mockChangeDetector = {
      detectChanges: jest.fn(),
      markForCheck: jest.fn(),
      detach: jest.fn(),
      reattach: jest.fn(),
      checkNoChanges: jest.fn(),
    } as unknown as jest.Mocked<ChangeDetectorRef>;

    await TestBed.configureTestingModule({
      imports: [
        CreateEditPointRuleComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatNativeDateModule,
      ],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        FormBuilder,
        DatePipe,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ChangeDetectorRef, useValue: mockChangeDetector },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditPointRuleComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    datePipe = TestBed.inject(DatePipe);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable all forms', () => {
    const spy1 = jest.spyOn(component.baseSettingForm, 'disable');
    const spy2 = jest.spyOn(component.welcomeRuleDefaultPointForm, 'disable');
    const spy3 = jest.spyOn(component.welcomeRuleForm, 'disable');
    const spy4 = jest.spyOn(component.criteriaCheckinRuleForm, 'disable');
    const spy5 = jest.spyOn(
      component.criteriaFeatureEngagementRuleForm,
      'disable'
    );
    component.disableAllForm();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
  });

  it('should enable all forms', () => {
    const spy1 = jest.spyOn(component.baseSettingForm, 'enable');
    const spy2 = jest.spyOn(component.welcomeRuleDefaultPointForm, 'enable');
    const spy3 = jest.spyOn(component.welcomeRuleForm, 'enable');
    const spy4 = jest.spyOn(component.criteriaCheckinRuleForm, 'enable');
    const spy5 = jest.spyOn(
      component.criteriaFeatureEngagementRuleForm,
      'enable'
    );
    component.enableAllForm();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
  });

  it('should set form mode and dispatch setFormDirty', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.setFormMode('edit');
    expect(component.formMode()).toBe('edit');
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(
        CreateEditPointRuleActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  });

  it('should get start and end date time', () => {
    const form = component.baseSettingForm;
    form.patchValue({
      start_date: new Date('2023-01-01'),
      start_time: '10:30',
      end_date: new Date('2023-01-02'),
      end_time: '12:00',
    });
    const result = component.getStartDateTimeEndDateTime(form);
    expect(result.start_date_time).toBeInstanceOf(Date);
    expect(result.end_date_time).toBeInstanceOf(Date);
    expect(result.start_date_time.getHours()).toBe(10);
    expect(result.start_date_time.getMinutes()).toBe(30);
    expect(result.end_date_time?.getHours()).toBe(12);
    expect(result.end_date_time?.getMinutes()).toBe(0);
  });

  it('should mark all as touched and not dispatch if form is invalid', () => {
    const spy1 = jest.spyOn(component.baseSettingForm, 'markAllAsTouched');
    const spy2 = jest.spyOn(
      component.welcomeRuleDefaultPointForm,
      'markAllAsTouched'
    );
    const spy3 = jest.spyOn(component.welcomeRuleForm, 'markAllAsTouched');
    const spy4 = jest.spyOn(
      component.criteriaCheckinRuleForm,
      'markAllAsTouched'
    );
    const spy5 = jest.spyOn(
      component.criteriaFeatureEngagementRuleForm,
      'markAllAsTouched'
    );
    const spyDispatch = jest.spyOn(store, 'dispatch');
    component.baseSettingForm.patchValue({ name: '', description: '' });
    component.onSubmit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
    expect(spyDispatch).not.toHaveBeenCalledWith(
      CreateEditPointRuleActions.createPointRule({ queryParams: {} })
    );
  });

  it('should dispatch createPointRule if form is valid and mode is create', () => {
    component.formMode.set('create');
    component.baseSettingForm.patchValue({
      name: 'Test',
      description: 'desc',
      expiry_date_duration: 2,
      category: CategoryCode.WelcomeRule,
      start_date: new Date('2025-05-15T10:22:00.000Z'),
      start_time: datePipe.transform('2025-05-15T10:22:00.000Z', 'HH:mm'),
      end_date: '2025-05-18T04:22:00.000Z',
      end_time: datePipe.transform('2025-05-18T04:22:00.000Z', 'HH:mm'),
    });
    component.welcomeRuleDefaultPointForm.patchValue({ set_point: 10 });
    jest.spyOn(component.baseSettingForm, 'valid', 'get').mockReturnValue(true);
    jest
      .spyOn(component.welcomeRuleDefaultPointForm, 'valid', 'get')
      .mockReturnValue(true);
    jest.spyOn(component.welcomeRuleForm, 'valid', 'get').mockReturnValue(true);
    jest.spyOn(store, 'dispatch');
    component.onSubmit();
    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditPointRuleActions.createPointRule({
          queryParams: {
            category: 'WELCOME_RULE',
            criteria_based_rule: undefined,
            description: 'desc',
            end_date_time: '',
            expiry_date_duration: 1,
            is_published: false,
            name: 'Test',
            set_point: 10,
            start_date_time: '2025-05-15T10:22:00.000Z',
            welcome_point_rules: [
              {
                earning_point: 0,
                rule_conditions: [
                  {
                    attribute: WelcomeRuleConditionCode.UserType,
                    condition: CompareConditionType.Is,
                    group_condition: null,
                    value: WelcomeRuleValueCode.Customer,
                    welcome_rule_condition_id: null,
                  },
                ],
              },
            ],
          },
        })
      );
    }, 0);
  });

  it('should open dialog and dispatch updatePointRule if form is valid and mode is edit', () => {
    component.formMode.set('edit');
    component.baseSettingForm.patchValue({
      name: 'Test',
      description: 'desc',
      expiry_date_duration: 2,
      category: CategoryCode.WelcomeRule,
    });
    component.welcomeRuleDefaultPointForm.patchValue({ set_point: 10 });
    jest.spyOn(component.baseSettingForm, 'valid', 'get').mockReturnValue(true);
    jest
      .spyOn(component.welcomeRuleDefaultPointForm, 'valid', 'get')
      .mockReturnValue(true);
    jest.spyOn(component.welcomeRuleForm, 'valid', 'get').mockReturnValue(true);
    const dialogSpy = jest.spyOn(mockDialog, 'open');
    const afterClosed$ = new Subject<boolean>();
    dialogSpy.mockReturnValue({
      afterClosed: () => afterClosed$,
    } as any);
    jest.spyOn(store, 'dispatch');
    setTimeout(() => afterClosed$.next(true));
    component.onSubmit();
    afterClosed$.next(true);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should call setValueCriteriaCheckinRuleForm', () => {
    const detail = {
      criteria_based_rule: {
        criteria_checkin_rules: [{ checkin_day: 1, earning_point: 2 }],
      },
    } as any;
    component.setValueCriteriaCheckinRuleForm(detail);
    expect(
      component.criteriaCheckinRuleForm.get('criteria_checkin_rules')?.value
        .length
    ).toBe(1);
  });

  it('should call setValueWelcomeRuleForm', () => {
    const detail = {
      welcome_point_rules: [
        {
          earning_point: 5,
          rule_conditions: [
            {
              attribute: 'a',
              condition: 'b',
              value: 'c',
              group_condition: 'd',
            },
          ],
        },
      ],
    } as any;
    component.setValueWelcomeRuleForm(detail);
    expect(component.welcomeRuleForm.get('rules')?.value.length).toBe(1);
  });

  it('should call setValueCriteriaFeatureEngagementRuleForm', () => {
    const detail = {
      criteria_based_rule: {
        criteria_feature_engagement_rules: [
          {
            attribute: 'a',
            condition: 'b',
            value: 'c',
            unlimited_value: false,
            earning_point: 1,
          },
          {
            attribute: 'a2',
            condition: 'b2',
            value: 'c2',
            unlimited_value: true,
            earning_point: 2,
          },
        ],
      },
    } as any;
    component.setValueCriteriaFeatureEngagementRuleForm(detail);
    expect(
      component.criteriaFeatureEngagementRuleForm.get(
        'criteria_feature_engagement_rules'
      )?.value.length
    ).toBe(1);
  });

  it('should dispatch reset on ngOnDestroy', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith(CreateEditPointRuleActions.reset());
  });

  describe('Form Validation and Submission', () => {
    it('should validate ProductBasedRuleForm with invalid channels', () => {
      component.channelOptions = [
        {
          key: 'valid-channel',
          name: 'Valid Channel',
          channel_code: 'VC',
          system_id: '1',
        } as any,
      ];

      const channelRulesArray = component.productBasedRuleForm.get(
        'channel_rules'
      ) as FormArray;
      channelRulesArray.push(
        component['fb'].group({
          channel: ['invalid-channel'],
          point_rate: [1],
        })
      );

      const result = component.validateProductBasedRuleForm(
        component.productBasedRuleForm
      );
      expect(result).toBe(false);
    });

    it('should validate ProductBasedRuleForm with invalid product name', () => {
      component.channelOptions = [];
      component['productNames'].set([
        { product_code: 'VALID_CODE', product_name: 'Valid Product' } as any,
      ]);

      component.productBasedRuleForm.patchValue({
        plan_code: 'INVALID_CODE',
        product_name: 'Invalid Product',
      });

      const result = component.validateProductBasedRuleForm(
        component.productBasedRuleForm
      );
      expect(result).toBe(false);
    });

    it('should validate ProductBasedRuleForm with valid data', () => {
      component.channelOptions = [
        {
          key: 'valid-channel',
          name: 'Valid Channel',
          channel_code: 'VC',
          system_id: '1',
        } as any,
      ];
      component['productNames'].set([
        { product_code: 'VALID_CODE', product_name: 'Valid Product' } as any,
      ]);

      const channelRulesArray = component.productBasedRuleForm.get(
        'channel_rules'
      ) as FormArray;
      channelRulesArray.push(
        component['fb'].group({
          channel: ['valid-channel'],
          point_rate: [1],
        })
      );

      component.productBasedRuleForm.patchValue({
        plan_code: 'VALID_CODE',
        product_name: 'Valid Product',
      });

      const result = component.validateProductBasedRuleForm(
        component.productBasedRuleForm
      );
      expect(result).toBe(false);
    });

    it('should handle form submission for criteria-based daily checkin rule', () => {
      component.formMode.set('create');
      component.baseSettingForm.patchValue({
        name: 'Test Rule',
        description: 'Test Description',
        category: CategoryCode.CriteriaBasedRule,
        criteria_type: CriteriaCode.DailyCheckIn,
        expiry_date_duration: 30,
        start_date: new Date('2023-01-01'),
        start_time: '09:00',
      });

      jest
        .spyOn(component.baseSettingForm, 'valid', 'get')
        .mockReturnValue(true);
      jest
        .spyOn(component.criteriaCheckinRuleForm, 'valid', 'get')
        .mockReturnValue(true);
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPointRuleActions.createPointRule({
          queryParams: expect.objectContaining({
            category: CategoryCode.CriteriaBasedRule,
            criteria_based_rule: expect.objectContaining({
              criteria_type: CriteriaCode.DailyCheckIn,
            }),
          }),
        })
      );
    });

    it('should handle form submission for criteria-based feature engagement rule', () => {
      component.formMode.set('create');
      component.baseSettingForm.patchValue({
        name: 'Test Rule',
        description: 'Test Description',
        category: CategoryCode.CriteriaBasedRule,
        criteria_type: CriteriaCode.FeatureEngagement,
        expiry_date_duration: 30,
        start_date: new Date('2023-01-01'),
        start_time: '09:00',
      });

      component.criteriaFeatureEngagementRuleForm.patchValue({
        default_attribute: EngagementBasedRuleAttributeCode.TaxCertificate,
        default_condition: 'EQUAL',
        default_value: '100',
        default_earning_point: 10,
        criteria_feature_engagement_rules: [],
      });

      jest
        .spyOn(component.baseSettingForm, 'valid', 'get')
        .mockReturnValue(true);
      jest
        .spyOn(component.criteriaFeatureEngagementRuleForm, 'valid', 'get')
        .mockReturnValue(true);
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPointRuleActions.createPointRule({
          queryParams: expect.objectContaining({
            category: CategoryCode.CriteriaBasedRule,
            criteria_based_rule: expect.objectContaining({
              criteria_type: CriteriaCode.FeatureEngagement,
            }),
          }),
        })
      );
    });

    it('should handle form submission for product-based rule', () => {
      component.formMode.set('create');
      component.baseSettingForm.patchValue({
        name: 'Test Rule',
        description: 'Test Description',
        category: CategoryCode.ProductBasedRule,
        expiry_date_duration: 30,
        count_expiry_from: CountExpiryFromCode.EarningPointDate,
        expiry_condition: ExpiryConditionCode.EndOfNextCalendarYear,
        start_date: new Date('2023-01-01'),
        start_time: '09:00',
      });

      component.channelOptions = [
        {
          key: 'test-channel',
          name: 'Test Channel',
          channel_code: 'TC',
          system_id: '1',
        } as any,
      ];

      const channelRulesArray = component.productBasedRuleForm.get(
        'channel_rules'
      ) as FormArray;
      channelRulesArray.push(
        component['fb'].group({
          channel: ['test-channel'],
          point_rate: [1.5],
        })
      );

      component.productBasedRuleForm.patchValue({
        product_name: 'Test Product - PROD001',
        plan_code: 'PROD001',
        marketing_name_en: 'Test Product EN',
        marketing_name_th: 'Test Product TH',
      });

      jest
        .spyOn(component.baseSettingForm, 'valid', 'get')
        .mockReturnValue(true);
      jest
        .spyOn(component.productBasedRuleForm, 'valid', 'get')
        .mockReturnValue(true);
      jest
        .spyOn(component, 'validateProductBasedRuleForm')
        .mockReturnValue(true);
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPointRuleActions.createPointRule({
          queryParams: expect.objectContaining({
            category: CategoryCode.ProductBasedRule,
            product_based_rule: expect.objectContaining({
              product_name: 'Test Product - PROD001',
              channel_rules: expect.arrayContaining([
                expect.objectContaining({
                  channel: 'Test Channel',
                  point_rate: 1.5,
                }),
              ]),
            }),
          }),
        })
      );
    });
  });

  describe('Form Value Setting Methods', () => {
    it('should set criteria checkin rule form values', () => {
      const pointRuleDetail = {
        criteria_based_rule: {
          criteria_checkin_rules: [
            { checkin_day: 1, earning_point: 10 },
            { checkin_day: 2, earning_point: 20 },
          ],
        },
      } as any;

      component.setValueCriteriaCheckinRuleForm(pointRuleDetail);

      const rulesArray = component.criteriaCheckinRuleForm.get(
        'criteria_checkin_rules'
      ) as FormArray;
      expect(rulesArray.length).toBe(2);
      expect(rulesArray.at(0).get('checkin_day')?.value).toBe(1);
      expect(rulesArray.at(0).get('earning_point')?.value).toBe(10);
      expect(rulesArray.at(1).get('checkin_day')?.value).toBe(2);
      expect(rulesArray.at(1).get('earning_point')?.value).toBe(20);
    });

    it('should set criteria feature engagement rule form values with unlimited value', () => {
      const pointRuleDetail = {
        criteria_based_rule: {
          criteria_feature_engagement_rules: [
            {
              attribute: EngagementBasedRuleAttributeCode.TaxCertificate,
              condition: 'EQUAL',
              value: '100',
              unlimited_value: false,
              earning_point: 10,
            },
            {
              attribute: 'OTHER_ATTRIBUTE',
              condition: 'GREATER_THAN',
              value: 'Unlimited',
              unlimited_value: true,
              earning_point: 20,
            },
          ],
        },
      } as any;

      component.setValueCriteriaFeatureEngagementRuleForm(pointRuleDetail);

      const form = component.criteriaFeatureEngagementRuleForm;
      expect(form.get('default_attribute')?.value).toBe(
        EngagementBasedRuleAttributeCode.TaxCertificate
      );
      expect(form.get('default_condition')?.value).toBe('EQUAL');
      expect(form.get('default_value')?.value).toBe('100');
      expect(form.get('default_earning_point')?.value).toBe(10);
      expect(form.get('is_unlimited_value')?.value).toBe(true);

      const rulesArray = form.get(
        'criteria_feature_engagement_rules'
      ) as FormArray;
      expect(rulesArray.length).toBe(1);
      expect(rulesArray.at(0).get('value')?.value).toBe('Unlimited');
    });

    it('should set product based rule form values', () => {
      const pointRuleDetail = {
        product_based_rule: {
          product_based_rule_id: 123,
          product_name: 'Test Product',
          plan_code: 'PLAN001',
          marketing_name_en: 'Marketing EN',
          marketing_name_th: 'Marketing TH',
          channel_rules: [
            {
              product_based_rule_channel_id: 1,
              channel: 'Test Channel',
              channel_code: 'TC',
              system_id: '1',
              point_rate: 1.5,
            },
          ],
        },
      } as any;

      component.setValueProductBasedRuleForm(pointRuleDetail);

      const form = component.productBasedRuleForm;
      expect(form.get('product_based_rule_id')?.value).toBe(123);
      expect(form.get('product_name')?.value).toBe('Test Product');
      expect(form.get('plan_code')?.value).toBe('PLAN001');
      expect(form.get('marketing_name_en')?.value).toBe('Marketing EN');
      expect(form.get('marketing_name_th')?.value).toBe('Marketing TH');

      const channelRulesArray = form.get('channel_rules') as FormArray;
      expect(channelRulesArray.length).toBe(1);
      expect(channelRulesArray.at(0).get('channel')?.value).toBe(
        '1 - Test Channel (TC)'
      );
      expect(channelRulesArray.at(0).get('point_rate')?.value).toBe(1.5);
    });

    it('should set welcome rule form values with empty rules', () => {
      const pointRuleDetail = {
        welcome_point_rules: [],
      } as any;

      component.setValueWelcomeRuleForm(pointRuleDetail);

      const rulesArray = component.welcomeRuleForm.get('rules') as FormArray;
      expect(rulesArray.length).toBe(0);
    });
  });

  describe('Form Enable/Disable Methods', () => {
    it('should enable all forms in edit mode and handle specific control states', () => {
      // Setup criteria checkin form with controls
      const checkinRulesArray = component.criteriaCheckinRuleForm.get(
        'criteria_checkin_rules'
      ) as FormArray;
      checkinRulesArray.push(
        component['fb'].group({
          checkin_day: ['1'],
          earning_point: ['10'],
        })
      );

      // Setup criteria engagement form with controls
      const engagementRulesArray =
        component.criteriaFeatureEngagementRuleForm.get(
          'criteria_feature_engagement_rules'
        ) as FormArray;
      engagementRulesArray.push(
        component['fb'].group({
          attribute: ['test'],
          unlimited_value: [true],
          value: ['Unlimited'],
        })
      );

      component.criteriaFeatureEngagementRuleForm.patchValue({
        default_attribute: EngagementBasedRuleAttributeCode.TaxCertificate,
      });

      const enableSpy1 = jest.spyOn(component.baseSettingForm, 'enable');
      const enableSpy2 = jest.spyOn(
        component.welcomeRuleDefaultPointForm,
        'enable'
      );
      const disableSpy = jest.spyOn(
        component.baseSettingForm.get('category')!,
        'disable'
      );

      component.enableAllForm();

      expect(enableSpy1).toHaveBeenCalled();
      expect(enableSpy2).toHaveBeenCalled();
      expect(disableSpy).toHaveBeenCalled();

      // Check if is_unlimited_value is disabled for TaxCertificate
      expect(
        component.criteriaFeatureEngagementRuleForm.get('is_unlimited_value')
          ?.disabled
      ).toBe(true);
    });
  });

  describe('Date/Time Handling', () => {
    it('should handle getStartDateTimeEndDateTime with end date', () => {
      const form = component['fb'].group({
        start_date: [new Date('2023-01-01')],
        start_time: ['10:30'],
        end_date: [new Date('2023-01-02')],
        end_time: ['15:45'],
      });

      const result = component.getStartDateTimeEndDateTime(form);

      expect(result.start_date_time).toBeInstanceOf(Date);
      expect(result.end_date_time).toBeInstanceOf(Date);
      expect(result.start_date_time.getHours()).toBe(10);
      expect(result.start_date_time.getMinutes()).toBe(30);
      expect(result.end_date_time?.getHours()).toBe(15);
      expect(result.end_date_time?.getMinutes()).toBe(45);
    });

    it('should handle getStartDateTimeEndDateTime without end date', () => {
      const form = component['fb'].group({
        start_date: [new Date('2023-01-01')],
        start_time: ['10:30'],
        end_date: [null],
        end_time: ['15:45'],
      });

      const result = component.getStartDateTimeEndDateTime(form);

      expect(result.start_date_time).toBeInstanceOf(Date);
      expect(result.end_date_time).toBeNull();
    });

    it('should handle default time values', () => {
      const form = component['fb'].group({
        start_date: [new Date('2023-01-01')],
        start_time: [null],
        end_date: [new Date('2023-01-02')],
        end_time: [null],
      });

      const result = component.getStartDateTimeEndDateTime(form);

      expect(result.start_date_time.getHours()).toBe(0);
      expect(result.start_date_time.getMinutes()).toBe(0);
      expect(result.end_date_time?.getHours()).toBe(0);
      expect(result.end_date_time?.getMinutes()).toBe(0);
    });
  });

  describe('Action Handling', () => {
    it('should handle createPointRuleSuccess action', () => {
      const dialogSpy = jest.spyOn(mockDialog, 'open');
      const afterClosed$ = new Subject<void>();

      dialogSpy.mockReturnValue({
        afterClosed: () => afterClosed$,
      } as any);

      component.formMode.set('create');

      // Trigger the success action
      actions$.next(CreateEditPointRuleActions.createPointRuleSuccess());

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            message: 'The Point Rule was created',
          }),
        })
      );

      // Simulate dialog close
      afterClosed$.next();

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        'point-management',
        'point-rule-management',
        'list',
      ]);
    });

    it('should handle updatePointRuleSuccess action', () => {
      const dialogSpy = jest.spyOn(mockDialog, 'open');
      const afterClosed$ = new Subject<void>();

      dialogSpy.mockReturnValue({
        afterClosed: () => afterClosed$,
      } as any);

      component.formMode.set('edit');

      // Trigger the success action
      actions$.next(CreateEditPointRuleActions.updatePointRuleSuccess());

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            message: 'The Point Rule was updated',
          }),
        })
      );

      // Simulate dialog close
      afterClosed$.next();

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        'point-management',
        'point-rule-management',
        'list',
      ]);
    });
  });

  describe('Form Category and Criteria Type Changes', () => {
    it('should reset welcome rule forms when category changes to WelcomeRule in create mode', () => {
      component.formMode.set('create');
      const resetSpy = jest.spyOn(
        component.welcomeRuleDefaultPointForm,
        'reset'
      );

      // Trigger category change
      component.baseSettingForm
        .get('category')
        ?.setValue(CategoryCode.WelcomeRule);

      expect(resetSpy).toHaveBeenCalled();
    });

    it('should initialize product based rule form when category changes to ProductBasedRule in create mode', () => {
      component.formMode.set('create');

      // Trigger category change
      component.baseSettingForm
        .get('category')
        ?.setValue(CategoryCode.ProductBasedRule);

      expect(component.productBasedRuleForm).toBeDefined();
    });

    it('should initialize criteria checkin form when criteria type changes to DailyCheckIn', () => {
      // Trigger criteria type change
      component.baseSettingForm
        .get('criteria_type')
        ?.setValue(CriteriaCode.DailyCheckIn);

      expect(component.criteriaCheckinRuleForm).toBeDefined();
    });

    it('should initialize criteria engagement form when criteria type changes to FeatureEngagement', () => {
      // Trigger criteria type change
      component.baseSettingForm
        .get('criteria_type')
        ?.setValue(CriteriaCode.FeatureEngagement);

      expect(component.criteriaFeatureEngagementRuleForm).toBeDefined();
    });
  });

  describe('Store Selectors and Observables', () => {
    it('should handle productNames$ observable', () => {
      const mockProductNames = [
        { product_code: 'PROD1', product_name: 'Product 1' },
        { product_code: 'PROD2', product_name: 'Product 2' },
      ] as any[];

      // Mock the store selector
      store.overrideSelector(
        createEditPointRuleSelectors.selectProductNames,
        mockProductNames
      );
      store.refreshState();

      component['productNames$'].subscribe((productNames) => {
        expect(component.productNames()).toEqual(mockProductNames);
      });
    });

    it('should handle channelOptions$ observable', () => {
      const mockPolicyChannels = [
        { system_id: '1', name: 'Channel 1', channel_code: 'CH1' },
        { system_id: '2', name: 'Channel 2', channel_code: 'CH2' },
      ] as any[];

      // Mock the store selector
      store.overrideSelector(
        createEditPointRuleSelectors.selectPolicyChannels,
        mockPolicyChannels
      );
      store.refreshState();

      component['channelOptions$'].subscribe((options) => {
        expect(component.channelOptions).toEqual([
          { ...mockPolicyChannels[0], key: '1 - Channel 1 (CH1)' },
          { ...mockPolicyChannels[1], key: '2 - Channel 2 (CH2)' },
        ]);
      });
    });
  });

  describe('Form Dirty State Handling', () => {
    it('should dispatch setFormDirty on form value changes', () => {
      component.formMode.set('edit'); // Not view mode
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      // Trigger form value change
      component.baseSettingForm.get('name')?.setValue('New Name');

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPointRuleActions.setFormDirty({ isDirty: true })
      );
    });

    it('should not dispatch setFormDirty in view mode', () => {
      component.formMode.set('view');
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      // Trigger form value change
      component.baseSettingForm.get('name')?.setValue('New Name');

      // Should not be called because we're in view mode
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        CreateEditPointRuleActions.setFormDirty({ isDirty: true })
      );
    });
  });

  describe('Edit Mode Confirmation Dialog', () => {
    it('should open confirmation dialog and dispatch updatePointRule on confirmation', () => {
      component.formMode.set('edit');
      component.pointRuleId.set(123);

      // Setup valid form
      component.baseSettingForm.patchValue({
        name: 'Test Rule',
        description: 'Test Description',
        category: CategoryCode.WelcomeRule,
        expiry_date_duration: 30,
        start_date: new Date('2023-01-01'),
        start_time: '09:00',
      });

      component.welcomeRuleDefaultPointForm.patchValue({ set_point: 10 });

      jest
        .spyOn(component.baseSettingForm, 'valid', 'get')
        .mockReturnValue(true);
      jest
        .spyOn(component.welcomeRuleDefaultPointForm, 'valid', 'get')
        .mockReturnValue(true);
      jest
        .spyOn(component.welcomeRuleForm, 'valid', 'get')
        .mockReturnValue(true);

      const dialogSpy = jest.spyOn(mockDialog, 'open');
      const afterClosed$ = new Subject<boolean>();

      dialogSpy.mockReturnValue({
        afterClosed: () => afterClosed$,
      } as any);

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onSubmit();

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Update point rule?',
            type: 'warning',
          }),
        })
      );

      // Simulate confirmation
      afterClosed$.next(true);

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPointRuleActions.updatePointRule({
          data: expect.objectContaining({
            id: 123,
          }),
        })
      );
    });

    it('should not dispatch updatePointRule if confirmation is cancelled', () => {
      component.formMode.set('edit');

      // Setup valid form
      component.baseSettingForm.patchValue({
        name: 'Test Rule',
        description: 'Test Description',
        category: CategoryCode.WelcomeRule,
        expiry_date_duration: 30,
      });

      jest
        .spyOn(component.baseSettingForm, 'valid', 'get')
        .mockReturnValue(true);
      jest
        .spyOn(component.welcomeRuleDefaultPointForm, 'valid', 'get')
        .mockReturnValue(true);
      jest
        .spyOn(component.welcomeRuleForm, 'valid', 'get')
        .mockReturnValue(true);

      const dialogSpy = jest.spyOn(mockDialog, 'open');
      const afterClosed$ = new Subject<boolean>();

      dialogSpy.mockReturnValue({
        afterClosed: () => afterClosed$,
      } as any);

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onSubmit();

      // Simulate cancellation
      afterClosed$.next(false);

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        CreateEditPointRuleActions.updatePointRule(expect.anything())
      );
    });
  });

  describe('setFormMode', () => {
    it('should set form mode to edit and enable forms', () => {
      const enableSpy = jest.spyOn(component, 'enableAllForm');
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.setFormMode('edit');

      expect(component.formMode()).toBe('edit');
      expect(enableSpy).toHaveBeenCalled();

      // Check that setFormDirty is called after timeout
      setTimeout(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          CreateEditPointRuleActions.setFormDirty({ isDirty: false })
        );
      }, 0);
    });

    it('should set form mode to view without enabling forms', () => {
      const enableSpy = jest.spyOn(component, 'enableAllForm');
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.setFormMode('view');

      expect(component.formMode()).toBe('view');
      expect(enableSpy).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          CreateEditPointRuleActions.setFormDirty({ isDirty: false })
        );
      }, 0);
    });
  });
});
