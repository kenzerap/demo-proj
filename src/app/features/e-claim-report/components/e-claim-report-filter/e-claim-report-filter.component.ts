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
import * as EclaimReportsActions from '../../stores/e-claim-report-list/e-claim-report-list.actions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';
import { MatSelectModule } from '@angular/material/select';

import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { CommonModule } from '@angular/common';
import { EclaimReportQueryParams } from '../../models/e-claim-report-query-params.model';
@Component({
  selector: 'app-eclaim-report-filter',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    SvgCalendarComponent,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './e-claim-report-filter.component.html',
  styleUrls: ['./e-claim-report-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EclaimReportFilterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  listLoading$ = this.store.select(selectIsLoading('getEclaimReports'));

  searchForm: FormGroup = this.fb.group({
    from_date_time: '',
    to_date_time: '',
    expected_zone_id: '',
  });

  hasFilter(filters: Partial<EclaimReportQueryParams>): boolean {
    if (!filters) return false;
    return !!filters.from_date_time || !!filters.to_date_time;
  }

  onSearch() {
    const formValues = this.searchForm.value;
    if (!this.hasFilter(formValues)) {
      return;
    }
    const fromDate = formValues.from_date_time
      ? new Date(formValues.from_date_time)
      : null;
    if (fromDate) fromDate.setHours(0, 0, 0, 0);
    const toDate = formValues.to_date_time
      ? new Date(formValues.to_date_time)
      : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);
    this.store.dispatch(
      EclaimReportsActions.setEclaimReportsFilters({
        filters: {
          from_date_time: fromDate ? fromDate.toISOString() : '',
          to_date_time: toDate ? toDate.toISOString() : '',
          page: 0,
          size: 20,
          expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      })
    );
  }

  resetForm() {
    this.searchForm.reset();
    this.store.dispatch(EclaimReportsActions.resetEclaimReportsFilters());
  }
}
