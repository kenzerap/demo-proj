import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-criteria-checkin-rule-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    DemoprojInputComponent,
    SvgPlusComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
  ],
  templateUrl: './criteria-checkin-rule-section.component.html',
  styleUrl: './criteria-checkin-rule-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriteriaCheckinRuleSectionComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  get rulesFormArray(): FormArray {
    return this.formGroup.get('criteria_checkin_rules') as FormArray;
  }

  ngOnInit(): void {}

  addRule() {
    const length = this.rulesFormArray.controls.length;
    this.rulesFormArray.push(
      this.fb.group({
        checkin_day: [
          { value: length + 1, disabled: true },
          [Validators.required, Validators.min(1)],
        ],
        earning_point: ['', [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeCondition(index: number) {
    this.rulesFormArray.removeAt(index);

    this.rulesFormArray.controls.forEach((control, i) => {
      const checkinDayControl = control.get('checkin_day');
      if (checkinDayControl) {
        checkinDayControl.patchValue(i + 1);
      }
    });
  }
}
