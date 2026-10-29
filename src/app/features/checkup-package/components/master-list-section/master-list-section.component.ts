import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';

@Component({
  selector: 'app-master-list-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    DemoprojInputComponent,
  ],
  providers: [DatePipe],
  templateUrl: './master-list-section.component.html',
  styleUrl: './master-list-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterListSectionComponent extends BaseComponent {
  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  get nameEnControl() {
    return this.formGroup?.get('package_name_en');
  }
  get nameThControl() {
    return this.formGroup?.get('package_name_th');
  }
}
