import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-redeem-section',
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
  templateUrl: './redeem-section.component.html',
  styleUrl: './redeem-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedeemSectionComponent extends BaseComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  unitOptions: ValueCode[] = [{ code: 'POINT', value: 'Point' }];

  get valueControl() {
    return this.formGroup?.get('value');
  }
  get unitControl() {
    return this.formGroup?.get('unit');
  }
  get isAdvanceControl() {
    return this.formGroup?.get('is_advance');
  }
  get isOnlyPromotionOrUnicodeControl() {
    return this.formGroup?.get('is_only_promotion_or_unicode');
  }

  ngOnInit(): void {
    this.isOnlyPromotionOrUnicodeControl?.valueChanges
      .pipe(
        filter(() => this.formMode !== 'view'),
        takeUntil(this.destroy$)
      )
      .subscribe((isChecked) => {
        if (isChecked) {
          this.valueControl?.patchValue(0);
          this.valueControl?.disable();
        } else {
          this.valueControl?.enable();
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
