import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RedeemLimitSectionComponent } from './redeem-limit-section.component';
import { ValueCode } from '@app/shared/models/value-code.model';
import { redeemLimitConditions } from '../../constants/redeem-limit-condition-options.const';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RedeemLimitCondition } from '@app/shared/utils/enums/redeem-limit-condition.enums';
import { Subject } from 'rxjs';

describe('RedeemLimitSectionComponent', () => {
  let component: RedeemLimitSectionComponent;
  let fixture: ComponentFixture<RedeemLimitSectionComponent>;
  let formBuilder: FormBuilder;
  let mockDestroy$: Subject<void>;

  beforeEach(async () => {
    mockDestroy$ = new Subject<void>();

    await TestBed.configureTestingModule({
      imports: [
        RedeemLimitSectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RedeemLimitSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    // Mock the destroy$ property
    Object.defineProperty(component, 'destroy$', {
      value: mockDestroy$,
      writable: false,
      configurable: true,
    });

    component.formGroup = formBuilder.group({
      condition: ['', Validators.required],
      quota: ['', [Validators.required, Validators.min(1)]],
      is_advance: [false],
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    mockDestroy$.complete();
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize redeemLimitConditionOptions with correct data', () => {
      expect(component.redeemLimitConditionOptions).toBe(redeemLimitConditions);
      expect(component.redeemLimitConditionOptions).toEqual(expect.any(Array));
    });

    it('should initialize redeemLimitConditions enum', () => {
      expect(component.redeemLimitConditions).toBe(RedeemLimitCondition);
    });
  });

  describe('Form Control Getters', () => {
    it('should return conditionControl', () => {
      expect(component.conditionControl).toBe(
        component.formGroup.get('condition')
      );
    });

    it('should return quotaControl', () => {
      expect(component.quotaControl).toBe(component.formGroup.get('quota'));
    });

    it('should return isAdvanceControl', () => {
      expect(component.isAdvanceControl).toBe(
        component.formGroup.get('is_advance')
      );
    });

    it('should handle null formGroup gracefully', () => {
      component.formGroup = null as any;
      expect(component.conditionControl).toBeUndefined();
      expect(component.quotaControl).toBeUndefined();
      expect(component.isAdvanceControl).toBeUndefined();
    });
  });

  describe('ngOnInit', () => {
    it('should setup valueChanges subscription on conditionControl', () => {
      const conditionControl = component.conditionControl;
      const pipeSpySpy = jest.spyOn(conditionControl!.valueChanges, 'pipe');

      component.ngOnInit();

      expect(pipeSpySpy).toHaveBeenCalled();
    });

    it('should handle ONE_TIME_REDEEM condition', () => {
      const quotaControl = component.quotaControl;
      const patchValueSpy = jest.spyOn(quotaControl!, 'patchValue');
      const setValidatorsSpy = jest.spyOn(quotaControl!, 'setValidators');

      component.ngOnInit();
      component.conditionControl?.setValue(
        RedeemLimitCondition.ONE_TIME_REDEEM
      );

      expect(patchValueSpy).toHaveBeenCalledWith(1);
      expect(setValidatorsSpy).toHaveBeenCalled();
    });

    it('should handle UNLIMITED_REDEEM condition', () => {
      const quotaControl = component.quotaControl;
      const resetSpy = jest.spyOn(quotaControl!, 'reset');
      const setValidatorsSpy = jest.spyOn(quotaControl!, 'setValidators');

      component.ngOnInit();
      component.conditionControl?.setValue(
        RedeemLimitCondition.UNLIMITED_REDEEM
      );

      expect(setValidatorsSpy).toHaveBeenCalledWith([]);
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should handle default condition case', () => {
      const quotaControl = component.quotaControl;
      const resetSpy = jest.spyOn(quotaControl!, 'reset');
      const setValidatorsSpy = jest.spyOn(quotaControl!, 'setValidators');

      component.ngOnInit();
      component.conditionControl?.setValue('SOME_OTHER_CONDITION');

      expect(resetSpy).toHaveBeenCalled();
      expect(setValidatorsSpy).toHaveBeenCalled();
    });

    it('should handle null conditionControl gracefully', () => {
      component.formGroup = formBuilder.group({
        quota: ['', [Validators.required, Validators.min(1)]],
        is_advance: [false],
      });

      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('getDropdownValue method', () => {
    const dropdownOptions: ValueCode[] = [
      { code: 'OPTION_1', value: 'Option 1' },
      { code: 'OPTION_2', value: 'Option 2' },
      { code: 'OPTION_3', value: 'Option 3' },
    ];

    it('should return correct dropdown value for valid code', () => {
      expect(component.getDropdownValue('OPTION_1', dropdownOptions)).toBe(
        'Option 1'
      );
      expect(component.getDropdownValue('OPTION_2', dropdownOptions)).toBe(
        'Option 2'
      );
      expect(component.getDropdownValue('OPTION_3', dropdownOptions)).toBe(
        'Option 3'
      );
    });

    it('should return empty string for invalid code', () => {
      expect(component.getDropdownValue('INVALID', dropdownOptions)).toBe('');
      expect(component.getDropdownValue('NON_EXISTENT', dropdownOptions)).toBe(
        ''
      );
    });

    it('should return empty string for null selectedCode', () => {
      expect(component.getDropdownValue(null, dropdownOptions)).toBe('');
    });

    it('should handle empty dropdownOptions array', () => {
      expect(component.getDropdownValue('OPTION_1', [])).toBe('');
    });

    it('should handle undefined values in dropdownOptions', () => {
      const optionsWithUndefined: ValueCode[] = [
        { code: 'OPTION_1', value: undefined as any },
        { code: 'OPTION_2', value: 'Option 2' },
      ];

      expect(component.getDropdownValue('OPTION_1', optionsWithUndefined)).toBe(
        ''
      );
      expect(component.getDropdownValue('OPTION_2', optionsWithUndefined)).toBe(
        'Option 2'
      );
    });
  });

  describe('Integration Tests', () => {
    it('should update quota control when condition changes to ONE_TIME_REDEEM', () => {
      component.ngOnInit();

      component.conditionControl?.setValue(
        RedeemLimitCondition.ONE_TIME_REDEEM
      );

      expect(component.quotaControl?.value).toBe(1);
      expect(component.quotaControl?.hasError('required')).toBeFalsy();
    });

    it('should clear quota control when condition changes to UNLIMITED_REDEEM', () => {
      // Set initial value
      component.quotaControl?.setValue(5);
      component.ngOnInit();

      component.conditionControl?.setValue(
        RedeemLimitCondition.UNLIMITED_REDEEM
      );

      expect(component.quotaControl?.value).toBeNull();
    });

    it('should reset and set validators for default conditions', () => {
      component.quotaControl?.setValue(5);
      component.ngOnInit();

      component.conditionControl?.setValue('CUSTOM_CONDITION');

      expect(component.quotaControl?.value).toBeNull();
      // Set a value to test validator
      component.quotaControl?.setValue(0);
      expect(component.quotaControl?.hasError('min')).toBeTruthy();
    });

    it('should work with real redeemLimitConditions data', () => {
      const mockRedeemLimitConditions = [
        {
          code: RedeemLimitCondition.ONE_TIME_REDEEM,
          value: 'One Time Redeem',
        },
        {
          code: RedeemLimitCondition.UNLIMITED_REDEEM,
          value: 'Unlimited Redeem',
        },
      ];

      expect(
        component.getDropdownValue(
          RedeemLimitCondition.ONE_TIME_REDEEM,
          mockRedeemLimitConditions
        )
      ).toBe('One Time Redeem');
    });
  });

  describe('Component Template Integration', () => {
    it('should render without errors when formGroup is provided', () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle formGroup input property', () => {
      const newFormGroup = formBuilder.group({
        condition: ['test'],
        quota: [10],
        is_advance: [true],
      });

      component.formGroup = newFormGroup;
      fixture.detectChanges();

      expect(component.formGroup).toBe(newFormGroup);
      expect(component.conditionControl?.value).toBe('test');
      expect(component.quotaControl?.value).toBe(10);
      expect(component.isAdvanceControl?.value).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle subscription errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Create a form control that will throw an error
      const errorFormGroup = formBuilder.group({
        condition: [''],
        quota: [''],
        is_advance: [false],
      });

      // Mock valueChanges to throw an error
      jest
        .spyOn(errorFormGroup.get('condition')!.valueChanges, 'pipe')
        .mockImplementation(() => {
          throw new Error('Test error');
        });

      component.formGroup = errorFormGroup;

      expect(() => component.ngOnInit()).toThrow('Test error');

      consoleSpy.mockRestore();
    });

    it('should handle missing conditionControl in valueChanges subscription', () => {
      // Create form without condition control
      const partialFormGroup = formBuilder.group({
        quota: [''],
        is_advance: [false],
      });

      component.formGroup = partialFormGroup;

      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle formGroup being undefined', () => {
      component.formGroup = undefined as any;

      expect(component.conditionControl).toBeUndefined();
      expect(component.quotaControl).toBeUndefined();
      expect(component.isAdvanceControl).toBeUndefined();
    });

    it('should handle multiple rapid condition changes', () => {
      const quotaControl = component.quotaControl;
      const setValidatorsSpy = jest.spyOn(quotaControl!, 'setValidators');

      component.ngOnInit();

      // Rapid changes
      component.conditionControl?.setValue(
        RedeemLimitCondition.ONE_TIME_REDEEM
      );
      component.conditionControl?.setValue(
        RedeemLimitCondition.UNLIMITED_REDEEM
      );
      component.conditionControl?.setValue('CUSTOM');

      // Should have been called multiple times
      expect(setValidatorsSpy).toHaveBeenCalledTimes(6);
    });

    it('should handle subscription cleanup on destroy', () => {
      component.ngOnInit();

      // Trigger destroy
      mockDestroy$.next();
      mockDestroy$.complete();

      // Should not throw when trying to emit after destroy
      expect(() => {
        component.conditionControl?.setValue('test');
      }).not.toThrow();
    });
  });
});
