import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryWarningDialogComponent } from './inventory-warning-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InventoryWarningDialogComponent', () => {
  let component: InventoryWarningDialogComponent;
  let fixture: ComponentFixture<InventoryWarningDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<InventoryWarningDialogComponent>>;
  let mockRouter: jest.Mocked<Router>;

  const mockDialogData = {
    linkedPrivileges: [
      { privilege_id: 1, name_th: 'Privilege 1' },
      { privilege_id: 2, name_th: 'Privilege 2' },
    ],
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<InventoryWarningDialogComponent>>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [InventoryWarningDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Router, useValue: mockRouter },
        provideRouter([]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryWarningDialogComponent);
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
    const privilegeId = 1;
    component.navigateToDetail(privilegeId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'privilege-setting',
      'form',
      privilegeId,
      'view-edit',
    ]);
    expect(mockDialogRef.close).toHaveBeenCalledWith('navigateExit');
  });

  it('should have the correct injected data', () => {
    expect(component.data).toEqual(mockDialogData as any);
  });
});
