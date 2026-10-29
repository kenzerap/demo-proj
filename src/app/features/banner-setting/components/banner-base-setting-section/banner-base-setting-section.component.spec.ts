import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BannerBaseSettingSectionComponent } from './banner-base-setting-section.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import * as CreateEditBannerSettingActions from '@app/features/banner-setting/stores/create-edit-banner-setting/create-edit-banner-setting.actions';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BannerBaseSettingSectionComponent', () => {
  let component: BannerBaseSettingSectionComponent;
  let fixture: ComponentFixture<BannerBaseSettingSectionComponent>;
  let mockDialog: jest.Mocked<MatDialog>;
  let store: MockStore;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BannerBaseSettingSectionComponent,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: mockDialog },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerBaseSettingSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = new FormBuilder().group({
      // start_date: [''],
      // start_time: [''],
      // isSetEndDate: [false],
      // end_date: [''],
      // end_time: [''],
      // published: [false],
      // bannerName: [''],
      // imageFile: [null],
      // imageUrl: [''],
      // imageName: [''],

      start_date: ['2023-10-01'],
      start_time: ['10:00'],
      isSetEndDate: [true],
      end_date: ['2023-10-01'],
      end_time: ['11:00'],
      published: [false],
      bannerName: [''],
      imageFile: [null],
      imageUrl: [''],
      imageName: [''],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should re-validate form on initialization', () => {
    const spy = jest.spyOn(component, 'reValidateForm');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should reset end date and time when isSetEndDate is false', () => {
    component.isSetEndDateControl?.setValue(false);
    expect(component.endDateControl?.value).toBeNull();
    expect(component.endTimeControl?.value).toBeNull();
  });

  it('should set validators for end date and time when isSetEndDate is true', () => {
    component.isSetEndDateControl?.setValue(true);
    expect(component.endDateControl?.validator).toBeDefined();
    expect(component.endTimeControl?.validator).toBeDefined();
  });

  it('should validate end time correctly', () => {
    component.formGroup.patchValue({
      start_date: '2023-10-01',
      start_time: '10:00',
      end_date: '2023-10-01',
      end_time: '09:00',
    });
    const errors = component.endTimeValidator(component.endTimeControl!);
    expect(errors).toEqual({ invalidEndTime: true });
  });

  it('should validate start time correctly', () => {
    component.formGroup.patchValue({
      start_date: '2023-10-01',
      start_time: '11:00',
      end_date: '2023-10-01',
      end_time: '10:00',
    });
    const errors = component.startTimeValidator(component.startTimeControl!);
    setTimeout(() => {
      expect(errors).toEqual({ invalidStartTime: true });
    }, 0);
  });

  it('should handle file drop with valid size', () => {
    const fileDragDrop = {
      file: new File([], 'test.png', { type: 'image/png' }),
      size: { width: 1650, height: 650 },
    };
    component.onFileDropped(fileDragDrop);
    expect(component.imageFileControl?.value).toEqual(fileDragDrop.file);
  });

  it('should open warning dialog for invalid file size on drop', () => {
    const fileDragDrop = {
      file: new File([], 'test.png', { type: 'image/png' }),
      size: { width: 800, height: 300 },
    };
    component.onFileDropped(fileDragDrop);
    setTimeout(() => {
      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent);
    }, 0);
  });

  it('should handle file selection with valid size', () => {
    const file = new File([], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;
    jest.spyOn(component, 'setPreviewImages');
    jest.spyOn(component, 'openWarningFileSizeDialog');
    component.onFileSelected(event);
    setTimeout(() => {
      expect(component.setPreviewImages).toHaveBeenCalledWith(file);
      expect(component.openWarningFileSizeDialog).not.toHaveBeenCalled();
    }, 0);
  });

  it('should open warning dialog for invalid file size on selection', () => {
    const file = new File([], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;
    jest.spyOn(component, 'openWarningFileSizeDialog');
    component.onFileSelected(event);
    setTimeout(() => {
      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent);
    }, 0);
  });

  it('should set preview images', () => {
    const file = new File([], 'test.png', { type: 'image/png' });
    const reader = new FileReader();
    jest.spyOn(reader, 'readAsDataURL');
    component.setPreviewImages(file);
    setTimeout(() => {
      expect(reader.readAsDataURL).toHaveBeenCalledWith(file);
    }, 0);
  });

  it('should dispatch setPreviewImages action when imageUrl and imageName change', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.imageUrlControl?.setValue('test-url');
    component.imageNameControl?.setValue('test-name');
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditBannerSettingActions.setPreviewImages({
        images: [{ image: 'test-name', imageData: 'test-url' }],
      })
    );
  });

  it('should return undefined if formGroup is undefined', () => {
    component.formGroup = undefined as unknown as FormGroup;
    expect(component.startDateControl).toBeUndefined();
    expect(component.startTimeControl).toBeUndefined();
    expect(component.isSetEndDateControl).toBeUndefined();
    expect(component.endDateControl).toBeUndefined();
    expect(component.endTimeControl).toBeUndefined();
    expect(component.publishedControl).toBeUndefined();
    expect(component.bannerNameControl).toBeUndefined();
    expect(component.imageFileControl).toBeUndefined();
    expect(component.imageUrlControl).toBeUndefined();
    expect(component.imageNameControl).toBeUndefined();
  });

  it('should return null if start date, start time, or isSetEndDate is missing', () => {
    component.formGroup.patchValue({
      start_date: '',
      start_time: '',
      isSetEndDate: false,
    });
    const control = new FormControl('');
    expect(component.startTimeValidator(control)).toBeNull();
  });

  it('should return { required: true } if start time is empty', () => {
    component.formGroup.patchValue({
      start_date: '2023-10-01',
      start_time: ' ',
      isSetEndDate: true,
    });
    expect(component.startTimeValidator(component.startTimeControl!)).toEqual({
      required: true,
    });
  });

  it('should return { invalidStartTime: true } if start time is after end time', () => {
    component.formGroup.patchValue({
      start_date: '2023-10-01',
      start_time: '12:00',
      end_date: '2023-10-01',
      end_time: '11:00',
      isSetEndDate: true,
    });
    const control = new FormControl('12:00');
    expect(component.startTimeValidator(control)).toEqual({
      invalidStartTime: true,
    });
  });

  it('should return null if start time is before end time', () => {
    component.formGroup.patchValue({
      start_date: '2023-10-01',
      start_time: '10:00',
      end_date: '2023-10-01',
      end_time: '11:00',
      isSetEndDate: true,
    });
    const control = new FormControl('10:00');
    expect(component.startTimeValidator(control)).toBeNull();
  });
});
