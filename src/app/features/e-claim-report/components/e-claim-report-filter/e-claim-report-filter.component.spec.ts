import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as PrivilegeRedemptionReportsActions from '../../stores/e-claim-report-list/e-claim-report-list.actions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EclaimReportFilterComponent } from './e-claim-report-filter.component';

describe('EclaimReportFilterComponent', () => {
  let component: EclaimReportFilterComponent;
  let fixture: ComponentFixture<EclaimReportFilterComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        EclaimReportFilterComponent,
        MatDatepickerModule,
        BrowserAnimationsModule,
      ],
      providers: [provideMockStore({}), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(EclaimReportFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hasFilter', () => {
    it('should return false if filters is null', () => {
      expect(component.hasFilter(null as any)).toBe(false);
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

    it('should dispatch setEclaimReportsFilters with correct payload (string)', () => {
      component.searchForm.setValue({
        from_date_time: '2024-01-01',
        to_date_time: '2024-01-02',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      const expectedFrom = (() => { const d = new Date('2024-01-01'); d.setHours(0, 0, 0, 0); return d.toISOString(); })();
      const expectedTo = (() => { const d = new Date('2024-01-02'); d.setHours(23, 59, 59, 999); return d.toISOString(); })();
      expect(dispatchSpy).toHaveBeenCalledWith(
        PrivilegeRedemptionReportsActions.setEclaimReportsFilters({
          filters: {
            from_date_time: expectedFrom,
            to_date_time: expectedTo,
            page: 0,
            size: 20,
            expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })
      );
    });

    it('should handle empty date fields gracefully', () => {
      component.searchForm.setValue({
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
    it('should reset the form and dispatch resetEclaimReportsFilters', () => {
      component.searchForm.setValue({
        from_date_time: '2024-01-01',
        to_date_time: '2024-01-02',
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      component.resetForm();
      expect(component.searchForm.value).toEqual({
        from_date_time: null,
        to_date_time: null,
        expected_zone_id: null,
      });
      expect(dispatchSpy).toHaveBeenCalledWith(
        PrivilegeRedemptionReportsActions.resetEclaimReportsFilters()
      );
    });
  });
});
