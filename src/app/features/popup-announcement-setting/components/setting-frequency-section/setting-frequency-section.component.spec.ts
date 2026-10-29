import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { SettingFrequencySectionComponent } from './setting-frequency-section.component';
import {
  FrequencyPeriodCode,
  frequencyPeriodOptions,
} from './frequency-options.const';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SettingFrequencySectionComponent', () => {
  let component: SettingFrequencySectionComponent;
  let fixture: ComponentFixture<SettingFrequencySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SettingFrequencySectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingFrequencySectionComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      frequencyCap: new FormControl(''),
      frequencyPeriod: new FormControl(''),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize frequencyPeriodControl with default value in create mode', () => {
    component.isCreateMode = true;
    component.ngOnInit();
    expect(component.frequencyPeriodControl?.value).toBe(
      FrequencyPeriodCode.Day
    );
  });

  it('should return the correct dropdown value', () => {
    const selectedCode = FrequencyPeriodCode.Week;
    const result = component.getDropdownValue(
      selectedCode,
      frequencyPeriodOptions
    );
    expect(result).toBe('Week');
  });

  it('should return an empty string if selectedCode is not found in dropdown options', () => {
    const selectedCode = 'INVALID_CODE';
    const result = component.getDropdownValue(
      selectedCode,
      frequencyPeriodOptions
    );
    expect(result).toBe('');
  });

  it('should return the frequencyCap control', () => {
    const control = component.frequencyCapControl;
    expect(control).toBe(component.formGroup.get('frequencyCap'));
  });

  it('should return the frequencyPeriod control', () => {
    const control = component.frequencyPeriodControl;
    expect(control).toBe(component.formGroup.get('frequencyPeriod'));
  });
});
