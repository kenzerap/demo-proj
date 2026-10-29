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
import * as PointTransactionReportsActions from '../../stores/point-transaction-report-list/point-transaction-report-list.actions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';
import { MatSelectModule } from '@angular/material/select';
import { TransactionTypeEnum } from '../../utils/transaction-type.enum';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { PointTransactionReportQueryParams } from '../../models/point-transaction-report-query-params.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-point-transaction-report-filter',
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
  templateUrl: './point-transaction-report-filter.component.html',
  styleUrl: './point-transaction-report-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointTransactionReportFilterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  transactionTypeLists = Object.values(TransactionTypeEnum);

  listLoading$ = this.store.select(
    selectIsLoading('getPointTransactionReport')
  );

  searchForm: FormGroup = this.fb.group({
    transaction_type: null,
    from_date_time: '',
    to_date_time: '',
    expected_zone_id: '',
  });

  hasFilter(filters: Partial<PointTransactionReportQueryParams>): boolean {
    if (!filters) return false;
    return (
      !!filters.transaction_type ||
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

    let transaction_type = formValues.transaction_type;
    if (Array.isArray(transaction_type)) {
      transaction_type =
        transaction_type.length > 0 ? transaction_type.join(',') : null;
    }
    if (transaction_type === '') {
      transaction_type = null;
    }
    this.store.dispatch(
      PointTransactionReportsActions.setPointTransactionReportsFilters({
        filters: {
          transaction_type,
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
      transaction_type: null,
      from_date_time: '',
      to_date_time: '',
      expected_zone_id: '',
    });
    this.store.dispatch(
      PointTransactionReportsActions.resetPointTransactionReportsFilters()
    );
  }
}
