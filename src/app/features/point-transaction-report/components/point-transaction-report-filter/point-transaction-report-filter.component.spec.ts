import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointTransactionReportFilterComponent } from './point-transaction-report-filter.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';
import { DemoprojInputComponent } from '@app/shared/components/demoproj-input/demoproj-input.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import * as PointTransactionReportsActions from '../../stores/point-transaction-report-list/point-transaction-report-list.actions';

describe('PointTransactionReportFilterComponent', () => {
  let component: PointTransactionReportFilterComponent;
  let fixture: ComponentFixture<PointTransactionReportFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PointTransactionReportFilterComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        SvgCalendarComponent,
        DemoprojInputComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        MatSelectModule,
      ],
      providers: [
        provideMockStore(),
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PointTransactionReportFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('hasFilter', () => {
    it('should return false if filters is null', () => {
      expect(component.hasFilter(null as any)).toBe(false);
    });

    it('should return true if transaction_type is set', () => {
      expect(component.hasFilter({ transaction_type: 'A' })).toBe(true);
    });

    it('should return true if from_date_time is set', () => {
      expect(component.hasFilter({ from_date_time: '2024-01-01' })).toBe(true);
    });

    it('should return true if to_date_time is set', () => {
      expect(component.hasFilter({ to_date_time: '2024-01-02' })).toBe(true);
    });

    it('should return false if all filters are empty', () => {
      expect(component.hasFilter({})).toBe(false);
    });
  });
  describe('onSearch', () => {
    it('should not dispatch if hasFilter returns false', () => {
      jest.spyOn(component, 'hasFilter').mockReturnValue(false);
      component.onSearch();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch setPointTransactionReportsFilters with correct payload (string type)', () => {
      component.searchForm.setValue({
        transaction_type: 'A',
        from_date_time: '2024-01-01',
        to_date_time: '2024-01-02',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      const expectedFrom = (() => { const d = new Date('2024-01-01'); d.setHours(0, 0, 0, 0); return d.toISOString(); })();
      const expectedTo = (() => { const d = new Date('2024-01-02'); d.setHours(23, 59, 59, 999); return d.toISOString(); })();
      expect(store.dispatch).toHaveBeenCalledWith(
        PointTransactionReportsActions.setPointTransactionReportsFilters({
          filters: {
            transaction_type: 'A',
            from_date_time: expectedFrom,
            to_date_time: expectedTo,
            page: 0,
            size: 20,
            expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })
      );
    });

    it('should dispatch with transaction_type as null if empty string', () => {
      component.searchForm.setValue({
        transaction_type: '',
        from_date_time: '',
        to_date_time: '',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      expect(store.dispatch).toHaveBeenCalledWith(
        PointTransactionReportsActions.setPointTransactionReportsFilters({
          filters: {
            transaction_type: null,
            from_date_time: '',
            to_date_time: '',
            expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
            page: 0,
            size: 20,
          },
        })
      );
    });

    it('should dispatch with transaction_type as joined string if string', () => {
      component.searchForm.setValue({
        transaction_type: ['A', 'B'],
        from_date_time: '',
        to_date_time: '',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      expect(store.dispatch).toHaveBeenCalledWith(
        PointTransactionReportsActions.setPointTransactionReportsFilters({
          filters: {
            transaction_type: 'A,B',
            from_date_time: '',
            to_date_time: '',
            expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
            page: 0,
            size: 20,
          },
        })
      );
    });
  });

  describe('resetForm', () => {
    it('should reset the form and dispatch resetPointTransactionReportsFilters', () => {
      component.searchForm.patchValue({
        transaction_type: 'A',
        from_date_time: '2024-01-01',
        to_date_time: '2024-01-02',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      component.resetForm();
      expect(component.searchForm.value).toEqual({
        transaction_type: null,
        from_date_time: '',
        to_date_time: '',
        expected_zone_id: '',
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        PointTransactionReportsActions.resetPointTransactionReportsFilters()
      );
    });
  });
});
