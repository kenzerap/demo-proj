import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnInit,
  Optional,
  Output,
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
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';

import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { GroupItem, GroupOption } from './models/group-option.model';
import { OverlayModule } from '@angular/cdk/overlay';
import { ValueCode } from '@app/shared/models/value-code.model';

@Component({
  selector: 'app-demoproj-autocomplete-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    OverlayModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DemoprojAutocompleteDropdownComponent),
      multi: true,
    },
  ],
  templateUrl: './demoproj-autocomplete-dropdown.component.html',
  styleUrl: './demoproj-autocomplete-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoprojAutocompleteDropdownComponent<T extends object = {}>
  extends BaseComponent
  implements OnInit, ControlValueAccessor
{
  private changeDetectorRef = inject(ChangeDetectorRef);
  @Optional() private controlContainer = inject(ControlContainer);

  @Input() formControlName!: string;
  @Input() maxLength = 255;
  @Input() formFieldGray = false;
  @Input() isGrouped = false;

  _groupOptions: GroupOption<T>[] = [];
  @Input() set groupOptions(value: GroupOption<T>[]) {
    this._groupOptions = value;
    this.filteredGroupOptions = this.filterGroup(this.formControl?.value || '');

    if (this.formControl?.value) {
      this.formControl.setValue(this.formControl?.value, { emitEvent: false });
    }
  }
  get groupOptions(): GroupOption<T>[] {
    return this._groupOptions;
  }

  _nonGroupOptions: ValueCode[] = [];
  @Input() set nonGroupOptions(value: ValueCode[]) {
    this._nonGroupOptions = value;
    this.filteredNonGroupOptions = this.filterNonGroup(
      this.formControl?.value || ''
    );

    if (this.formControl?.value) {
      this.formControl.setValue(this.formControl?.value, { emitEvent: false });
    }
  }
  get nonGroupOptions(): ValueCode[] {
    return this._nonGroupOptions;
  }

  @Output() optionSelected = new EventEmitter();

  formControl = new FormControl<string | null>('');
  selectedCode: string | null = null;

  filteredGroupOptions: GroupOption<T>[] = [];
  filteredNonGroupOptions: ValueCode[] = [];

  ngOnInit(): void {
    if (this.controlContainer && this.formControlName) {
      this.updateValidators();

      this.formControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.updateFilteredOptions(value || '');
        });

      this.formControl.valueChanges
        .pipe(
          takeUntil(this.destroy$),
          filter(
            () =>
              (this.formControl.touched || this.formControl.dirty) &&
              !!this.selectedCode
          )
        )
        .subscribe(() => {
          this.selectedCode = '';
          this.onChange('');
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
    this.onOptionSelected({
      option: {
        value: value,
        viewValue: value,
        selected: true,
      },
    } as MatAutocompleteSelectedEvent);
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
    this.formControl.setErrors(
      this.controlContainer.control?.get(this.formControlName)?.errors || null
    );
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const code = event.option.value;
    this.selectedCode = code;
    this.onChange(code);

    this.updateFilteredOptions(code);
    this.optionSelected.emit(event);
  }

  filterGroup(value: string): GroupOption<T>[] {
    if (value) {
      return this.groupOptions
        .map((group) => {
          return {
            groupName: group.groupName,
            groupItems: this.filterItem(group.groupItems, value),
          };
        })
        .filter((group) => group.groupItems.length > 0);
    }

    return this.groupOptions;
  }

  filterItem = (opt: GroupItem<T>[], value: string): GroupItem<T>[] => {
    const filterValue = value.toLowerCase();

    return opt.filter((item) => item.value.toLowerCase().includes(filterValue));
  };

  filterNonGroup(value: string): ValueCode[] {
    return value
      ? this.nonGroupOptions.filter((item) =>
          item.value.toLowerCase().includes(value.toLowerCase())
        )
      : this.nonGroupOptions;
  }

  displayFn = (code: string | null): string => {
    if (this.isGrouped) {
      const item = this.groupOptions.flatMap((group) =>
        group.groupItems.filter((item) => item.code === code)
      )[0];

      return item ? item.value : '';
    } else {
      const item = this.nonGroupOptions.find((item) => item.code === code);
      return item ? item.value : '';
    }
  };

  updateFilteredOptions(value: string) {
    if (this.isGrouped) {
      this.filteredGroupOptions = this.filterGroup(value || '');
    } else {
      this.filteredNonGroupOptions = this.filterNonGroup(value || '');
    }
  }

  selectedItemStyle() {
    return {
      'background-color': 'var(--mat-option-selected-state-layer-color)',
      color: 'var(--mat-option-selected-state-label-text-color)',
    };
  }
}
