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
import * as DisabledClaimByPolicyNoListActions from '../../stores/disabled-claim-by-policy-no-list/disabled-claim-by-policy-no-list.actions';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-disabled-claim-by-policy-no-list-filter',
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
  templateUrl: './disabled-claim-by-policy-no-list-filter.component.html',
  styleUrl: './disabled-claim-by-policy-no-list-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisabledClaimByPolicyNoListFilterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  searchForm: FormGroup = this.fb.group({
    commonSearch: [''],
  });

  onSearch() {
    const formValues = this.searchForm.value;
    this.store.dispatch(
      DisabledClaimByPolicyNoListActions.setDisabledClaimPolicyFilters({
        filters: {
          keyword: (formValues.commonSearch || '').trim(),
          page: 0,
        },
      }),
    );
  }

  resetForm() {
    this.searchForm.reset();
    this.onSearch();
  }
}
