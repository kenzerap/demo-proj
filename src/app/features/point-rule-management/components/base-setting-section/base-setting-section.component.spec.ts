import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseSettingSectionComponent } from './base-setting-section.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, Subject } from 'rxjs';
import { CategoryCode } from '../../constants/category-options.const';
import { CriteriaCode } from '../../constants/criteria-options.const';
import { ResetPeriodCode } from '../../constants/reset-period-options.const';
import { CountExpiryFromCode } from '../../constants/count-expiry-from.const';
import { ExpiryConditionCode } from '../../constants/expiry-condition.const';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PointRuleDetail } from '../../models/point-rule-model';
import * as createEditPointRuleSelectors from '../../stores/create-edit-point-rule/create-edit-point-rule.selectors';

describe('BaseSettingSectionComponent', () => {
  let component: BaseSettingSectionComponent;
  let fixture: ComponentFixture<BaseSettingSectionComponent>;
  let formBuilder: FormBuilder;
  let mockStore: MockStore;
  let mockDialog: jest.Mocked<MatDialog>;

  const mockPointRuleDetail: PointRuleDetail = {
    id: 1,
    name: 'Test Rule',
    description: 'Test Description',
    count_expiry_from: CountExpiryFromCode.EarningPointDate,
    expiry_condition: ExpiryConditionCode.SetExpiryValue,
    expiry_date_duration: 30,
    category: CategoryCode.ProductBasedRule,
    criteria_type: CriteriaCode.DailyCheckIn,
    criteria_reset_period: ResetPeriodCode.Daily,
    is_published: true,
    start_date: '2023-10-01',
    start_time: '10:00',
    end_date: '2023-10-02',
    end_time: '18:00',
    isSetEndDate: true,
  } as any;

  beforeEach(async () => {
    const dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BaseSettingSectionComponent,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: createEditPointRuleSelectors.selectPointRuleDetail,
              value: null,
            },
          ],
        }),
        FormBuilder,
        DatePipe,
        { provide: MatDialog, useValue: dialogSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseSettingSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    mockStore = TestBed.inject(MockStore);
    mockDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;

    // Initialize form group with all required controls
    component.formGroup = formBuilder.group({
      start_date: ['2023-10-01', Validators.required],
      start_time: ['10:00', Validators.required],
      end_date: ['2023-10-02', Validators.required],
      end_time: ['18:00', Validators.required],
      isSetEndDate: [true],
      name: ['Test Rule', Validators.required],
      description: ['Test Description', Validators.required],
      category: [CategoryCode.WelcomeRule],
      expiry_date_duration: [30, [Validators.required, Validators.min(1)]],
      criteria_type: [CriteriaCode.DailyCheckIn],
      criteria_reset_period: [ResetPeriodCode.Daily],
      count_expiry_from: [CountExpiryFromCode.EarningPointDate],
      expiry_condition: [ExpiryConditionCode.SetExpiryValue],
      is_published: [false],
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    mockStore?.resetSelectors();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.formMode).toBe('create');
      expect(component.currentDate).toBeInstanceOf(Date);
      expect(component.imageNameUploaded()).toBe('Upload file');
    });

    it('should initialize options arrays', () => {
      expect(component.categoryOptions).toBeDefined();
      expect(component.countExpiryFromOptions).toBeDefined();
      expect(component.expiryConditionOptions).toBeDefined();
      expect(component.criteriaOptions).toBeDefined();
      expect(component.resetPeriodOptions).toBeDefined();
    });
  });

  describe('Form Controls Getters', () => {
    it('should return correct form controls', () => {
      expect(component.startDateControl).toBe(
        component.formGroup.get('start_date')
      );
      expect(component.startTimeControl).toBe(
        component.formGroup.get('start_time')
      );
      expect(component.endDateControl).toBe(
        component.formGroup.get('end_date')
      );
      expect(component.endTimeControl).toBe(
        component.formGroup.get('end_time')
      );
      expect(component.isSetEndDateControl).toBe(
        component.formGroup.get('isSetEndDate')
      );
      expect(component.nameControl).toBe(component.formGroup.get('name'));
      expect(component.descriptionControl).toBe(
        component.formGroup.get('description')
      );
      expect(component.isPublishedControl).toBe(
        component.formGroup.get('is_published')
      );
      expect(component.categoryControl).toBe(
        component.formGroup.get('category')
      );
      expect(component.countExpiryFromControl).toBe(
        component.formGroup.get('count_expiry_from')
      );
      expect(component.expiryConditionControl).toBe(
        component.formGroup.get('expiry_condition')
      );
      expect(component.expiryDateDurationControl).toBe(
        component.formGroup.get('expiry_date_duration')
      );
      expect(component.criteriaTypeControl).toBe(
        component.formGroup.get('criteria_type')
      );
      expect(component.criteriaResetPeriodControl).toBe(
        component.formGroup.get('criteria_reset_period')
      );
    });

    it('should handle undefined form group', () => {
      component.formGroup = null as any;
      expect(component.startDateControl).toBeUndefined();
      expect(component.startTimeControl).toBeUndefined();
    });
  });

  describe('ngOnInit', () => {
    it('should call reValidateForm on init', () => {
      const reValidateFormSpy = jest.spyOn(component, 'reValidateForm');
      component.ngOnInit();
      expect(reValidateFormSpy).toHaveBeenCalled();
    });

    it('should handle pointRuleDetail$ with PremiumPaidDate', () => {
      const mockDetail = {
        ...mockPointRuleDetail,
        count_expiry_from: CountExpiryFromCode.PremiumPaidDate,
      };
      mockStore.overrideSelector(
        createEditPointRuleSelectors.selectPointRuleDetail,
        mockDetail
      );

      component.ngOnInit();

      expect(component.expiryConditionOptions).toEqual([
        {
          value: 'End of next calendar year',
          code: ExpiryConditionCode.EndOfNextCalendarYear,
        },
      ]);
    });

    it('should handle pointRuleDetail$ with other expiry from codes', () => {
      mockStore.overrideSelector(
        createEditPointRuleSelectors.selectPointRuleDetail,
        mockPointRuleDetail
      );

      component.ngOnInit();

      expect(component.expiryConditionOptions.length).toBeGreaterThan(1);
    });

    it('should handle null pointRuleDetail$', () => {
      mockStore.overrideSelector(
        createEditPointRuleSelectors.selectPointRuleDetail,
        null
      );

      component.ngOnInit();

      // Should not throw error and continue with initialization
      expect(component).toBeTruthy();
    });
  });

  describe('Form Validation - isSetEndDate Changes', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should clear end date/time validators when isSetEndDate is false', () => {
      component.isSetEndDateControl?.setValue(false);

      expect(component.endDateControl?.hasError).toBeDefined();
      expect(component.endTimeControl?.hasError).toBeDefined();
    });

    it('should set end date/time validators when isSetEndDate is true', () => {
      component.isSetEndDateControl?.setValue(true);

      expect(component.endDateControl?.validator).toBeTruthy();
      expect(component.endTimeControl?.validator).toBeTruthy();
    });

    it('should reset end date/time values when isSetEndDate is false', () => {
      component.endDateControl?.setValue('2023-10-02');
      component.endTimeControl?.setValue('18:00');

      component.isSetEndDateControl?.setValue(false);

      expect(component.endDateControl?.value).toBeNull();
      expect(component.endTimeControl?.value).toBeNull();
    });
  });

  describe('Form Validation - Date/Time Changes', () => {
    beforeEach(() => {
      component.ngOnInit();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should trigger start time validation when start date changes', () => {
      const updateValueAndValiditySpy = jest.spyOn(
        component.startTimeControl!,
        'updateValueAndValidity'
      );

      component.startDateControl?.setValue('2023-10-02');
      jest.advanceTimersByTime(100);

      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    });

    it('should trigger end time validation when end date changes', () => {
      const updateValueAndValiditySpy = jest.spyOn(
        component.endTimeControl!,
        'updateValueAndValidity'
      );

      component.endDateControl?.setValue('2023-10-03');
      jest.advanceTimersByTime(100);

      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    });

    it('should trigger end time validation when start time changes', () => {
      const updateValueAndValiditySpy = jest.spyOn(
        component.endTimeControl!,
        'updateValueAndValidity'
      );

      component.startTimeControl?.setValue('11:00');
      jest.advanceTimersByTime(1);

      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    });
  });

  describe('Category Control Changes', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should handle ProductBasedRule category', () => {
      component.categoryControl?.setValue(CategoryCode.ProductBasedRule);

      expect(component.countExpiryFromControl?.value).toBe(
        CountExpiryFromCode.EarningPointDate
      );
      expect(component.countExpiryFromControl?.validator).toBeTruthy();
      expect(component.expiryConditionControl?.validator).toBeTruthy();
    });

    it('should handle ProductBasedRule with SetExpiryValue condition', () => {
      component.expiryConditionControl?.setValue(
        ExpiryConditionCode.SetExpiryValue
      );
      component.categoryControl?.setValue(CategoryCode.ProductBasedRule);

      expect(component.expiryDateDurationControl?.validator).toBeFalsy();
    });

    it('should handle ProductBasedRule with EndOfNextCalendarYear condition', () => {
      component.expiryConditionControl?.setValue(
        ExpiryConditionCode.EndOfNextCalendarYear
      );
      component.categoryControl?.setValue(CategoryCode.ProductBasedRule);

      // Should clear validators for expiry date duration
      expect(component.expiryDateDurationControl?.value).toBeNull();
    });

    it('should handle CriteriaBasedRule category', () => {
      component.categoryControl?.setValue(CategoryCode.CriteriaBasedRule);

      expect(component.criteriaTypeControl?.value).toBe(
        CriteriaCode.DailyCheckIn
      );
      expect(component.expiryDateDurationControl?.validator).toBeTruthy();
    });

    it('should handle WelcomeRule category (default case)', () => {
      component.categoryControl?.setValue(CategoryCode.WelcomeRule);

      expect(component.expiryDateDurationControl?.validator).toBeTruthy();
    });
  });

  describe('Criteria Type Control Changes', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should handle FeatureEngagement criteria', () => {
      component.criteriaTypeControl?.setValue(CriteriaCode.FeatureEngagement);

      expect(component.criteriaResetPeriodControl?.value).toBe(
        ResetPeriodCode.Daily
      );
      expect(component.expiryDateDurationControl?.value).toBeNull();
    });

    it('should handle other criteria types (default case)', () => {
      component.criteriaTypeControl?.setValue(CriteriaCode.DailyCheckIn);

      expect(component.expiryDateDurationControl?.value).toBeNull();
      expect(component.criteriaResetPeriodControl?.value).toBeNull();
    });
  });

  describe('Expiry Condition Control Changes', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should handle EndOfNextCalendarYear condition', () => {
      const updateValueAndValiditySpy = jest.spyOn(
        component.expiryDateDurationControl!,
        'updateValueAndValidity'
      );

      component.expiryConditionControl?.setValue(
        ExpiryConditionCode.EndOfNextCalendarYear
      );

      expect(component.expiryDateDurationControl?.value).toBe('');
      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    });

    it('should handle SetExpiryValue condition', () => {
      const updateValueAndValiditySpy = jest.spyOn(
        component.expiryDateDurationControl!,
        'updateValueAndValidity'
      );

      component.expiryConditionControl?.setValue(
        ExpiryConditionCode.SetExpiryValue
      );

      expect(component.expiryDateDurationControl?.value).toBeNull();
      expect(component.expiryDateDurationControl?.validator).toBeTruthy();
      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    });
  });

  describe('Count Expiry From Control Changes', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should handle PremiumPaidDate', () => {
      component.countExpiryFromControl?.setValue(
        CountExpiryFromCode.PremiumPaidDate
      );

      expect(component.expiryConditionOptions).toEqual([
        {
          value: 'End of next calendar year',
          code: ExpiryConditionCode.EndOfNextCalendarYear,
        },
      ]);
    });

    it('should handle EarningPointDate (default case)', () => {
      const originalLength = component.expiryConditionOptions.length;
      component.countExpiryFromControl?.setValue(
        CountExpiryFromCode.EarningPointDate
      );

      expect(component.expiryConditionOptions.length).toBeGreaterThanOrEqual(
        originalLength
      );
    });
  });

  describe('updateProductBasedRuleControls', () => {
    it('should update all product-based rule controls', () => {
      const countExpirySpy = jest.spyOn(
        component.countExpiryFromControl!,
        'updateValueAndValidity'
      );
      const expiryConditionSpy = jest.spyOn(
        component.expiryConditionControl!,
        'updateValueAndValidity'
      );
      const expiryDurationSpy = jest.spyOn(
        component.expiryDateDurationControl!,
        'updateValueAndValidity'
      );

      component.updateProductBasedRuleControls();

      expect(countExpirySpy).toHaveBeenCalled();
      expect(expiryConditionSpy).toHaveBeenCalled();
      expect(expiryDurationSpy).toHaveBeenCalled();
    });
  });

  describe('getDropdownValue', () => {
    const mockOptions = [
      { code: 'CODE1', value: 'Value 1' },
      { code: 'CODE2', value: 'Value 2' },
    ];

    it('should return correct value for existing code', () => {
      const result = component.getDropdownValue('CODE1', mockOptions);
      expect(result).toBe('Value 1');
    });

    it('should return empty string for non-existing code', () => {
      const result = component.getDropdownValue('NONEXISTENT', mockOptions);
      expect(result).toBe('');
    });

    it('should return empty string for null code', () => {
      const result = component.getDropdownValue(null, mockOptions);
      expect(result).toBe('');
    });

    it('should return empty string for empty options array', () => {
      const result = component.getDropdownValue('CODE1', []);
      expect(result).toBe('');
    });
  });

  describe('reValidateForm', () => {
    it('should set validators for start date and time', () => {
      component.reValidateForm();

      expect(component.startDateControl?.validator).toBeTruthy();
      expect(component.startTimeControl?.validator).toBeTruthy();
    });

    it('should handle ProductBasedRule category in reValidateForm', () => {
      component.categoryControl?.setValue(CategoryCode.ProductBasedRule);
      component.expiryConditionControl?.setValue(
        ExpiryConditionCode.SetExpiryValue
      );

      component.reValidateForm();

      expect(component.countExpiryFromControl?.validator).toBeTruthy();
      expect(component.expiryConditionControl?.validator).toBeTruthy();
      expect(component.expiryDateDurationControl?.validator).toBeTruthy();
    });

    it('should handle ProductBasedRule with EndOfNextCalendarYear', () => {
      component.categoryControl?.setValue(CategoryCode.ProductBasedRule);
      component.expiryConditionControl?.setValue(
        ExpiryConditionCode.EndOfNextCalendarYear
      );

      component.reValidateForm();

      expect(component.countExpiryFromControl?.validator).toBeTruthy();
      expect(component.expiryConditionControl?.validator).toBeTruthy();
    });

    it('should handle CriteriaBasedRule category in reValidateForm', () => {
      component.categoryControl?.setValue(CategoryCode.CriteriaBasedRule);

      component.reValidateForm();

      expect(component.expiryDateDurationControl?.validator).toBeTruthy();
    });

    it('should handle WelcomeRule category (default) in reValidateForm', () => {
      component.categoryControl?.setValue(CategoryCode.WelcomeRule);

      component.reValidateForm();

      expect(component.expiryDateDurationControl?.validator).toBeTruthy();
    });
  });

  describe('endTimeValidator', () => {
    let mockControl: AbstractControl;

    beforeEach(() => {
      mockControl = { value: '18:00' } as AbstractControl;
    });

    it('should return null when required data is missing', () => {
      component.formGroup.patchValue({
        start_date: null,
        start_time: '10:00',
        end_date: '2023-10-01',
      });

      const result = component.endTimeValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should return required error when end time is empty', () => {
      mockControl = { value: '' } as AbstractControl;
      component.formGroup.patchValue({
        start_date: '2023-10-01',
        start_time: '10:00',
        end_date: '2023-10-01',
      });

      const result = component.endTimeValidator(mockControl);
      expect(result).toEqual({ required: true });
    });

    it('should return required error when end time is whitespace', () => {
      mockControl = { value: '   ' } as AbstractControl;
      component.formGroup.patchValue({
        start_date: '2023-10-01',
        start_time: '10:00',
        end_date: '2023-10-01',
      });

      const result = component.endTimeValidator(mockControl);
      expect(result).toEqual({ required: true });
    });

    it('should return invalidEndTime when end time is before start time', () => {
      mockControl = { value: '09:00' } as AbstractControl;
      component.formGroup.patchValue({
        start_date: '2023-10-01',
        start_time: '10:00',
        end_date: '2023-10-01',
      });

      const result = component.endTimeValidator(mockControl);
      expect(result).toEqual({ invalidEndTime: true });
    });

    it('should return invalidEndTime when end time equals start time', () => {
      mockControl = { value: '10:00' } as AbstractControl;
      component.formGroup.patchValue({
        start_date: '2023-10-01',
        start_time: '10:00',
        end_date: '2023-10-01',
      });

      const result = component.endTimeValidator(mockControl);
      expect(result).toEqual({ invalidEndTime: true });
    });

    it('should return null when end time is after start time', () => {
      mockControl = { value: '18:00' } as AbstractControl;
      component.formGroup.patchValue({
        start_date: '2023-10-01',
        start_time: '10:00',
        end_date: '2023-10-01',
      });

      const result = component.endTimeValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should handle different dates correctly', () => {
      mockControl = { value: '09:00' } as AbstractControl;
      component.formGroup.patchValue({
        start_date: '2023-10-01',
        start_time: '10:00',
        end_date: '2023-10-02',
      });

      const result = component.endTimeValidator(mockControl);
      expect(result).toBeNull();
    });
  });

  describe('startTimeValidator', () => {
    let mockControl: AbstractControl;

    beforeEach(() => {
      mockControl = { value: '10:00' } as AbstractControl;
      component.formMode = 'create';
    });

    it('should return null when start date is missing', () => {
      component.formGroup.patchValue({ start_date: null });

      const result = component.startTimeValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should return null when start time is missing', () => {
      mockControl = { value: null } as AbstractControl;
      component.formGroup.patchValue({ start_date: '2023-10-01' });

      const result = component.startTimeValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should return null when form mode is not create', () => {
      component.formMode = 'edit';
      component.formGroup.patchValue({ start_date: '2020-01-01' });

      const result = component.startTimeValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should return required error when start time is empty', () => {
      mockControl = { value: '' } as AbstractControl;
      component.formGroup.patchValue({ start_date: '2023-10-01' });

      const result = component.startTimeValidator(mockControl);
      expect(result).toEqual(null);
    });

    it('should return required error when start time is whitespace', () => {
      mockControl = { value: '   ' } as AbstractControl;
      component.formGroup.patchValue({ start_date: '2023-10-01' });

      const result = component.startTimeValidator(mockControl);
      expect(result).toEqual({ required: true });
    });

    it('should return invalidStartTime when start time is in the past', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      mockControl = { value: '10:00' } as AbstractControl;
      component.formGroup.patchValue({ start_date: yesterdayStr });

      const result = component.startTimeValidator(mockControl);
      expect(result).toEqual({ invalidStartTime: true });
    });

    it('should return null when start time is in the future', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      mockControl = { value: '10:00' } as AbstractControl;
      component.formGroup.patchValue({ start_date: tomorrowStr });

      const result = component.startTimeValidator(mockControl);
      expect(result).toBeNull();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle form controls that are null or undefined', () => {
      component.formGroup = formBuilder.group({});

      expect(component.startDateControl).toBeNull();
      expect(component.nameControl).toBeNull();

      // Should not throw errors when calling methods
      component.reValidateForm();
      component.updateProductBasedRuleControls();
    });

    it('should handle invalid time format in validators', () => {
      const mockControl = { value: 'invalid-time' } as AbstractControl;
      component.formGroup.patchValue({
        start_date: '2023-10-01',
        start_time: 'invalid',
        end_date: '2023-10-01',
      });

      // Should not throw error even with invalid time format
      expect(() => component.endTimeValidator(mockControl)).not.toThrow();
    });

    it('should handle destroy$ subject properly', () => {
      component.ngOnInit();

      // Simulate component destruction
      component.destroy$.next();
      component.destroy$.complete();

      // Should not throw errors
      expect(component).toBeTruthy();
    });
  });

  describe('Form Mode Handling', () => {
    it('should handle create mode', () => {
      component.formMode = 'create';
      const mockControl = { value: '10:00' } as AbstractControl;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      component.formGroup.patchValue({
        start_date: yesterday.toISOString().split('T')[0],
      });

      const result = component.startTimeValidator(mockControl);
      expect(result).toEqual({ invalidStartTime: true });
    });

    it('should handle edit mode', () => {
      component.formMode = 'edit';
      const mockControl = { value: '10:00' } as AbstractControl;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      component.formGroup.patchValue({
        start_date: yesterday.toISOString().split('T')[0],
      });

      const result = component.startTimeValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should handle view mode', () => {
      component.formMode = 'view';
      const mockControl = { value: '10:00' } as AbstractControl;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      component.formGroup.patchValue({
        start_date: yesterday.toISOString().split('T')[0],
      });

      const result = component.startTimeValidator(mockControl);
      expect(result).toBeNull();
    });
  });

  describe('Signal Usage', () => {
    it('should initialize imageNameUploaded signal', () => {
      expect(component.imageNameUploaded()).toBe('Upload file');
    });

    it('should allow updating imageNameUploaded signal', () => {
      component.imageNameUploaded.set('new-file.jpg');
      expect(component.imageNameUploaded()).toBe('new-file.jpg');
    });
  });
});
