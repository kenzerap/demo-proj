import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPrivilegeTypeDialogComponent } from './add-privilege-type-dialog.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { of, ReplaySubject } from 'rxjs';
import * as CreateEditBrandActions from '../../stores/create-edit-brand/create-edit-brand.actions';
import { BrandCategory } from '../../models/brand-category.model';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockActions } from '@ngrx/effects/testing';
import * as CreateEditBrandSelectors from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DeleteBrandWarningDialogComponent } from '../delete-brand-warning-dialog/delete-brand-warning-dialog.component';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';

describe('AddPrivilegeTypeDialogComponent', () => {
  let component: AddPrivilegeTypeDialogComponent;
  let fixture: ComponentFixture<AddPrivilegeTypeDialogComponent>;
  let store: MockStore;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockDialogRef: jest.Mocked<MatDialogRef<AddPrivilegeTypeDialogComponent>>;
  let actions$: ReplaySubject<any>;

  const mockBrandCategory: BrandCategory = {
    brand_category_id: 1,
    brand_category_name_thai: 'Test Thai',
    brand_category_name_english: 'Test English',
    display_order: 1,
  };

  const mockBrandCategories: BrandCategory[] = [
    mockBrandCategory,
    {
      brand_category_id: 2,
      brand_category_name_thai: 'Test Thai 2',
      brand_category_name_english: 'Test English 2',
      display_order: 2,
    },
  ];

  const mockDialogData = {
    selectedBrandCategory: mockBrandCategory,
  };

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);

    const mockConfirmDialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
    };

    const mockWarningDialogRef = {
      afterClosed: jest.fn().mockReturnValue(of('navigateExit')),
    };

    mockDialog = {
      open: jest.fn().mockImplementation((component) => {
        if (component === ConfirmDialogComponent) {
          return mockConfirmDialogRef;
        }
        if (component === DeleteBrandWarningDialogComponent) {
          return mockWarningDialogRef;
        }
        return mockConfirmDialogRef;
      }),
    } as unknown as jest.Mocked<MatDialog>;

    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<AddPrivilegeTypeDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [
        AddPrivilegeTypeDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDialogModule,
      ],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideProvider(MatDialog, { useValue: mockDialog })
      .compileComponents();

    fixture = TestBed.createComponent(AddPrivilegeTypeDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Override selectors
    store.overrideSelector(
      CreateEditBrandSelectors.selectBrandCategories,
      mockBrandCategories
    );
    store.overrideSelector(
      CreateEditBrandSelectors.selectBrandCategoryDisplayOrders,
      [1, 2]
    );
    store.overrideSelector('selectIsLoading', false);

    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct initial values', () => {
    expect(component.formMode()).toBe('view');
    expect(component.privilegeTypeTableColumns()).toBeDefined();
    expect(component.brandCategoryDisplayOrders()).toEqual([]);
    expect(component.selectedItem()).toBeNull();
  });

  it('should initialize form with correct validators', () => {
    const form = component.createPrivilegeTypeForm;
    expect(form.get('brand_category_id')?.value).toBe('');
    expect(
      form.get('brand_category_name_thai')?.hasError('required')
    ).toBeTruthy();
    expect(
      form.get('brand_category_name_english')?.hasError('required')
    ).toBeTruthy();
    expect(form.get('display_order')?.hasError('required')).toBeTruthy();
  });

  it('should return correct form controls from getters', () => {
    expect(component.brandCategoryIdControl).toBe(
      component.createPrivilegeTypeForm.get('brand_category_id')
    );
    expect(component.brandCategoryNameThaiControl).toBe(
      component.createPrivilegeTypeForm.get('brand_category_name_thai')
    );
    expect(component.brandCategoryNameEnglishControl).toBe(
      component.createPrivilegeTypeForm.get('brand_category_name_english')
    );
    expect(component.displayOrderControl).toBe(
      component.createPrivilegeTypeForm.get('display_order')
    );
  });

  describe('ngOnInit', () => {
    it('should dispatch getBrandCategories action', () => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditBrandActions.getBrandCategories()
      );
    });

    it('should set brandCategoryDisplayOrders on subscription', () => {
      fixture.detectChanges();
      expect(component.brandCategoryDisplayOrders()).toEqual([1, 2]);
    });

    it('should set selectedItem if data.selectedBrandCategory exists', () => {
      fixture.detectChanges();
      expect(component.selectedItem()).toEqual(mockBrandCategory);
    });

    it('should handle createBrandCategorySuccess action', () => {
      jest.spyOn(component.createPrivilegeTypeForm, 'reset');
      jest.spyOn(component.selectedItem, 'set');
      jest.spyOn(component, 'setFormMode');

      fixture.detectChanges();
      actions$.next(CreateEditBrandActions.createBrandCategorySuccess());

      expect(component.createPrivilegeTypeForm.reset).toHaveBeenCalled();
      expect(component.selectedItem.set).toHaveBeenCalledWith(null);
      expect(component.setFormMode).toHaveBeenCalledWith('view');
    });

    it('should handle editBrandCategorySuccess action', () => {
      jest.spyOn(component.createPrivilegeTypeForm, 'reset');
      jest.spyOn(component.selectedItem, 'set');
      jest.spyOn(component, 'setFormMode');

      fixture.detectChanges();
      actions$.next(CreateEditBrandActions.editBrandCategorySuccess());

      expect(component.createPrivilegeTypeForm.reset).toHaveBeenCalled();
      expect(component.selectedItem.set).toHaveBeenCalledWith(null);
      expect(component.setFormMode).toHaveBeenCalledWith('view');
    });

    it('should handle deleteBrandCategorySuccess with existed brands', () => {
      const existedBrands: any[] = [{ brand_id: 1, brand_name: 'Test Brand' }];

      fixture.detectChanges();
      actions$.next(
        CreateEditBrandActions.deleteBrandCategorySuccess({
          existedBrands,
          brandCategoryId: 1,
        })
      );

      expect(mockDialog.open).toHaveBeenCalledWith(
        DeleteBrandWarningDialogComponent,
        {
          data: { brands: existedBrands },
          autoFocus: false,
          width: '30rem',
        }
      );
    });

    it('should handle deleteBrandCategorySuccess without existed brands', () => {
      fixture.detectChanges();
      actions$.next(
        CreateEditBrandActions.deleteBrandCategorySuccess({
          existedBrands: [],
          brandCategoryId: 1,
        })
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        pushMessage({
          messageData: {
            title: 'Delete brand category',
            message: 'Brand category deleted successfully.',
            type: ToastMessageType.SUCCESS,
          },
          duration: 3000,
        })
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditBrandActions.getBrandCategories()
      );
    });
  });

  describe('Form Mode Management', () => {
    it('should set form mode and reset form', () => {
      jest.spyOn(component.createPrivilegeTypeForm, 'reset');

      component.setFormMode('create');

      expect(component.formMode()).toBe('create');
      expect(component.createPrivilegeTypeForm.reset).toHaveBeenCalled();
    });

    it('should set edit mode and patch form values', () => {
      jest.spyOn(component.createPrivilegeTypeForm, 'patchValue');

      component.setEditMode(mockBrandCategory);

      expect(component.formMode()).toBe('edit');
      expect(component.createPrivilegeTypeForm.patchValue).toHaveBeenCalledWith(
        mockBrandCategory
      );
    });
  });

  describe('CRUD Operations', () => {
    beforeEach(() => {
      component.createPrivilegeTypeForm.patchValue({
        brand_category_name_english: 'New English',
        brand_category_name_thai: 'New Thai',
        display_order: 3,
      });
    });

    it('should dispatch createBrandCategory action', () => {
      component.createPrivilegeType();

      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditBrandActions.createBrandCategory({
          params: {
            brand_category_name_english: 'New English',
            brand_category_name_thai: 'New Thai',
            display_order: 3,
          },
        })
      );
    });

    it('should dispatch editBrandCategory action', () => {
      component.editPrivilegeType(mockBrandCategory);

      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditBrandActions.editBrandCategory({
          brandCategoryId: mockBrandCategory.brand_category_id,
          params: {
            brand_category_name_english: 'New English',
            brand_category_name_thai: 'New Thai',
            display_order: 3,
          },
        })
      );
    });

    it('should open confirm dialog and dispatch delete action', () => {
      component.deletePrivilegeType(mockBrandCategory);

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Delete Privilege Type?',
          message:
            'After you click proceed the privilege type will be deleted.',
          btnCloseText: 'Cancel',
          btnConfirmText: 'Proceed',
          type: 'warning',
        },
        width: '25rem',
      });

      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditBrandActions.deleteBrandCategory({
          brandCategoryId: mockBrandCategory.brand_category_id,
        })
      );
    });
  });

  describe('Dialog Actions', () => {
    it('should close dialog with selected item on submit', () => {
      component.selectedItem.set(mockBrandCategory);

      component.onSubmit();

      expect(mockDialogRef.close).toHaveBeenCalledWith(mockBrandCategory);
    });

    it('should close dialog on cancel', () => {
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Display Order Validation', () => {
    beforeEach(() => {
      component.brandCategoryDisplayOrders.set([1, 2, 3]);
    });

    it('should return null for valid display order', () => {
      const control = { value: 5 } as any;
      const result = component.displayOrdersValidatorAsync(control);

      expect(result).toBeNull();
    });

    it('should return null for empty value', () => {
      const control = { value: '' } as any;
      const result = component.displayOrdersValidatorAsync(control);

      expect(result).toBeNull();
    });

    it('should return null for zero value', () => {
      const control = { value: 0 } as any;
      const result = component.displayOrdersValidatorAsync(control);

      expect(result).toBeNull();
    });

    it('should return null when editing same item with same display order', () => {
      component.formMode.set('edit');
      component.selectedItem.set(mockBrandCategory);
      const control = { value: 1 } as any; // same as mockBrandCategory.display_order

      const result = component.displayOrdersValidatorAsync(control);

      expect(result).toBeNull();
    });

    it('should return error for duplicate display order', () => {
      const control = { value: 2 } as any;
      const result = component.displayOrdersValidatorAsync(control);

      expect(result).toEqual({ displayOrderExists: true });
    });

    it('should return error when editing different item with existing display order', () => {
      component.formMode.set('edit');
      component.selectedItem.set({ ...mockBrandCategory, display_order: 5 });
      const control = { value: 2 } as any;

      const result = component.displayOrdersValidatorAsync(control);

      expect(result).toEqual({ displayOrderExists: true });
    });
  });

  describe('Selected Items Change', () => {
    it('should set selected item', () => {
      const event = {
        items: [mockBrandCategory],
        toggleItem: mockBrandCategory,
      };

      component.onSelectedItemsChange(event);

      expect(component.selectedItem()).toEqual(mockBrandCategory);
    });

    it('should set form mode to view when editing different item', () => {
      component.formMode.set('edit');
      component.createPrivilegeTypeForm.patchValue({ brand_category_id: 999 });
      jest.spyOn(component, 'setFormMode');

      const event = {
        items: [mockBrandCategory],
        toggleItem: mockBrandCategory,
      };

      component.onSelectedItemsChange(event);

      expect(component.setFormMode).toHaveBeenCalledWith('view');
    });

    it('should not change form mode when editing same item', () => {
      component.formMode.set('edit');
      component.createPrivilegeTypeForm.patchValue({
        brand_category_id: mockBrandCategory.brand_category_id,
      });
      jest.spyOn(component, 'setFormMode');

      const event = {
        items: [mockBrandCategory],
        toggleItem: mockBrandCategory,
      };

      component.onSelectedItemsChange(event);

      expect(component.setFormMode).not.toHaveBeenCalled();
    });

    it('should handle null toggle item', () => {
      const event = {
        items: [],
        toggleItem: null,
      };

      component.onSelectedItemsChange(event);

      expect(component.selectedItem()).toBeNull();
    });
  });

  describe('Observable Selectors', () => {
    it('should have correct observable selectors', () => {
      fixture.detectChanges();

      expect(component.loading$).toBeDefined();
      expect(component.createLoading$).toBeDefined();
      expect(component.editLoading$).toBeDefined();
      expect(component.brandCategories$).toBeDefined();
      expect(component.brandCategoryDisplayOrders$).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty brand categories list', () => {
      store.overrideSelector(
        CreateEditBrandSelectors.selectBrandCategories,
        []
      );

      fixture.detectChanges();

      expect(component.selectedItem()).toBeNull();
    });

    it('should handle undefined selectedBrandCategory in data', () => {
      TestBed.resetTestingModule();

      TestBed.configureTestingModule({
        imports: [
          AddPrivilegeTypeDialogComponent,
          ReactiveFormsModule,
          NoopAnimationsModule,
          MatDialogModule,
        ],
        providers: [
          provideMockStore(),
          provideMockActions(() => actions$),
          { provide: MatDialog, useValue: mockDialog },
          { provide: MatDialogRef, useValue: mockDialogRef },
          {
            provide: MAT_DIALOG_DATA,
            useValue: { selectedBrandCategory: null },
          },
          FormBuilder,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      fixture = TestBed.createComponent(AddPrivilegeTypeDialogComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();

      expect(component.selectedItem()).toBeNull();
    });

    it('should handle delete dialog cancellation', () => {
      const mockConfirmDialogRef: any = {
        afterClosed: jest.fn().mockReturnValue(of(false)),
      };

      mockDialog.open.mockReturnValue(mockConfirmDialogRef);

      component.deletePrivilegeType(mockBrandCategory);

      expect(store.dispatch).not.toHaveBeenCalledWith(
        CreateEditBrandActions.deleteBrandCategory(expect.any(Object))
      );
    });

    it('should handle warning dialog with different result', () => {
      const existedBrands: any[] = [{ brand_id: 1, brand_name: 'Test Brand' }];
      const mockWarningDialogRef: any = {
        afterClosed: jest.fn().mockReturnValue(of('different_result')),
      };

      mockDialog.open.mockReturnValue(mockWarningDialogRef);

      fixture.detectChanges();
      actions$.next(
        CreateEditBrandActions.deleteBrandCategorySuccess({
          existedBrands,
          brandCategoryId: 1,
        })
      );

      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('Form Validation Integration', () => {
    it('should validate min value for display order', () => {
      const displayOrderControl = component.displayOrderControl;

      displayOrderControl?.setValue(-1);
      displayOrderControl?.markAsTouched();

      expect(displayOrderControl?.hasError('min')).toBeTruthy();
    });

    it('should validate required fields', () => {
      const thaiControl = component.brandCategoryNameThaiControl;
      const englishControl = component.brandCategoryNameEnglishControl;
      const displayOrderControl = component.displayOrderControl;

      thaiControl?.markAsTouched();
      englishControl?.markAsTouched();
      displayOrderControl?.markAsTouched();

      expect(thaiControl?.hasError('required')).toBeTruthy();
      expect(englishControl?.hasError('required')).toBeTruthy();
      expect(displayOrderControl?.hasError('required')).toBeTruthy();
    });
  });
});
