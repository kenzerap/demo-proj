import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseSettingSectionComponent } from './base-setting-section.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, ReplaySubject } from 'rxjs';
import { AddPrivilegeTypeDialogComponent } from '../add-privilege-type-dialog/add-privilege-type-dialog.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import * as CreateEditBrandActions from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.actions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockActions } from '@ngrx/effects/testing';

describe('BaseSettingSectionComponent', () => {
  let component: BaseSettingSectionComponent;
  let fixture: ComponentFixture<BaseSettingSectionComponent>;
  let mockDialog: jest.Mocked<MatDialog>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ brand_category_id: 1 })),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BaseSettingSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: mockDialog },
        FormBuilder,
        provideMockActions(() => actions$)
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseSettingSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    component.formGroup = new FormBuilder().group({
      is_active: [false],
      brand_name_english: [''],
      brand_name_thai: [''],
      brand_category_id: [''],
      display_order: [''],
      imageFile: [null],
      imageUrl: [''],
      imageName: [''],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize displayOrderControl validators', () => {
    const control = component.displayOrderControl;
    expect(control?.validator).toBeDefined();
  });

  it('should dispatch getBrandDisplayOrders on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditBrandActions.getBrandDisplayOrders()
    );
  });

  it('should update imageNameUploaded when imageFileControl value changes', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    component.imageFileControl?.setValue(file);
    expect(component.imageNameUploaded()).toBe('test.png');
  });

  it('should update imageNameUploaded when imageUrlControl and imageNameControl values change', () => {
    component.imageUrlControl?.setValue('http://example.com/image.png');
    component.imageNameControl?.setValue('image.png');
    expect(component.imageNameUploaded()).toBe('image.png');
  });

  it('should open AddPrivilegeTypeDialogComponent and update selectedBrandCategory', () => {
    component.addPrivilegeType();
    expect(mockDialog.open).toHaveBeenCalledWith(
      AddPrivilegeTypeDialogComponent,
      {
        data: { selectedBrandCategory: null },
        autoFocus: false,
        width: '55rem',
      }
    );

    setTimeout(() => {
      expect(component.selectedBrandCategory()).toEqual({
        brand_category_id: 1,
        brand_category_name_english: '',
        brand_category_name_thai: '',
        display_order: 0,
      });
    }, 0);
  });

  it('should handle file drop with valid size', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const fileDragDrop = { file, size: { width: 1040, height: 1040 } };
    component.onFileDropped(fileDragDrop);
    expect(component.imageFileControl?.value).toBe(file);
  });

  it('should handle file drop with invalid size', () => {
    const fileDragDrop = {
      file: new File([''], 'test.png', { type: 'image/png' }),
      size: { width: 500, height: 500 },
    };
    const openSpy = jest.spyOn(mockDialog, 'open');
    component.onFileDropped(fileDragDrop);
    expect(openSpy).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: 'The file you uploaded is not supported.',
        message:
          'Please upload a file in one of the following format SVG, PNG, JPG or GIF (max. 1040 x 1040px)',
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'warning',
      },
    });
  });

  it('should handle file selection with valid size', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = {
      target: { files: [file] },
    } as unknown as Event;

    jest.spyOn(component, 'openWarningFileSizeDialog');
    jest.spyOn(component, 'onFileSelected');
    jest.spyOn(component, 'imageFileControl', 'get').mockReturnValue({
      patchValue: jest.fn(),
    } as any);

    component.onFileSelected(event);
    expect(component.openWarningFileSizeDialog).not.toHaveBeenCalled();
  });

  it('should validate displayOrderControl asynchronously', () => {
    const control = component.displayOrderControl;
    control?.setValue(1);
    const errors = component.displayOrdersValidatorAsync(control!);
    expect(errors).toBeNull();
  });
});
