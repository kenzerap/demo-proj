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
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { checkImageMimeType } from '@app/shared/utils/check-image-mime-type';
import { getImageSizeOser } from '@app/shared/utils/get-image-size';
import * as CreateEditSplashScreenActions from '@app/features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.actions';
import * as CreateEditSplashScreenSelectors from '@app/features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.selectors';

jest.mock('@app/shared/utils/check-image-mime-type');
jest.mock('@app/shared/utils/get-image-size');

describe('BaseSettingSectionComponent', () => {
  let component: BaseSettingSectionComponent;
  let fixture: ComponentFixture<BaseSettingSectionComponent>;
  let mockDialog: jest.Mocked<MatDialog>;
  let store: MockStore;

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

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BaseSettingSectionComponent,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector:
                CreateEditSplashScreenSelectors.selectSplashScreenDisplayOrders,
              value: [],
            },
          ],
        }),
        { provide: MatDialog, useValue: mockDialog },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseSettingSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    component.formGroup = new FormBuilder().group({
      send_time_type: [TimePeriodType.SPECIFIC_TIME],
      start_date: [''],
      start_time: [''],
      isSetEndDate: [false],
      end_date: [''],
      end_time: [''],
      is_active: [false],
      name_en: [''],
      name_th: [''],
      description_en: [''],
      description_th: [''],
      display_order: [''],
      imageFile: [null],
      imageUrl: [''],
      imageName: [''],
    });

    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getSplashScreenDisplayOrders on init', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      CreateEditSplashScreenActions.getSplashScreenDisplayOrders()
    );
  });

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
    expect(component.endDateControl).toBe(component.formGroup.get('end_date'));
    expect(component.endTimeControl).toBe(component.formGroup.get('end_time'));
    expect(component.isSetEndDateControl).toBe(
      component.formGroup.get('isSetEndDate')
    );
    expect(component.isActiveControl).toBe(
      component.formGroup.get('is_active')
    );
    expect(component.nameEnControl).toBe(component.formGroup.get('name_en'));
    expect(component.nameThControl).toBe(component.formGroup.get('name_th'));
    expect(component.descriptionEnControl).toBe(
      component.formGroup.get('description_en')
    );
    expect(component.descriptionThControl).toBe(
      component.formGroup.get('description_th')
    );
    expect(component.displayOrderControl).toBe(
      component.formGroup.get('display_order')
    );
  });

  it('should reset date/time fields when send time type changes', fakeAsync(() => {
    component.ngOnInit();
    component.formGroup.patchValue({
      start_date: '2024-01-01',
      start_time: '10:00',
      end_date: '2024-01-02',
      end_time: '12:00',
    });

    component.sendTimeTypeControl?.setValue(TimePeriodType.IMMEDIATELY);
    tick();

    expect(component.startDateControl?.value).toBeNull();
    expect(component.startTimeControl?.value).toBeNull();
    expect(component.endDateControl?.value).toBeNull();
    expect(component.endTimeControl?.value).toBeNull();
  }));

  describe('reValidateForm', () => {
    it('should clear validators for IMMEDIATELY type', () => {
      component.reValidateForm(TimePeriodType.IMMEDIATELY);

      expect(component.startDateControl?.validator).toBeNull();
      expect(component.startTimeControl?.validator).toBeNull();
      expect(component.endDateControl?.validator).toBeNull();
      expect(component.endTimeControl?.validator).toBeNull();
    });

    it('should set start date/time required and clear end date/time validators for SPECIFIC_TIME type', () => {
      component.reValidateForm(TimePeriodType.SPECIFIC_TIME);

      expect(component.startDateControl?.validator).not.toBeNull();
      expect(component.startTimeControl?.validator).not.toBeNull();
      expect(component.endDateControl?.validator).toBeNull();
      expect(component.endTimeControl?.validator).toBeNull();
    });
  });

  describe('isSetEndDate toggle', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.sendTimeTypeControl?.setValue(TimePeriodType.SPECIFIC_TIME, {
        emitEvent: false,
      });
    });

    it('should set required validators on end date/time when checked', fakeAsync(() => {
      component.isSetEndDateControl?.setValue(true);
      tick();

      expect(component.endDateControl?.validator).not.toBeNull();
      expect(component.endTimeControl?.validator).not.toBeNull();
    }));

    it('should clear end date/time when unchecked', fakeAsync(() => {
      component.formGroup.patchValue({
        end_date: '2024-01-02',
        end_time: '12:00',
      });
      component.isSetEndDateControl?.setValue(true);
      tick();

      component.isSetEndDateControl?.setValue(false);
      tick();

      expect(component.endDateControl?.value).toBeNull();
      expect(component.endTimeControl?.value).toBeNull();
      expect(component.endDateControl?.validator).toBeNull();
      expect(component.endTimeControl?.validator).toBeNull();
    }));

    it('should reset isSetEndDate when send time type changes', fakeAsync(() => {
      component.isSetEndDateControl?.setValue(true);
      tick();

      component.sendTimeTypeControl?.setValue(TimePeriodType.IMMEDIATELY);
      tick();

      expect(component.isSetEndDateControl?.value).toBe(false);
    }));
  });

  describe('endTimeValidator', () => {
    beforeEach(() => {
      component.formGroup.patchValue({
        start_date: new Date('2024-12-01'),
        start_time: '10:00',
        end_date: new Date('2024-12-01'),
      });
    });

    it('should return invalidEndTime error when end time is before start time', () => {
      const control = new FormControl('09:00');
      expect(component.endTimeValidator(control)).toEqual({
        invalidEndTime: true,
      });
    });

    it('should return null when end time is after start time', () => {
      const control = new FormControl('12:00');
      expect(component.endTimeValidator(control)).toBeNull();
    });
  });

  describe('displayOrdersValidator', () => {
    it('should return null when value is not used', () => {
      component.splashScreenDisplayOrders.set([1, 2, 3]);
      const control = new FormControl(4);

      expect(component.displayOrdersValidator(control)).toBeNull();
    });

    it('should return displayOrderExists error when value is already used', () => {
      component.splashScreenDisplayOrders.set([1, 2, 3]);
      const control = new FormControl(2);

      expect(component.displayOrdersValidator(control)).toEqual({
        displayOrderExists: true,
      });
    });

    it('should allow the current splash screen display order when editing', () => {
      component.splashScreenDetail = { display_order: 2 } as any;
      component.splashScreenDisplayOrders.set([1, 2, 3]);
      const control = new FormControl(2);

      expect(component.displayOrdersValidator(control)).toBeNull();
    });
  });

  describe('File Handling Methods', () => {
    it('should patch imageFile when drop size and type are valid', () => {
      const fileDragDrop = {
        file: new File([''], 'test.png', { type: 'image/png' }),
        size: { width: 1030, height: 768 },
      };
      mockCheckImageMimeType.mockReturnValue(true);

      component.onFileDropped(fileDragDrop);

      expect(component.imageFileControl?.value).toEqual(fileDragDrop.file);
    });

    it('should open warning dialog when drop size is invalid', () => {
      const fileDragDrop = {
        file: new File([''], 'test.png', { type: 'image/png' }),
        size: { width: 100, height: 100 },
      };
      mockCheckImageMimeType.mockReturnValue(true);

      component.onFileDropped(fileDragDrop);

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'The file you uploaded is not supported.',
          message:
            'Please upload a file in one of the following format SVG, PNG, JPG or GIF (1030 x 768 px)',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'warning',
        },
      });
    });

    it('should handle file selection with valid size', fakeAsync(() => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      const event = {
        target: { files: [file], value: '' } as any,
      } as any;

      mockCheckImageMimeType.mockReturnValue(true);
      mockGetImageSizeOser.mockReturnValue(of({ width: 1030, height: 768 }));

      component.onFileSelected(event);
      tick();

      expect(component.imageFileControl?.value).toBe(file);
    }));
  });
});
