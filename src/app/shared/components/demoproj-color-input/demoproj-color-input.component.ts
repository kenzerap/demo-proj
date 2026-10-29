import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Input,
  OnInit,
  Optional,
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
import { MatInputModule } from '@angular/material/input';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { ColorPickerDirective } from 'ngx-color-picker';

@Component({
  selector: 'app-demoproj-color-input',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ColorPickerDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DemoprojColorInputComponent),
      multi: true,
    },
  ],
  templateUrl: './demoproj-color-input.component.html',
  styleUrl: './demoproj-color-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoprojColorInputComponent
  extends BaseComponent
  implements OnInit, ControlValueAccessor
{
  @Optional() private controlContainer = inject(ControlContainer);

  @Input() formControlName!: string;
  @Input() maxLength = 255;
  @Input() disabled: boolean = false;

  formControl = new FormControl<string | null>(null);
  color = '';

  ngOnInit(): void {
    if (this.controlContainer && this.formControlName) {
      this.updateValidators();

      this.formControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.color = value || '';
        });

      this.formControl.valueChanges
        .pipe(
          takeUntil(this.destroy$),
          filter(() => this.formControl.touched || this.formControl.dirty)
        )
        .subscribe((value) => {
          this.onChange(value);
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

  onBlur() {
    this.onTouched();
  }

  updateValidators() {
    this.formControl.setValidators(
      this.controlContainer.control?.get(this.formControlName)?.validator ||
        null
    );
    this.formControl.updateValueAndValidity({ emitEvent: false });
  }

  trimSpaces() {
    const value = this.formControl.value || '';
    this.formControl.setValue(value.trim(), { emitEvent: false });
  }

  colorChange(color: any) {
    this.formControl.setValue(color);
    this.onChange(color);
  }
}
