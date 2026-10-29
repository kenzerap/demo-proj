import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import * as userAccountReportReportActions from '../../stores/user-account-report-list/user-account-report-list.actions';
import * as userAccountReportListComponentSelectors from '../../stores/user-account-report-list/user-account-report-list.selector';
import { Router } from '@angular/router';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserAccountReportListComponent } from './user-account-report-list.component';
import { UserAccountReportFilterComponent } from '../user-account-report-filter/user-account-report-filter.component';

describe('UserAccountReportListComponent', () => {
  let component: UserAccountReportListComponent;
  let fixture: ComponentFixture<UserAccountReportListComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        UserAccountReportFilterComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideNativeDateAdapter(),

        provideMockStore({
          selectors: [
            {
              selector:
                userAccountReportListComponentSelectors.selectfromUserAccountReports,
              value: [],
            },
            {
              selector:
                userAccountReportListComponentSelectors.selectPagination,
              value: { page: 0, size: 20, totalItems: 2, totalPages: 1 },
            },
            {
              selector: selectIsLoading('getUserAccountReports'),
              value: false,
            },
            {
              selector:
                userAccountReportListComponentSelectors.selectUserAccountFilters,
              value: { user_types: 'Test' },
            },
          ],
        }),
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountReportListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getUserAccountReportTotals on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      userAccountReportReportActions.getUserAccountReportTotals({
        params: { user_types: [] },
      })
    );
  });
  it('should dispatch setUserAccountReportsFilters with size and reset page on onPageSizeChange', () => {
    store.overrideSelector(
      userAccountReportListComponentSelectors.selectfromUserAccountReports,
      [{} as any]
    );
    store.refreshState();
    fixture.detectChanges();

    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      userAccountReportReportActions.setUserAccountReportsFilters({
        filters: { size: 50, page: 0 },
      })
    );
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

  it('should dispatch setUserAccountReportsFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      userAccountReportReportActions.setUserAccountReportsFilters({
        filters: { page: 2 },
      })
    );
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

  it('should have selectCommonSearch$ emit true when filters have user_types', (done) => {
    component.selectCommonSearch$.subscribe((val) => {
      expect(val).toBe(true);
      done();
    });
  });

  it('should have selectCommonSearch$ emit false when filters are empty', (done) => {
    store.overrideSelector(
      userAccountReportListComponentSelectors.selectUserAccountFilters,
      {}
    );
    store.refreshState();
    component.selectCommonSearch$.subscribe((val) => {
      expect(val).toBe(false);
      done();
    });
  });

  it('should dispatch resetAll on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(
      userAccountReportReportActions.resetAll()
    );
  });
});
