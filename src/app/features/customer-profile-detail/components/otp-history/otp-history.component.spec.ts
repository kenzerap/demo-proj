import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpHistoryComponent } from './otp-history.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import * as OtpHistoryActions from '../../stores/otp-history/otp-history.actions';
import * as CustomerDetailActions from '../../stores/customer-detail/customer-detail.actions';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('OtpHistoryComponent', () => {
  let component: OtpHistoryComponent;
  let fixture: ComponentFixture<OtpHistoryComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpHistoryComponent, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({ party_id: '123' }),
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpHistoryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getOtpHistories on onPageChange', () => {
    component.onPageChange(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      OtpHistoryActions.getOtpHistories({
        queryParams: { page: 2, mobile_no: '', size: 20 },
      })
    );
  });

  it('should dispatch getOtpHistories on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(dispatchSpy).toHaveBeenCalledWith(
      OtpHistoryActions.getOtpHistories({
        queryParams: { size: 50, page: 0, mobile_no: '' },
      })
    );
  });

  it('should dispatch reset actions on ngOnDestroy', () => {
    const superSpy = jest.spyOn(OtpHistoryComponent.prototype, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(CustomerDetailActions.reset());
    expect(dispatchSpy).toHaveBeenCalledWith(
      OtpHistoryActions.resetOtpHistories()
    );
    superSpy.mockRestore();
  });

  it('should have defaultParams with correct initial values', () => {
    expect(component.defaultParams()).toEqual({
      mobile_no: '',
      page: 0,
      size: 20,
    });
  });

  it('should set tableColumns, partyId, and observables', () => {
    expect(component.tableColumns).toBeDefined();
    expect(component.partyId).toBeDefined();
    expect(component.otpHistories$).toBeDefined();
    expect(component.customerDetail$).toBeDefined();
    expect(component.pagination$).toBeDefined();
    expect(component.loading$).toBeDefined();
  });

  it('should set defaultParams and dispatch getOtpHistories when customerDetail$ emits', () => {
    // Arrange
    const customer = { mobile_no: '0999999999' };
    const setSpy = jest.spyOn(component.defaultParams, 'set');
    const dispatch = jest.spyOn(store, 'dispatch');
    // Mock customerDetail$ to emit a customer
    (component as any).customerDetail$ = of(customer);

    // Act
    component.ngOnInit();

    // Assert
    expect(setSpy).toHaveBeenCalledWith({
      mobile_no: '0999999999',
      page: 0,
      size: 20,
    });
    expect(dispatch).toHaveBeenCalledWith(
      OtpHistoryActions.getOtpHistories({
        queryParams: {
          mobile_no: '0999999999',
          page: 0,
          size: 20,
        },
      })
    );
  });

  it('should not dispatch getOtpHistories if customerDetail$ emits null', () => {
    // Arrange
    const setSpy = jest.spyOn(component.defaultParams, 'set');
    const dispatch = jest.spyOn(store, 'dispatch');
    (component as any).customerDetail$ = of(null);

    // Act
    component.ngOnInit();

    // Assert
    expect(setSpy).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalledWith(
      OtpHistoryActions.getOtpHistories({
        queryParams: { ...component.defaultParams() },
      })
    );
  });
});
