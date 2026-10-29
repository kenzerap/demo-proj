import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointTransactionReportListComponent } from './point-transaction-report-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PointTransactionReportFilterComponent } from '../point-transaction-report-filter/point-transaction-report-filter.component';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import * as pointTransactionReportReportActions from '../../stores/point-transaction-report-list/point-transaction-report-list.actions';
import * as PointTransactionReportListComponentSelectors from '../../../popup-announcement-setting/point-transaction-report-list.selector';
import { Router } from '@angular/router';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PointTransactionReportListComponent', () => {
  let component: PointTransactionReportListComponent;
  let fixture: ComponentFixture<PointTransactionReportListComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        PointTransactionReportListComponent,
        PointTransactionReportFilterComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideNativeDateAdapter(),

        provideMockStore({
          selectors: [
            {
              selector:
                PointTransactionReportListComponentSelectors.selectfromPointTransactionReports,
              value: [],
            },
            {
              selector:
                PointTransactionReportListComponentSelectors.selectPagination,
              value: { page: 0, size: 20, totalItems: 2, totalPages: 1 },
            },
            {
              selector: selectIsLoading('getPointTransactionReports'),
              value: false,
            },
            {
              selector:
                PointTransactionReportListComponentSelectors.selectPointTransactionFilters,
              value: { keyword: 'test' },
            },
          ],
        }),
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PointTransactionReportListComponent);
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

  it('should dispatch setPointTransactionReportsFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      pointTransactionReportReportActions.setPointTransactionReportsFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setPointTransactionReportsFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      pointTransactionReportReportActions.setPointTransactionReportsFilters({
        filters: { size: 50, page: 0 },
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

  it('should dispatch resetAll on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(
      pointTransactionReportReportActions.resetAll()
    );
  });
});
