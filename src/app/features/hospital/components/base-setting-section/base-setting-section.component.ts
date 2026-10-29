import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';

@Component({
  selector: 'app-base-setting-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    DemoprojInputComponent,
  ],
  templateUrl: './base-setting-section.component.html',
  styleUrl: './base-setting-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseSettingSectionComponent
  extends BaseComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  get nameControl() {
    return this.formGroup?.get('name');
  }
  get descriptionControl() {
    return this.formGroup?.get('description');
  }
  get isPublishedControl() {
    return this.formGroup?.get('is_published');
  }

  ngOnInit(): void {}
}
