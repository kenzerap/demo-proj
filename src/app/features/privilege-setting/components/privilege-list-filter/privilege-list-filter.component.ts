import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
import * as PrivilegeListActions from '../../stores/privilege/privilege.actions';
import * as privilegesSelectors from '../../stores/privilege/privilege.selectors';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { CommonModule } from '@angular/common';
import { map, Observable, takeUntil } from 'rxjs';
import { BaseComponent } from '@app/shared/components/base/base.component';

@Component({
  selector: 'app-privilege-list-filter',
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
  templateUrl: './privilege-list-filter.component.html',
  styleUrl: './privilege-list-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivilegeListFilterComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private store = inject(Store);

  selectCommonSearch$: Observable<string> = this.store
    .select(privilegesSelectors.selectPrivilegeSettingFilters)
    .pipe(map((filters) => filters.keyword || ''));

  selectPrivilegeId$: Observable<string> = this.store
    .select(privilegesSelectors.selectPrivilegeSettingFilters)
    .pipe(map((filters) => filters.privilegeId || ''));

  searchForm: FormGroup = this.fb.group({
    commonSearch: [''],
    privilegeId: [''],
  });

  ngOnInit(): void {
    this.selectCommonSearch$
      .pipe(takeUntil(this.destroy$))
      .subscribe((keyword) => {
        this.searchForm.patchValue({ commonSearch: keyword });
      });
    this.selectPrivilegeId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((privilegeId) => {
        this.searchForm.patchValue({ privilegeId });
      });
  }

  onSearch() {
    const formValues = this.searchForm.value;
    this.store.dispatch(
      PrivilegeListActions.setPrivilegeSettingsFilter({
        filters: {
          keyword: (formValues.commonSearch || '').trim(),
          privilegeId: (formValues.privilegeId || '').trim(),
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
