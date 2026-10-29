import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { WelcomeRuleSectionComponent } from './welcome-rule-section.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WelcomeRuleConditionCode } from '../../utils/welcome-rule-condition-code.enum';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { WelcomeRuleValueCode } from '../../utils/welcome-rule-value-code.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

describe('WelcomeRuleSectionComponent', () => {
  let component: WelcomeRuleSectionComponent;
  let fixture: ComponentFixture<WelcomeRuleSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        WelcomeRuleSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeRuleSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      rules: formBuilder.array([
        formBuilder.group({
          earning_point: [
            '',
            [Validators.required, Validators.min(1), Validators.max(999999)],
          ],
          rule_conditions: formBuilder.array([
            formBuilder.group({
              attribute: [
                WelcomeRuleConditionCode.UserType,
                Validators.required,
              ],
              condition: [CompareConditionType.Is, Validators.required],
              value: [WelcomeRuleValueCode.Customer, [Validators.required]],
              group_condition: [null],
            }),
          ]),
        }),
      ]),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get rulesFormArray', () => {
    expect(component.rulesFormArray).toBeInstanceOf(FormArray);
  });

  it('should subscribe to tierGroups$ and update tierGroupOptions', () => {
    const mockTierGroups = [
      { tier_id: 1, tier_name_thai: 'Gold' },
      { tier_id: 2, tier_name_thai: 'Silver' },
    ];
    (component as any).tierGroups$ = of(mockTierGroups);
    component.ngOnInit();
    expect(component.tierGroupOptions.length).toBe(2);
    expect(component.tierGroupOptions[0].value).toBe('Gold');
  });

  it('should subscribe to rulesFormArray valueChanges and call detectChanges', () => {
    const spy = jest.spyOn((component as any).changeDetector, 'detectChanges');
    component.rulesFormArray.at(0).patchValue({ earning_point: 10 });
    expect(spy).toHaveBeenCalled();
  });

  it('should get dropdown value', () => {
    const options = [
      { code: 'A', value: 'Option A' },
      { code: 'B', value: 'Option B' },
    ];
    expect(component.getDropdownValue('A', options)).toBe('Option A');
    expect(component.getDropdownValue('C', options)).toBe('');
  });

  it('should get value options for Tier and UserType', () => {
    component.tierGroupOptions = [{ code: '1', value: 'Gold' }];
    expect(component.getValueOptions(WelcomeRuleConditionCode.Tier)).toBe(
      component.tierGroupOptions
    );
    expect(component.getValueOptions(WelcomeRuleConditionCode.UserType)).toBe(
      component.valueOptions
    );
  });

  it('should patch value on attributeChange for Tier', () => {
    component.tierGroupOptions = [{ code: '1', value: 'Gold' }];
    const formGroup = formBuilder.group({
      value: [''],
    });
    component.attributeChange(
      { value: WelcomeRuleConditionCode.Tier } as any,
      formGroup
    );
    expect(formGroup.value.value).toBe('1');
  });

  it('should patch value on attributeChange for UserType', () => {
    const formGroup = formBuilder.group({
      value: [''],
    });
    component.attributeChange(
      { value: WelcomeRuleConditionCode.UserType } as any,
      formGroup
    );
    expect(formGroup.value.value).toBe(component.valueOptions[0].code);
  });

  it('should not patch value on attributeChange for default', () => {
    const formGroup = formBuilder.group({
      value: [''],
    });
    component.attributeChange({ value: 'other' } as any, formGroup);
    expect(formGroup.value.value).toBe('');
  });

  it('should get conditions form array', () => {
    expect(component.getConditionsFormArray(0)).toBeInstanceOf(FormArray);
  });

  it('should add a condition and set group_condition', () => {
    component.addCondition(0);
    const arr = component.getConditionsFormArray(0);
    expect(arr.length).toBe(2);
    expect(arr.at(0).get('group_condition')?.value).toBe(
      CompareConditionType.AND
    );
    expect(arr.at(1).get('group_condition')?.value).toBeNull();
  });

  it('should add a welcome rule', () => {
    const initialLength = component.rulesFormArray.length;
    component.addWelcomeRule();
    expect(component.rulesFormArray.length).toBe(initialLength + 1);
    const rule = component.rulesFormArray.at(initialLength);
    expect(rule.get('earning_point')).toBeTruthy();
    expect(rule.get('rule_conditions')).toBeTruthy();
  });

  it('should remove a condition and update group_condition', () => {
    component.addCondition(0);
    const arr = component.getConditionsFormArray(0);
    component.removeCondition(arr, 0);
    expect(arr.length).toBe(1);
    expect(arr.at(0).get('group_condition')?.value).toBeNull();
  });

  it('should remove a condition when only one left', () => {
    const arr = component.getConditionsFormArray(0);
    component.removeCondition(arr, 0);
    expect(arr.length).toBe(0);
  });

  it('should delete a welcome rule', () => {
    component.addWelcomeRule();
    const initialLength = component.rulesFormArray.length;
    component.deleteWelcomeRule(0);
    expect(component.rulesFormArray.length).toBe(initialLength - 1);
  });
});
