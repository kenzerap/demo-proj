import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerProfileFilterComponent } from './customer-profile-filter.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as CustomerProfileFilterActions from '../../stores/customer-profile-filter/customer-profile-filter.actions';
import * as CustomerProfileFilterSelectors from '../../stores/customer-profile-filter/customer-profile-filter.selectors';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustomerProfileFilterComponent', () => {
  let component: CustomerProfileFilterComponent;
  let fixture: ComponentFixture<CustomerProfileFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CustomerProfileFilterComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CustomerProfileFilterSelectors.selectCommonSearch,
              value: '',
            },
            {
              selector: CustomerProfileFilterSelectors.selectPolicyNumber,
              value: '',
            },
            {
              selector:
                CustomerProfileFilterSelectors.selectCertificateNumber,
              value: '',
            },
          ],
        }),
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProfileFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.searchForm.value).toEqual({
      commonSearch: '',
      policyNumber: '',
      certificateNumber: '',
    });
  });

  it('should dispatch searchCustomerProfiles action on onSearch', () => {
    component.searchForm.setValue({
      commonSearch: 'test search',
      policyNumber: '12345',
      certificateNumber: 'CERT01',
    });

    component.onSearch();

    expect(store.dispatch).toHaveBeenCalledWith(
      CustomerProfileFilterActions.searchCustomerProfiles({
        commonSearch: 'test search',
        policyNumber: '12345',
        certificateNumber: 'CERT01',
      })
    );
  });

  it('should reset the form and call onSearch on resetForm', () => {
    jest.spyOn(component, 'onSearch');
    component.searchForm.setValue({
      commonSearch: 'test search',
      policyNumber: '12345',
      certificateNumber: 'CERT01',
    });

    component.resetForm();

    expect(component.searchForm.value).toEqual({
      commonSearch: null,
      policyNumber: null,
      certificateNumber: null,
    });
    expect(component.onSearch).toHaveBeenCalled();
  });

  it('should trim spaces from the specified form control on trimSpaces', () => {
    component.searchForm.setValue({
      commonSearch: '  test search  ',
      policyNumber: ' 12345 ',
      certificateNumber: ' CERT01 ',
    });

    component.trimSpaces('commonSearch');
    component.trimSpaces('policyNumber');

    expect(component.searchForm.value).toEqual({
      commonSearch: 'test search',
      policyNumber: '12345',
      certificateNumber: ' CERT01 ',
    });
  });
});
