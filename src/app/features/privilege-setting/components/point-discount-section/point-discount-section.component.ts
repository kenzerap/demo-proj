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

@Component({
  selector: 'app-point-discount-section',
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
  templateUrl: './point-discount-section.component.html',
  styleUrl: './point-discount-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointDiscountSectionComponent
  extends BaseComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;

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

  ngOnInit(): void {}

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }
}
