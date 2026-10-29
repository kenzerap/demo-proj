import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import {
  FrequencyPeriodCode,
  frequencyPeriodOptions,
} from './frequency-options.const';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';

@Component({
  selector: 'app-setting-frequency-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    DemoprojInputComponent,
  ],
  templateUrl: './setting-frequency-section.component.html',
  styleUrl: './setting-frequency-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingFrequencySectionComponent
  extends BaseComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;
  @Input() isCreateMode!: boolean;

  selectFrequencyPeriodOptions: ValueCode[] = frequencyPeriodOptions;
  frequencyPeriodCode = FrequencyPeriodCode;

  get frequencyCapControl() {
    return this.formGroup?.get('frequencyCap');
  }
  get frequencyPeriodControl() {
    return this.formGroup?.get('frequencyPeriod');
  }

  ngOnInit(): void {
    if (this.isCreateMode) {
      this.frequencyPeriodControl?.patchValue(FrequencyPeriodCode.Day, {
        emitEvent: false,
      });
    }
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }
}
