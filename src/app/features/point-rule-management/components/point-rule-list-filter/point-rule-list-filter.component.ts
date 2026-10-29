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
import * as PointRuleListActions from '../../stores/point-rule-list/point-rule-list.actions';
import * as PointRuleSelectors from '../../stores/point-rule-list/point-rule-list.selectors';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { CommonModule } from '@angular/common';
import { map, Observable, takeUntil } from 'rxjs';
import { BaseComponent } from '@app/shared/components/base/base.component';

@Component({
  selector: 'app-point-rule-list-filter',
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
  templateUrl: './point-rule-list-filter.component.html',
  styleUrl: './point-rule-list-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointRuleListFilterComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private store = inject(Store);

  selectCommonSearch$: Observable<string> = this.store
    .select(PointRuleSelectors.selectPointRuleFilters)
    .pipe(map((filters) => filters.keyword || ''));

  searchForm: FormGroup = this.fb.group({
    commonSearch: [''],
  });

  ngOnInit(): void {
    this.selectCommonSearch$
      .pipe(takeUntil(this.destroy$))
      .subscribe((keyword) => {
        this.searchForm.patchValue({ commonSearch: keyword });
      });
  }

  onSearch() {
    const formValues = this.searchForm.value;
    this.store.dispatch(
      PointRuleListActions.setPointRuleFilters({
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
