import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { redeemLimitConditions } from '../../constants/redeem-limit-condition-options.const';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { RedeemLimitCondition } from '@app/shared/utils/enums/redeem-limit-condition.enums';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-redeem-limit-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    DemoprojInputComponent,
  ],
  templateUrl: './redeem-limit-section.component.html',
  styleUrl: './redeem-limit-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedeemLimitSectionComponent
  extends BaseComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;

  redeemLimitConditionOptions: ValueCode[] = redeemLimitConditions;
  redeemLimitConditions = RedeemLimitCondition;

  get conditionControl() {
    return this.formGroup?.get('condition');
  }
  get quotaControl() {
    return this.formGroup?.get('quota');
  }
  get isAdvanceControl() {
    return this.formGroup?.get('is_advance');
  }

  ngOnInit(): void {
    this.conditionControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        switch (value) {
          case RedeemLimitCondition.ONE_TIME_REDEEM:
            this.quotaControl?.patchValue(1);
            this.quotaControl?.setValidators([
              Validators.required,
              Validators.min(0),
            ]);
            break;
          case RedeemLimitCondition.UNLIMITED_REDEEM:
            this.quotaControl?.setValidators([]);
            this.quotaControl?.reset();
            break;

          default:
            this.quotaControl?.reset();
            this.quotaControl?.setValidators([
              Validators.required,
              Validators.min(1),
            ]);
            break;
        }
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
}
