import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivePeriodSectionComponent } from './active-period-section.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ActivePeriodSectionComponent', () => {
  let component: ActivePeriodSectionComponent;
  let fixture: ComponentFixture<ActivePeriodSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        ActivePeriodSectionComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivePeriodSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      start_date: [''],
      start_time: [''],
      end_date: [''],
      end_time: [''],
      is_published: [false],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call reValidateForm on ngOnInit', () => {
    const reValidateFormSpy = jest.spyOn(component, 'reValidateForm');
    component.ngOnInit();
    expect(reValidateFormSpy).toHaveBeenCalled();
  });

  it('should validate endTimeValidator correctly', () => {
    const control = component.formGroup.get('end_time')!;
    component.formGroup.patchValue({
      start_date: '2023-10-01',
      start_time: '10:00',
      end_date: '2023-10-01',
      end_time: '11:00',
    });
    const result = component.endTimeValidator(control);
    expect(result).toBeNull();

    component.formGroup.patchValue({
      start_date: '2023-10-01',
      start_time: '10:00',
      end_date: '2023-10-01',
      end_time: '09:00',
    });
    const invalidResult = component.endTimeValidator(control);
    expect(invalidResult).toEqual({ invalidEndTime: true });
  });

  it('should handle getDropdownValue correctly', () => {
    const dropdownOptions = [
      { code: '1', value: 'Option 1' },
      { code: '2', value: 'Option 2' },
    ];
    const result = component.getDropdownValue('1', dropdownOptions);
    expect(result).toBe('Option 1');

    const emptyResult = component.getDropdownValue('3', dropdownOptions);
    expect(emptyResult).toBe('');
  });

  it('should reValidateForm and update validators', () => {
    const startDateControl = component.formGroup.get('start_date')!;
    const startTimeControl = component.formGroup.get('start_time')!;
    const endDateControl = component.formGroup.get('end_date')!;
    const endTimeControl = component.formGroup.get('end_time')!;

    component.reValidateForm();

    expect(startDateControl.validator).toBeDefined();
    expect(startTimeControl.validator).toBeDefined();
    expect(endDateControl.validator).toBeDefined();
    expect(endTimeControl.validator).toBeDefined();
  });

  it('should clear publishBeforeSave error on isPublishedControl value change', () => {
    const isPublishedControl = component.formGroup.get('is_published')!;
    isPublishedControl.setErrors({ publishBeforeSave: true });
    isPublishedControl.setValue(true);
    expect(isPublishedControl.errors).toBeNull();
  });
});
