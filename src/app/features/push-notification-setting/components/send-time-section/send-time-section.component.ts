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
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { DemoprojTimepickerComponent } from '../../../../shared/components/demoproj-timepicker/demoproj-timepicker.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { filter, takeUntil } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { timePickerFormatValidator } from '@app/shared/utils/time-picker-format-validator';

@Component({
  selector: 'app-send-time-section',
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
  templateUrl: './send-time-section.component.html',
  styleUrl: './send-time-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendTimeSectionComponent extends BaseComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() isCreateMode = true;

  pushNotificationType = TimePeriodType;
  sendTimeTypes: ValueCode[] = [
    { value: 'Send immediately', code: TimePeriodType.IMMEDIATELY },
    { value: 'Specific time', code: TimePeriodType.SPECIFIC_TIME },
    { value: 'Trigger Event', code: TimePeriodType.TRIGGER_EVENT },
  ];

  get sendTimeTypeControl() {
    return this.formGroup?.get('send_time_type');
  }
  get startDateControl() {
    return this.formGroup?.get('start_date');
  }
  get startTimeControl() {
    return this.formGroup?.get('start_time');
  }
  get isSetEndDateControl() {
    return this.formGroup?.get('isSetEndDate');
  }
  get endDateControl() {
    return this.formGroup?.get('end_date');
  }
  get endTimeControl() {
    return this.formGroup?.get('end_time');
  }
  get publishedControl() {
    return this.formGroup?.get('published');
  }

  currentDate = new Date();

  ngOnInit(): void {
    this.reValidateForm(this.sendTimeTypeControl?.value);
    this.sendTimeTypeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: TimePeriodType) => {
        this.startDateControl?.reset(null, { emitEvent: false });
        this.startTimeControl?.reset(null, { emitEvent: false });
        this.endDateControl?.reset(null, { emitEvent: false });
        this.endTimeControl?.reset(null, { emitEvent: false });
        this.publishedControl?.reset(false, { emitEvent: false });
        this.isSetEndDateControl?.reset(false, { emitEvent: false });

        this.formGroup.markAsUntouched();
        this.reValidateForm(value);
      });

    this.isSetEndDateControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(
          () => this.sendTimeTypeControl?.value === TimePeriodType.TRIGGER_EVENT
        )
      )
      .subscribe((value) => {
        if (!value) {
          this.endDateControl?.reset(null, { emitEvent: false });
          this.endTimeControl?.reset(null, { emitEvent: false });

          this.endDateControl?.setValidators([]);
          this.endTimeControl?.setValidators([]);
        } else {
          this.endDateControl?.setValidators([Validators.required]);
          this.endTimeControl?.setValidators([
            Validators.required,
            timePickerFormatValidator,
            (control: AbstractControl) => this.endTimeValidator(control),
          ]);

          this.endDateControl?.markAsUntouched();
          this.endTimeControl?.markAsUntouched();
        }

        this.startTimeControl?.updateValueAndValidity({ emitEvent: false });
        this.endDateControl?.updateValueAndValidity({ emitEvent: false });
        this.endTimeControl?.updateValueAndValidity({ emitEvent: false });
      });

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

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  reValidateForm(value: TimePeriodType) {
    switch (value) {
      case TimePeriodType.IMMEDIATELY:
        this.startDateControl?.setValidators([]);
        this.startTimeControl?.setValidators([]);
        this.endDateControl?.setValidators([]);
        this.endTimeControl?.setValidators([]);
        this.endTimeControl?.setErrors(null);
        break;

      case TimePeriodType.SPECIFIC_TIME:
        this.startDateControl?.setValidators([Validators.required]);
        this.startTimeControl?.setValidators([
          Validators.required,
          timePickerFormatValidator,
          (control: AbstractControl) => this.startTimeValidator(control),
        ]);
        this.endDateControl?.setValidators([]);
        this.endTimeControl?.setValidators([]);
        break;

      case TimePeriodType.TRIGGER_EVENT:
        this.startDateControl?.setValidators([Validators.required]);
        this.startTimeControl?.setValidators([
          Validators.required,
          timePickerFormatValidator,
          (control: AbstractControl) => this.startTimeValidator(control),
        ]);
        break;

      default:
        break;
    }

    this.startDateControl?.updateValueAndValidity({ emitEvent: false });
    this.startTimeControl?.updateValueAndValidity({ emitEvent: false });
    this.endDateControl?.updateValueAndValidity({ emitEvent: false });
    this.endTimeControl?.updateValueAndValidity({ emitEvent: false });
  }

  endTimeValidator(control: AbstractControl): ValidationErrors | null {
    const sendTimeFormValue = this.formGroup?.value;
    const endTimeValue = control.value;
    const startTimeValue = sendTimeFormValue?.start_time;
    const startDateValue = sendTimeFormValue?.start_date;
    const endDateValue = sendTimeFormValue?.end_date;

    if (!startDateValue || !startTimeValue || !endDateValue) {
      return null;
    }

    if (!endTimeValue?.trim()) {
      return { required: true };
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

  startTimeValidator(control: AbstractControl): ValidationErrors | null {
    const sendTimeFormValue = this.formGroup?.value;
    const startTimeValue = control.value;
    const startDateValue = sendTimeFormValue?.start_date;
    const hasEditEndDate =
      !!this.isSetEndDateControl?.value && !this.isCreateMode;

    if (!startDateValue || !startTimeValue || hasEditEndDate) {
      return null;
    }

    if (!startTimeValue?.trim()) {
      return { required: true };
    }

    const [startHours, startMinutes] = (startTimeValue || '')
      .split(':')
      .map(Number);
    const start_date_time = new Date(startDateValue);
    start_date_time.setHours(startHours, startMinutes, 0, 0);
    const currentDateTime = new Date();

    if (start_date_time < currentDateTime) {
      return { invalidStartTime: true };
    }

    return null;
  }

  getMinEndDate() {
    const startDate = new Date(this.startDateControl?.getRawValue());
    return startDate < this.currentDate ? this.currentDate : startDate;
  }
}
