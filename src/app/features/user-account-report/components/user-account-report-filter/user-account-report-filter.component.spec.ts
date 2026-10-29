import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import * as UserAccountReportsActions from '../../stores/user-account-report-list/user-account-report-list.actions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserAccountReportFilterComponent } from './user-account-report-filter.component';
import { Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserAccountReportFilterComponent', () => {
  let component: UserAccountReportFilterComponent;
  let fixture: ComponentFixture<UserAccountReportFilterComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserAccountReportFilterComponent,
        ReactiveFormsModule,
        MatDatepickerModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({}), provideNativeDateAdapter()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountReportFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('hasFilter', () => {
    it('should return false if filters is null', () => {
      expect(component.hasFilter(null as any)).toBe(false);
    });

    it('should return true if user_types is set', () => {
      expect(component.hasFilter({ user_types: ['Test'] })).toBe(true);
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
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch setUserAccountReportsFilters with correct payload', () => {
      component.searchForm.setValue({
        user_types: ['Test'],
        from_date_time: '2024-01-01',
        to_date_time: '2024-01-02',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      const expectedFrom = (() => { const d = new Date('2024-01-01'); d.setHours(0, 0, 0, 0); return d.toISOString(); })();
      const expectedTo = (() => { const d = new Date('2024-01-02'); d.setHours(23, 59, 59, 999); return d.toISOString(); })();
      expect(dispatchSpy).toHaveBeenCalledWith(
        UserAccountReportsActions.setUserAccountReportsFilters({
          filters: {
            user_types: ['Test'],
            from_date_time: expectedFrom,
            to_date_time: expectedTo,
            page: 0,
            size: 20,
            expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })
      );
    });

    it('should handle user_types as array', () => {
      component.searchForm.setValue({
        user_types: ['Test', 'Other'],
        from_date_time: '',
        to_date_time: '',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      expect(dispatchSpy).toHaveBeenCalledWith(
        UserAccountReportsActions.setUserAccountReportsFilters({
          filters: {
            user_types: ['Test', 'Other'],
            from_date_time: '',
            to_date_time: '',
            expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
            page: 0,
            size: 20,
          },
        })
      );
    });

    it('should handle empty user_types array', () => {
      component.searchForm.setValue({
        user_types: [],
        from_date_time: '',
        to_date_time: '',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      expect(dispatchSpy).toHaveBeenCalledWith(
        UserAccountReportsActions.setUserAccountReportsFilters({
          filters: {
            user_types: [],
            from_date_time: '',
            to_date_time: '',
            expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
            page: 0,
            size: 20,
          },
        })
      );
    });

    it('should handle empty date fields gracefully', () => {
      component.searchForm.setValue({
        user_types: null,
        from_date_time: '',
        to_date_time: '',
        expected_zone_id: '',
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe('resetForm', () => {
    it('should reset the form and dispatch resetUserAccountReportsFilters', () => {
      component.searchForm.setValue({
        user_types: ['Test'],
        from_date_time: '2024-01-01',
        to_date_time: '2024-01-02',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      component.resetForm();
      expect(component.searchForm.value).toEqual({
        user_types: [],
        from_date_time: '',
        to_date_time: '',
        expected_zone_id: '',
      });
      expect(dispatchSpy).toHaveBeenCalledWith(
        UserAccountReportsActions.resetUserAccountReportsFilters()
      );
    });
  });
});
