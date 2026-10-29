import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
  WritableSignal,
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
import { take, takeUntil } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { timePickerFormatValidator } from '@app/shared/utils/time-picker-format-validator';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  CategoryCode,
  categoryOptions,
} from '../../constants/category-options.const';

@Component({
  selector: 'app-home-base-setting-section',
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
    MatButtonModule,
    MatDividerModule,
    MatSelectModule,
  ],
  providers: [DatePipe],
  templateUrl: './home-base-setting-section.component.html',
  styleUrl: './home-base-setting-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeBaseSettingSectionComponent
  extends BaseComponent
  implements OnInit
{
  private dialog = inject(MatDialog);
  private store = inject(Store);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  pushNotificationType = TimePeriodType;
  categoryOptions: ValueCode<CategoryCode>[] = categoryOptions;

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
  get sectionNameControl() {
    return this.formGroup?.get('sectionName');
  }
  get descriptionControl() {
    return this.formGroup?.get('description');
  }
  get categoryControl() {
    return this.formGroup?.get('category');
  }

  currentDate = new Date();

  ngOnInit(): void {
    this.reValidateForm();

    this.isSetEndDateControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
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
        }, 0);
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
      (control: AbstractControl) => this.startTimeValidator(control),
    ]);
    this.endDateControl?.setValidators([]);
    this.endTimeControl?.setValidators([]);

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

    if (!startDateValue || !startTimeValue || this.formMode !== 'create') {
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
}
