import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { HomeGroupConditionSectionComponent } from './home-group-condition-section.component';
import {
  AttributeCode,
  ValueOptionsCode,
} from '../../utils/privilege-attribute-code.enum';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { PrivilegeTypeEnum } from '@app/shared/utils/enums/privilege-type.enums';
import { CampaignType } from '@app/shared/utils/enums/campaign-type.enums';
import { MatSelectChange } from '@angular/material/select';
import * as createEditHomeScreenSelectors from '../../stores/create-edit-home-screen/create-edit-home-screen.selectors';

describe('HomeGroupConditionSectionComponent', () => {
  let component: HomeGroupConditionSectionComponent;
  let fixture: ComponentFixture<HomeGroupConditionSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HomeGroupConditionSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: createEditHomeScreenSelectors.selectTierGroups,
              value: [],
            },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeGroupConditionSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      conditions: formBuilder.array([
        formBuilder.group({
          privilegeConditionsId: [''],
          attribute: [AttributeCode.START_DATE],
          condition: [CompareConditionType.Is],
          value: [ValueOptionsCode.Today],
          group_condition: [null],
        }),
      ]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a condition and set previous group_condition to AND', () => {
    const arr = component.formGroup.get('conditions') as FormArray;
    expect(arr.length).toBe(1);
    component.addCondition();
    expect(arr.length).toBe(2);
    expect(arr.at(0).get('group_condition')?.value).toBe(
      CompareConditionType.AND
    );
    expect(arr.at(1).get('group_condition')?.value).toBeNull();
  });

  it('should remove a condition and set last group_condition to null', () => {
    component.addCondition();
    const arr = component.formGroup.get('conditions') as FormArray;
    expect(arr.length).toBe(2);
    arr.at(0).patchValue({ group_condition: CompareConditionType.AND });
    arr.at(1).patchValue({ group_condition: null });
    component.removeCondition(0);
    expect(arr.length).toBe(1);
    expect(arr.at(0).get('group_condition')?.value).toBeNull();
  });

  it('should handle attributeChange for START_DATE and END_DATE', () => {
    const fg = component.conditionsFormArray.at(0);
    const event = { value: AttributeCode.START_DATE } as MatSelectChange;
    fg.patchValue({ condition: null, value: null });
    fg.get('value')?.disable();
    jest.spyOn(fg.get('value')!, 'enable');
    component.attributeChange(event, fg);
    expect(fg.get('condition')?.value).toBe(CompareConditionType.Is);
    expect(fg.get('value')?.value).toBe(ValueOptionsCode.Today);
    expect(fg.get('value')?.enable).toHaveBeenCalled();
  });

  it('should handle attributeChange for TIER', () => {
    const fg = component.conditionsFormArray.at(0);
    const event = { value: AttributeCode.TIER } as MatSelectChange;
    fg.patchValue({ condition: null, value: null });
    component.attributeChange(event, fg);
    expect(fg.get('condition')?.value).toBe(CompareConditionType.Is);
    expect(fg.get('value')?.value).toBe('User matched');
  });

  it('should handle attributeChange for USER_REMAINING_POINT', () => {
    const fg = component.conditionsFormArray.at(0);
    const event = {
      value: AttributeCode.USER_REMAINING_POINT,
    } as MatSelectChange;
    fg.patchValue({ condition: null, value: null });
    fg.get('value')?.enable();
    jest.spyOn(fg.get('value')!, 'disable');
    component.attributeChange(event, fg);
    expect(fg.get('condition')?.value).toBe(CompareConditionType.GREATER_THAN);
    expect(fg.get('value')?.value).toBe('Privilege Redemption');
    expect(fg.get('value')?.disable).toHaveBeenCalled();
  });

  it('should handle attributeChange for PRIVILEGE_TYPE', () => {
    const fg = component.conditionsFormArray.at(0);
    const event = { value: AttributeCode.PRIVILEGE_TYPE } as MatSelectChange;
    fg.patchValue({ condition: null, value: null });
    fg.get('value')?.disable();
    jest.spyOn(fg.get('value')!, 'enable');
    component.attributeChange(event, fg);
    expect(fg.get('condition')?.value).toBe(CompareConditionType.Is);
    expect(fg.get('value')?.value).toBe(PrivilegeTypeEnum.E_VOUCHER);
    expect(fg.get('value')?.enable).toHaveBeenCalled();
  });

  it('should handle attributeChange for CAMPAIGN_TYPE', () => {
    const fg = component.conditionsFormArray.at(0);
    const event = { value: AttributeCode.CAMPAIGN_TYPE } as MatSelectChange;
    fg.patchValue({ condition: null, value: null });
    fg.get('value')?.disable();
    jest.spyOn(fg.get('value')!, 'enable');
    component.attributeChange(event, fg);
    expect(fg.get('condition')?.value).toBe(CompareConditionType.Is);
    expect(fg.get('value')?.value).toBe(CampaignType.NORMAL);
    expect(fg.get('value')?.enable).toHaveBeenCalled();
  });

  it('should handle attributeChange default case', () => {
    const fg = component.conditionsFormArray.at(0);
    const event = { value: 'UNKNOWN' } as MatSelectChange;
    fg.patchValue({ condition: null, value: null });
    component.attributeChange(event, fg);
    expect(fg.get('condition')?.value).toBeNull();
    expect(fg.get('value')?.value).toBeNull();
  });

  it('should not throw if removeCondition is called with empty array', () => {
    const arr = component.formGroup.get('conditions') as FormArray;
    arr.clear();
    expect(() => component.removeCondition(0)).not.toThrow();
  });

  it('should not throw if addCondition is called with empty array', () => {
    const arr = component.formGroup.get('conditions') as FormArray;
    arr.clear();
    expect(() => component.addCondition()).not.toThrow();
    expect(arr.length).toBe(1);
  });

  it('should get conditionsFormArray', () => {
    expect(component.conditionsFormArray).toBeInstanceOf(FormArray);
  });

  it('should getAtributeControl, getConditionControl, getValueControl correctly', () => {
    const arr = component.conditionsFormArray;
    expect(component.getAtributeControl(0)).toBe(arr.at(0).get('attribute'));
    expect(component.getConditionControl(0)).toBe(arr.at(0).get('condition'));
    expect(component.getValueControl(0)).toBe(arr.at(0).get('value'));
  });

  it('should handle attributeChange for PRIVILEGE_TYPE', () => {
    const fg = component.conditionsFormArray.at(0);
    const event = { value: AttributeCode.PRIVILEGE_TYPE } as MatSelectChange;
    fg.patchValue({ condition: null, value: null });
    fg.get('value')?.disable();
    jest.spyOn(fg.get('value')!, 'enable');
    component.attributeChange(event, fg);
    expect(fg.get('condition')?.value).toBe(CompareConditionType.Is);
    expect(fg.get('value')?.value).toBe(PrivilegeTypeEnum.E_VOUCHER);
    expect(fg.get('value')?.enable).toHaveBeenCalled();
  });

  it('should handle attributeChange for CAMPAIGN_TYPE', () => {
    const fg = component.conditionsFormArray.at(0);
    const event = { value: AttributeCode.CAMPAIGN_TYPE } as MatSelectChange;
    fg.patchValue({ condition: null, value: null });
    fg.get('value')?.disable();
    jest.spyOn(fg.get('value')!, 'enable');
    component.attributeChange(event, fg);
    expect(fg.get('condition')?.value).toBe(CompareConditionType.Is);
    expect(fg.get('value')?.value).toBe(CampaignType.NORMAL);
    expect(fg.get('value')?.enable).toHaveBeenCalled();
  });

  it('should handle attributeChange for unknown attribute (default case)', () => {
    const fg = component.conditionsFormArray.at(0);
    const event = { value: 'UNKNOWN' } as MatSelectChange;
    fg.patchValue({ condition: null, value: null });
    fg.get('value')?.disable();
    jest.spyOn(fg.get('value')!, 'enable');
    component.attributeChange(event, fg);
    // Should not change condition or value
    expect(fg.get('condition')?.value).toBeNull();
    expect(fg.get('value')?.value).toBeNull();
  });

  it('should not throw if removeCondition is called with invalid index', () => {
    expect(() => component.removeCondition(99)).not.toThrow();
  });

  it('should call ngOnInit without error', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
