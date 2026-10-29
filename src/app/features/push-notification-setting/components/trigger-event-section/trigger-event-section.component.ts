import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { triggerEventOptions } from './trigger-event-options.const';
import { TriggerEventType } from '@app/shared/utils/enums/trigger-event-type.enum';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { takeUntil } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DemoprojInputComponent } from "../../../../shared/components/demoproj-input/demoproj-input.component";

@Component({
  selector: 'app-trigger-event-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    DemoprojInputComponent
],
  templateUrl: './trigger-event-section.component.html',
  styleUrl: './trigger-event-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriggerEventSectionComponent
  extends BaseComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;
  @Output() changeTriggerEventType = new EventEmitter<TriggerEventType>();

  get triggerEventTypeControl() {
    return this.formGroup?.get('trigger_event_type');
  }
  get triggerEventConditionControl() {
    return this.formGroup?.get('trigger_event_condition');
  }
  get triggerEventValueControl() {
    return this.formGroup?.get('trigger_event_value');
  }
  get triggerEventUnitControl() {
    return this.formGroup?.get('trigger_event_unit');
  }

  compareConditionType = CompareConditionType;
  triggerEventType = TriggerEventType;
  eventOptions: ValueCode<TriggerEventType>[] = triggerEventOptions;
  conditionOptions: ValueCode<CompareConditionType>[] = [
    { value: 'Is', code: CompareConditionType.Is },
    { value: 'Before', code: CompareConditionType.Before },
  ];
  unitOptions: ValueCode[] = [
    { value: 'Day', code: 'day' },
    { value: '-', code: '-' },
  ];

  ngOnInit(): void {
    switch (this.triggerEventTypeControl?.value) {
      case TriggerEventType.ClaimStatus:
        this.conditionOptions = [
          { value: 'Is', code: CompareConditionType.Is },
        ];
        break;

      case TriggerEventType.PointsExpiryDate:
        this.conditionOptions = [
          { value: 'Is', code: CompareConditionType.Is },
          { value: 'Before', code: CompareConditionType.Before },
        ];
        break;

      case TriggerEventType.PaymentDueDate:
        this.conditionOptions = [
          { value: 'Is', code: CompareConditionType.Is },
          { value: 'Before', code: CompareConditionType.Before },
        ];
        break;

      default:
        break;
    }

    this.triggerEventTypeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: TriggerEventType) => {
        switch (value) {
          case TriggerEventType.ClaimStatus:
            this.conditionOptions = [
              { value: 'Is', code: CompareConditionType.Is },
            ];
            this.triggerEventConditionControl?.patchValue(
              CompareConditionType.Is
            );
            break;

          case TriggerEventType.PointsExpiryDate:
            this.conditionOptions = [
              { value: 'Is', code: CompareConditionType.Is },
              { value: 'Before', code: CompareConditionType.Before },
            ];
            this.triggerEventUnitControl?.reset('day', { emitEvent: false });
            this.triggerEventConditionControl?.patchValue(
              CompareConditionType.Before
            );
            break;

          case TriggerEventType.PaymentDueDate:
            this.conditionOptions = [
              { value: 'Is', code: CompareConditionType.Is },
              { value: 'Before', code: CompareConditionType.Before },
            ];
            this.triggerEventUnitControl?.reset('day', { emitEvent: false });
            this.triggerEventConditionControl?.patchValue(
              CompareConditionType.Before
            );
            break;

          default:
            break;
        }

        this.changeTriggerEventType.emit(value);
      });

    this.triggerEventConditionControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: CompareConditionType) => {
        if (value === CompareConditionType.Is) {
          const triggerEventTypeValue: TriggerEventType =
            this.triggerEventTypeControl?.value;

          switch (triggerEventTypeValue) {
            case TriggerEventType.ClaimStatus:
              this.triggerEventValueControl?.patchValue('Updated');
              this.triggerEventValueControl?.disable();
              break;

            default:
              this.triggerEventValueControl?.patchValue('Today');
              this.triggerEventValueControl?.disable();
              break;
          }

          this.triggerEventUnitControl?.patchValue('-');
        } else {
          this.triggerEventValueControl?.setValidators([
            Validators.required,
            Validators.min(0),
          ]);
          this.triggerEventValueControl?.reset();
          this.triggerEventValueControl?.enable();
          this.triggerEventUnitControl?.patchValue('day');
        }
      });
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value ||
      'None'
    );
  }
}
