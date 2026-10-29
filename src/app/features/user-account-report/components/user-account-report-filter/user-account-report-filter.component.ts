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
import * as UserAccountReportsActions from '../../stores/user-account-report-list/user-account-report-list.actions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';
import { MatSelectModule } from '@angular/material/select';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { CommonModule } from '@angular/common';
import { UserType } from '../../utils/privilege-status.enum';
import { UserAccountReportQueryParams } from '../../models/user-account-report-query-params.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-account-report-filter',
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
    MatCardModule,
  ],
  templateUrl: './user-account-report-filter.component.html',
  styleUrl: './user-account-report-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccountReportFilterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  userTypes = Object.values(UserType);

  listLoading$ = this.store.select(selectIsLoading('getUserAccountReports'));

  searchForm: FormGroup = this.fb.group({
    user_types: [],
    from_date_time: '',
    to_date_time: '',
    expected_zone_id: '',
  });

  hasFilter(filters: Partial<UserAccountReportQueryParams>): boolean {
    if (!filters) return false;
    const hasUserTypes = Array.isArray(filters.user_types)
      ? filters.user_types.length > 0
      : !!filters.user_types;
    return hasUserTypes || !!filters.from_date_time || !!filters.to_date_time;
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
    let user_types = formValues.user_types ?? [];
    this.store.dispatch(
      UserAccountReportsActions.setUserAccountReportsFilters({
        filters: {
          user_types,
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
    this.searchForm.reset({
      user_types: [],
      from_date_time: '',
      to_date_time: '',
      expected_zone_id: '',
    });
    this.store.dispatch(
      UserAccountReportsActions.resetUserAccountReportsFilters()
    );
    this.store.dispatch(
      UserAccountReportsActions.getUserAccountReportTotals({
        params: {
          user_types: [],
        },
      })
    );
  }
}
