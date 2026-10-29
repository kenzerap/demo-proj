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
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-package-setting-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    DemoprojInputComponent,
  ],
  templateUrl: './package-setting-section.component.html',
  styleUrl: './package-setting-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageSettingSectionComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  get publishedControl() {
    return this.formGroup?.get('published');
  }
  get packageNameControl() {
    return this.formGroup?.get('name');
  }
  get descriptionControl() {
    return this.formGroup?.get('description');
  }

  ngOnInit(): void {}
}
