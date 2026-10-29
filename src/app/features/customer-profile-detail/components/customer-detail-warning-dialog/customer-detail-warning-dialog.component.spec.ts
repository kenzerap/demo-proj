import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerDetailWarningDialogComponent } from './customer-detail-warning-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustomerDetailWarningDialogComponent', () => {
  let component: CustomerDetailWarningDialogComponent;
  let fixture: ComponentFixture<CustomerDetailWarningDialogComponent>;
  let mockDialogRef: jest.Mocked<
    MatDialogRef<CustomerDetailWarningDialogComponent>
  >;
  let mockRouter: jest.Mocked<Router>;

  const mockDialogData = {
    mobile_no: '1234567890',
    dup_mobile_no: {
      first_name: 'John',
      last_name: 'Doe',
      party_id: '1234',
    },
    security_no: '5678',
    dup_security_no: {
      first_name: 'Jane',
      last_name: 'Smith',
      party_id: '5678',
    },
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<
      MatDialogRef<CustomerDetailWarningDialogComponent>
    >;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [CustomerDetailWarningDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with true on onConfirm', () => {
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should navigate to the correct route and close the dialog on navigateToDetail', () => {
    const partyId = '1234';
    component.navigateToDetail(partyId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/user-management',
      'customer-profile',
      partyId,
      'overview',
    ]);
    expect(mockDialogRef.close).toHaveBeenCalledWith('exitEditMode');
  });

  it('should have the correct injected data', () => {
    expect(component.data).toEqual(mockDialogData);
  });
});
