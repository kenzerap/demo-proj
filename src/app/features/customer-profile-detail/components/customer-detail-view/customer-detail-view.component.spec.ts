import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerDetailViewComponent } from './customer-detail-view.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { of, Subject } from 'rxjs';
import * as customerDetailActions from '../../stores/customer-detail/customer-detail.actions';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NO_ERRORS_SCHEMA } from '@angular/core';

jest.mock('@angular/material/dialog');

describe('CustomerDetailViewComponent', () => {
  let component: CustomerDetailViewComponent;
  let fixture: ComponentFixture<CustomerDetailViewComponent>;
  let store: MockStore;
  let actions$: Subject<any>;
  let mockDialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    actions$ = new Subject();
    mockDialog = { open: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [CustomerDetailViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            customerDetail: { customer: null },
            loading: { getCustomerDetail: false, updateCustomerDetail: false },
          },
        }),
        provideMockActions(() => actions$),
        { provide: MatDialog, useValue: mockDialog },
        {
          provide: ActivatedRoute,
          useValue: { parent: { params: of({ party_id: '12345' }) } },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailViewComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getCustomerDetail on init', () => {
    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        customerDetailActions.getCustomerDetail({ partyId: '12345' })
      );
    }, 0);
  });

  it('should toggle sidebar collapse state', () => {
    component.toggleSidebarColapsed();
    expect(component.isSidebarColapsed()).toBeTruthy();
    expect(component.isEditMode()).toBeFalsy();
  });

  it('should get correct customer status', () => {
    const mockCustomer = { party_status: 'Blocked', is_blocked: true } as any;
    expect(component.getCustomerStatus(mockCustomer)).toBe('Blocked');
  });

  it('should dispatch markCustomerFraudOrBlock on fraud toggle', () => {
    component.onFraudToggle({ checked: true } as MatSlideToggleChange);

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        customerDetailActions.markCustomerFraudOrBlock({
          partyId: '12345',
          is_fraud: true,
        })
      );
    }, 0);
  });

  it('should dispatch markCustomerFraudOrBlock on block toggle', () => {
    component.onBlockToggle({ checked: true } as MatSlideToggleChange);

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        customerDetailActions.markCustomerFraudOrBlock({
          partyId: '12345',
          is_blocked: true,
        })
      );
    }, 0);
  });

  it('should format customer address', () => {
    const mockCustomer = {
      address: '123 Main St',
      district: { district_th: 'Central' },
      sub_district: { sub_district_th: 'Downtown' },
      province: { province_th: 'Metropolis' },
      postcode_info: { postcode: '10000' },
    } as any;
    component.hasEditPermission = true;
    const address = component.getCustomerAddress(mockCustomer);
    expect(address).toBe('123 Main St Central Downtown Metropolis 10000');
  });

  it('should set edit mode', () => {
    component.setEditMode(true);
    expect(component.isEditMode()).toBeTruthy();
  });

  it('should dispatch updateCustomerDetail', () => {
    component.updateCustomerProfile({ first_name: 'abc' });

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        customerDetailActions.updateCustomerDetail({
          partyId: '12345',
          customerDetail: { first_name: 'abc' },
        })
      );
    }, 0);
  });

  it('should handle successful update', () => {
    jest.spyOn(component, 'setEditMode');
    component.handleUpdateCustomerDetailSuccess();
    expect(component.setEditMode).toHaveBeenCalledWith(false);

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        customerDetailActions.getCustomerDetail({ partyId: '12345' })
      );
    }, 0);
  });

  it('should open dialog on duplicated update', () => {
    const mockResponse = {
      duplicated: true,
      dup_mobile_no: '1234567890',
      dup_security_no: '9876',
    } as any;
    const mockRequest = { mobile_no: '1234567890', security_no: '9876' } as any;
    mockDialog.open.mockReturnValue({
      afterClosed: () => of('exitEditMode'),
    } as any);
    component.handleUpdateDupplicated(mockResponse, mockRequest);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(component.isEditMode()).toBeFalsy();
  });

  it('should reset store on destroy', () => {
    component.ngOnDestroy();

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        customerDetailActions.reset()
      );
    }, 0);
  });

  it('should toggle saveCustomerProfile state', () => {
    const initial = component.isSaveCustomerProfile();
    component.saveCustomerProfile();
    expect(component.isSaveCustomerProfile()).toBe(!initial);
  });

  it('should have an onDeleteCustomer method', () => {
    expect(typeof component.onDeleteCustomer).toBe('function');
  });
});
