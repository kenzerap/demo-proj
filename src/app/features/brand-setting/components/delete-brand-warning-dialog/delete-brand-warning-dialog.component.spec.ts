import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteBrandWarningDialogComponent } from './delete-brand-warning-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Brand } from '@app/shared/models/brand-model';

describe('DeleteBrandWarningDialogComponent', () => {
  let component: DeleteBrandWarningDialogComponent;
  let fixture: ComponentFixture<DeleteBrandWarningDialogComponent>;
  let mockDialogRef: jest.Mocked<
    MatDialogRef<DeleteBrandWarningDialogComponent>
  >;
  let mockRouter: jest.Mocked<Router>;

  const mockDialogData = {
    brands: [
      { brand_id: 1, brand_name_thai: 'Brand 1', brand_name_english: 'Brand 1' },
      { brand_id: 2, brand_name_thai: 'Brand 2', brand_name_english: 'Brand 2' },
    ] as Brand[],
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<
      MatDialogRef<DeleteBrandWarningDialogComponent>
    >;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [DeleteBrandWarningDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteBrandWarningDialogComponent);
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
    const brandId = 1;
    component.navigateToDetail(brandId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'brand-setting',
      'form',
      brandId,
      'view-edit',
    ]);
    expect(mockDialogRef.close).toHaveBeenCalledWith('navigateExit');
  });

  it('should have the correct injected data', () => {
    expect(component.data).toEqual(mockDialogData);
  });
});
