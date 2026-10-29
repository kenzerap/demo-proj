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
import { ValueCode } from '@app/shared/models/value-code.model';
import { DemoprojTimepickerComponent } from '../../../../shared/components/demoproj-timepicker/demoproj-timepicker.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { filter, takeUntil } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { timePickerFormatValidator } from '@app/shared/utils/time-picker-format-validator';

@Component({
  selector: 'app-active-period-section',
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
  ],
  providers: [DatePipe],
  templateUrl: './active-period-section.component.html',
  styleUrl: './active-period-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivePeriodSectionComponent
  extends BaseComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;

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
  get isPublishedControl() {
    return this.formGroup?.get('is_published');
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

    this.isPublishedControl?.valueChanges
      .pipe(
        filter((isPublished) => !!isPublished),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.isPublishedControl?.hasError('publishBeforeSave')) {
          this.isPublishedControl?.setErrors(null);
        }
      });
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
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
    const activePeriodFormValue = this.formGroup?.value;
    const endTimeValue = control.value;
    const startTimeValue = activePeriodFormValue?.start_time;
    const startDateValue = activePeriodFormValue?.start_date;
    const endDateValue = activePeriodFormValue?.end_date;

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
