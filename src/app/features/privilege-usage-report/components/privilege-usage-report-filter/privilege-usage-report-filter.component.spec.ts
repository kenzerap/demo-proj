import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivilegeUsageReportFilterComponent } from './privilege-usage-report-filter.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import * as PrivilegeUsageReportsActions from '../../stores/privilege-usage-report-list/privilege-usage-report-list.actions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PrivilegeUsageReportFilterComponent', () => {
  let component: PrivilegeUsageReportFilterComponent;
  let fixture: ComponentFixture<PrivilegeUsageReportFilterComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PrivilegeUsageReportFilterComponent,
        ReactiveFormsModule,
        MatDatepickerModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({}), provideNativeDateAdapter()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivilegeUsageReportFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearch', () => {
    it('should not dispatch if hasFilter returns false', () => {
      jest.spyOn(component, 'hasFilter').mockReturnValue(false);
      component.onSearch();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch setPrivilegeUsageReportsFilters with correct payload (string)', () => {
      component.searchForm.setValue({
        is_published: null,
        start_date_time_from: '',
        start_date_time_to: '',
        end_date_time_from: '',
        end_date_time_to: '',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      expect(dispatchSpy).toHaveBeenCalledWith(
        PrivilegeUsageReportsActions.setPrivilegeUsageReportsFilters({
          filters: {
            is_published: undefined,
            start_date_time_from: '',
            start_date_time_to: '',
            end_date_time_from: '',
            end_date_time_to: '',
            expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
            page: 0,
            size: 20,
          },
        })
      );
    });

    it('should handle empty date fields gracefully', () => {
      component.searchForm.setValue({
        is_published: null,
        start_date_time_from: '',
        start_date_time_to: '',
        end_date_time_from: '',
        end_date_time_to: '',
        expected_zone_id: '',
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe('resetForm', () => {
    it('should reset the form and dispatch resetPrivilegeUsageReportsFilters', () => {
      component.searchForm.setValue({
        is_published: 'Published',
        start_date_time_from: '2024-01-01',
        start_date_time_to: '2024-01-02',
        end_date_time_from: '2024-01-03',
        end_date_time_to: '2024-01-04',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      component.resetForm();
      expect(component.searchForm.value).toEqual({
        is_published: null,
        start_date_time_from: '',
        start_date_time_to: '',
        end_date_time_from: '',
        end_date_time_to: '',
        expected_zone_id: '',
      });
      expect(dispatchSpy).toHaveBeenCalledWith(
        PrivilegeUsageReportsActions.resetPrivilegeUsageReportsFilters()
      );
    });
  });
});
