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
import { filter, Observable, take, takeUntil } from 'rxjs';
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
import {
  CriteriaCode,
  criteriaOptions,
} from '../../constants/criteria-options.const';
import {
  ResetPeriodCode,
  resetPeriodOptions,
} from '../../constants/reset-period-options.const';
import {
  CountExpiryFromCode,
  countExpiryFromOptions,
} from '../../constants/count-expiry-from.const';
import {
  ExpiryConditionCode,
  expiryConditionOptions,
} from '../../constants/expiry-condition.const';
import * as createEditPointRuleSelectors from '../../stores/create-edit-point-rule/create-edit-point-rule.selectors';
import { PointRuleDetail } from '../../models/point-rule-model';

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
    MatButtonModule,
    MatDividerModule,
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
  private dialog = inject(MatDialog);
  private store = inject(Store);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  pushNotificationType = TimePeriodType;
  categoryOptions: ValueCode<CategoryCode>[] = categoryOptions;
  countExpiryFromOptions: ValueCode<CountExpiryFromCode>[] =
    countExpiryFromOptions;
  expiryConditionOptions: ValueCode<ExpiryConditionCode>[] =
    expiryConditionOptions;
  expiryConditionCode = ExpiryConditionCode;
  categoryCode = CategoryCode;
  criteriaOptions: ValueCode<CriteriaCode>[] = criteriaOptions;
  criteriaCode = CriteriaCode;
  resetPeriodOptions: ValueCode<ResetPeriodCode>[] = resetPeriodOptions;
  imageNameUploaded: WritableSignal<string> = signal<string>('Upload file');

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
  get isSetEndDateControl() {
    return this.formGroup?.get('isSetEndDate');
  }
  get nameControl() {
    return this.formGroup?.get('name');
  }
  get descriptionControl() {
    return this.formGroup?.get('description');
  }
  get isPublishedControl() {
    return this.formGroup?.get('is_published');
  }
  get categoryControl() {
    return this.formGroup?.get('category');
  }
  get countExpiryFromControl() {
    return this.formGroup?.get('count_expiry_from');
  }
  get expiryConditionControl() {
    return this.formGroup?.get('expiry_condition');
  }
  get expiryDateDurationControl() {
    return this.formGroup?.get('expiry_date_duration');
  }
  get criteriaTypeControl() {
    return this.formGroup?.get('criteria_type');
  }
  get criteriaResetPeriodControl() {
    return this.formGroup?.get('criteria_reset_period');
  }

  currentDate = new Date();

  pointRuleDetail$: Observable<PointRuleDetail | null> = this.store.select(
    createEditPointRuleSelectors.selectPointRuleDetail
  );

  updateProductBasedRuleControls() {
    this.countExpiryFromControl?.updateValueAndValidity();
    this.expiryConditionControl?.updateValueAndValidity();
    this.expiryDateDurationControl?.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.reValidateForm();

    this.pointRuleDetail$
      .pipe(
        filter((pointRuleDetail) => !!pointRuleDetail),
        take(1)
      )
      .subscribe((pointRuleDetail: PointRuleDetail) => {
        switch (pointRuleDetail.count_expiry_from) {
          case CountExpiryFromCode.PremiumPaidDate:
            this.expiryConditionOptions = [
              {
                value: 'End of next calendar year',
                code: ExpiryConditionCode.EndOfNextCalendarYear,
              },
            ];
            break;

          default:
            this.expiryConditionOptions = [...expiryConditionOptions];
            break;
        }

        this.reValidateForm();
      });

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

    this.categoryControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        switch (value) {
          case CategoryCode.ProductBasedRule:
            this.countExpiryFromControl?.patchValue(
              CountExpiryFromCode.EarningPointDate
            );

            this.countExpiryFromControl?.setValidators([Validators.required]);
            this.expiryConditionControl?.setValidators([Validators.required]);

            if (
              this.expiryConditionControl?.value ===
              ExpiryConditionCode.SetExpiryValue
            ) {
              this.expiryDateDurationControl?.setValidators([
                Validators.required,
                Validators.min(1),
              ]);
            } else {
              this.expiryDateDurationControl?.clearValidators();
            }

            this.expiryDateDurationControl?.reset();
            break;
          case CategoryCode.CriteriaBasedRule:
            this.criteriaTypeControl?.patchValue(CriteriaCode.DailyCheckIn);

            this.expiryDateDurationControl?.setValidators([
              Validators.required,
              Validators.min(1),
            ]);
            this.countExpiryFromControl?.clearValidators();
            this.expiryConditionControl?.clearValidators();
            break;
          default:
            this.expiryDateDurationControl?.reset();

            this.expiryDateDurationControl?.setValidators([
              Validators.required,
              Validators.min(1),
            ]);
            this.countExpiryFromControl?.clearValidators();
            this.expiryConditionControl?.clearValidators();
            break;
        }
      });

    this.criteriaTypeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        switch (value) {
          case CriteriaCode.FeatureEngagement:
            this.criteriaResetPeriodControl?.patchValue(ResetPeriodCode.Daily);

            this.expiryDateDurationControl?.reset();
            break;

          default:
            this.expiryDateDurationControl?.reset();
            this.criteriaResetPeriodControl?.reset();
            break;
        }
      });

    this.expiryConditionControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === ExpiryConditionCode.EndOfNextCalendarYear) {
          this.expiryDateDurationControl?.clearValidators();
          this.expiryDateDurationControl?.setValue('');
        } else {
          this.expiryDateDurationControl?.reset();
          this.expiryDateDurationControl?.setValidators([
            Validators.required,
            Validators.min(1),
          ]);
        }
        this.expiryDateDurationControl?.updateValueAndValidity();
      });

    this.countExpiryFromControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        switch (value) {
          case CountExpiryFromCode.PremiumPaidDate:
            this.expiryConditionOptions = [
              {
                value: 'End of next calendar year',
                code: ExpiryConditionCode.EndOfNextCalendarYear,
              },
            ];
            break;

          default:
            this.expiryConditionOptions = [...expiryConditionOptions];
            break;
        }
        this.expiryConditionControl?.reset(expiryConditionOptions[0].code);
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

    const categoryControlValue = this.categoryControl?.getRawValue();
    switch (categoryControlValue) {
      case CategoryCode.ProductBasedRule:
        this.countExpiryFromControl?.setValidators([Validators.required]);
        this.expiryConditionControl?.setValidators([Validators.required]);

        if (
          this.expiryConditionControl?.value ===
          ExpiryConditionCode.SetExpiryValue
        ) {
          this.expiryDateDurationControl?.setValidators([
            Validators.required,
            Validators.min(1),
          ]);
        } else {
          this.expiryDateDurationControl?.clearValidators();
        }

        break;
      case CategoryCode.CriteriaBasedRule:
        this.expiryDateDurationControl?.setValidators([
          Validators.required,
          Validators.min(1),
        ]);
        this.countExpiryFromControl?.clearValidators();
        this.expiryConditionControl?.clearValidators();
        break;
      default:
        this.expiryDateDurationControl?.setValidators([
          Validators.required,
          Validators.min(1),
        ]);
        this.countExpiryFromControl?.clearValidators();
        this.expiryConditionControl?.clearValidators();
        break;
    }
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
