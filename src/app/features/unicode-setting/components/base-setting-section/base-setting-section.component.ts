import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';
import { DemoprojTimepickerComponent } from '../../../../shared/components/demoproj-timepicker/demoproj-timepicker.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { takeUntil } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { timePickerFormatValidator } from '@app/shared/utils/time-picker-format-validator';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';

@Component({
  selector: 'app-base-setting-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    SvgCalendarComponent,
    DemoprojTimepickerComponent,
    MatCheckboxModule,
    MatSlideToggleModule,
    DemoprojInputComponent,
  ],
  providers: [DatePipe],
  templateUrl: './base-setting-section.component.html',
  styleUrl: './base-setting-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseSettingSectionComponent
  extends BaseComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;

  get nameControl() {
    return this.formGroup?.get('name');
  }
  get descriptionControl() {
    return this.formGroup?.get('description');
  }
  get startDateControl() {
    return this.formGroup?.get('start_date');
  }
  get startTimeControl() {
    return this.formGroup?.get('start_time');
  }
  get endDateControl() {
    return this.formGroup?.get('end_date');
  }
  get endTimeControl() {
    return this.formGroup?.get('end_time');
  }
  get isActiveControl() {
    return this.formGroup?.get('isActive');
  }

  currentDate = new Date();

  ngOnInit(): void {
    this.reValidateForm();

    this.startDateControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        setTimeout(() => {
          this.startTimeControl?.updateValueAndValidity();
        }, 100);
      });
    this.endDateControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        setTimeout(() => {
          this.endTimeControl?.updateValueAndValidity();
        }, 100);
      });
    this.startTimeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        setTimeout(() => {
          this.endTimeControl?.updateValueAndValidity();
        }, 100);
      });
  }

  reValidateForm() {
    this.startDateControl?.setValidators([Validators.required]);
    this.startTimeControl?.setValidators([
      Validators.required,
      timePickerFormatValidator,
    ]);
    this.endDateControl?.setValidators([Validators.required]);
    this.endTimeControl?.setValidators([
      Validators.required,
      timePickerFormatValidator,
      (control: AbstractControl) => this.endTimeValidator(control),
    ]);

    this.startDateControl?.updateValueAndValidity({ emitEvent: false });
    this.startTimeControl?.updateValueAndValidity({ emitEvent: false });
    this.endDateControl?.updateValueAndValidity({ emitEvent: false });
    this.endTimeControl?.updateValueAndValidity({ emitEvent: false });
  }

  endTimeValidator(control: AbstractControl): ValidationErrors | null {
    const baseSettingFormValue = this.formGroup?.value;
    const endTimeValue = control.value;
    const startTimeValue = baseSettingFormValue?.start_time;
    const startDateValue = baseSettingFormValue?.start_date;
    const endDateValue = baseSettingFormValue?.end_date;

    if (
      !startDateValue ||
      !startTimeValue ||
      !endDateValue ||
      !endTimeValue?.trim()
    ) {
      return null;
    }

    const [startHours, startMinutes] = (startTimeValue || '')
      .split(':')
      .map(Number);
    const start_date_time = new Date(startDateValue);
    start_date_time.setHours(startHours, startMinutes, 0, 0);

    const [endHours, endMinutes] = (endTimeValue || '').split(':').map(Number);
    const end_date_time = new Date(endDateValue);
    end_date_time.setHours(endHours, endMinutes, 0, 0);

    if (end_date_time <= start_date_time) {
      return { invalidEndTime: true };
    }

    return null;
  }
}
