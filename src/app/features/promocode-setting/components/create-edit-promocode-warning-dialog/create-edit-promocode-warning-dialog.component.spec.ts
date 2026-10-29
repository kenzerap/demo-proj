import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditPromocodeWarningDialogComponent } from './create-edit-promocode-warning-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateEditPromocodeWarningDialogComponent', () => {
  let component: CreateEditPromocodeWarningDialogComponent;
  let fixture: ComponentFixture<CreateEditPromocodeWarningDialogComponent>;
  let mockDialogRef: jest.Mocked<
    MatDialogRef<CreateEditPromocodeWarningDialogComponent>
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
      MatDialogRef<CreateEditPromocodeWarningDialogComponent>
    >;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [CreateEditPromocodeWarningDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(
      CreateEditPromocodeWarningDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialogRef.close with true when onConfirm is called', () => {
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should navigate to the correct route and close the dialog on navigateToDetail', () => {
    const promocodeId = 123;
    component.navigateToDetail(promocodeId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'promocode-setting',
      'form',
      promocodeId,
      'view-edit',
    ]);
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});
