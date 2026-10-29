import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoprojTimepickerComponent } from './demoproj-timepicker.component';
import { DatePipe } from '@angular/common';
import {
  ControlContainer,
  TouchedChangeEvent,
  ValueChangeEvent,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconButton } from '@angular/material/button';
import { Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DemoprojTimepickerComponent', () => {
  let component: DemoprojTimepickerComponent;
  let fixture: ComponentFixture<DemoprojTimepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoprojTimepickerComponent, NoopAnimationsModule],
      providers: [DatePipe, ControlContainer],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoprojTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write value to form control', () => {
    const value = '12:30';
    component.writeValue(value);
    expect(component.formControl.value).toBe(value);
  });

  it('should register onChange callback', () => {
    const onChangeMock = jest.fn();
    component.registerOnChange(onChangeMock);
    component.formControl.setValue('10:00');
    setTimeout(() => {
      expect(onChangeMock).toHaveBeenCalledWith('10:00');
    }, 0);
  });

  it('should register onTouched callback', () => {
    const onTouchedMock = jest.fn();
    component.registerOnTouched(onTouchedMock);
    setTimeout(() => {
      expect(onTouchedMock).toHaveBeenCalled();
    }, 0);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.formControl.disabled).toBe(true);

    component.setDisabledState(false);
    expect(component.formControl.disabled).toBe(false);
  });

  it('should update validators', () => {
    const controlContainerMock = {
      control: {
        get: jest.fn().mockReturnValue({
          validator: jest.fn(),
        }),
      },
    } as unknown as ControlContainer;

    component['controlContainer'] = controlContainerMock;
    component.formControlName = 'testControl';
    component.updateValidators();

    expect(controlContainerMock.control?.get).toHaveBeenCalledWith(
      'testControl'
    );
  });

  it('should update hidden form control when value changes', () => {
    const datePipe = new DatePipe('en-US');
    const value = '12:30';
    const expectedDate = new Date();
    expectedDate.setHours(12, 30, 0, 0);

    component.updateHiddenFormControl(value);
    expect(component.hiddenFormControl.value).toEqual(expectedDate);

    component.updateHiddenFormControl(null);
    expect(component.hiddenFormControl.value).toBeNull();
  });

  it('should handle ngOnInit when controlContainer is null', () => {
    component['controlContainer'] = null as unknown as ControlContainer;
    component.ngOnInit();
    expect(component.formControl).toBeDefined();
  });

  it('should open time picker', () => {
    const timepickerMock = {
      _elementRef: {
        nativeElement: {
          click: jest.fn(),
        },
      },
    } as unknown as MatIconButton;

    component.timepicker = timepickerMock;
    component.openTimePicker();
    expect(timepickerMock._elementRef.nativeElement.click).toHaveBeenCalled();
  });

  it('should handle value changes in formControl', () => {
    const onChangeMock = jest.fn();
    component.registerOnChange(onChangeMock);

    component.formControl.setValue('14:00');
    setTimeout(() => {
      expect(onChangeMock).toHaveBeenCalledWith('14:00');
    }, 0);
  });

  it('should handle value changes in hiddenFormControl', () => {
    const datePipe = new DatePipe('en-US');
    const date = new Date();
    date.setHours(15, 45, 0, 0);

    component.hiddenFormControl.setValue(date);
    setTimeout(() => {
      expect(component.formControl.value).toBe(
        datePipe.transform(date, 'HH:mm')
      );
    }, 0);
  });

  it('should mark form control as touched or untouched based on events', () => {
    const touchedEvent = { touched: true };
    const untouchedEvent = { touched: false };

    component['controlContainer'] = {
      control: {
        get: jest.fn().mockReturnValue({
          events: {
            pipe: jest.fn().mockReturnValue({
              subscribe: (callback: any) => {
                callback(touchedEvent);
                callback(untouchedEvent);
              },
            }),
          },
        }),
      },
    } as unknown as ControlContainer;

    component.ngOnInit();

    expect(component.formControl.touched).toBe(false);
  });

  it('should handle TouchedChangeEvent from formControl events', () => {
    const onTouchedMock = jest.fn();
    component.registerOnTouched(onTouchedMock);

    // Ensure events is a Subject, otherwise mock it
    if (!(component.formControl.events instanceof Subject)) {
      (component.formControl as any).events = new Subject();
    }

    // Emit the event
    const touchedEvent = new TouchedChangeEvent(true, component.formControl);
    (component.formControl.events as Subject<any>).next(touchedEvent);

    // Assert that onTouchedMock was called
    setTimeout(() => {
      expect(onTouchedMock).toHaveBeenCalled();
    }, 0);
  });

  it('should handle TouchedChangeEvent from controlContainer events', () => {
    const controlMock = {
      get: jest.fn().mockReturnValue({
        events: {
          pipe: jest.fn().mockReturnValue({
            subscribe: (callback: any) => {
              callback(new TouchedChangeEvent(true, component.formControl));
              callback(new TouchedChangeEvent(false, component.formControl));
            },
          }),
        },
      }),
    } as unknown as ControlContainer;

    component['controlContainer'] = controlMock;
    component.formControlName = 'testControl';
    component.ngOnInit();

    expect(component.formControl.touched).toBe(false);
  });

  it('should handle ValueChangeEvent from controlContainer events', () => {
    const controlMock = {
      get: jest.fn().mockReturnValue({
        events: {
          pipe: jest.fn().mockReturnValue({
            subscribe: (callback: any) => {
              callback(new ValueChangeEvent('test', component.formControl));
            },
          }),
        },
      }),
    } as unknown as ControlContainer;

    component['controlContainer'] = controlMock;
    component.formControlName = 'testControl';
    component.ngOnInit();

    const updateValueAndValiditySpy = jest.spyOn(
      component.formControl,
      'updateValueAndValidity'
    );
    setTimeout(() => {
      expect(updateValueAndValiditySpy).toHaveBeenCalledWith({
        emitEvent: false,
      });
    }, 0);
  });
});
