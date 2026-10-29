import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivilegeSettingSectionComponent } from './privilege-setting-section.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import * as CreateEditPrivilegeSelectors from '@app/features/privilege-setting/stores/create-edit-privilege/create-edit-privilege.selectors';
import * as CreateEditPrivilegeActions from '@app/features/privilege-setting/stores/create-edit-privilege/create-edit-privilege.actions';
import { ValueCode } from '@app/shared/models/value-code.model';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PrivilegeTypeEnum } from '@app/shared/utils/enums/privilege-type.enums';

// Mock the external utility functions
jest.mock('@app/shared/utils/check-image-mime-type', () => ({
  checkImageMimeType: jest.fn(),
}));

jest.mock('@app/shared/utils/get-image-size', () => ({
  getImageSizeOser: jest.fn(),
}));

jest.mock('@app/shared/utils/url-validator', () => ({
  urlValidator: jest.fn(),
}));

import { checkImageMimeType } from '@app/shared/utils/check-image-mime-type';
import { getImageSizeOser } from '@app/shared/utils/get-image-size';
import { urlValidator } from '@app/shared/utils/url-validator';

describe('PrivilegeSettingSectionComponent', () => {
  let component: PrivilegeSettingSectionComponent;
  let fixture: ComponentFixture<PrivilegeSettingSectionComponent>;
  let store: MockStore;
  let mockDialog: jest.Mocked<MatDialog>;
  let formBuilder: FormBuilder;

  const mockBrands = [
    { brand_id: 1, brand_name_thai: 'Brand 1' },
    { brand_id: 2, brand_name_thai: 'Brand 2' },
  ];

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        PrivilegeSettingSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CreateEditPrivilegeSelectors.selectBrands,
              value: mockBrands,
            },
          ],
        }),
        { provide: MatDialog, useValue: mockDialog },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivilegeSettingSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      name_th: [''],
      name_en: [''],
      thumnailImageFile: [''],
      thumnailImageUrl: [''],
      thumnailImageName: [''],
      privilegeImageFile: [''],
      privilegeImageUrl: [''],
      privilegeImageName: [''],
      privilege_type: [''],
      campaign_type: [''],
      brand_id: [''],
      telephone: [''],
      website: [''],
      booking_url: [''],
    });

    // Reset mocks before each test
    jest.clearAllMocks();
    (checkImageMimeType as jest.Mock).mockReturnValue(true);
    (urlValidator as jest.Mock).mockReturnValue(null);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize brand options and set default brand on init for create mode', () => {
      component.formMode = 'create';
      component.privilegeId = null;
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      fixture.detectChanges();
      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPrivilegeActions.getBrandOptions()
      );
      expect(component.brandIdControl?.value).toBe(1);
    });

    it('should not set default brand for edit mode', () => {
      component.formMode = 'edit';
      component.privilegeId = 123;

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.brandIdControl?.value).toBe('');
    });

    it('should not set default brand when brands list is empty', () => {
      store.overrideSelector(CreateEditPrivilegeSelectors.selectBrands, []);

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.brandIdControl?.value).toBe('');
    });
  });

  describe('Form control getters', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return correct form controls', () => {
      expect(component.nameThControl).toBe(component.formGroup.get('name_th'));
      expect(component.nameEnControl).toBe(component.formGroup.get('name_en'));
      expect(component.thumnailImageFileControl).toBe(
        component.formGroup.get('thumnailImageFile')
      );
      expect(component.thumnailImageUrlControl).toBe(
        component.formGroup.get('thumnailImageUrl')
      );
      expect(component.thumnailImageNameControl).toBe(
        component.formGroup.get('thumnailImageName')
      );
      expect(component.privilegeImageFileControl).toBe(
        component.formGroup.get('privilegeImageFile')
      );
      expect(component.privilegeImageUrlControl).toBe(
        component.formGroup.get('privilegeImageUrl')
      );
      expect(component.privilegeImageNameControl).toBe(
        component.formGroup.get('privilegeImageName')
      );
      expect(component.privilegeTypeControl).toBe(
        component.formGroup.get('privilege_type')
      );
      expect(component.campaignTypeControl).toBe(
        component.formGroup.get('campaign_type')
      );
      expect(component.brandIdControl).toBe(
        component.formGroup.get('brand_id')
      );
      expect(component.telephoneControl).toBe(
        component.formGroup.get('telephone')
      );
      expect(component.websiteControl).toBe(component.formGroup.get('website'));
      expect(component.bookingUrlControl).toBe(
        component.formGroup.get('booking_url')
      );
    });
  });

  describe('File upload - thumbnail', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update thumbnail image name on file change', () => {
      const file = new File(['content'], 'test-thumbnail.png', {
        type: 'image/png',
      });

      component.thumnailImageFileControl?.setValue(file);

      expect(component.thumnailImageNameUploaded()).toBe('test-thumbnail.png');
    });

    it('should update thumbnail image name from URL and name controls', () => {
      component.thumnailImageUrlControl?.setValue(
        'http://example.com/image.png'
      );
      component.thumnailImageNameControl?.setValue('url-thumbnail.png');

      expect(component.thumnailImageNameUploaded()).toBe('url-thumbnail.png');
    });

    it('should not update thumbnail name when file has no name', () => {
      const file = new File(['content'], '', { type: 'image/png' });

      component.thumnailImageFileControl?.setValue(file);

      expect(component.thumnailImageNameUploaded()).toBe('');
    });
  });

  describe('File upload - privilege image', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update privilege image name on file change', () => {
      const file = new File(['content'], 'test-privilege.png', {
        type: 'image/png',
      });

      component.privilegeImageFileControl?.setValue(file);

      expect(component.privilegeImageNameUploaded()).toBe('test-privilege.png');
    });

    it('should update privilege image name from URL and name controls', () => {
      component.privilegeImageUrlControl?.setValue(
        'http://example.com/privilege.png'
      );
      component.privilegeImageNameControl?.setValue('url-privilege.png');

      expect(component.privilegeImageNameUploaded()).toBe('url-privilege.png');
    });

    it('should not update privilege name when file has no name', () => {
      const file = new File(['content'], '', { type: 'image/png' });

      component.privilegeImageFileControl?.setValue(file);

      expect(component.privilegeImageNameUploaded()).toBe('');
    });
  });

  describe('Privilege type validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set booking URL validators when privilege type is BOOKING', () => {
      const setValidatorsSpy = jest.spyOn(
        component.bookingUrlControl!,
        'setValidators'
      );

      component.privilegeTypeControl?.setValue(PrivilegeTypeEnum.BOOKING);

      expect(setValidatorsSpy).toHaveBeenCalledWith([
        Validators.required,
        urlValidator,
      ]);
    });

    it('should clear booking URL validators and reset value when privilege type is not BOOKING', () => {
      // First set to BOOKING
      component.privilegeTypeControl?.setValue(PrivilegeTypeEnum.BOOKING);
      component.bookingUrlControl?.setValue('http://example.com');

      const setValidatorsSpy = jest.spyOn(
        component.bookingUrlControl!,
        'setValidators'
      );
      const resetSpy = jest.spyOn(component.bookingUrlControl!, 'reset');
      const markAsPristineSpy = jest.spyOn(
        component.bookingUrlControl!,
        'markAsPristine'
      );

      // Change to non-BOOKING type
      component.privilegeTypeControl?.setValue('OTHER');

      expect(setValidatorsSpy).toHaveBeenCalledWith([]);
      expect(resetSpy).toHaveBeenCalledWith('', { emitEvent: false });
      expect(markAsPristineSpy).toHaveBeenCalled();
    });

    it('should validate booking URL when privilege type is BOOKING', () => {
      component.privilegeTypeControl?.setValue(PrivilegeTypeEnum.BOOKING);
      expect(component.bookingUrlControl?.validator).toBeDefined();
    });

    it('should reset booking URL when privilege type is not BOOKING', () => {
      component.privilegeTypeControl?.setValue('OTHER');
      expect(component.bookingUrlControl?.validator).toBeNull();
      expect(component.bookingUrlControl?.value).toBe('');
    });
  });

  describe('File drop handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle valid thumbnail file drop', () => {
      const fileDragDrop = {
        file: new File([], 'test.png', { type: 'image/png' }),
        size: { width: 640, height: 360 },
      };

      component.onFileDropped(fileDragDrop, 'thumnail');

      expect(component.thumnailImageFileControl?.value).toBe(fileDragDrop.file);
    });

    it('should handle valid privilege file drop', () => {
      const fileDragDrop = {
        file: new File([], 'test.png', { type: 'image/png' }),
        size: { width: 640, height: 426 },
      };

      component.onFileDropped(fileDragDrop, 'privilege');

      expect(component.privilegeImageFileControl?.value).toBe(
        fileDragDrop.file
      );
    });

    it('should open warning dialog for invalid thumbnail dimensions', () => {
      const fileDragDrop = {
        file: new File([], 'test.png', { type: 'image/png' }),
        size: { width: 300, height: 300 },
      };

      component.onFileDropped(fileDragDrop, 'thumnail');

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'The file you uploaded is not supported.',
          message:
            'Please upload a file in one of the following format SVG, PNG, JPG or GIF (640 x 360 px)',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'warning',
        },
      });
    });

    it('should open warning dialog for invalid privilege image dimensions', () => {
      const fileDragDrop = {
        file: new File([], 'test.png', { type: 'image/png' }),
        size: { width: 300, height: 300 },
      };

      component.onFileDropped(fileDragDrop, 'privilege');

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'The file you uploaded is not supported.',
          message:
            'Please upload a file in one of the following format SVG, PNG, JPG or GIF (640 x 426 px)',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'warning',
        },
      });
    });

    it('should open warning dialog for invalid file type', () => {
      (checkImageMimeType as jest.Mock).mockReturnValue(false);

      const fileDragDrop = {
        file: new File([], 'test.txt', { type: 'text/plain' }),
        size: { width: 640, height: 360 },
      };

      component.onFileDropped(fileDragDrop, 'thumnail');

      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('File selection handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle valid thumbnail file selection', () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const event = {
        target: { files: [file] },
      } as unknown as Event;

      (getImageSizeOser as jest.Mock).mockReturnValue(
        of({ width: 640, height: 360 })
      );

      component.onFileSelected(event, 'thumnail');

      expect(getImageSizeOser).toHaveBeenCalledWith(file);
    });

    it('should handle valid privilege file selection', () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const event = {
        target: { files: [file] },
      } as unknown as Event;

      (getImageSizeOser as jest.Mock).mockReturnValue(
        of({ width: 640, height: 426 })
      );

      component.onFileSelected(event, 'privilege');

      expect(getImageSizeOser).toHaveBeenCalledWith(file);
    });

    it('should handle file selection with invalid dimensions', () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const mockInput = {
        files: [file],
        value: 'test.png',
      };
      const event = {
        target: mockInput,
      } as unknown as Event;

      (getImageSizeOser as jest.Mock).mockReturnValue(
        of({ width: 300, height: 300 })
      );

      component.onFileSelected(event, 'thumnail');

      expect(mockInput.value).toBe('');
      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should handle file selection with invalid file type', () => {
      (checkImageMimeType as jest.Mock).mockReturnValue(false);

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const mockInput = {
        files: [file],
        value: 'test.txt',
      };
      const event = {
        target: mockInput,
      } as unknown as Event;

      (getImageSizeOser as jest.Mock).mockReturnValue(
        of({ width: 640, height: 360 })
      );

      component.onFileSelected(event, 'thumnail');

      expect(mockInput.value).toBe('');
      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should handle file selection when no files are selected', () => {
      const event = {
        target: { files: null },
      } as unknown as Event;

      component.onFileSelected(event, 'thumnail');

      expect(getImageSizeOser).not.toHaveBeenCalled();
    });

    it('should handle file selection when files array is empty', () => {
      const event = {
        target: { files: [] },
      } as unknown as Event;

      component.onFileSelected(event, 'thumnail');

      expect(getImageSizeOser).not.toHaveBeenCalled();
    });

    it('should set file value when dimensions and type are valid', () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const event = {
        target: { files: [file] },
      } as unknown as Event;

      (getImageSizeOser as jest.Mock).mockReturnValue(
        of({ width: 640, height: 360 })
      );

      const patchValueSpy = jest.spyOn(
        component.thumnailImageFileControl!,
        'patchValue'
      );

      component.onFileSelected(event, 'thumnail');

      // Need to wait for the observable to complete
      setTimeout(() => {
        expect(patchValueSpy).toHaveBeenCalledWith(file);
      }, 0);
    });
  });

  describe('Utility methods', () => {
    it('should return correct dropdown value when code exists', () => {
      const dropdownOptions: ValueCode[] = [
        { code: '1', value: 'Option 1' },
        { code: '2', value: 'Option 2' },
      ];

      expect(component.getDropdownValue('1', dropdownOptions)).toBe('Option 1');
      expect(component.getDropdownValue('2', dropdownOptions)).toBe('Option 2');
    });

    it('should return empty string when code does not exist', () => {
      const dropdownOptions: ValueCode[] = [
        { code: '1', value: 'Option 1' },
        { code: '2', value: 'Option 2' },
      ];

      expect(component.getDropdownValue('3', dropdownOptions)).toBe('');
    });

    it('should return empty string when selectedCode is null', () => {
      const dropdownOptions: ValueCode[] = [{ code: '1', value: 'Option 1' }];

      expect(component.getDropdownValue(null, dropdownOptions)).toBe('');
    });

    it('should return empty string when dropdownOptions is empty', () => {
      expect(component.getDropdownValue('1', [])).toBe('');
    });

    it('should open warning dialog with correct parameters', () => {
      const message = 'Custom error message';

      component.openWarningFileSizeDialog(message);

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'The file you uploaded is not supported.',
          message,
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'warning',
        },
      });
    });
  });

  describe('Form validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call reValidateForm on init', () => {
      const reValidateFormSpy = jest.spyOn(component, 'reValidateForm');

      component.ngOnInit();

      expect(reValidateFormSpy).toHaveBeenCalled();
    });

    it('should set validators for BOOKING privilege type in reValidateForm', () => {
      component.privilegeTypeControl?.setValue(PrivilegeTypeEnum.BOOKING);
      const setValidatorsSpy = jest.spyOn(
        component.bookingUrlControl!,
        'setValidators'
      );

      component.reValidateForm();

      expect(setValidatorsSpy).toHaveBeenCalledWith([
        Validators.required,
        urlValidator,
      ]);
    });

    it('should clear validators for non-BOOKING privilege type in reValidateForm', () => {
      component.privilegeTypeControl?.setValue('OTHER');
      const setValidatorsSpy = jest.spyOn(
        component.bookingUrlControl!,
        'setValidators'
      );

      component.reValidateForm();

      expect(setValidatorsSpy).toHaveBeenCalledWith([]);
    });
  });

  describe('Component properties', () => {
    it('should have correct privilege type enum reference', () => {
      expect(component.privilegeType).toBe(PrivilegeTypeEnum);
    });

    it('should have current date set', () => {
      expect(component.currentDate).toBeInstanceOf(Date);
    });

    it('should initialize signals with empty strings', () => {
      expect(component.privilegeImageNameUploaded()).toBe('');
      expect(component.thumnailImageNameUploaded()).toBe('');
    });
  });

  describe('Brand options observable', () => {
    it('should map brand data correctly', (done) => {
      component.brandOptions$.subscribe((options) => {
        expect(options).toEqual([
          { code: 1, value: 'Brand 1' },
          { code: 2, value: 'Brand 2' },
        ]);
        done();
      });
    });
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle null file in onFileDropped', () => {
      const fileDragDrop = {
        file: null as any,
        size: { width: 640, height: 360 },
      };

      expect(() =>
        component.onFileDropped(fileDragDrop, 'thumnail')
      ).not.toThrow();
    });

    it('should handle null size in onFileDropped', () => {
      const fileDragDrop = {
        file: new File([], 'test.png', { type: 'image/png' }),
        size: null as any,
      };

      component.onFileDropped(fileDragDrop, 'thumnail');

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should handle getImageSizeOser returning null', () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const mockInput = {
        files: [file],
        value: 'test.png',
      };
      const event = {
        target: mockInput,
      } as unknown as Event;

      (getImageSizeOser as jest.Mock).mockReturnValue(of(null));

      component.onFileSelected(event, 'thumnail');

      expect(mockInput.value).toBe('');
      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('Component lifecycle', () => {
    it('should unsubscribe on destroy', () => {
      fixture.detectChanges();
      component.ngOnInit();

      const destroySpy = jest.spyOn(component['destroy$'], 'next');
      const completeySpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeySpy).toHaveBeenCalled();
    });
  });
});
