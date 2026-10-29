import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of } from 'rxjs';
import { UploadPointDialogComponent } from './upload-point-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as CreateEditPointBulkActions from '@app/features/point-bulk/stores/create-edit-point-bulk/create-edit-point-bulk.actions';
import { ValidateUploadPointResponse } from '../../models/validate-upload-point-response.model';
import { FileDragDrop } from '@app/shared/directives/drag-drop-upload.directive';
import { provideNativeDateAdapter } from '@angular/material/core';
import { selectIsLoading } from '@app/store/loading/loading.selectors';

describe('UploadPointDialogComponent', () => {
  let component: UploadPointDialogComponent;
  let fixture: ComponentFixture<UploadPointDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<UploadPointDialogComponent>>;
  let mockDialog: jest.Mocked<MatDialog>;
  let actions$: ReplaySubject<any>;
  let store: MockStore;

  const mockDialogData = {
    inventoryData: {
      brand_id: 1,
    },
  };

  const mockValidResponse: ValidateUploadPointResponse = {
    valid: true,
    gap_rows: [],
    invalid_rows: [],
    not_found_rows: [],
    blank_rows: [],
  } as any;

  const mockInvalidResponse: ValidateUploadPointResponse = {
    valid: false,
    gap_rows: [1, 2],
    invalid_rows: [3, 4],
    not_found_rows: [5, 6],
    blank_rows: [7, 8],
  } as any;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<UploadPointDialogComponent>>;

    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    actions$ = new ReplaySubject(1);

    await TestBed.configureTestingModule({
      imports: [
        UploadPointDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatDialog, useValue: mockDialog },
        FormBuilder,
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: selectIsLoading('validateUploadPointBulk'),
              value: false,
            },
            {
              selector: selectIsLoading('uploadPointBulk'),
              value: false,
            },
          ],
        }),
        provideMockActions(() => actions$),
        provideNativeDateAdapter(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideProvider(MatDialog, { useValue: mockDialog })
      .compileComponents();

    fixture = TestBed.createComponent(UploadPointDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  afterEach(() => {
    actions$.complete();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with required validators', () => {
      expect(component.uploadPointForm).toBeDefined();
      expect(component.subjectControl?.hasError('required')).toBeTruthy();
      expect(component.noteControl?.hasError('required')).toBeTruthy();
      expect(
        component.pointExpiryDateControl?.hasError('required')
      ).toBeTruthy();
      expect(component.excelFileControl?.hasError('required')).toBeTruthy();
    });

    it('should initialize signals with default values', () => {
      expect(component.imageNameUploaded()).toBe('Click to upload');
      expect(component.validateUploadPoint()).toBeNull();
      expect(component.currentDate).toBeInstanceOf(Date);
    });

    it('should have form control getters return correct controls', () => {
      expect(component.subjectControl).toBe(
        component.uploadPointForm.get('subject')
      );
      expect(component.noteControl).toBe(component.uploadPointForm.get('note'));
      expect(component.pointExpiryDateControl).toBe(
        component.uploadPointForm.get('point_expiry_date')
      );
      expect(component.excelFileControl).toBe(
        component.uploadPointForm.get('excelFile')
      );
    });
  });

  describe('File Upload Handling', () => {
    it('should update imageNameUploaded when file is selected via valueChanges', () => {
      const mockFile = new File(['test'], 'test-file.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      component.excelFileControl?.patchValue(mockFile);

      expect(component.imageNameUploaded()).toBe('test-file.xlsx');
    });

    it('should handle onFileDropped', () => {
      const mockFile = new File(['test'], 'dropped-file.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const fileDragDrop: FileDragDrop = { file: mockFile } as any;

      component.onFileDropped(fileDragDrop);

      expect(component.excelFileControl?.value).toBe(mockFile);
      expect(component.validateUploadPoint()).toBeNull();
    });

    it('should handle onFileSelected with valid file', () => {
      const mockFile = new File(['test'], 'selected-file.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as Event;

      component.onFileSelected(mockEvent);

      expect(component.excelFileControl?.value).toBe(mockFile);
      expect(component.validateUploadPoint()).toBeNull();
    });

    it('should handle onFileSelected with no files', () => {
      const mockEvent = {
        target: {
          files: null,
        },
      } as unknown as Event;

      component.onFileSelected(mockEvent);

      expect(component.excelFileControl?.value).toBe('');
    });

    it('should handle onFileSelected with empty file list', () => {
      const mockEvent = {
        target: {
          files: [],
        },
      } as unknown as Event;

      component.onFileSelected(mockEvent);

      expect(component.excelFileControl?.value).toBe('');
    });
  });

  describe('Form Submission', () => {
    it('should dispatch validateUploadPointBulk action on onSubmit', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const mockFile = new File(['test'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      component.excelFileControl?.patchValue(mockFile);

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPointBulkActions.validateUploadPointBulk({
          file: mockFile,
        })
      );
    });
  });

  describe('Validation Response Handling', () => {
    it('should handle successful validation and open confirmation dialog', (done) => {
      const mockFile = new File(['test'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      component.excelFileControl?.patchValue(mockFile);
      component.uploadPointForm.patchValue({
        subject: 'Test Subject',
        note: 'Test Note',
        point_expiry_date: new Date(),
      });

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      // Simulate successful validation
      actions$.next(
        CreateEditPointBulkActions.validateUploadPointBulkSuccess({
          response: mockValidResponse,
        })
      );

      setTimeout(() => {
        expect(component.validateUploadPoint()).toEqual(mockValidResponse);
        expect(mockDialog.open).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalledWith(
          CreateEditPointBulkActions.uploadPointBulk({
            file: mockFile,
            data: {
              subject: 'Test Subject',
              note: 'Test Note',
              point_expiry_date: expect.any(String),
            },
          })
        );
        done();
      }, 0);
    });

    it('should handle invalid validation and reset file control', () => {
      const mockFile = new File(['test'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      component.excelFileControl?.patchValue(mockFile);

      const resetSpy = jest.spyOn(component.excelFileControl!, 'reset');

      // Simulate invalid validation
      actions$.next(
        CreateEditPointBulkActions.validateUploadPointBulkSuccess({
          response: mockInvalidResponse,
        })
      );

      setTimeout(() => {
        expect(component.validateUploadPoint()).toEqual(mockInvalidResponse);
        expect(resetSpy).toHaveBeenCalled();
      }, 0);
    });

    it('should handle confirmation dialog cancellation', () => {
      const mockFile = new File(['test'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      component.excelFileControl?.patchValue(mockFile);

      mockDialog.open.mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(false)),
      } as any);

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      // Simulate successful validation
      actions$.next(
        CreateEditPointBulkActions.validateUploadPointBulkSuccess({
          response: mockValidResponse,
        })
      );

      setTimeout(() => {
        expect(mockDialog.open).toHaveBeenCalled();
        // Should not dispatch upload action
        expect(dispatchSpy).not.toHaveBeenCalledWith(
          expect.objectContaining({
            type: CreateEditPointBulkActions.uploadPointBulk.type,
          })
        );
      }, 0);
    });

    it('should close dialog on successful upload', () => {
      // Simulate successful upload
      actions$.next(CreateEditPointBulkActions.uploadPointBulkSuccess());

      setTimeout(() => {
        expect(mockDialogRef.close).toHaveBeenCalledWith(true);
      }, 0);
    });
  });

  describe('Error Counting and Validation', () => {
    beforeEach(() => {
      component.validateUploadPoint.set(mockInvalidResponse);
    });

    it('should count total errors correctly', () => {
      const totalErrors = component.countTotalError();
      expect(totalErrors).toBe(4); // gap_rows, invalid_rows, not_found_rows, blank_rows
    });

    it('should count total errors correctly with partial errors', () => {
      const partialError: ValidateUploadPointResponse = {
        valid: false,
        gap_rows: [1],
        invalid_rows: [],
        not_found_rows: [2],
        blank_rows: [],
      } as any;
      component.validateUploadPoint.set(partialError);

      const totalErrors = component.countTotalError();
      expect(totalErrors).toBe(2); // only gap_rows and not_found_rows
    });

    it('should count zero errors when no validation response', () => {
      component.validateUploadPoint.set(null);

      const totalErrors = component.countTotalError();
      expect(totalErrors).toBe(0);
    });

    it('should return true for isInvalidUploadPoint when response is invalid', () => {
      expect(component.isInvalidUploadPoint()).toBe(true);
    });

    it('should return false for isInvalidUploadPoint when response is valid', () => {
      component.validateUploadPoint.set(mockValidResponse);
      expect(component.isInvalidUploadPoint()).toBe(false);
    });

    it('should return false for isInvalidUploadPoint when no response', () => {
      component.validateUploadPoint.set(null);
      expect(component.isInvalidUploadPoint()).toBe(false);
    });
  });

  describe('Loading States', () => {
    it('should handle loading states from store selectors', () => {
      store.overrideSelector('selectIsLoading', true);
      store.refreshState();

      component.loadingValidate$.subscribe((loading) => {
        expect(loading).toBe(true);
      });

      component.loadingUploadPoint$.subscribe((loading) => {
        expect(loading).toBe(true);
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate subject field with no spaces validator', () => {
      const subjectControl = component.subjectControl;

      subjectControl?.setValue('   ');
      expect(subjectControl?.invalid).toBeTruthy();

      subjectControl?.setValue('Valid Subject');
      expect(subjectControl?.valid).toBeTruthy();
    });

    it('should validate note field with no spaces validator', () => {
      const noteControl = component.noteControl;

      noteControl?.setValue('   ');
      expect(noteControl?.invalid).toBeTruthy();

      noteControl?.setValue('Valid Note');
      expect(noteControl?.valid).toBeTruthy();
    });

    it('should validate point expiry date field', () => {
      const dateControl = component.pointExpiryDateControl;

      expect(dateControl?.hasError('required')).toBeTruthy();

      dateControl?.setValue(new Date());
      expect(dateControl?.valid).toBeTruthy();
    });

    it('should validate excel file field', () => {
      const fileControl = component.excelFileControl;

      expect(fileControl?.hasError('required')).toBeTruthy();

      const mockFile = new File(['test'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fileControl?.setValue(mockFile);
      expect(fileControl?.valid).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle file valueChanges subscription when file has no name', () => {
      const mockFile = { name: undefined } as any;

      component.excelFileControl?.patchValue(mockFile);

      expect(component.imageNameUploaded()).toBe('Click to upload');
    });

    it('should handle validation response with empty arrays', () => {
      const emptyResponse: ValidateUploadPointResponse = {
        valid: false,
        gap_rows: [],
        invalid_rows: [],
        not_found_rows: [],
        blank_rows: [],
      } as any;
      component.validateUploadPoint.set(emptyResponse);

      expect(component.countTotalError()).toBe(0);
      expect(component.isInvalidUploadPoint()).toBe(true);
    });
  });
});
