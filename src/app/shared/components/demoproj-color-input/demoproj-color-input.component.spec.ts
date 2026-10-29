import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoprojColorInputComponent } from './demoproj-color-input.component';
import { ControlContainer } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DemoprojColorInputComponent', () => {
  let component: DemoprojColorInputComponent;
  let fixture: ComponentFixture<DemoprojColorInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoprojColorInputComponent, NoopAnimationsModule],
      providers: [ControlContainer],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoprojColorInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write value to the form control', () => {
    const value = '#FFFFFF';
    component.writeValue(value);
    expect(component.formControl.value).toBe(value);
  });

  it('should register onTouched callback', () => {
    const onTouchedMock = jest.fn();
    component.registerOnTouched(onTouchedMock);
    component.onBlur();
    expect(onTouchedMock).toHaveBeenCalled();
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

  it('should trim spaces from the form control value', () => {
    component.formControl.setValue('  test  ');
    component.trimSpaces();
    expect(component.formControl.value).toBe('test');
  });

  it('should handle color change', () => {
    const color = '#123456';
    const onChangeMock = jest.fn();
    component.registerOnChange(onChangeMock);

    component.colorChange(color);
    expect(component.formControl.value).toBe(color);
    expect(onChangeMock).toHaveBeenCalledWith(color);
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

  it('should handle ngOnInit when controlContainer is null', () => {
    component['controlContainer'] = null as unknown as ControlContainer;
    component.ngOnInit();
    expect(component['controlContainer']?.validator || null).toBeNull();
  });

  it('should call onTouched when onBlur is triggered', () => {
    const onTouchedMock = jest.fn();
    component.registerOnTouched(onTouchedMock);
    component.onBlur();
    expect(onTouchedMock).toHaveBeenCalled();
  });

  it('should handle null value in writeValue', () => {
    component.writeValue(null);
    expect(component.formControl.value).toBeNull();
  });

  it('should handle null validator in updateValidators', () => {
    const controlContainerMock = {
      control: {
        get: jest.fn().mockReturnValue(null),
      },
    } as unknown as ControlContainer;

    component['controlContainer'] = controlContainerMock;
    component.formControlName = 'testControl';
    component.updateValidators();

    expect(controlContainerMock.control?.get).toHaveBeenCalledWith(
      'testControl'
    );
    expect(component.formControl.validator).toBeNull();
  });
});
