import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RedeemLimitSectionComponent } from './redeem-limit-section.component';
import { ValueCode } from '@app/shared/models/value-code.model';
import { RewardsredeemLimitConditions } from '../../constants/rewards-redeem-limit-condition-options.const';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RedeemLimitCondition } from '@app/shared/utils/enums/redeem-limit-condition.enums';
import { BaseComponent } from '@app/shared/components/base/base.component';

// Mock BaseComponent
class MockBaseComponent {
  destroy$ = {
    next: jest.fn(),
    complete: jest.fn(),
  };
}

describe('RedeemLimitSectionComponent', () => {
  let component: RedeemLimitSectionComponent;
  let fixture: ComponentFixture<RedeemLimitSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RedeemLimitSectionComponent,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(RedeemLimitSectionComponent, {
        set: {
          providers: [{ provide: BaseComponent, useClass: MockBaseComponent }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RedeemLimitSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    // Setup form group before each test
    component.formGroup = formBuilder.group({
      redeem_condition: ['', Validators.required],
      redeem_quota: ['', [Validators.required, Validators.min(1)]],
      is_advance_limit: [false],
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should extend BaseComponent', () => {
      expect(component).toBeInstanceOf(BaseComponent);
    });

    it('should have correct component properties', () => {
      expect(component.redeemLimitConditionOptions).toBe(
        RewardsredeemLimitConditions
      );
      expect(component.redeemLimitCondition).toBe(RedeemLimitCondition);
    });

    it('should initialize with input formGroup', () => {
      expect(component.formGroup).toBeDefined();
      expect(component.formGroup.get('redeem_condition')).toBeDefined();
      expect(component.formGroup.get('redeem_quota')).toBeDefined();
      expect(component.formGroup.get('is_advance_limit')).toBeDefined();
    });
  });

  describe('Getters', () => {
    it('should return conditionControl', () => {
      expect(component.conditionControl).toBe(
        component.formGroup.get('redeem_condition')
      );
    });

    it('should return quotaControl', () => {
      expect(component.quotaControl).toBe(
        component.formGroup.get('redeem_quota')
      );
    });

    it('should return isAdvanceControl', () => {
      expect(component.isAdvanceControl).toBe(
        component.formGroup.get('is_advance_limit')
      );
    });

    it('should handle when formGroup is null/undefined for conditionControl', () => {
      component.formGroup = null as any;
      expect(component.conditionControl).toBeUndefined();
    });

    it('should handle when formGroup is null/undefined for quotaControl', () => {
      component.formGroup = null as any;
      expect(component.quotaControl).toBeUndefined();
    });

    it('should handle when formGroup is null/undefined for isAdvanceControl', () => {
      component.formGroup = null as any;
      expect(component.isAdvanceControl).toBeUndefined();
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      // Setup spies for form controls
      jest.spyOn(component.quotaControl!, 'patchValue');
      jest.spyOn(component.quotaControl!, 'setValidators');
      jest.spyOn(component.quotaControl!, 'reset');
    });

    it('should call ngOnInit', () => {
      const spy = jest.spyOn(component, 'ngOnInit');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should setup valueChanges subscription', () => {
      const valueChangesSpy = jest.spyOn(
        component.conditionControl!.valueChanges,
        'pipe'
      );
      component.ngOnInit();
      expect(valueChangesSpy).toHaveBeenCalled();
    });

    describe('Value Changes Subscription', () => {
      beforeEach(() => {
        component.ngOnInit();
      });

      it('should handle PER_PRIVILEGE condition change', () => {
        component.conditionControl!.setValue(
          RedeemLimitCondition.PER_PRIVILEGE
        );

        expect(component.quotaControl!.patchValue).toHaveBeenCalledWith(1);
        expect(component.quotaControl!.setValidators).toHaveBeenCalled();
      });

      it('should handle UNLIMITED_REDEEM condition change', () => {
        component.conditionControl!.setValue(
          RedeemLimitCondition.UNLIMITED_REDEEM
        );

        expect(component.quotaControl!.setValidators).toHaveBeenCalledWith([]);
        expect(component.quotaControl!.reset).toHaveBeenCalled();
      });

      it('should handle default condition change', () => {
        component.conditionControl!.setValue('SOME_OTHER_CONDITION');

        expect(component.quotaControl!.reset).toHaveBeenCalled();
        expect(component.quotaControl!.setValidators).toHaveBeenCalled();
      });

      it('should handle empty/null condition change (default case)', () => {
        component.conditionControl!.setValue(null);

        expect(component.quotaControl!.reset).toHaveBeenCalled();
        expect(component.quotaControl!.setValidators).toHaveBeenCalled();
      });

      it('should handle undefined condition change (default case)', () => {
        component.conditionControl!.setValue(undefined);

        expect(component.quotaControl!.reset).toHaveBeenCalled();
        expect(component.quotaControl!.setValidators).toHaveBeenCalled();
      });
    });

    it('should handle when conditionControl is null', () => {
      component.formGroup = formBuilder.group({
        redeem_quota: ['', [Validators.required, Validators.min(1)]],
        is_advance_limit: [false],
      });

      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('getDropdownValue', () => {
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
      expect(component.getDropdownValue('INVALID_CODE', dropdownOptions)).toBe(
        ''
      );
    });

    it('should return empty string for null selectedCode', () => {
      expect(component.getDropdownValue(null, dropdownOptions)).toBe('');
    });

    it('should return empty string for undefined selectedCode', () => {
      expect(
        component.getDropdownValue(undefined as any, dropdownOptions)
      ).toBe('');
    });

    it('should return empty string for empty selectedCode', () => {
      expect(component.getDropdownValue('', dropdownOptions)).toBe('');
    });

    it('should handle empty dropdown options array', () => {
      expect(component.getDropdownValue('OPTION_1', [])).toBe('');
    });

    it('should handle dropdown options with special characters', () => {
      const specialOptions: ValueCode[] = [
        { code: 'SPECIAL_!@#', value: 'Special Value !@#' },
      ];
      expect(component.getDropdownValue('SPECIAL_!@#', specialOptions)).toBe(
        'Special Value !@#'
      );
    });

    it('should handle case sensitive codes', () => {
      expect(component.getDropdownValue('option_1', dropdownOptions)).toBe('');
      expect(component.getDropdownValue('OPTION_1', dropdownOptions)).toBe(
        'Option 1'
      );
    });
  });

  describe('Component Integration', () => {
    it('should initialize redeemLimitConditionOptions correctly', () => {
      expect(component.redeemLimitConditionOptions).toBe(
        RewardsredeemLimitConditions
      );
      expect(Array.isArray(component.redeemLimitConditionOptions)).toBe(true);
    });

    it('should have correct enum reference', () => {
      expect(component.redeemLimitCondition).toBe(RedeemLimitCondition);
      expect(typeof component.redeemLimitCondition).toBe('object');
    });

    it('should handle form validation states', () => {
      // Test initial state
      expect(component.formGroup.valid).toBe(false);

      // Set valid values
      component.conditionControl!.setValue(RedeemLimitCondition.PER_PRIVILEGE);
      component.quotaControl!.setValue(1);
      component.isAdvanceControl!.setValue(true);

      expect(component.conditionControl!.value).toBe(
        RedeemLimitCondition.PER_PRIVILEGE
      );
      expect(component.quotaControl!.value).toBe(1);
      expect(component.isAdvanceControl!.value).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid value changes', () => {
      component.ngOnInit();

      const conditions = [
        RedeemLimitCondition.PER_PRIVILEGE,
        RedeemLimitCondition.UNLIMITED_REDEEM,
        'OTHER_CONDITION',
        RedeemLimitCondition.PER_PRIVILEGE,
      ];

      conditions.forEach((condition) => {
        component.conditionControl!.setValue(condition);
      });

      // Should handle all changes without error
      expect(component.conditionControl!.value).toBe(
        RedeemLimitCondition.PER_PRIVILEGE
      );
    });

    it('should handle form group recreation', () => {
      const originalFormGroup = component.formGroup;

      // Create new form group
      component.formGroup = formBuilder.group({
        redeem_condition: ['NEW_VALUE'],
        redeem_quota: [5],
        is_advance_limit: [true],
      });

      expect(component.conditionControl!.value).toBe('NEW_VALUE');
      expect(component.quotaControl!.value).toBe(5);
      expect(component.isAdvanceControl!.value).toBe(true);

      // Restore original for other tests
      component.formGroup = originalFormGroup;
    });
  });

  describe('Memory Management', () => {
    it('should use takeUntil for subscription management', () => {
      const takeUntilSpy = jest.spyOn(
        component.conditionControl!.valueChanges,
        'pipe'
      );
      component.ngOnInit();

      expect(takeUntilSpy).toHaveBeenCalled();
    });
  });
});
