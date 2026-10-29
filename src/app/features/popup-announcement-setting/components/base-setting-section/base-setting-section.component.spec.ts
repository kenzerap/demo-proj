import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { BaseSettingSectionComponent } from './base-setting-section.component';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { checkImageMimeType } from '@app/shared/utils/check-image-mime-type';
import { getImageSizeOser } from '@app/shared/utils/get-image-size';
import * as CreateEditPopupAnnouncementActions from '@app/features/popup-announcement-setting/stores/create-edit-popup-announcement/create-edit-popup-announcement.actions';

// Mock external utilities
jest.mock('@app/shared/utils/check-image-mime-type');
jest.mock('@app/shared/utils/get-image-size');

describe('BaseSettingSectionComponent', () => {
  let component: BaseSettingSectionComponent;
  let fixture: ComponentFixture<BaseSettingSectionComponent>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockStore: jest.Mocked<Store>;

  const mockCheckImageMimeType = checkImageMimeType as jest.MockedFunction<
    typeof checkImageMimeType
  >;
  const mockGetImageSizeOser = getImageSizeOser as jest.MockedFunction<
    typeof getImageSizeOser
  >;

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    mockStore = {
      dispatch: jest.fn(),
    } as unknown as jest.Mocked<Store>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BaseSettingSectionComponent,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: Store, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseSettingSectionComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormBuilder().group({
      send_time_type: [TimePeriodType.SPECIFIC_TIME],
      start_date: [''],
      start_time: [''],
      end_date: [''],
      end_time: [''],
      isSetEndDate: [false],
      published: [false],
      bannerName: [''],
      dontShowButton: [false],
      imageFile: [null],
      imageUrl: [''],
      imageName: [''],
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Controls Getters', () => {
    it('should return correct form controls', () => {
      expect(component.sendTimeTypeControl).toBe(
        component.formGroup.get('send_time_type')
      );
      expect(component.startDateControl).toBe(
        component.formGroup.get('start_date')
      );
      expect(component.startTimeControl).toBe(
        component.formGroup.get('start_time')
      );
      expect(component.isSetEndDateControl).toBe(
        component.formGroup.get('isSetEndDate')
      );
      expect(component.endDateControl).toBe(
        component.formGroup.get('end_date')
      );
      expect(component.endTimeControl).toBe(
        component.formGroup.get('end_time')
      );
      expect(component.publishedControl).toBe(
        component.formGroup.get('published')
      );
      expect(component.bannerNameControl).toBe(
        component.formGroup.get('bannerName')
      );
      expect(component.dontShowButtonControl).toBe(
        component.formGroup.get('dontShowButton')
      );
      expect(component.imageFileControl).toBe(
        component.formGroup.get('imageFile')
      );
      expect(component.imageUrlControl).toBe(
        component.formGroup.get('imageUrl')
      );
      expect(component.imageNameControl).toBe(
        component.formGroup.get('imageName')
      );
    });
  });

  describe('ngOnInit', () => {
    it('should initialize form validation and subscriptions', () => {
      const reValidateFormSpy = jest.spyOn(component, 'reValidateForm');

      component.ngOnInit();

      expect(reValidateFormSpy).toHaveBeenCalledWith(
        TimePeriodType.SPECIFIC_TIME
      );
    });

    it('should handle sendTimeType changes', fakeAsync(() => {
      const reValidateFormSpy = jest.spyOn(component, 'reValidateForm');

      component.ngOnInit();
      component.sendTimeTypeControl?.setValue(TimePeriodType.IMMEDIATELY);
      tick();

      expect(reValidateFormSpy).toHaveBeenCalledWith(
        TimePeriodType.IMMEDIATELY
      );
      expect(component.startDateControl?.value).toBeNull();
      expect(component.startTimeControl?.value).toBeNull();
      expect(component.endDateControl?.value).toBeNull();
      expect(component.endTimeControl?.value).toBeNull();
      expect(component.isSetEndDateControl?.value).toBe(false);
    }));

    it('should handle isSetEndDate changes when value is true', fakeAsync(() => {
      component.ngOnInit();

      component.isSetEndDateControl?.setValue(true);
      tick();

      expect(component.endDateControl?.hasError).toBeDefined();
      expect(component.endTimeControl?.hasError).toBeDefined();
    }));

    it('should handle isSetEndDate changes when value is false', fakeAsync(() => {
      component.ngOnInit();

      component.isSetEndDateControl?.setValue(false);
      tick();

      expect(component.endDateControl?.value).toBeNull();
      expect(component.endTimeControl?.value).toBeNull();
    }));

    it('should handle startDate changes and trigger startTime validation', fakeAsync(() => {
      const updateValueAndValiditySpy = jest.spyOn(
        component.startTimeControl as FormControl,
        'updateValueAndValidity'
      );

      component.ngOnInit();
      component.startDateControl?.setValue('2024-01-01');
      tick(100);

      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    }));

    it('should handle endDate changes and trigger endTime validation', fakeAsync(() => {
      const updateValueAndValiditySpy = jest.spyOn(
        component.endTimeControl as FormControl,
        'updateValueAndValidity'
      );

      component.ngOnInit();
      component.endDateControl?.setValue('2024-01-01');
      tick(100);

      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    }));

    it('should handle startTime changes and trigger endTime validation', fakeAsync(() => {
      const updateValueAndValiditySpy = jest.spyOn(
        component.endTimeControl as FormControl,
        'updateValueAndValidity'
      );

      component.ngOnInit();
      component.startTimeControl?.setValue('10:00');
      tick();

      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    }));

    it('should handle imageFile changes', fakeAsync(() => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      const setPreviewImagesSpy = jest.spyOn(component, 'setPreviewImages');

      component.ngOnInit();
      component.imageFileControl?.setValue(file);
      tick();

      expect(component.imageNameUploaded()).toBe('test.png');
      expect(setPreviewImagesSpy).toHaveBeenCalledWith(file);
    }));

    it('should handle imageUrl and imageName changes', fakeAsync(() => {
      component.ngOnInit();
      component.imageUrlControl?.setValue('http://example.com/image.png');
      component.imageNameControl?.setValue('image.png');
      tick();

      expect(component.imageNameUploaded()).toBe('image.png');
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        CreateEditPopupAnnouncementActions.setPreviewImages({
          images: [
            { image: 'image.png', imageData: 'http://example.com/image.png' },
          ],
        })
      );
    }));

    it('should not handle imageUrl and imageName changes when values are empty', fakeAsync(() => {
      component.ngOnInit();
      component.imageUrlControl?.setValue('');
      component.imageNameControl?.setValue('');
      tick();

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    }));
  });

  describe('Form Validation Methods', () => {
    describe('reValidateForm', () => {
      it('should set validators for IMMEDIATELY type', () => {
        component.reValidateForm(TimePeriodType.IMMEDIATELY);

        expect(component.startDateControl?.validator).toBeNull();
        expect(component.startTimeControl?.validator).toBeNull();
        expect(component.endDateControl?.validator).toBeNull();
        expect(component.endTimeControl?.validator).toBeNull();
        expect(component.endTimeControl?.errors).toBeNull();
      });

      it('should set validators for SPECIFIC_TIME type', () => {
        component.reValidateForm(TimePeriodType.SPECIFIC_TIME);

        expect(component.startDateControl?.validator).not.toBeNull();
        expect(component.startTimeControl?.validator).not.toBeNull();
        expect(component.endDateControl?.validator).toBeNull();
        expect(component.endTimeControl?.validator).toBeNull();
      });

      it('should set validators for TRIGGER_EVENT type', () => {
        component.reValidateForm(TimePeriodType.TRIGGER_EVENT);

        expect(component.startDateControl?.validator).not.toBeNull();
        expect(component.startTimeControl?.validator).not.toBeNull();
      });
    });

    describe('endTimeValidator', () => {
      beforeEach(() => {
        component.formGroup.patchValue({
          start_date: new Date('2024-12-01'),
          start_time: '10:00',
          end_date: new Date('2024-12-01'),
        });
      });

      it('should return null when required fields are missing', () => {
        component.formGroup.patchValue({ start_date: null });
        const control = new FormControl('12:00');

        const result = component.endTimeValidator(control);

        expect(result).toBeNull();
      });

      it('should return required error when endTime is empty', () => {
        const control = new FormControl('');

        const result = component.endTimeValidator(control);

        expect(result).toEqual({ required: true });
      });

      it('should return required error when endTime is only whitespace', () => {
        const control = new FormControl('   ');

        const result = component.endTimeValidator(control);

        expect(result).toEqual({ required: true });
      });

      it('should return invalidEndTime error when end time is before start time', () => {
        const control = new FormControl('09:00');

        const result = component.endTimeValidator(control);

        expect(result).toEqual({ invalidEndTime: true });
      });

      it('should return null when end time is after start time', () => {
        const control = new FormControl('12:00');

        const result = component.endTimeValidator(control);

        expect(result).toBeNull();
      });

      it('should return invalidEndTime error when end time equals start time', () => {
        const control = new FormControl('10:00');

        const result = component.endTimeValidator(control);

        expect(result).toEqual({ invalidEndTime: true });
      });
    });

    describe('startTimeValidator', () => {
      beforeEach(() => {
        component.formMode = 'create';
        component.formGroup.patchValue({
          start_date: new Date('2024-12-01'),
          end_date: new Date('2024-12-01'),
          end_time: '12:00',
        });
      });

      it('should return null when required fields are missing', () => {
        component.formGroup.patchValue({ start_date: null });
        const control = new FormControl('10:00');

        const result = component.startTimeValidator(control);

        expect(result).toBeNull();
      });

      it('should return null when form mode is not create', () => {
        component.formMode = 'edit';
        const control = new FormControl('10:00');

        const result = component.startTimeValidator(control);

        expect(result).toBeNull();
      });

      it('should return required error when startTime is empty', () => {
        const control = new FormControl('');

        const result = component.startTimeValidator(control);

        expect(result).toEqual(null);
      });

      it('should return required error when startTime is only whitespace', () => {
        const control = new FormControl('   ');

        const result = component.startTimeValidator(control);

        expect(result).toEqual({ required: true });
      });

      it('should return invalidStartTime error when start time is in the past', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        component.formGroup.patchValue({ start_date: pastDate });

        const control = new FormControl('10:00');

        const result = component.startTimeValidator(control);

        expect(result).toEqual({ invalidStartTime: true });
      });

      it('should return null when start time is in the future', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        component.formGroup.patchValue({ start_date: futureDate });

        const control = new FormControl('10:00');

        const result = component.startTimeValidator(control);

        expect(result).toBeNull();
      });
    });
  });

  describe('File Handling Methods', () => {
    describe('onFileDropped', () => {
      it('should handle valid file drop', () => {
        const fileDragDrop = {
          file: new File([''], 'test.png', { type: 'image/png' }),
          size: { width: 1372, height: 1980 },
        };

        mockCheckImageMimeType.mockReturnValue(true);

        component.onFileDropped(fileDragDrop);

        expect(component.imageFileControl?.value).toEqual(fileDragDrop.file);
      });

      it('should handle invalid file format', () => {
        const fileDragDrop = {
          file: new File([''], 'test.txt', { type: 'text/plain' }),
          size: { width: 1372, height: 1980 },
        };

        mockCheckImageMimeType.mockReturnValue(false);
        const openWarningDialogSpy = jest.spyOn(
          component,
          'openWarningFileSizeDialog'
        );

        component.onFileDropped(fileDragDrop);

        expect(openWarningDialogSpy).toHaveBeenCalled();
        expect(component.imageFileControl?.value).toBeNull();
      });

      it('should handle invalid file size', () => {
        const fileDragDrop = {
          file: new File([''], 'test.png', { type: 'image/png' }),
          size: { width: 100, height: 100 },
        };

        mockCheckImageMimeType.mockReturnValue(true);
        const openWarningDialogSpy = jest.spyOn(
          component,
          'openWarningFileSizeDialog'
        );

        component.onFileDropped(fileDragDrop);

        expect(openWarningDialogSpy).toHaveBeenCalled();
        expect(component.imageFileControl?.value).toBeNull();
      });

      it('should handle invalid file format and invalid size', () => {
        const fileDragDrop = {
          file: new File([''], 'test.txt', { type: 'text/plain' }),
          size: { width: 100, height: 100 },
        };

        mockCheckImageMimeType.mockReturnValue(false);
        const openWarningDialogSpy = jest.spyOn(
          component,
          'openWarningFileSizeDialog'
        );

        component.onFileDropped(fileDragDrop);

        expect(openWarningDialogSpy).toHaveBeenCalled();
        expect(component.imageFileControl?.value).toBeNull();
      });
    });

    describe('onFileSelected', () => {
      it('should handle valid file selection', fakeAsync(() => {
        const file = new File([''], 'test.png', { type: 'image/png' });
        const event = {
          target: {
            files: [file],
            value: '',
          } as any,
        } as any;

        mockCheckImageMimeType.mockReturnValue(true);
        mockGetImageSizeOser.mockReturnValue(of({ width: 1372, height: 1980 }));

        component.onFileSelected(event);
        tick();

        expect(component.imageFileControl?.value).toBe(file);
      }));

      it('should handle invalid file size in file selection', fakeAsync(() => {
        const file = new File([''], 'test.png', { type: 'image/png' });
        const inputElement = {
          files: [file],
          value: 'test.png',
        } as any;
        const event = { target: inputElement } as Event;

        mockCheckImageMimeType.mockReturnValue(true);
        mockGetImageSizeOser.mockReturnValue(of({ width: 100, height: 100 }));
        const openWarningDialogSpy = jest.spyOn(
          component,
          'openWarningFileSizeDialog'
        );

        component.onFileSelected(event);
        tick();

        expect(openWarningDialogSpy).toHaveBeenCalled();
        expect(inputElement.value).toBe('');
      }));

      it('should handle invalid file format in file selection', fakeAsync(() => {
        const file = new File([''], 'test.txt', { type: 'text/plain' });
        const inputElement = {
          files: [file],
          value: 'test.txt',
        } as any;
        const event = { target: inputElement } as Event;

        mockCheckImageMimeType.mockReturnValue(false);
        mockGetImageSizeOser.mockReturnValue(of({ width: 1372, height: 1980 }));
        const openWarningDialogSpy = jest.spyOn(
          component,
          'openWarningFileSizeDialog'
        );

        component.onFileSelected(event);
        tick();

        expect(openWarningDialogSpy).toHaveBeenCalled();
        expect(inputElement.value).toBe('');
      }));

      it('should handle null size response', fakeAsync(() => {
        const file = new File([''], 'test.png', { type: 'image/png' });
        const inputElement = {
          files: [file],
          value: 'test.png',
        } as any;
        const event = { target: inputElement } as Event;

        mockCheckImageMimeType.mockReturnValue(true);
        mockGetImageSizeOser.mockReturnValue(of(null));
        const openWarningDialogSpy = jest.spyOn(
          component,
          'openWarningFileSizeDialog'
        );

        component.onFileSelected(event);
        tick();

        expect(openWarningDialogSpy).toHaveBeenCalled();
        expect(inputElement.value).toBe('');
      }));

      it('should handle no files selected', () => {
        const event = {
          target: { files: null } as HTMLInputElement,
        } as any;

        const result = component.onFileSelected(event);

        expect(result).toBeUndefined();
      });

      it('should handle empty files array', () => {
        const event = {
          target: { files: [] as any } as any,
        } as any;

        const result = component.onFileSelected(event);

        expect(result).toBeUndefined();
      });
    });

    describe('setPreviewImages', () => {
      it('should set preview images and dispatch action', (done) => {
        const file = new File(['test content'], 'test.png', {
          type: 'image/png',
        });

        // Mock FileReader
        const mockFileReader = {
          onload: null as any,
          result: 'data:image/png;base64,testdata',
          readAsDataURL: jest.fn(function (this: any) {
            setTimeout(() => {
              if (this.onload) {
                this.onload();
              }
            }, 0);
          }),
        };

        global.FileReader = jest.fn(() => mockFileReader) as any;

        component.setPreviewImages(file);

        setTimeout(() => {
          expect(mockStore.dispatch).toHaveBeenCalledWith(
            CreateEditPopupAnnouncementActions.setPreviewImages({
              images: [
                {
                  image: 'test.png',
                  imageData: 'data:image/png;base64,testdata',
                },
              ],
            })
          );
          done();
        }, 10);
      });
    });
  });

  describe('Dialog Methods', () => {
    it('should open warning dialog with correct configuration', () => {
      component.openWarningFileSizeDialog();

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'The file you uploaded is not supported.',
          message:
            'Please upload a file in one of the following format SVG, PNG, JPG or GIF (1372 x 1980 px)',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'warning',
        },
      });
    });
  });

  describe('Utility Methods', () => {
    it('should return correct dropdown value', () => {
      const dropdownOptions = [
        { value: 'Option 1', code: 'opt1' },
        { value: 'Option 2', code: 'opt2' },
      ];

      expect(component.getDropdownValue('opt1', dropdownOptions)).toBe(
        'Option 1'
      );
      expect(component.getDropdownValue('opt2', dropdownOptions)).toBe(
        'Option 2'
      );
      expect(component.getDropdownValue('nonexistent', dropdownOptions)).toBe(
        ''
      );
      expect(component.getDropdownValue(null, dropdownOptions)).toBe('');
    });
  });

  describe('Component Properties', () => {
    it('should have correct initial properties', () => {
      expect(component.sendTimeTypes).toEqual([
        { value: 'Specific time', code: TimePeriodType.SPECIFIC_TIME },
      ]);
      expect(component.imageNameUploaded()).toBe('Upload file');
      expect(component.currentDate).toBeInstanceOf(Date);
      expect(component.formMode).toBe('create');
      expect(component.pushNotificationType).toBe(TimePeriodType);
    });

    it('should update imageNameUploaded signal', () => {
      component.imageNameUploaded.set('new-image.png');
      expect(component.imageNameUploaded()).toBe('new-image.png');
    });
  });

  describe('Form Integration', () => {
    it('should handle form mode changes', () => {
      component.formMode = 'view';
      expect(component.formMode).toBe('view');

      component.formMode = 'edit';
      expect(component.formMode).toBe('edit');
    });

    it('should handle form group changes', () => {
      const newFormGroup = new FormBuilder().group({
        send_time_type: [''],
        start_date: [''],
        start_time: [''],
        end_date: [''],
        end_time: [''],
        isSetEndDate: [false],
        published: [false],
        bannerName: [''],
        dontShowButton: [false],
        imageFile: [null],
        imageUrl: [''],
        imageName: [''],
      });

      component.formGroup = newFormGroup;
      expect(component.formGroup).toBe(newFormGroup);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined form controls gracefully', () => {
      component.formGroup = new FormBuilder().group({});

      expect(component.sendTimeTypeControl).toBeNull();
      expect(component.startDateControl).toBeNull();
      expect(component.startTimeControl).toBeNull();
      expect(component.endDateControl).toBeNull();
      expect(component.endTimeControl).toBeNull();
    });

    it('should handle malformed time values in validators', () => {
      component.formGroup.patchValue({
        start_date: new Date('2024-12-01'),
        start_time: 'invalid:time',
        end_date: new Date('2024-12-01'),
      });

      const control = new FormControl('12:00');
      expect(() => component.endTimeValidator(control)).not.toThrow();
    });

    it('should handle invalid date values in validators', () => {
      component.formGroup.patchValue({
        start_date: 'invalid-date',
        start_time: '10:00',
        end_date: 'invalid-date',
      });

      const control = new FormControl('12:00');
      expect(() => component.endTimeValidator(control)).not.toThrow();
    });
  });

  describe('Component Lifecycle', () => {
    it('should properly destroy subscriptions on component destroy', () => {
      const destroySpy = jest.spyOn(component['destroy$'], 'next');
      const completeDestroySpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeDestroySpy).toHaveBeenCalled();
    });
  });
});
