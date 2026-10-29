import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import * as PrivilegeRedemptionReportsActions from '../../stores/privilede-redemption-report-list/privilege-redemption-report-list.actions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';
import { DemoprojInputComponent } from '@app/shared/components/demoproj-input/demoproj-input.component';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { CommonModule } from '@angular/common';
import { PrivilegeRedemptionReportQueryParams } from '../../models/privilede-redemption-report-query-params.model';
import { PrivilegeTypeEnum } from '@app/shared/utils/enums/privilege-type.enums';
import { ValueCode } from '@app/shared/models/value-code.model';

@Component({
  selector: 'app-privilege-redemption-report-filter',
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
    DemoprojInputComponent,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './privilege-redemption-report-filter.component.html',
  styleUrl: './privilege-redemption-report-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivilegeRedemptionReportFilterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  listLoading$ = this.store.select(
    selectIsLoading('getPrivilegeRedemptionReport')
  );

  privilegeTypeValuesOptions: ValueCode<string>[] = [
    { value: 'E-Voucher', code: PrivilegeTypeEnum.E_VOUCHER },
    { value: 'Delivery', code: PrivilegeTypeEnum.DELIVERY },
    { value: 'Booking', code: PrivilegeTypeEnum.BOOKING },
    { value: 'Healthcare', code: PrivilegeTypeEnum.HEALTH_CARE },
  ];

  searchForm: FormGroup = this.fb.group({
    keyword: [''],
    privilege_types: null,
    from_date_time: '',
    to_date_time: '',
    expected_zone_id: '',
  });

  hasFilter(filters: Partial<PrivilegeRedemptionReportQueryParams>): boolean {
    if (!filters) return false;
    return (
      !!(filters.keyword && filters.keyword.trim()) ||
      !!filters.privilege_types ||
      !!filters.from_date_time ||
      !!filters.to_date_time
    );
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

    let privilege_types = formValues.privilege_types;

    this.store.dispatch(
      PrivilegeRedemptionReportsActions.setPrivilegeRedemptionReportFilters({
        filters: {
          keyword: (formValues.keyword || '').trim(),
          privilege_types,
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
    this.store.dispatch(
      PrivilegeRedemptionReportsActions.resetPrivilegeRedemptionReportsFilters()
    );
  }
}
