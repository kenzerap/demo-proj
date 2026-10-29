import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { CriteriaCheckinRuleSectionComponent } from './criteria-checkin-rule-section.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CriteriaCheckinRuleSectionComponent', () => {
  let component: CriteriaCheckinRuleSectionComponent;
  let fixture: ComponentFixture<CriteriaCheckinRuleSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CriteriaCheckinRuleSectionComponent,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CriteriaCheckinRuleSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      criteria_checkin_rules: formBuilder.array([]),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return rulesFormArray', () => {
    expect(component.rulesFormArray).toBeInstanceOf(FormArray);
  });

  it('should add a rule with correct values', () => {
    expect(component.rulesFormArray.length).toBe(0);
    component.addRule();
    expect(component.rulesFormArray.length).toBe(1);
    const rule = component.rulesFormArray.at(0);
    expect(rule.get('checkin_day')?.value).toBe(1);
    expect(rule.get('earning_point')?.value).toBe('');
    expect(rule.get('checkin_day')?.disabled).toBe(true);
  });

  it('should increment checkin_day for each added rule', () => {
    component.addRule();
    component.addRule();
    expect(component.rulesFormArray.at(0).get('checkin_day')?.value).toBe(1);
    expect(component.rulesFormArray.at(1).get('checkin_day')?.value).toBe(2);
  });

  it('should remove a rule and update checkin_day values', () => {
    component.addRule();
    component.addRule();
    component.addRule();
    expect(component.rulesFormArray.length).toBe(3);

    component.removeCondition(1);
    expect(component.rulesFormArray.length).toBe(2);
    expect(component.rulesFormArray.at(0).get('checkin_day')?.value).toBe(1);
    expect(component.rulesFormArray.at(1).get('checkin_day')?.value).toBe(2);
  });

  it('should not throw if removeCondition is called with invalid index', () => {
    expect(() => component.removeCondition(0)).not.toThrow();
  });
});
