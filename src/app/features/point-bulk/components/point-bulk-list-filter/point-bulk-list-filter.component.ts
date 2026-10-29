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
import * as PointBulkListActions from '../../stores/point-bulk-list/point-bulk-list.actions';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-point-bulk-list-filter',
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
  templateUrl: './point-bulk-list-filter.component.html',
  styleUrl: './point-bulk-list-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointBulkListFilterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  searchForm: FormGroup = this.fb.group({
    commonSearch: [''],
  });

  onSearch() {
    const formValues = this.searchForm.value;
    this.store.dispatch(
      PointBulkListActions.setPointBulkFilters({
        filters: {
          keyword: (formValues.commonSearch || '').trim(),
          page: 0,
        },
      })
    );
  }

  resetForm() {
    this.searchForm.reset();
    this.onSearch();
  }
}
