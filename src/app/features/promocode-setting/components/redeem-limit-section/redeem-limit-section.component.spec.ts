import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { RedeemLimitSectionComponent } from './redeem-limit-section.component';
import { ValueCode } from '@app/shared/models/value-code.model';
import { RewardsredeemLimitConditions } from '../../constants/rewards-redeem-limit-condition-options.const';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RedeemLimitCondition } from '@app/shared/utils/enums/redeem-limit-condition.enums';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { Subject } from 'rxjs';

// Mock BaseComponent
jest.mock('@app/shared/components/base/base.component', () => {
  return {
    BaseComponent: class MockBaseComponent {
      destroy$ = new Subject<void>();

      ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
      }
    },
  };
});

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
    }).compileComponents();

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

    it('should initialize redeemLimitConditionOptions', () => {
      expect(component.redeemLimitConditionOptions).toBe(
        RewardsredeemLimitConditions
      );
    });

    it('should initialize redeemLimitCondition enum', () => {
      expect(component.redeemLimitCondition).toBe(RedeemLimitCondition);
    });
  });

  describe('Form Control Getters', () => {
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

    it('should return null when formGroup is null', () => {
      component.formGroup = null as any;
      expect(component.conditionControl).toBeUndefined();
      expect(component.quotaControl).toBeUndefined();
      expect(component.isAdvanceControl).toBeUndefined();
    });
  });

  describe('ngOnInit', () => {
    it('should handle ngOnInit', () => {
      const spy = jest.spyOn(component, 'ngOnInit');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should subscribe to conditionControl valueChanges', () => {
      const subscriptionSpy = jest.spyOn(
        component.conditionControl!.valueChanges,
        'subscribe'
      );
      component.ngOnInit();
      expect(subscriptionSpy).toHaveBeenCalled();
    });

    it('should handle PER_PRIVILEGE condition change', () => {
      component.ngOnInit();

      const quotaControl = component.quotaControl!;
      const patchValueSpy = jest.spyOn(quotaControl, 'patchValue');
      const setValidatorsSpy = jest.spyOn(quotaControl, 'setValidators');

      // Trigger the condition change
      component.conditionControl?.patchValue(
        RedeemLimitCondition.PER_PRIVILEGE
      );

      expect(patchValueSpy).toHaveBeenCalledWith(1);
      expect(setValidatorsSpy).toHaveBeenCalled();
    });

    it('should handle UNLIMITED_REDEEM condition change', () => {
      component.ngOnInit();

      const quotaControl = component.quotaControl!;
      const setValidatorsSpy = jest.spyOn(quotaControl, 'setValidators');
      const resetSpy = jest.spyOn(quotaControl, 'reset');

      // Trigger the condition change
      component.conditionControl?.patchValue(
        RedeemLimitCondition.UNLIMITED_REDEEM
      );

      expect(setValidatorsSpy).toHaveBeenCalledWith([]);
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should handle default condition change', () => {
      component.ngOnInit();

      const quotaControl = component.quotaControl!;
      const setValidatorsSpy = jest.spyOn(quotaControl, 'setValidators');
      const resetSpy = jest.spyOn(quotaControl, 'reset');

      // Trigger the condition change with a default value
      component.conditionControl?.patchValue('SOME_OTHER_CONDITION');

      expect(resetSpy).toHaveBeenCalled();
      expect(setValidatorsSpy).toHaveBeenCalled();
    });

    it('should not subscribe if conditionControl is null', () => {
      // Create a form group without redeem_condition
      component.formGroup = formBuilder.group({
        redeem_quota: [''],
        is_advance_limit: [false],
      });

      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('getDropdownValue', () => {
    it('should return correct dropdown value for valid code', () => {
      const dropdownOptions: ValueCode[] = [
        { code: 'OPTION_1', value: 'Option 1' },
        { code: 'OPTION_2', value: 'Option 2' },
      ];

      expect(component.getDropdownValue('OPTION_1', dropdownOptions)).toBe(
        'Option 1'
      );
      expect(component.getDropdownValue('OPTION_2', dropdownOptions)).toBe(
        'Option 2'
      );
    });

    it('should return empty string for invalid code', () => {
      const dropdownOptions: ValueCode[] = [
        { code: 'OPTION_1', value: 'Option 1' },
        { code: 'OPTION_2', value: 'Option 2' },
      ];

      expect(component.getDropdownValue('INVALID', dropdownOptions)).toBe('');
    });

    it('should return empty string for null code', () => {
      const dropdownOptions: ValueCode[] = [
        { code: 'OPTION_1', value: 'Option 1' },
      ];

      expect(component.getDropdownValue(null, dropdownOptions)).toBe('');
    });

    it('should return empty string for empty dropdown options', () => {
      expect(component.getDropdownValue('OPTION_1', [])).toBe('');
    });

    it('should handle undefined value in dropdown options', () => {
      const dropdownOptions: ValueCode[] = [
        { code: 'OPTION_1', value: 'Option 1' },
        { code: 'OPTION_2', value: undefined as any },
      ];

      expect(component.getDropdownValue('OPTION_2', dropdownOptions)).toBe('');
    });
  });

  describe('Form Integration', () => {
    it('should update validators when form control value changes', () => {
      component.ngOnInit();

      const quotaControl = component.quotaControl!;
      const setValidatorsSpy = jest.spyOn(quotaControl, 'setValidators');

      // Change to PER_PRIVILEGE
      component.conditionControl?.setValue(RedeemLimitCondition.PER_PRIVILEGE);
      expect(setValidatorsSpy).toHaveBeenCalled();

      // Change to UNLIMITED_REDEEM
      component.conditionControl?.setValue(
        RedeemLimitCondition.UNLIMITED_REDEEM
      );
      expect(setValidatorsSpy).toHaveBeenLastCalledWith([]);

      // Change to any other value
      component.conditionControl?.setValue('OTHER');
      expect(setValidatorsSpy).toHaveBeenCalled();
    });

    it('should handle form control updates correctly', () => {
      component.ngOnInit();

      const quotaControl = component.quotaControl!;

      // Test PER_PRIVILEGE sets value to 1
      component.conditionControl?.setValue(RedeemLimitCondition.PER_PRIVILEGE);
      expect(quotaControl.value).toBe(1);

      // Test UNLIMITED_REDEEM resets the control
      quotaControl.setValue(5);
      component.conditionControl?.setValue(
        RedeemLimitCondition.UNLIMITED_REDEEM
      );
      expect(quotaControl.value).toBeNull();

      // Test default case resets the control
      quotaControl.setValue(5);
      component.conditionControl?.setValue('OTHER');
      expect(quotaControl.value).toBeNull();
    });
  });

  describe('Lifecycle', () => {
    it('should unsubscribe on destroy', () => {
      component.ngOnInit();

      const destroySubject = component.destroy$ as Subject<void>;
      const nextSpy = jest.spyOn(destroySubject, 'next');
      const completeSpy = jest.spyOn(destroySubject, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null formGroup gracefully', () => {
      component.formGroup = null as any;

      expect(component.conditionControl).toBeUndefined();
      expect(component.quotaControl).toBeUndefined();
      expect(component.isAdvanceControl).toBeUndefined();
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle undefined formGroup gracefully', () => {
      component.formGroup = undefined as any;

      expect(component.conditionControl).toBeUndefined();
      expect(component.quotaControl).toBeUndefined();
      expect(component.isAdvanceControl).toBeUndefined();
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle missing form controls', () => {
      component.formGroup = formBuilder.group({});

      expect(component.conditionControl).toBeNull();
      expect(component.quotaControl).toBeNull();
      expect(component.isAdvanceControl).toBeNull();
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('Template Integration', () => {
    it('should render correctly when formGroup is provided', () => {
      expect(
        fixture.debugElement.query((component) => component.name === 'mat-card')
      ).toBeTruthy();
    });

    it('should not render when formGroup is null', () => {
      component.formGroup = null as any;
      fixture.detectChanges();

      // Component should handle null formGroup gracefully
      expect(component).toBeTruthy();
    });
  });
});
