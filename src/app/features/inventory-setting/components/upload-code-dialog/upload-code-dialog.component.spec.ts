import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of } from 'rxjs';
import { UploadCodeDialogComponent } from './upload-code-dialog.component';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UploadCodeDialogComponent', () => {
  let component: UploadCodeDialogComponent;
  let fixture: ComponentFixture<UploadCodeDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<UploadCodeDialogComponent>>;
  let actions$: ReplaySubject<any>;
  let store: MockStore;

  const mockDialogData = {
    inventoryData: {
      brand_id: 1,
    },
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<UploadCodeDialogComponent>>;

    actions$ = new ReplaySubject(1);

    await TestBed.configureTestingModule({
      imports: [
        UploadCodeDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        FormBuilder,
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadCodeDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set imageNameUploaded when a file is selected', () => {
    const file = new File(['content'], 'test-file.csv', { type: 'text/csv' });
    component.imageFileControl?.setValue(file);
    expect(component.imageNameUploaded()).toBe('test-file.csv');
  });

  it('should reset imageFileControl if validation fails', () => {
    const file = new File(['content'], 'test-file.csv', { type: 'text/csv' });
    component.imageFileControl?.setValue(file);

    component.ngOnInit();
    component.onSubmit();

    setTimeout(() => {
      expect(component.imageFileControl?.value).toBeNull();
    }, 0);
  });

  it('should dispatch validateUploadCode on onSubmit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const file = new File(['content'], 'test-file.csv', { type: 'text/csv' });
    component.imageFileControl?.setValue(file);

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditInventoryActions.validateUploadCode({
        brand_id: 1,
        file,
      })
    );
  });

  it('should open confirmation dialog and dispatch createInventoryAndUpdateData on confirm', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const file = new File(['content'], 'test-file.csv', { type: 'text/csv' });
    component.imageFileControl?.setValue(file);

    actions$.next(
      CreateEditInventoryActions.validateUploadCodeSuccess({
        response: {
          valid: true,
          gap_rows: [],
          duplicated_rows: [],
          invalid_rows: [],
          total_rows: 0,
        },
      })
    );

    const dialogRefSpy = jest
      .spyOn(component['dialog'], 'open')
      .mockReturnValue({
        afterClosed: () => of(true),
      } as any);

    setTimeout(() => {
      expect(dialogRefSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditInventoryActions.createInventoryAndUpdateData({
          file,
          inventoryData: mockDialogData.inventoryData,
          dataUpdated: {
            code_name: '',
            description: '',
          },
        })
      );
    }, 0);
  });

  it('should close the dialog on uploadCodeSuccess', () => {
    actions$.next(
      CreateEditInventoryActions.uploadCodeSuccess({
        inventory_id: 1,
        uploadCodes: [],
      })
    );
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should patch file on onFileDropped', () => {
    const file = new File(['content'], 'test-file.csv', { type: 'text/csv' });
    component.onFileDropped({ file, size: { height: 10, width: 10 } });
    expect(component.imageFileControl?.value).toBe(file);
  });

  it('should patch file on onFileSelected', () => {
    const file = new File(['content'], 'test-file.csv', { type: 'text/csv' });
    const event = {
      target: { files: [file] },
    } as unknown as Event;

    component.onFileSelected(event);
    expect(component.imageFileControl?.value).toBe(file);
  });

  it('should count total errors correctly', () => {
    component.validateUploadCode.set({
      valid: false,
      gap_rows: [1, 2],
      duplicated_rows: [3],
    } as any);

    expect(component.countTotalError()).toBe(2);
  });

  it('should return true for isInvalidUploadCode when validation fails', () => {
    component.validateUploadCode.set({ valid: false } as any);
    expect(component.isInvalidUploadCode()).toBe(true);
  });

  it('should return false for isInvalidUploadCode when validation passes', () => {
    component.validateUploadCode.set({ valid: true } as any);
    expect(component.isInvalidUploadCode()).toBe(false);
  });
});
