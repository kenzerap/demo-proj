import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import * as PrivilegeUsageReportReportActions from '../../stores/e-claim-report-list/e-claim-report-list.actions';
import * as EclaimReportListComponentSelectors from '../../stores/e-claim-report-list/e-claim-report-list.selector';
import { Router } from '@angular/router';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EclaimReportFilterComponent } from '../e-claim-report-filter/e-claim-report-filter.component';
import { EclaimReportListComponent } from './e-claim-report-list.component';

describe('EclaimReportListComponent', () => {
  let component: EclaimReportListComponent;
  let fixture: ComponentFixture<EclaimReportListComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        EclaimReportFilterComponent,
      ],
      providers: [
        provideNativeDateAdapter(),

        provideMockStore({
          selectors: [
            {
              selector:
                EclaimReportListComponentSelectors.selectfromClaimReports,
              value: [],
            },
            {
              selector: EclaimReportListComponentSelectors.selectPagination,
              value: { page: 0, size: 20, totalItems: 2, totalPages: 1 },
            },
            {
              selector: selectIsLoading('getPointTransactionReports'),
              value: false,
            },
            {
              selector: EclaimReportListComponentSelectors.selectClaimFilters,
              value: { keyword: 'test' },
            },
          ],
        }),
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EclaimReportListComponent);
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

  it('should emit selectCommonSearch$ as false when filters are empty', (done) => {
    store.overrideSelector(
      EclaimReportListComponentSelectors.selectClaimFilters,
      {}
    );
    store.refreshState();
    component.selectCommonSearch$.subscribe((val) => {
      expect(val).toBe(false);
      done();
    });
  });

  it('should dispatch setEclaimReportsFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeUsageReportReportActions.setEclaimReportsFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setEclaimReportsFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeUsageReportReportActions.setEclaimReportsFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should dispatch exportEclaimReports if hasFilter returns true', () => {
    jest.spyOn(component, 'hasFilter').mockReturnValue(true);
    jest.spyOn(component.filters$, 'pipe').mockReturnValue({
      subscribe: (cb: any) => cb({}),
    } as any);

    component.exportToExcel();
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeUsageReportReportActions.exportEclaimReports({
        params: {},
      })
    );
  });

  it('should not dispatch exportEclaimReports if hasFilter returns false', () => {
    jest.spyOn(component, 'hasFilter').mockReturnValue(false);
    jest.spyOn(component.filters$, 'pipe').mockReturnValue({
      subscribe: (cb: any) => cb({}),
    } as any);

    component.exportToExcel();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      PrivilegeUsageReportReportActions.exportEclaimReports({
        params: {},
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
