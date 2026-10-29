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
import { BaseComponent } from '@app/shared/components/base/base.component';
import { combineLatest, filter, Observable, take, takeUntil } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { timePickerFormatValidator } from '@app/shared/utils/time-picker-format-validator';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { SvgDefaultImageComponent } from '../../../../shared/icons/svg-default-image/svg-default-image.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {
  DragDropUploadDirective,
  FileDragDrop,
} from '@app/shared/directives/drag-drop-upload.directive';
import { getImageSizeOser } from '@app/shared/utils/get-image-size';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { Store } from '@ngrx/store';
import * as CreateEditSplashScreenActions from '@app/features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.actions';
import * as CreateEditSplashScreenSelectors from '@app/features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.selectors';
import { checkImageMimeType } from '@app/shared/utils/check-image-mime-type';
import { SplashScreenDetail } from '../../models/splash-screen-management.model';

const IMAGE_WIDTH = 1030;
const IMAGE_HEIGHT = 768;

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
    MatSlideToggleModule,
    MatCheckboxModule,
    DemoprojInputComponent,
    SvgDefaultImageComponent,
    MatButtonModule,
    MatDividerModule,
    DragDropUploadDirective,
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
  @Input() splashScreenDetail: SplashScreenDetail | null = null;

  pushNotificationType = TimePeriodType;
  sendTimeTypes: ValueCode[] = [
    { value: 'Specific time', code: TimePeriodType.SPECIFIC_TIME },
    { value: 'Immediately', code: TimePeriodType.IMMEDIATELY },
  ];
  imageNameUploaded: WritableSignal<string> = signal<string>('Upload file');
  splashScreenDisplayOrders: WritableSignal<number[]> = signal([]);

  splashScreenDisplayOrders$: Observable<number[]> = this.store.select(
    CreateEditSplashScreenSelectors.selectSplashScreenDisplayOrders
  );

  get sendTimeTypeControl() {
    return this.formGroup?.get('send_time_type');
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
  get isSetEndDateControl() {
    return this.formGroup?.get('isSetEndDate');
  }
  get isActiveControl() {
    return this.formGroup?.get('is_active');
  }
  get nameEnControl() {
    return this.formGroup?.get('name_en');
  }
  get nameThControl() {
    return this.formGroup?.get('name_th');
  }
  get descriptionEnControl() {
    return this.formGroup?.get('description_en');
  }
  get descriptionThControl() {
    return this.formGroup?.get('description_th');
  }
  get displayOrderControl() {
    return this.formGroup?.get('display_order');
  }
  get imageFileControl() {
    return this.formGroup?.get('imageFile');
  }
  get imageUrlControl() {
    return this.formGroup?.get('imageUrl');
  }
  get imageNameControl() {
    return this.formGroup?.get('imageName');
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
        this.isSetEndDateControl?.reset(false, { emitEvent: false });

        this.formGroup.markAsUntouched();
        this.reValidateForm(value);
      });

    this.isSetEndDateControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(
          () => this.sendTimeTypeControl?.value === TimePeriodType.SPECIFIC_TIME
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

    this.displayOrderControl?.setValidators([
      Validators.required,
      Validators.min(1),
      (control: AbstractControl) => this.displayOrdersValidator(control),
    ]);
    this.splashScreenDisplayOrders$
      .pipe(
        filter((displayOrders) => displayOrders.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe((displayOrders) => {
        this.splashScreenDisplayOrders.set(displayOrders);
      });

    this.imageFileControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((file) => !!file?.name)
      )
      .subscribe((file: File) => {
        this.imageNameUploaded.set(file.name || '');
      });

    combineLatest([
      this.imageUrlControl?.valueChanges || [],
      this.imageNameControl?.valueChanges || [],
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(([url, name]) => !!url && !!name)
      )
      .subscribe(([url, name]) => {
        this.imageNameUploaded.set(name || '');
      });

    this.store.dispatch(CreateEditSplashScreenActions.getSplashScreenDisplayOrders());
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
    const endDateValue = sendTimeFormValue?.end_date;
    const endTimeValue = sendTimeFormValue?.end_time;

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

    const [endHours, endMinutes] = (endTimeValue || '').split(':').map(Number);
    const end_date_time = new Date(endDateValue);
    end_date_time.setHours(endHours, endMinutes, 0, 0);
    const currentDateTime = new Date();

    if (start_date_time < currentDateTime) {
      return { invalidStartTime: true };
    }

    return null;
  }

  displayOrdersValidator(control: AbstractControl): ValidationErrors | null {
    const value = Number(control.value) || 0;
    if (!value || value === this.splashScreenDetail?.display_order) {
      return null;
    }

    if (this.splashScreenDisplayOrders().includes(value)) {
      return { displayOrderExists: true };
    }

    return null;
  }

  onFileDropped(fileDragDrop: FileDragDrop) {
    const isValidImage = checkImageMimeType(fileDragDrop.file);
    const isStandardSize =
      fileDragDrop.size?.height === IMAGE_HEIGHT &&
      fileDragDrop.size?.width === IMAGE_WIDTH;
    if (isStandardSize && isValidImage) {
      this.imageFileControl?.patchValue(fileDragDrop.file);
    } else {
      this.openWarningFileSizeDialog();
    }
  }

  /* istanbul ignore next */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const isValidImage = checkImageMimeType(input.files[0]);

      getImageSizeOser(input.files[0])
        .pipe(take(1))
        .subscribe((size: { width: number; height: number } | null) => {
          if (
            size?.height === IMAGE_HEIGHT &&
            size?.width === IMAGE_WIDTH &&
            input.files?.[0] &&
            isValidImage
          ) {
            this.imageFileControl?.patchValue(input.files?.[0]);
          } else {
            input.value = '';
            this.openWarningFileSizeDialog();
          }
        });
    }
  }

  openWarningFileSizeDialog() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'The file you uploaded is not supported.',
        message: `Please upload a file in one of the following format SVG, PNG, JPG or GIF (${IMAGE_WIDTH} x ${IMAGE_HEIGHT} px)`,
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'warning',
      },
    });
  }
}
