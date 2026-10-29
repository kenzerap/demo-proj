import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivilegeUsageReportListComponent } from './privilege-usage-report-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PrivilegeUsageReportFilterComponent } from '../privilege-usage-report-filter/privilege-usage-report-filter.component';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import * as PrivilegeUsageReportReportActions from '../../stores/privilege-usage-report-list/privilege-usage-report-list.actions';
import * as PrivilegeUsageReportListComponentSelectors from '../../stores/privilege-usage-report-list/privilege-usage-report-list.selector';
import { Router } from '@angular/router';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PrivilegeUsageReportListComponent', () => {
  let component: PrivilegeUsageReportListComponent;
  let fixture: ComponentFixture<PrivilegeUsageReportListComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        PrivilegeUsageReportFilterComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideNativeDateAdapter(),

        provideMockStore({
          selectors: [
            {
              selector:
                PrivilegeUsageReportListComponentSelectors.selectfromPrivilegeUsageReports,
              value: [],
            },
            {
              selector:
                PrivilegeUsageReportListComponentSelectors.selectPagination,
              value: { page: 0, size: 20, totalItems: 2, totalPages: 1 },
            },
            {
              selector: selectIsLoading('getPointTransactionReports'),
              value: false,
            },
            {
              selector:
                PrivilegeUsageReportListComponentSelectors.selectPrivilegeUsageFilters,
              value: { keyword: 'test' },
            },
          ],
        }),
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivilegeUsageReportListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
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

    it('should return true if is_published is set', () => {
      expect(component.hasFilter({ is_published: true })).toBe(true);
      expect(component.hasFilter({ is_published: false })).toBe(true);
    });

    it('should return true if start_date_time_from is set', () => {
      expect(component.hasFilter({ start_date_time_from: '2024-01-01' })).toBe(
        true
      );
    });

    it('should return true if start_date_time_to is set', () => {
      expect(component.hasFilter({ start_date_time_to: '2024-01-02' })).toBe(
        true
      );
    });

    it('should return true if end_date_time_from is set', () => {
      expect(component.hasFilter({ end_date_time_from: '2024-01-03' })).toBe(
        true
      );
    });

    it('should return true if end_date_time_to is set', () => {
      expect(component.hasFilter({ end_date_time_to: '2024-01-04' })).toBe(
        true
      );
    });

    it('should return false if all filters are empty', () => {
      expect(component.hasFilter({})).toBe(false);
    });
  });

  it('should emit selectCommonSearch$ as true when filters have is_published', (done) => {
    store.overrideSelector(
      PrivilegeUsageReportListComponentSelectors.selectPrivilegeUsageFilters,
      { is_published: true }
    );
    store.refreshState();
    component.selectCommonSearch$.subscribe((val) => {
      expect(val).toBe(true);
      done();
    });
  });
  it('should emit selectCommonSearch$ as false when filters are empty', (done) => {
    store.overrideSelector(
      PrivilegeUsageReportListComponentSelectors.selectPrivilegeUsageFilters,
      {}
    );
    store.refreshState();
    component.selectCommonSearch$.subscribe((val) => {
      expect(val).toBe(false);
      done();
    });
  });

  it('should emit selectSearchHighlightText$ as Unpublished when is_published is false', (done) => {
    store.overrideSelector(
      PrivilegeUsageReportListComponentSelectors.selectPrivilegeUsageFilters,
      { is_published: false }
    );
    store.refreshState();
    component.selectSearchHighlightText$.subscribe((val) => {
      expect(val).toBe('Unpublished');
      done();
    });
  });

  it('should emit selectSearchHighlightText$ as empty string when is_published is undefined', (done) => {
    store.overrideSelector(
      PrivilegeUsageReportListComponentSelectors.selectPrivilegeUsageFilters,
      {}
    );
    store.refreshState();
    component.selectSearchHighlightText$.subscribe((val) => {
      expect(val).toBe('');
      done();
    });
  });

  it('should dispatch setPrivilegeUsageReportsFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeUsageReportReportActions.setPrivilegeUsageReportsFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setPrivilegeUsageReportsFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeUsageReportReportActions.setPrivilegeUsageReportsFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should dispatch exportPrivilegeUsageReports if hasFilter returns true', () => {
    jest.spyOn(component, 'hasFilter').mockReturnValue(true);
    jest.spyOn(component.filters$, 'pipe').mockReturnValue({
      subscribe: (cb: any) => cb({ is_published: true }),
    } as any);

    component.exportToExcel();
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeUsageReportReportActions.exportPrivilegeUsageReports({
        params: { is_published: true },
      })
    );
  });

  it('should not dispatch exportPrivilegeUsageReports if hasFilter returns false', () => {
    jest.spyOn(component, 'hasFilter').mockReturnValue(false);
    jest.spyOn(component.filters$, 'pipe').mockReturnValue({
      subscribe: (cb: any) => cb({}),
    } as any);

    component.exportToExcel();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      PrivilegeUsageReportReportActions.exportPrivilegeUsageReports({
        params: { is_published: true },
      })
    );
  });

  it('should call exportToExcel when export button is clicked', () => {
    const spy = jest.spyOn(component, 'exportToExcel').mockImplementation();
    fixture.detectChanges();
    const exportBtn = fixture.debugElement.query(By.css('button.demoproj-btn'));
    expect(exportBtn).toBeTruthy();
    exportBtn.triggerEventHandler('click', null);
    spy.mockRestore();
  });

  it('should have defaultParams signal with page 0 and size 20', () => {
    expect(component.defaultParams().page).toBe(0);
    expect(component.defaultParams().size).toBe(20);
  });

  it('should have tableColumns signal with columns', () => {
    expect(Array.isArray(component.tableColumns())).toBe(true);
  });
  it('should dispatch resetAll on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeUsageReportReportActions.resetAll()
    );
  });
});
