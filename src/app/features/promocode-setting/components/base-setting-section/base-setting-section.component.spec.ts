import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BaseSettingSectionComponent } from './base-setting-section.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BaseSettingSectionComponent', () => {
  let component: BaseSettingSectionComponent;
  let fixture: ComponentFixture<BaseSettingSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        BaseSettingSectionComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseSettingSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: [''],
      start_time: [''],
      end_date: [''],
      end_time: [''],
      isActive: [false],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize validators on ngOnInit', () => {
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

    component.ngOnInit();

    expect(startDateControlSpy).toHaveBeenCalledWith([Validators.required]);
    expect(startTimeControlSpy).toHaveBeenCalled();
    expect(endDateControlSpy).toHaveBeenCalledWith([Validators.required]);
    expect(endTimeControlSpy).toHaveBeenCalled();
  });

  it('should validate endTimeValidator correctly', () => {
    const control = component.formGroup.get('end_time')!;
    component.formGroup.patchValue({
      start_date: '2023-10-01',
      start_time: '10:00',
      end_date: '2023-10-01',
      end_time: '09:00',
    });
    const invalidResult = component.endTimeValidator(control);
    expect(invalidResult).toEqual({ invalidEndTime: true });

    component.formGroup.patchValue({
      end_time: '11:00',
    });
    const validResult = component.endTimeValidator(control);
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

  it('should subscribe to value changes on ngOnInit', () => {
    const startTimeUpdateSpy = jest.spyOn(
      component.startTimeControl!,
      'updateValueAndValidity'
    );
    const endTimeUpdateSpy = jest.spyOn(
      component.endTimeControl!,
      'updateValueAndValidity'
    );

    component.ngOnInit();

    component.startDateControl?.setValue('2023-10-01');
    expect(startTimeUpdateSpy).toHaveBeenCalled();

    component.endDateControl?.setValue('2023-10-02');
    expect(endTimeUpdateSpy).toHaveBeenCalled();
  });
});
