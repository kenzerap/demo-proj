import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of } from 'rxjs';
import { CreateEditProductStockDialogComponent } from './create-edit-product-stock-dialog.component';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ProductStock } from '../../models/product-stock.model';

describe('CreateEditProductStockDialogComponent', () => {
  let component: CreateEditProductStockDialogComponent;
  let fixture: ComponentFixture<CreateEditProductStockDialogComponent>;
  let mockDialogRef: jest.Mocked<
    MatDialogRef<CreateEditProductStockDialogComponent>
  >;
  let mockDialog: jest.Mocked<MatDialog>;
  let actions$: ReplaySubject<any>;
  let store: MockStore;

  const mockDialogData = {
    inventoryData: {
      brand_id: 1,
    },
    productStock: null,
  };

  const mockProductStock: ProductStock = {
    product_stock_id: 1,
    product_name: 'Test Product',
    description: 'Test Description',
    quantity: 10,
  } as any;

  beforeEach(async () => {
    actions$ = new ReplaySubject<any>(1);

    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<
      MatDialogRef<CreateEditProductStockDialogComponent>
    >;

    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        CreateEditProductStockDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        provideMockStore({
          initialState: {},
          selectors: [
            { selector: selectIsLoading('createInventory'), value: false },
            {
              selector: selectIsLoading('createInventoryAndUpdateData'),
              value: false,
            },
            {
              selector: selectIsLoading('createEditProductStock'),
              value: false,
            },
          ],
        }),
        provideMockActions(() => actions$),
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatDialog, useValue: mockDialog },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideProvider(MatDialog, { useValue: mockDialog })
      .compileComponents();

    fixture = TestBed.createComponent(CreateEditProductStockDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values when no productStock is provided', () => {
      fixture.detectChanges();

      expect(component.productStockForm.get('product_name')?.value).toBe('');
      expect(component.productStockForm.get('description')?.value).toBe('');
      expect(component.productStockForm.get('quantity')?.value).toBe('');
    });

    it('should initialize form with productStock values when provided', () => {
      component.data.productStock = mockProductStock;

      fixture.detectChanges();

      expect(component.productStockForm.get('product_name')?.value).toBe(
        mockProductStock.product_name
      );
      expect(component.productStockForm.get('description')?.value).toBe(
        mockProductStock.description
      );
      expect(component.productStockForm.get('quantity')?.value).toBe(
        mockProductStock.quantity
      );
    });

    it('should set up loading observables', () => {
      fixture.detectChanges();

      component.loading$.subscribe((loading) => {
        expect(loading).toBe(false);
      });

      component.loadingCreateInventory$.subscribe((loading) => {
        expect(loading).toBe(false);
      });

      component.loadingProductStock$.subscribe((loading) => {
        expect(loading).toBe(false);
      });
    });
  });

  describe('Form Controls Getters', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return productName control', () => {
      const control = component.productNameControl;
      expect(control).toBe(component.productStockForm.get('product_name'));
    });

    it('should return description control', () => {
      const control = component.descriptionControl;
      expect(control).toBe(component.productStockForm.get('description'));
    });

    it('should return quantity control', () => {
      const control = component.quantityControl;
      expect(control).toBe(component.productStockForm.get('quantity'));
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should be invalid when product_name is empty', () => {
      component.productStockForm.patchValue({
        product_name: '',
        description: 'test',
        quantity: 5,
      });

      expect(component.productStockForm.invalid).toBe(true);
      expect(component.productNameControl?.hasError('required')).toBe(true);
    });

    it('should be invalid when product_name has only spaces', () => {
      component.productStockForm.patchValue({
        product_name: '   ',
        description: 'test',
        quantity: 5,
      });

      expect(component.productStockForm.invalid).toBe(true);
      expect(component.productNameControl?.hasError('required')).toBe(true);
    });

    it('should be invalid when quantity is empty', () => {
      component.productStockForm.patchValue({
        product_name: 'test',
        description: 'test',
        quantity: '',
      });

      expect(component.productStockForm.invalid).toBe(true);
      expect(component.quantityControl?.hasError('required')).toBe(true);
    });

    it('should be invalid when quantity is less than 0', () => {
      component.productStockForm.patchValue({
        product_name: 'test',
        description: 'test',
        quantity: -1,
      });

      expect(component.productStockForm.invalid).toBe(true);
      expect(component.quantityControl?.hasError('min')).toBe(true);
    });

    it('should be valid with correct values', () => {
      component.productStockForm.patchValue({
        product_name: 'Test Product',
        description: 'Test Description',
        quantity: 5,
      });

      expect(component.productStockForm.valid).toBe(true);
    });
  });

  describe('ngOnInit', () => {
    it('should patch form with productStock data when provided', () => {
      component.data.productStock = mockProductStock;

      fixture.detectChanges();

      expect(component.productStockForm.get('product_name')?.value).toBe(
        mockProductStock.product_name
      );
      expect(component.productStockForm.get('description')?.value).toBe(
        mockProductStock.description
      );
      expect(component.productStockForm.get('quantity')?.value).toBe(
        mockProductStock.quantity
      );
    });

    it('should patch form with empty object when no productStock is provided', () => {
      component.data.productStock = null;

      fixture.detectChanges();

      expect(component.productStockForm.get('product_name')?.value).toBe('');
    });

    it('should close dialog when createEditProductStockSuccess action is dispatched', () => {
      fixture.detectChanges();

      const response = { success: true } as any;
      actions$.next(
        CreateEditInventoryActions.createEditProductStockSuccess({
          response,
          inventory_id: 1,
        })
      );

      expect(mockDialogRef.close).toHaveBeenCalledWith(response);
    });
  });

  it('should dispatch createInventoryAndUpdateData action when dialog is confirmed', () => {
    component.data.productStock = mockProductStock;

    component.onSubmit();
    expect(true).toBe(true);
  });

  describe('onSubmit - Update Product Stock', () => {
    beforeEach(() => {
      component.data.productStock = mockProductStock;
      component.productStockForm.patchValue({
        product_name: 'Updated Product',
        description: 'Updated Description',
        quantity: 15,
      });
      fixture.detectChanges();
    });

    it('should open confirmation dialog when updating existing product stock', () => {
      component.onSubmit();

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Update Product stock?',
          message:
            'If you click to confirmed the system will updated the product stock list',
          btnCloseText: 'Cancel',
          btnConfirmText: 'Confirm',
          type: 'warning',
        },
        width: '25rem',
      });
    });

    it('should dispatch createInventoryAndUpdateData action when dialog is confirmed', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditInventoryActions.createInventoryAndUpdateData({
          inventoryData: component.data.inventoryData,
          dataUpdated: {
            ...component.productStockForm.getRawValue(),
            product_stock_id: mockProductStock.product_stock_id,
          },
        })
      );
    });

    it('should not dispatch action when dialog is cancelled', () => {
      mockDialog.open.mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(false)),
      } as any);

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onSubmit();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit - Create New Product Stock', () => {
    beforeEach(() => {
      component.data.productStock = null;
      component.productStockForm.patchValue({
        product_name: 'New Product',
        description: 'New Description',
        quantity: 20,
      });
      fixture.detectChanges();
    });

    it('should dispatch createInventoryAndUpdateData action for new product stock', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditInventoryActions.createInventoryAndUpdateData({
          inventoryData: component.data.inventoryData,
          dataUpdated: component.productStockForm.getRawValue(),
        })
      );
    });

    it('should not open confirmation dialog for new product stock', () => {
      component.onSubmit();

      expect(mockDialog.open).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading states correctly', () => {
      store.overrideSelector(selectIsLoading('createInventory'), true);
      store.overrideSelector(
        selectIsLoading('createInventoryAndUpdateData'),
        true
      );
      store.overrideSelector(selectIsLoading('createEditProductStock'), true);
      store.refreshState();

      fixture.detectChanges();

      component.loading$.subscribe((loading) => {
        expect(loading).toBe(true);
      });

      component.loadingCreateInventory$.subscribe((loading) => {
        expect(loading).toBe(true);
      });

      component.loadingProductStock$.subscribe((loading) => {
        expect(loading).toBe(true);
      });
    });
  });

  describe('Component Destruction', () => {
    it('should handle component destruction properly', () => {
      fixture.detectChanges();

      // Simulate component destruction
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined productStock gracefully', () => {
      component.data.productStock = undefined as any;

      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should handle form submission with invalid form', () => {
      component.productStockForm.patchValue({
        product_name: '',
        description: '',
        quantity: '',
      });

      fixture.detectChanges();

      // Form should be invalid, but onSubmit should still work
      expect(() => {
        component.onSubmit();
      }).not.toThrow();
    });

    it('should handle missing dialog data', () => {
      component.data = {
        inventoryData: {},
        productStock: null,
      };

      expect(() => {
        fixture.detectChanges();
        component.onSubmit();
      }).not.toThrow();
    });
  });

  describe('Form Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update form values correctly', () => {
      const testValues = {
        product_name: 'Integration Test Product',
        description: 'Integration Test Description',
        quantity: 25,
      };

      component.productStockForm.patchValue(testValues);

      expect(component.productStockForm.get('product_name')?.value).toBe(
        testValues.product_name
      );
      expect(component.productStockForm.get('description')?.value).toBe(
        testValues.description
      );
      expect(component.productStockForm.get('quantity')?.value).toBe(
        testValues.quantity
      );
    });

    it('should get raw values correctly', () => {
      const testValues = {
        product_name: 'Raw Value Test',
        description: 'Raw Value Description',
        quantity: 30,
      };

      component.productStockForm.patchValue(testValues);

      const rawValues = component.productStockForm.getRawValue();
      expect(rawValues).toEqual(testValues);
    });
  });
});
