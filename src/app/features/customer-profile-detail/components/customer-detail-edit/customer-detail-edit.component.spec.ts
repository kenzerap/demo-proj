import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailEditComponent } from './customer-detail-edit.component';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Customer } from '../../models/customer.model';
import { customerDetail } from '../../constants/dummy-data.const';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import * as customerDetailActions from '../../stores/customer-detail/customer-detail.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustomerDetailEditComponent', () => {
  let component: CustomerDetailEditComponent;
  let fixture: ComponentFixture<CustomerDetailEditComponent>;
  const mockCustomerDetail: Customer = customerDetail;
  let store: any;

  beforeEach(async () => {
    store = {
      dispatch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CustomerDetailEditComponent,
        NoopAnimationsModule,
        MatNativeDateModule,
      ],
      providers: [FormBuilder, provideMockStore({}), { provide: DatePipe }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailEditComponent);
    component = fixture.componentInstance;
    component.customerDetail = mockCustomerDetail;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with customer details', () => {
    expect(component.customerForm.value).toEqual({
      first_name: mockCustomerDetail.first_name,
      last_name: mockCustomerDetail.last_name,
      mobile_no: mockCustomerDetail.mobile_no,
      email: mockCustomerDetail.email,
      security_no: mockCustomerDetail.security_no,
      birth_date: mockCustomerDetail.birth_date,
      security_type: mockCustomerDetail.security_type,
    });
  });

  it('should mark form as dirty on value changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.customerForm.patchValue({ first_name: 'Updated Name' });

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        customerDetailActions.setEditFormDirty({ isDirty: true })
      );
    }, 0);
  });

  it('should validate form data and emit update event', () => {
    const dispatchSpy = jest.spyOn(component.dispatchUpdate, 'emit');
    component.customerForm.patchValue({
      first_name: 'John',
      last_name: 'Doe',
      mobile_no: '1234567890',
      email: 'john@example.com',
      security_no: '1234',
      birth_date: '1990-01-01',
      security_type: 'ID',
    });
    component.validateFormData();
    expect(dispatchSpy).toHaveBeenCalledWith({
      first_name: 'John',
      last_name: 'Doe',
      mobile_no: '1234567890',
      email: 'john@example.com',
      security_no: '1234',
      birth_date: '1990-01-01',
      security_type: 'ID',
    });
  });

  it('should mark all fields as touched if form is invalid', () => {
    jest.spyOn(component.customerForm, 'markAllAsTouched');
    component.customerForm.patchValue({ first_name: '' });
    component.validateFormData();

    setTimeout(() => {
      expect(component.customerForm.markAllAsTouched).toHaveBeenCalled();
    }, 0);
  });

  it('should update the security number validator on value changes', () => {
    const updateSpy = jest.spyOn(
      component.securityNoControl!,
      'updateValueAndValidity'
    );
    component.selectedSecurityTypeControl?.setValue('Passport');
    expect(updateSpy).toHaveBeenCalled();
  });

  it('should return formatted customer address', () => {
    const address = component.getCustomerAddress(mockCustomerDetail);
    expect(address).toBe(
      `${mockCustomerDetail.address} ${mockCustomerDetail.district?.district_th} ${mockCustomerDetail.sub_district?.sub_district_th} ${mockCustomerDetail.province?.province_th} ${mockCustomerDetail.postcode_info?.postcode}`
    );
  });
});
