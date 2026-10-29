import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SendTimeSectionComponent } from './send-time-section.component';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { ValueCode } from '@app/shared/models/value-code.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

describe('SendTimeSectionComponent', () => {
  let component: SendTimeSectionComponent;
  let fixture: ComponentFixture<SendTimeSectionComponent>;
  let formBuilder: FormBuilder;
  let mockDatePipe: jest.Mocked<DatePipe>;

  beforeEach(async () => {
    mockDatePipe = {
      transform: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SendTimeSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [{ provide: DatePipe, useValue: mockDatePipe }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendTimeSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      send_time_type: [TimePeriodType.IMMEDIATELY],
      start_date: [''],
      start_time: [''],
      end_date: [''],
      end_time: [''],
      isSetEndDate: [false],
      published: [false],
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.pushNotificationType).toBe(TimePeriodType);
      expect(component.sendTimeTypes).toHaveLength(3);
      expect(component.currentDate).toBeInstanceOf(Date);
      expect(component.isCreateMode).toBe(true);
    });

    it('should have correct sendTimeTypes array', () => {
      expect(component.sendTimeTypes).toEqual([
        { value: 'Send immediately', code: TimePeriodType.IMMEDIATELY },
        { value: 'Specific time', code: TimePeriodType.SPECIFIC_TIME },
        { value: 'Trigger Event', code: TimePeriodType.TRIGGER_EVENT },
      ]);
    });
  });

  describe('Form Control Getters', () => {
    it('should return correct form controls', () => {
      expect(component.sendTimeTypeControl).toBe(
        component.formGroup.get('send_time_type')
      );
      expect(component.startDateControl).toBe(
        component.formGroup.get('start_date')
      );
      expect(component.startTimeControl).toBe(
        component.formGroup.get('start_time')
      );
      expect(component.isSetEndDateControl).toBe(
        component.formGroup.get('isSetEndDate')
      );
      expect(component.endDateControl).toBe(
        component.formGroup.get('end_date')
      );
      expect(component.endTimeControl).toBe(
        component.formGroup.get('end_time')
      );
      expect(component.publishedControl).toBe(
        component.formGroup.get('published')
      );
    });
  });

  describe('ngOnInit', () => {
    it('should call reValidateForm with current sendTimeTypeControl value', () => {
      const spy = jest.spyOn(component, 'reValidateForm');
      component.sendTimeTypeControl?.setValue(TimePeriodType.SPECIFIC_TIME);

      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith(TimePeriodType.SPECIFIC_TIME);
    });

    it('should set up sendTimeTypeControl value changes subscription', fakeAsync(() => {
      const spy = jest.spyOn(component, 'reValidateForm');

      component.ngOnInit();
      component.sendTimeTypeControl?.setValue(TimePeriodType.TRIGGER_EVENT);
      tick();

      expect(spy).toHaveBeenCalledWith(TimePeriodType.TRIGGER_EVENT);
      flush();
    }));

    it('should reset form controls when sendTimeType changes', fakeAsync(() => {
      component.ngOnInit();

      const resetSpy = jest.spyOn(component.startDateControl!, 'reset');
      component.sendTimeTypeControl?.setValue(TimePeriodType.SPECIFIC_TIME);
      tick();

      expect(resetSpy).toHaveBeenCalledWith(null, { emitEvent: false });
      flush();
    }));
  });

  describe('reValidateForm', () => {
    it('should set validators to null for IMMEDIATELY type', () => {
      component.reValidateForm(TimePeriodType.IMMEDIATELY);

      expect(component.startDateControl?.validator).toBeNull();
      expect(component.startTimeControl?.validator).toBeNull();
      expect(component.endDateControl?.validator).toBeNull();
      expect(component.endTimeControl?.validator).toBeNull();
    });

    it('should set correct validators for SPECIFIC_TIME type', () => {
      component.reValidateForm(TimePeriodType.SPECIFIC_TIME);

      expect(component.startDateControl?.validator).toBeDefined();
      expect(component.startTimeControl?.validator).toBeDefined();
      expect(component.endDateControl?.validator).toBeNull();
      expect(component.endTimeControl?.validator).toBeNull();
    });

    it('should set correct validators for TRIGGER_EVENT type', () => {
      component.reValidateForm(TimePeriodType.TRIGGER_EVENT);

      expect(component.startDateControl?.validator).toBeDefined();
      expect(component.startTimeControl?.validator).toBeDefined();
    });

    it('should update validators and validity for all controls', () => {
      const startDateSpy = jest.spyOn(
        component.startDateControl!,
        'updateValueAndValidity'
      );
      const startTimeSpy = jest.spyOn(
        component.startTimeControl!,
        'updateValueAndValidity'
      );
      const endDateSpy = jest.spyOn(
        component.endDateControl!,
        'updateValueAndValidity'
      );
      const endTimeSpy = jest.spyOn(
        component.endTimeControl!,
        'updateValueAndValidity'
      );

      component.reValidateForm(TimePeriodType.SPECIFIC_TIME);

      expect(startDateSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(startTimeSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(endDateSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(endTimeSpy).toHaveBeenCalledWith({ emitEvent: false });
    });

    it('should clear endTimeControl errors for IMMEDIATELY type', () => {
      const clearErrorsSpy = jest.spyOn(component.endTimeControl!, 'setErrors');

      component.reValidateForm(TimePeriodType.IMMEDIATELY);

      expect(clearErrorsSpy).toHaveBeenCalledWith(null);
    });

    it('should handle default case', () => {
      const invalidType = 'INVALID_TYPE' as TimePeriodType;

      expect(() => component.reValidateForm(invalidType)).not.toThrow();
    });
  });

  describe('Form Control Value Changes', () => {
    beforeEach(fakeAsync(() => {
      component.ngOnInit();
      tick();
      flush();
    }));

    afterEach(fakeAsync(() => {
      flush();
    }));

    it('should update startTimeControl validity when startDateControl changes', fakeAsync(() => {
      const updateSpy = jest.spyOn(
        component.startTimeControl!,
        'updateValueAndValidity'
      );

      component.startDateControl?.setValue('2023-12-01');
      tick(100);

      expect(updateSpy).toHaveBeenCalled();
      flush();
    }));

    it('should update endTimeControl validity when endDateControl changes', fakeAsync(() => {
      const updateSpy = jest.spyOn(
        component.endTimeControl!,
        'updateValueAndValidity'
      );

      component.endDateControl?.setValue('2023-12-01');
      tick(100);

      expect(updateSpy).toHaveBeenCalled();
      flush();
    }));

    it('should update endTimeControl validity when startTimeControl changes', fakeAsync(() => {
      const updateSpy = jest.spyOn(
        component.endTimeControl!,
        'updateValueAndValidity'
      );

      component.startTimeControl?.setValue('10:00');
      tick(100);

      expect(updateSpy).toHaveBeenCalled();
      flush();
    }));

    describe('isSetEndDateControl value changes', () => {
      beforeEach(fakeAsync(() => {
        component.sendTimeTypeControl?.setValue(TimePeriodType.TRIGGER_EVENT);
        tick();
      }));

      it('should reset end date/time controls and remove validators when isSetEndDate is false', fakeAsync(() => {
        const endDateResetSpy = jest.spyOn(component.endDateControl!, 'reset');
        const endTimeResetSpy = jest.spyOn(component.endTimeControl!, 'reset');
        const endDateValidatorSpy = jest.spyOn(
          component.endDateControl!,
          'setValidators'
        );
        const endTimeValidatorSpy = jest.spyOn(
          component.endTimeControl!,
          'setValidators'
        );

        component.isSetEndDateControl?.setValue(false);
        tick();

        expect(endDateResetSpy).toHaveBeenCalledWith(null, {
          emitEvent: false,
        });
        expect(endTimeResetSpy).toHaveBeenCalledWith(null, {
          emitEvent: false,
        });
        expect(endDateValidatorSpy).toHaveBeenCalledWith([]);
        expect(endTimeValidatorSpy).toHaveBeenCalledWith([]);
        flush();
      }));

      it('should set validators when isSetEndDate is true', fakeAsync(() => {
        const endDateValidatorSpy = jest.spyOn(
          component.endDateControl!,
          'setValidators'
        );
        const endTimeValidatorSpy = jest.spyOn(
          component.endTimeControl!,
          'setValidators'
        );

        component.isSetEndDateControl?.setValue(true);
        tick();

        expect(endDateValidatorSpy).toHaveBeenCalledWith(expect.any(Array));
        expect(endTimeValidatorSpy).toHaveBeenCalledWith(expect.any(Array));
        flush();
      }));

      it('should mark controls as untouched when isSetEndDate changes', fakeAsync(() => {
        const endDateUntouchedSpy = jest.spyOn(
          component.endDateControl!,
          'markAsUntouched'
        );
        const endTimeUntouchedSpy = jest.spyOn(
          component.endTimeControl!,
          'markAsUntouched'
        );

        component.isSetEndDateControl?.setValue(true);
        tick();

        expect(endDateUntouchedSpy).toHaveBeenCalled();
        expect(endTimeUntouchedSpy).toHaveBeenCalled();
        flush();
      }));

      it('should update validators validity when isSetEndDate changes', fakeAsync(() => {
        const startTimeSpy = jest.spyOn(
          component.startTimeControl!,
          'updateValueAndValidity'
        );
        const endDateSpy = jest.spyOn(
          component.endDateControl!,
          'updateValueAndValidity'
        );
        const endTimeSpy = jest.spyOn(
          component.endTimeControl!,
          'updateValueAndValidity'
        );

        component.isSetEndDateControl?.setValue(true);
        tick();

        expect(startTimeSpy).toHaveBeenCalledWith({ emitEvent: false });
        expect(endDateSpy).toHaveBeenCalledWith({ emitEvent: false });
        expect(endTimeSpy).toHaveBeenCalledWith({ emitEvent: false });
        flush();
      }));

      it('should not trigger when sendTimeType is not TRIGGER_EVENT', fakeAsync(() => {
        component.sendTimeTypeControl?.setValue(TimePeriodType.SPECIFIC_TIME);
        tick();

        const endDateResetSpy = jest.spyOn(component.endDateControl!, 'reset');

        component.isSetEndDateControl?.setValue(false);
        tick();

        expect(endDateResetSpy).not.toHaveBeenCalled();
        flush();
      }));
    });
  });

  describe('getDropdownValue', () => {
    const options: ValueCode[] = [
      { code: '1', value: 'Option 1' },
      { code: '2', value: 'Option 2' },
    ];

    it('should return correct value for existing code', () => {
      const result = component.getDropdownValue('1', options);
      expect(result).toBe('Option 1');
    });

    it('should return empty string for non-existing code', () => {
      const result = component.getDropdownValue('3', options);
      expect(result).toBe('');
    });

    it('should return empty string for null code', () => {
      const result = component.getDropdownValue(null, options);
      expect(result).toBe('');
    });

    it('should handle empty options array', () => {
      const result = component.getDropdownValue('1', []);
      expect(result).toBe('');
    });
  });

  describe('Validators', () => {
    describe('endTimeValidator', () => {
      it('should return null when required fields are missing', () => {
        component.formGroup.patchValue({
          start_date: null,
          start_time: null,
          end_date: null,
        });

        const control = component.endTimeControl!;
        control.setValue('10:00');

        const result = component.endTimeValidator(control);
        expect(result).toBeNull();
      });

      it('should return required error when endTime is empty', () => {
        component.formGroup.patchValue({
          start_date: '2023-12-01',
          start_time: '09:00',
          end_date: '2023-12-01',
        });

        const control = component.endTimeControl!;
        control.setValue('   ');

        const result = component.endTimeValidator(control);
        expect(result).toEqual({ required: true });
      });

      it('should return invalidEndTime error when end time is before start time', () => {
        component.formGroup.patchValue({
          start_date: '2023-12-01',
          start_time: '10:00',
          end_date: '2023-12-01',
        });

        const control = component.endTimeControl!;
        control.setValue('09:00');

        const result = component.endTimeValidator(control);
        expect(result).toEqual({ invalidEndTime: true });
      });

      it('should return invalidEndTime error when end time equals start time', () => {
        component.formGroup.patchValue({
          start_date: '2023-12-01',
          start_time: '10:00',
          end_date: '2023-12-01',
        });

        const control = component.endTimeControl!;
        control.setValue('10:00');

        const result = component.endTimeValidator(control);
        expect(result).toEqual({ invalidEndTime: true });
      });

      it('should return null for valid end time', () => {
        component.formGroup.patchValue({
          start_date: '2023-12-01',
          start_time: '09:00',
          end_date: '2023-12-01',
        });

        const control = component.endTimeControl!;
        control.setValue('10:00');

        const result = component.endTimeValidator(control);
        expect(result).toBeNull();
      });

      it('should handle cross-day validation', () => {
        component.formGroup.patchValue({
          start_date: '2023-12-01',
          start_time: '23:00',
          end_date: '2023-12-02',
        });

        const control = component.endTimeControl!;
        control.setValue('01:00');

        const result = component.endTimeValidator(control);
        expect(result).toBeNull();
      });

      it('should validate time format correctly with different formats', () => {
        component.formGroup.patchValue({
          start_date: '2023-12-01',
          start_time: '09:00',
          end_date: '2023-12-01',
        });

        const control = component.endTimeControl!;
        control.setValue('10:30'); // Different end time that's clearly after start time

        const result = component.endTimeValidator(control);
        expect(result).toBeNull();
      });
    });

    describe('startTimeValidator', () => {
      beforeEach(() => {
        component.currentDate = new Date('2023-12-01T08:00:00');
      });

      it('should return null when required fields are missing', () => {
        component.formGroup.patchValue({
          start_date: null,
        });

        const control = component.startTimeControl!;
        control.setValue('10:00');

        const result = component.startTimeValidator(control);
        expect(result).toBeNull();
      });

      it('should return null when hasEditEndDate is true', () => {
        component.isCreateMode = false;
        component.isSetEndDateControl?.setValue(true);

        component.formGroup.patchValue({
          start_date: '2023-12-01',
        });

        const control = component.startTimeControl!;
        control.setValue('10:00');

        const result = component.startTimeValidator(control);
        expect(result).toBeNull();
      });

      it('should return required error when startTime is empty', () => {
        component.formGroup.patchValue({
          start_date: '2023-12-01',
        });

        const control = component.startTimeControl!;
        control.setValue('   ');

        const result = component.startTimeValidator(control);
        expect(result).toEqual({ required: true });
      });

      it('should return invalidStartTime error when start time is in the past', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);

        component.formGroup.patchValue({
          start_date: pastDate.toISOString().split('T')[0],
        });

        const control = component.startTimeControl!;
        control.setValue('10:00');

        const result = component.startTimeValidator(control);
        expect(result).toEqual({ invalidStartTime: true });
      });

      it('should return null for valid future start time', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);

        component.formGroup.patchValue({
          start_date: futureDate.toISOString().split('T')[0],
        });

        const control = component.startTimeControl!;
        control.setValue('10:00');

        const result = component.startTimeValidator(control);
        expect(result).toBeNull();
      });

      it('should handle same date validation with future time', () => {
        const today = new Date();
        const futureTime = new Date();
        futureTime.setHours(futureTime.getHours() + 2);

        component.formGroup.patchValue({
          start_date: today.toISOString().split('T')[0],
        });

        const control = component.startTimeControl!;
        control.setValue(
          `${futureTime.getHours().toString().padStart(2, '0')}:${futureTime
            .getMinutes()
            .toString()
            .padStart(2, '0')}`
        );

        const result = component.startTimeValidator(control);
        expect(result).toBeNull();
      });
    });
  });

  describe('getMinEndDate', () => {
    it('should return currentDate when startDate is before currentDate', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      component.startDateControl?.setValue(pastDate);

      const result = component.getMinEndDate();
      expect(result).toBe(component.currentDate);
    });

    it('should return startDate when startDate is after or equal to currentDate', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      component.startDateControl?.setValue(futureDate);

      const result = component.getMinEndDate();
      expect(result).toEqual(futureDate);
    });

    it('should handle same date as current date', () => {
      const today = new Date();

      component.startDateControl?.setValue(today);

      const result = component.getMinEndDate();
      expect(result).toEqual(today);
    });

    it('should return currentDate when startDateControl value is null', () => {
      component.startDateControl?.setValue(null);

      const result = component.getMinEndDate();
      expect(result).toBe(component.currentDate);
    });
  });

  describe('Component Destruction', () => {
    it('should unsubscribe on destroy', () => {
      const destroySpy = jest.spyOn(component['destroy$'], 'next');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
    });

    it('should complete destroy subject on destroy', () => {
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('should accept formGroup input', () => {
      const newFormGroup = formBuilder.group({
        test: [''],
      });

      component.formGroup = newFormGroup;

      expect(component.formGroup).toBe(newFormGroup);
    });

    it('should accept isCreateMode input', () => {
      component.isCreateMode = false;

      expect(component.isCreateMode).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid time format in validators', () => {
      component.formGroup.patchValue({
        start_date: '2023-12-01',
        start_time: 'invalid:time',
        end_date: '2023-12-01',
      });

      const control = component.endTimeControl!;
      control.setValue('invalid:time');

      expect(() => component.endTimeValidator(control)).not.toThrow();
    });

    it('should handle null form group gracefully', () => {
      component.formGroup = null as any;

      expect(component.sendTimeTypeControl).toBeUndefined();
      expect(component.startDateControl).toBeUndefined();
    });

    it('should handle subscription cleanup correctly', fakeAsync(() => {
      component.ngOnInit();

      component.sendTimeTypeControl?.setValue(TimePeriodType.SPECIFIC_TIME);
      component.startDateControl?.setValue('2023-12-01');
      component.isSetEndDateControl?.setValue(true);

      tick(100);

      expect(() => component.ngOnDestroy()).not.toThrow();
      flush();
    }));
  });

  describe('Form Integration', () => {
    it('should work with reactive forms', () => {
      component.formGroup.patchValue({
        send_time_type: TimePeriodType.SPECIFIC_TIME,
        start_date: '2023-12-01',
        start_time: '10:00',
        isSetEndDate: false,
        published: true,
      });

      expect(component.sendTimeTypeControl?.value).toBe(
        TimePeriodType.SPECIFIC_TIME
      );
      expect(component.startDateControl?.value).toBe('2023-12-01');
      expect(component.startTimeControl?.value).toBe('10:00');
      expect(component.isSetEndDateControl?.value).toBe(false);
      expect(component.publishedControl?.value).toBe(true);
    });

    it('should validate form state correctly', fakeAsync(() => {
      component.ngOnInit();
      tick();

      component.reValidateForm(TimePeriodType.SPECIFIC_TIME);

      expect(component.formGroup.invalid).toBe(true);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      component.formGroup.patchValue({
        start_date: futureDate.toISOString().split('T')[0],
        start_time: '10:00',
      });

      component.formGroup.updateValueAndValidity();
      tick(100);
      flush();
    }));
  });

  describe('Specific Component Behavior', () => {
    it('should handle form group markAsUntouched when sendTimeType changes', fakeAsync(() => {
      component.ngOnInit();

      const markUntouchedSpy = jest.spyOn(
        component.formGroup,
        'markAsUntouched'
      );
      component.sendTimeTypeControl?.setValue(TimePeriodType.SPECIFIC_TIME);
      tick();

      expect(markUntouchedSpy).toHaveBeenCalled();
      flush();
    }));

    it('should reset published and isSetEndDate controls when sendTimeType changes', fakeAsync(() => {
      component.ngOnInit();

      const publishedResetSpy = jest.spyOn(
        component.publishedControl!,
        'reset'
      );
      const isSetEndDateResetSpy = jest.spyOn(
        component.isSetEndDateControl!,
        'reset'
      );

      component.sendTimeTypeControl?.setValue(TimePeriodType.TRIGGER_EVENT);
      tick();

      expect(publishedResetSpy).toHaveBeenCalledWith(false, {
        emitEvent: false,
      });
      expect(isSetEndDateResetSpy).toHaveBeenCalledWith(false, {
        emitEvent: false,
      });
      flush();
    }));

    it('should handle empty form control values gracefully', () => {
      component.formGroup.patchValue({
        send_time_type: null,
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        isSetEndDate: null,
        published: null,
      });

      expect(() =>
        component.reValidateForm(TimePeriodType.IMMEDIATELY)
      ).not.toThrow();
    });

    it('should handle component initialization with pre-existing form values', () => {
      const preExistingForm = formBuilder.group({
        send_time_type: [TimePeriodType.SPECIFIC_TIME],
        start_date: ['2023-12-01'],
        start_time: ['10:00'],
        end_date: ['2023-12-01'],
        end_time: ['11:00'],
        isSetEndDate: [true],
        published: [true],
      });

      component.formGroup = preExistingForm;

      expect(component.sendTimeTypeControl?.value).toBe(
        TimePeriodType.SPECIFIC_TIME
      );
      expect(component.startDateControl?.value).toBe('2023-12-01');
      expect(component.startTimeControl?.value).toBe('10:00');
    });
  });

  describe('Validator Edge Cases', () => {
    it('should handle null values in time validation', () => {
      component.formGroup.patchValue({
        start_date: null,
        start_time: null,
        end_date: null,
      });

      const control = component.endTimeControl!;
      control.setValue(null);

      const result = component.endTimeValidator(control);
      expect(result).toBeNull();
    });

    it('should handle undefined values in time validation', () => {
      component.formGroup.patchValue({
        start_date: undefined,
        start_time: undefined,
        end_date: undefined,
      });

      const control = component.startTimeControl!;
      control.setValue(undefined);

      const result = component.startTimeValidator(control);
      expect(result).toBeNull();
    });
  });

  describe('Complete Component Lifecycle', () => {
    it('should handle complete component lifecycle without errors', fakeAsync(() => {
      component.ngOnInit();
      tick();

      component.sendTimeTypeControl?.setValue(TimePeriodType.SPECIFIC_TIME);
      tick(100);

      component.startDateControl?.setValue('2023-12-01');
      tick(100);

      component.startTimeControl?.setValue('10:00');
      tick(100);

      expect(component.formGroup.get('send_time_type')?.value).toBe(
        TimePeriodType.SPECIFIC_TIME
      );

      component.ngOnDestroy();
      flush();
    }));
  });
});
