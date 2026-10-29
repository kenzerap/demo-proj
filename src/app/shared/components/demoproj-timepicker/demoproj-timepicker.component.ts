import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Input,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  ControlEvent,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  TouchedChangeEvent,
  ValueChangeEvent,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '../base/base.component';
import { filter, takeUntil } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { MatButtonModule, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-demoproj-timepicker',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    DatePickerModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DemoprojTimepickerComponent),
      multi: true,
    },
  ],
  templateUrl: './demoproj-timepicker.component.html',
  styleUrl: './demoproj-timepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoprojTimepickerComponent
  extends BaseComponent
  implements OnInit, ControlValueAccessor
{
  private datePipe = inject(DatePipe);
  @Optional() private controlContainer = inject(ControlContainer);
  @ViewChild('trigger') timepicker!: MatIconButton;
  @Input() formControlName!: string;
  formControl = new FormControl<string | null>(null);
  hiddenFormControl = new FormControl<Date | null>(null);

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.controlContainer && this.formControlName) {
      this.updateValidators();

      this.formControl.valueChanges
        .pipe(
          takeUntil(this.destroy$),
          filter(
            () =>
              this.formControl.touched ||
              this.formControl.dirty ||
              this.hiddenFormControl.touched ||
              this.hiddenFormControl.dirty
          )
        )
        .subscribe((value) => {
          this.onChange(value);

          this.updateHiddenFormControl(value);
        });

      this.hiddenFormControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          const convertedTime = this.datePipe.transform(value, 'HH:mm');
          this.formControl.setValue(convertedTime);
        });

      this.formControl?.events
        .pipe(takeUntil(this.destroy$))
        .subscribe((event: ControlEvent<any>) => {
          if (event instanceof TouchedChangeEvent) {
            if (event.touched) {
              this.onTouched();
            }
          }
        });

      this.controlContainer.control
        ?.get(this.formControlName)
        ?.events.pipe(takeUntil(this.destroy$))
        .subscribe((event: ControlEvent<any>) => {
          if (event instanceof TouchedChangeEvent) {
            if (event.touched) {
              this.formControl.markAsTouched();
            } else {
              this.formControl.markAsUntouched();
            }
          }
          if (event instanceof ValueChangeEvent) {
            this.updateValidators();
          }
        });
    }
  }

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.formControl.setValue(value);
    this.updateHiddenFormControl(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  openTimePicker() {
    this.timepicker._elementRef.nativeElement.click();
  }

  updateValidators() {
    this.formControl.setValidators(
      this.controlContainer.control?.get(this.formControlName)?.validator ||
        null
    );
    this.formControl.updateValueAndValidity({ emitEvent: false });
  }

  updateHiddenFormControl(value: string | null) {
    if (value) {
      const [hours, minutes] = (value || '').split(':').map(Number);
      const dateValue = new Date();
      dateValue.setHours(hours, minutes, 0, 0);
      if (isNaN(dateValue.getTime())) {
        this.hiddenFormControl.patchValue(null, { emitEvent: false });
        return;
      }

      this.hiddenFormControl.patchValue(dateValue, { emitEvent: false });
    } else {
      this.hiddenFormControl.patchValue(null, { emitEvent: false });
    }
  }
}
