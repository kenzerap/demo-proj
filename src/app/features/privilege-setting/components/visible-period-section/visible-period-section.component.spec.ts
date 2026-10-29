import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { VisiblePeriodSectionComponent } from './visible-period-section.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('VisiblePeriodSectionComponent', () => {
  let component: VisiblePeriodSectionComponent;
  let fixture: ComponentFixture<VisiblePeriodSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        VisiblePeriodSectionComponent,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VisiblePeriodSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      start_date: [''],
      start_time: [''],
      end_date: [''],
      end_time: [''],
      is_visible: [false],
      is_code_out: [false],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return startDateControl', () => {
    expect(component.startDateControl).toBe(
      component.formGroup.get('start_date')
    );
  });

  it('should return startTimeControl', () => {
    expect(component.startTimeControl).toBe(
      component.formGroup.get('start_time')
    );
  });

  it('should return endDateControl', () => {
    expect(component.endDateControl).toBe(component.formGroup.get('end_date'));
  });

  it('should return endTimeControl', () => {
    expect(component.endTimeControl).toBe(component.formGroup.get('end_time'));
  });

  it('should return isVisibleControl', () => {
    expect(component.isVisibleControl).toBe(
      component.formGroup.get('is_visible')
    );
  });

  it('should return isCodeOutControl', () => {
    expect(component.isCodeOutControl).toBe(
      component.formGroup.get('is_code_out')
    );
  });

  it('should validate endTimeValidator correctly', () => {
    component.formGroup.patchValue({
      start_date: '2023-12-01',
      start_time: '10:00',
      end_date: '2023-12-01',
      end_time: '09:00',
    });

    const result = component.endTimeValidator(component.endTimeControl as any);
    expect(result).toEqual({ invalidEndTime: true });

    component.formGroup.patchValue({
      end_time: '11:00',
    });

    const validResult = component.endTimeValidator(
      component.endTimeControl as any
    );
    expect(validResult).toBeNull();
  });

  it('should re-validate form controls', () => {
    const startDateControlSpy = jest.spyOn(
      component.startDateControl!,
      'setValidators'
    );
    const startTimeControlSpy = jest.spyOn(
      component.startTimeControl!,
      'setValidators'
    );
    const endDateControlSpy = jest.spyOn(
      component.endDateControl!,
      'setValidators'
    );
    const endTimeControlSpy = jest.spyOn(
      component.endTimeControl!,
      'setValidators'
    );

    component.reValidateForm();

    expect(startDateControlSpy).toHaveBeenCalled();
    expect(startTimeControlSpy).toHaveBeenCalled();
    expect(endDateControlSpy).toHaveBeenCalled();
    expect(endTimeControlSpy).toHaveBeenCalled();
  });

  it('should return correct dropdown value', () => {
    const dropdownOptions = [
      { code: 'OPTION_1', value: 'Option 1' },
      { code: 'OPTION_2', value: 'Option 2' },
    ];

    expect(component.getDropdownValue('OPTION_1', dropdownOptions)).toBe(
      'Option 1'
    );
    expect(component.getDropdownValue('OPTION_2', dropdownOptions)).toBe(
      'Option 2'
    );
    expect(component.getDropdownValue('INVALID', dropdownOptions)).toBe('');
  });

  it('should handle ngOnInit and subscribe to value changes', () => {
    const startTimeUpdateSpy = jest.spyOn(
      component.startTimeControl!,
      'updateValueAndValidity'
    );
    const endTimeUpdateSpy = jest.spyOn(
      component.endTimeControl!,
      'updateValueAndValidity'
    );

    component.ngOnInit();

    component.startDateControl?.setValue('2023-12-01');
    expect(startTimeUpdateSpy).toHaveBeenCalled();

    component.endDateControl?.setValue('2023-12-02');
    expect(endTimeUpdateSpy).toHaveBeenCalled();
  });
});
