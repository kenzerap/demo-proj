import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerProfileListComponent } from './customer-profile-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as customerProfileListActions from '../../stores/customer-profile-list/customer-profile-list.actions';
import * as customerProfileListSelectors from '../../stores/customer-profile-list/customer-profile-list.selectors';
import * as customerProfileFilterActions from '../../stores/customer-profile-filter/customer-profile-filter.actions';
import * as customerProfileFilterSelectors from '../../stores/customer-profile-filter/customer-profile-filter.selectors';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';

describe('CustomerProfileListComponent', () => {
  let component: CustomerProfileListComponent;
  let fixture: ComponentFixture<CustomerProfileListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;
  let activatedRouteMock: { queryParams: any };

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    activatedRouteMock = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [CustomerProfileListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: customerProfileListSelectors.selectCustomerProfiles,
              value: [],
            },
            {
              selector: customerProfileListSelectors.selectPagination,
              value: { page: 0, size: 20, totalItems: 0, totalPages: 0 },
            },
            { selector: selectIsLoading('getCustomerProfiles'), value: false },
            {
              selector: customerProfileFilterSelectors.selectCommonSearch,
              value: '',
            },
          ],
        }),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProfileListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getCustomerProfiles on ngOnInit when not navigating back', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      customerProfileListActions.reset()
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      customerProfileFilterActions.reset()
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      customerProfileListActions.getCustomerProfiles({
        params: {
          page: 0,
          size: 20,
          sort_field: 'createdDate',
          sort_order: 'DESC',
        },
      })
    );
  });

  it('should not dispatch getCustomerProfiles on ngOnInit when navigating back', () => {
    activatedRouteMock.queryParams = of({ isBack: 'true' });
    fixture = TestBed.createComponent(CustomerProfileListComponent);
    component = fixture.componentInstance;
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalledWith(
      customerProfileListActions.getCustomerProfiles(expect.anything())
    );
  });

  it('should dispatch getCustomerProfiles on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      customerProfileListActions.getCustomerProfiles({
        params: {
          page: 2,
          size: 20,
          sort_field: 'createdDate',
          sort_order: 'DESC',
        },
      })
    );
  });

  it('should dispatch getCustomerProfiles on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      customerProfileListActions.getCustomerProfiles({
        params: {
          page: 0,
          size: 50,
          sort_field: 'createdDate',
          sort_order: 'DESC',
        },
      })
    );
  });

  it('should navigate to customer detail on selectCustomer', () => {
    const mockCustomer = { party_id: '12345' };
    component.selectCustomer(mockCustomer as any);
    expect(router.navigate).toHaveBeenCalledWith([
      'user-management/customer-profile',
      '12345',
    ]);
  });
});
