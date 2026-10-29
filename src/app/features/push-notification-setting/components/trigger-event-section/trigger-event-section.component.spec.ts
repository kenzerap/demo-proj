import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TriggerEventSectionComponent } from './trigger-event-section.component';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { TriggerEventType } from '@app/shared/utils/enums/trigger-event-type.enum';
import { ValueCode } from '@app/shared/models/value-code.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TriggerEventSectionComponent', () => {
  let component: TriggerEventSectionComponent;
  let fixture: ComponentFixture<TriggerEventSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TriggerEventSectionComponent,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TriggerEventSectionComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      trigger_event_type: new FormControl(),
      trigger_event_condition: new FormControl(),
      trigger_event_value: new FormControl(),
      trigger_event_unit: new FormControl(),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize conditionOptions based on trigger_event_type on init', () => {
    component.formGroup
      .get('trigger_event_type')
      ?.setValue(TriggerEventType.ClaimStatus);
    component.ngOnInit();
    expect(component.conditionOptions).toEqual([
      { value: 'Is', code: CompareConditionType.Is },
    ]);

    component.formGroup
      .get('trigger_event_type')
      ?.setValue(TriggerEventType.PointsExpiryDate);
    component.ngOnInit();
    expect(component.conditionOptions).toEqual([
      { value: 'Is', code: CompareConditionType.Is },
      { value: 'Before', code: CompareConditionType.Before },
    ]);

    component.formGroup
      .get('trigger_event_type')
      ?.setValue(TriggerEventType.PaymentDueDate);
    component.ngOnInit();
    expect(component.conditionOptions).toEqual([
      { value: 'Is', code: CompareConditionType.Is },
      { value: 'Before', code: CompareConditionType.Before },
    ]);
  });

  it('should update conditionOptions and emit changeTriggerEventType on trigger_event_type change', () => {
    const emitSpy = jest.spyOn(component.changeTriggerEventType, 'emit');
    component.formGroup
      .get('trigger_event_type')
      ?.setValue(TriggerEventType.PointsExpiryDate);
    component.triggerEventTypeControl?.valueChanges.subscribe();
    expect(component.conditionOptions).toEqual([
      { value: 'Is', code: CompareConditionType.Is },
      { value: 'Before', code: CompareConditionType.Before },
    ]);
    expect(emitSpy).toHaveBeenCalledWith(TriggerEventType.PointsExpiryDate);
  });

  it('should update trigger_event_value and trigger_event_unit based on trigger_event_condition change', () => {
    component.formGroup
      .get('trigger_event_condition')
      ?.setValue(CompareConditionType.Is);
    component.triggerEventConditionControl?.valueChanges.subscribe();
    expect(component.triggerEventValueControl?.value).toBe('Today');
    expect(component.triggerEventUnitControl?.value).toBe('-');
    expect(component.triggerEventValueControl?.disabled).toBe(true);

    component.formGroup
      .get('trigger_event_condition')
      ?.setValue(CompareConditionType.Before);
    component.triggerEventConditionControl?.valueChanges.subscribe();
    expect(component.triggerEventValueControl?.enabled).toBe(true);
    expect(component.triggerEventUnitControl?.value).toBe('day');
  });

  it('should return correct dropdown value from getDropdownValue', () => {
    const dropdownOptions: ValueCode[] = [
      { value: 'Option 1', code: '1' },
      { value: 'Option 2', code: '2' },
    ];
    expect(component.getDropdownValue('1', dropdownOptions)).toBe('Option 1');
    expect(component.getDropdownValue('3', dropdownOptions)).toBe('None');
  });
});
