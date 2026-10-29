import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PrivilegeRedemptionReportListComponent } from './privilege-redemption-report-list.component';
import * as PrivilegeRedemptionReportsActions from '../../stores/privilede-redemption-report-list/privilege-redemption-report-list.actions';
import * as PrivilegeRedemptionReportsSelectors from '../../stores/privilede-redemption-report-list/privilege-redemption-report-list.selector';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PrivilegeRedemptionReportListComponent', () => {
  let component: PrivilegeRedemptionReportListComponent;
  let fixture: ComponentFixture<PrivilegeRedemptionReportListComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PrivilegeRedemptionReportListComponent,
        MatDatepickerModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({}), provideNativeDateAdapter()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivilegeRedemptionReportListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onPageChange', () => {
    it('should dispatch setPrivilegeRedemptionReportFilters with new page', () => {
      component.onPageChange(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        PrivilegeRedemptionReportsActions.setPrivilegeRedemptionReportFilters({
          filters: { page: 2 },
        })
      );
    });
  });

  describe('onPageSizeChange', () => {
    it('should dispatch setPrivilegeRedemptionReportFilters with new size and reset page', () => {
      component.onPageSizeChange(50);
      expect(dispatchSpy).toHaveBeenCalledWith(
        PrivilegeRedemptionReportsActions.setPrivilegeRedemptionReportFilters({
          filters: { size: 50, page: 0 },
        })
      );
    });
  });

  it('should call exportToExcel when export button is clicked', () => {
    const spy = jest.spyOn(component, 'exportToExcel').mockImplementation();
    fixture.detectChanges();
    const exportBtn = fixture.debugElement.query(By.css('button.demoproj-btn'));
    expect(exportBtn).toBeTruthy();
    exportBtn.triggerEventHandler('click', null);
    spy.mockRestore();
  });

  describe('tableColumns', () => {
    it('should return an array', () => {
      expect(Array.isArray(component.tableColumns())).toBe(true);
    });
  });

  describe('hasFilter', () => {
    it('should return false if filters is null', () => {
      expect(component.hasFilter(null as any)).toBe(false);
    });

    it('should return true if keyword is set', () => {
      expect(component.hasFilter({ keyword: 'A' })).toBe(true);
    });

    it('should return true if privilege_types is set', () => {
      expect(component.hasFilter({ privilege_types: ['B'] })).toBe(true);
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

  it('should format address correctly', () => {
    const address = {
      address: 'A',
      district: 'B',
      sub_district: 'C',
      province: 'D',
      postcode: 'E',
    };
    expect(component.formatAddress(address)).toBe('A, B, C, D, E');
    expect(component.formatAddress(undefined as any)).toBe('-');
    expect(component.formatAddress({})).toBe('-');
    expect(component.formatAddress({ address: 'A' })).toBe('A');
  });

  it('should dispatch setPrivilegeRedemptionReportFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeRedemptionReportsActions.setPrivilegeRedemptionReportFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setUserAccountReportsFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeRedemptionReportsActions.setPrivilegeRedemptionReportFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should emit selectCommonSearch$ as true when filters have keyword', (done) => {
    store.overrideSelector(
      PrivilegeRedemptionReportsSelectors.selectPrivilegeRedemptionReportFilters,
      { keyword: 'test' }
    );
    store.refreshState();
    component.selectCommonSearch$.subscribe((val) => {
      expect(val).toBe(true);
      done();
    });
  });

  it('should have selectCommonSearch$ emit false when filters are empty', (done) => {
    store.overrideSelector(
      PrivilegeRedemptionReportsSelectors.selectPrivilegeRedemptionReportFilters,
      {}
    );
    store.refreshState();
    component.selectCommonSearch$.subscribe((val) => {
      expect(val).toBe(false);
      done();
    });
  });

  it('should emit selectSearchHighlightText$ as keyword', (done) => {
    store.overrideSelector(
      PrivilegeRedemptionReportsSelectors.selectPrivilegeRedemptionReportFilters,
      { keyword: 'test' }
    );
    store.refreshState();
    component.selectSearchHighlightText$.subscribe((val) => {
      expect(val).toBe('test');
      done();
    });
  });

  it('should emit selectSearchHighlightText$ as empty string when filters are empty', (done) => {
    store.overrideSelector(
      PrivilegeRedemptionReportsSelectors.selectPrivilegeRedemptionReportFilters,
      {}
    );
    store.refreshState();
    component.selectSearchHighlightText$.subscribe((val) => {
      expect(val).toBe('');
      done();
    });
  });

  it('should open new tab when navigateToCustomerProfile is called and has permission', () => {
    (component as any).hasViewCustomerProfilePermission = true;
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    component.navigateToCustomerProfile('123');

    expect(openSpy).toHaveBeenCalledWith(
      window.location.origin + '/user-management/customer-profile/123',
      '_blank'
    );
    openSpy.mockRestore();
  });

  it('should dispatch exportPrivilegeRedemptionReport if hasFilter returns true', () => {
    jest.spyOn(component, 'hasFilter').mockReturnValue(true);
    jest.spyOn(component.filters$, 'pipe').mockReturnValue({
      subscribe: (cb: any) => cb({ keyword: 'test' }),
    } as any);

    component.exportToExcel();
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeRedemptionReportsActions.exportPrivilegeRedemptionReport({
        params: { keyword: 'test' },
      })
    );
  });

  it('should not dispatch exportPrivilegeRedemptionReport if hasFilter returns false', () => {
    jest.spyOn(component, 'hasFilter').mockReturnValue(false);
    jest.spyOn(component.filters$, 'pipe').mockReturnValue({
      subscribe: (cb: any) => cb({}),
    } as any);

    component.exportToExcel();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      PrivilegeRedemptionReportsActions.exportPrivilegeRedemptionReport({
        params: { keyword: 'test' },
      })
    );
  });

  describe('ngOnDestroy', () => {
    it('should dispatch resetAll on ngOnDestroy', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(
        PrivilegeRedemptionReportsActions.resetAll()
      );
    });
  });
});
