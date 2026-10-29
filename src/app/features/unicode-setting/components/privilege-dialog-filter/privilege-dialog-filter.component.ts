import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import * as CreateEditUnicodeActions from '../../stores/create-edit-unicode/create-edit-unicode.actions';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privilege-dialog-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    DemoprojInputComponent,
  ],
  templateUrl: './privilege-dialog-filter.component.html',
  styleUrl: './privilege-dialog-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivilegeDialogFilterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  searchForm: FormGroup = this.fb.group({
    commonSearch: [''],
  });

  onSearch() {
    const formValues = this.searchForm.value;
    this.store.dispatch(
      CreateEditUnicodeActions.setPrivilegeSearchFilter({
        filters: {
          keyword: (formValues.commonSearch || '').trim(),
        },
      })
    );
  }

  resetForm() {
    this.searchForm.reset();
    this.onSearch();
  }
}
