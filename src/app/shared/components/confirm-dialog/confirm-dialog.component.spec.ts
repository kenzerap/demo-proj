import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<ConfirmDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Test Title',
            message: 'Test Message',
            btnCloseText: 'Close',
            btnConfirmText: 'Confirm',
            hideConfirmIcon: false,
            type: 'warning',
          },
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct data injected', () => {
    expect(component.data.title).toBe('Test Title');
    expect(component.data.message).toBe('Test Message');
    expect(component.data.btnCloseText).toBe('Close');
    expect(component.data.btnConfirmText).toBe('Confirm');
    expect(component.data.hideConfirmIcon).toBe(false);
    expect(component.data.type).toBe('warning');
  });

  it('should call dialogRef.close with true when onConfirm is called', () => {
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close with false when dialog is closed without confirmation', () => {
    component['dialogRef'].close(false);
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
