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
  selector: 'app-home-display-section',
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
  templateUrl: './home-display-section.component.html',
  styleUrl: './home-display-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeDisplaySectionComponent extends BaseComponent {
  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  get titleEnControl() {
    return this.formGroup?.get('title_en');
  }
  get titleThControl() {
    return this.formGroup?.get('title_th');
  }
}
