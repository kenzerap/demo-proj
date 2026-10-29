import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoprojInputComponent } from './demoproj-input.component';
import { ReactiveFormsModule, ControlContainer } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DemoprojInputComponent', () => {
  let component: DemoprojInputComponent;
  let fixture: ComponentFixture<DemoprojInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DemoprojInputComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: ControlContainer,
          useValue: { control: { get: () => ({ validator: jest.fn() }) } },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoprojInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form control', () => {
    expect(component.formControl).toBeDefined();
  });

  it('should call onChange when form control value changes', () => {
    const onChangeSpy = jest.spyOn(component as any, 'onChange');
    const onChangeMock = jest.fn();
    component.registerOnChange(onChangeMock);
    component.formControl.setValue('test value');

    setTimeout(() => {
      expect(onChangeSpy).toHaveBeenCalledWith('test value');
    }, 0);
  });

  it('should call onTouched when onBlur is triggered', () => {
    const onTouchedSpy = jest.spyOn(component as any, 'onTouched');
    component.onBlur();
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should write value to form control', () => {
    component.writeValue('test input');
    expect(component.formControl.value).toBe('test input');
  });

  it('should register onChange function', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    expect(component['onChange']).toBe(fn);
  });

  it('should register onTouched function', () => {
    const fn = jest.fn();
    component.registerOnTouched(fn);
    expect(component['onTouched']).toBe(fn);
  });

  it('should disable form control', () => {
    component.setDisabledState(true);
    expect(component.formControl.disabled).toBe(true);
  });

  it('should enable form control', () => {
    component.setDisabledState(false);
    expect(component.formControl.disabled).toBe(false);
  });

  it('should update validators', () => {
    const setValidatorsSpy = jest.spyOn(component.formControl, 'setValidators');
    const updateValueAndValiditySpy = jest.spyOn(
      component.formControl,
      'updateValueAndValidity'
    );
    component.updateValidators();
    expect(setValidatorsSpy).toHaveBeenCalled();
    expect(updateValueAndValiditySpy).toHaveBeenCalledWith({
      emitEvent: false,
    });
  });

  it('should trim spaces', () => {
    component.formControl.setValue('  test value  ');
    component.trimSpaces();
    expect(component.formControl.value).toBe('test value');
  });
});
