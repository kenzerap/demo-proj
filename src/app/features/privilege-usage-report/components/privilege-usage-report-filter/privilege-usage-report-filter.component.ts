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
import * as PrivilegeUsageReportsActions from '../../stores/privilege-usage-report-list/privilege-usage-report-list.actions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';
import { MatSelectModule } from '@angular/material/select';
import {
  PrivilegeStatusEnum,
  privilegeStatusToBoolean,
} from '../../utils/privilege-status.enum';
import { PrivilegeUsageReportQueryParams } from '../../models/privilege-usage-report-query-params.model';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-privilege-usage-report-filter',
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
  templateUrl: './privilege-usage-report-filter.component.html',
  styleUrl: './privilege-usage-report-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivilegeUsageReportFilterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  privilegeStatusLists = Object.values(PrivilegeStatusEnum);

  listLoading$ = this.store.select(selectIsLoading('getPrivilegeUsageReports'));

  searchForm: FormGroup = this.fb.group({
    is_published: null,
    start_date_time_from: '',
    start_date_time_to: '',
    end_date_time_from: '',
    end_date_time_to: '',
    expected_zone_id: '',
  });

  hasFilter(filters: Partial<PrivilegeUsageReportQueryParams>): boolean {
    if (!filters) return false;
    return (
      (filters.is_published !== null && filters.is_published !== undefined) ||
      !!filters.start_date_time_from ||
      !!filters.start_date_time_to ||
      !!filters.end_date_time_from ||
      !!filters.end_date_time_to
    );
  }
  onSearch() {
    const formValues = this.searchForm.value;
    if (!this.hasFilter(formValues)) {
      return;
    }
    const fromDate = formValues.start_date_time_from
      ? new Date(formValues.start_date_time_from)
      : null;
    if (fromDate) fromDate.setHours(0, 0, 0, 0);
    const toDate = formValues.start_date_time_to
      ? new Date(formValues.start_date_time_to)
      : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);
    const fromDateEnd = formValues.end_date_time_from
      ? new Date(formValues.end_date_time_from)
      : null;
    if (fromDateEnd) fromDateEnd.setHours(0, 0, 0, 0);
    const toDateEnd = formValues.end_date_time_to
      ? new Date(formValues.end_date_time_to)
      : null;
    if (toDateEnd) toDateEnd.setHours(23, 59, 59, 999);
    const is_published = privilegeStatusToBoolean(formValues.is_published);
    this.store.dispatch(
      PrivilegeUsageReportsActions.setPrivilegeUsageReportsFilters({
        filters: {
          is_published,
          start_date_time_from: fromDate ? fromDate.toISOString() : '',
          start_date_time_to: toDate ? toDate.toISOString() : '',
          end_date_time_from: fromDateEnd ? fromDateEnd.toISOString() : '',
          end_date_time_to: toDateEnd ? toDateEnd.toISOString() : '',
          page: 0,
          size: 20,
          expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      })
    );
  }

  resetForm() {
    this.searchForm.reset({
      is_published: null,
      start_date_time_from: '',
      start_date_time_to: '',
      end_date_time_from: '',
      end_date_time_to: '',
      expected_zone_id: '',
    });
    this.store.dispatch(
      PrivilegeUsageReportsActions.resetPrivilegeUsageReportsFilters()
    );
  }
}
