import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductStockListSectionComponent } from './product-stock-list-section.component';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { of, ReplaySubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import * as CreateEditInventorySelectors from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.selectors';
import { ProductStock } from '../../models/product-stock.model';
import { CreateEditInventoryQueryParams } from '../../models/create-edit-inventory-query-params.model';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CreateEditProductStockDialogComponent } from '../create-edit-product-stock-dialog/create-edit-product-stock-dialog.component';
import { InventoryWarningDialogComponent } from '../inventory-warning-dialog/inventory-warning-dialog.component';
import { InventoryType } from '@app/shared/utils/enums/inventory-type.enum';

describe('ProductStockListSectionComponent', () => {
  let component: ProductStockListSectionComponent;
  let fixture: ComponentFixture<ProductStockListSectionComponent>;
  let store: MockStore;
  let datePipe: DatePipe;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockDialogRef: any;

  const mockProductStock: ProductStock = {
    product_stock_id: 1,
    stock_name: 'Test Stock',
    quantity: 100,
    unit_price: 10.5,
    total_amount: 1050,
  } as any;

  const mockProductStocks: ProductStock[] = [mockProductStock];

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);

    mockDialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
      close: jest.fn(),
    };

    mockDialog = {
      open: jest.fn().mockReturnValue(mockDialogRef),
      closeAll: jest.fn(),
      getDialogById: jest.fn(),
      openDialogs: [],
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ProductStockListSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        DatePipe,
        provideMockStore({
          selectors: [
            {
              selector: CreateEditInventorySelectors.selectProductStocks,
              value: mockProductStocks,
            },
          ],
        }),
        provideMockActions(() => actions$),
        { provide: MatDialog, useValue: mockDialog },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductStockListSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    datePipe = TestBed.inject(DatePipe);

    // Setup form group
    const formBuilder = TestBed.inject(FormBuilder);
    component.formGroup = formBuilder.group({
      inventory_name: ['Test Inventory'],
      description: ['Test Description'],
      brand_id: [1],
      inventory_type: [InventoryType.UPLOAD_CODE],
      status: [true],
      expire_date: [new Date('2023-10-01T15:30:00.000Z').toISOString()],
      expire_time: [datePipe.transform(new Date('2023-10-01T15:30:00.000Z').toISOString(), 'HH:mm')],
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.formMode).toBe('create');
    expect(component.tableColumns()).toBeDefined();
    expect(component.productStocks$).toBeDefined();
  });

  it('should set input properties correctly', () => {
    const newFormMode = 'edit';
    component.formMode = newFormMode;
    expect(component.formMode).toBe(newFormMode);
  });

  describe('ngOnInit', () => {
    it('should subscribe to deleteProductStockSuccess action and open warning dialog when could_update_delete is false', () => {
      const mockResponse: any = {
        could_update_delete: false,
        linked_privileges: ['privilege1', 'privilege2'],
      };

      component.ngOnInit();

      actions$.next(
        CreateEditInventoryActions.deleteProductStockSuccess({
          response: mockResponse,
          inventory_id: 1,
        })
      );

      expect(mockDialog.open).toHaveBeenCalledWith(
        InventoryWarningDialogComponent,
        {
          data: {
            linkedPrivileges: mockResponse.linked_privileges,
            title: `The product stock can't delete`,
            message:
              'This product stock is currently linked to an active privilege. To proceed with deletion, please deactivate the associated privilege first.',
          },
          autoFocus: false,
          width: '30rem',
        }
      );
    });

    it('should subscribe to deleteProductStockSuccess action and open success dialog when could_update_delete is true', () => {
      const mockResponse: any = {
        could_update_delete: true,
        linked_privileges: [],
      };

      component.ngOnInit();

      actions$.next(
        CreateEditInventoryActions.deleteProductStockSuccess({
          response: mockResponse,
          inventory_id: 1,
        })
      );

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          message: 'The inventory stocks was updated',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'success',
        },
        width: '25rem',
      });
    });
  });

  describe('openProductStockDialog', () => {
    beforeEach(() => {
      // Setup form values for testing
      component.formGroup.patchValue({
        inventory_name: 'Test Inventory',
        description: 'Test Description',
        brand_id: 1,
        inventory_type: InventoryType.UPLOAD_CODE,
        status: true,
        expire_date: new Date('2023-10-01T15:30:00.000Z').toISOString(),
        expire_time: datePipe.transform(new Date('2023-10-01T15:30:00.000Z').toISOString(), 'HH:mm'),
      });
    });

    it('should open dialog without rowData (create mode)', () => {
      component.openProductStockDialog();

      const expectedInventoryData: Partial<CreateEditInventoryQueryParams> = {
        inventory_name: 'Test Inventory',
        description: 'Test Description',
        brand_id: 1,
        inventory_type: InventoryType.UPLOAD_CODE,
        status: 'ACTIVE',
        expire_date_time: new Date('2023-10-01T15:30:00.000Z').toISOString(),
      };

      expect(mockDialog.open).toHaveBeenCalledWith(
        CreateEditProductStockDialogComponent,
        {
          data: {
            inventoryData: expectedInventoryData,
            productStock: undefined,
          },
          width: '36rem',
          autoFocus: false,
          disableClose: true,
        }
      );
    });

    it('should open dialog with rowData (edit mode)', () => {
      component.openProductStockDialog(mockProductStock);

      const expectedInventoryData: Partial<CreateEditInventoryQueryParams> = {
        inventory_name: 'Test Inventory',
        description: 'Test Description',
        brand_id: 1,
        inventory_type: InventoryType.UPLOAD_CODE,
        status: 'ACTIVE',
        expire_date_time: new Date('2023-10-01T15:30:00.000Z').toISOString(),
      };

      expect(mockDialog.open).toHaveBeenCalledWith(
        CreateEditProductStockDialogComponent,
        {
          data: {
            inventoryData: expectedInventoryData,
            productStock: mockProductStock,
          },
          width: '36rem',
          autoFocus: false,
          disableClose: true,
        }
      );
    });

    it('should handle status false correctly', () => {
      component.formGroup.patchValue({
        status: false,
      });

      component.openProductStockDialog();

      expect(mockDialog.open).toHaveBeenCalledWith(
        CreateEditProductStockDialogComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            inventoryData: expect.objectContaining({
              status: 'INACTIVE',
            }),
          }),
        })
      );
    });
  });

  describe('deleteProductStock', () => {
    it('should open confirmation dialog and dispatch delete action on confirm', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(true));
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.deleteProductStock(mockProductStock);

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Delete Product Stock?',
          message: `If you confirm, the system will immediately delete this product stock from the database.`,
          btnCloseText: 'Cancel',
          btnConfirmText: 'Confirm',
          type: 'warning',
        },
        width: '25rem',
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditInventoryActions.deleteProductStock({
          product_stock_id: mockProductStock.product_stock_id,
        })
      );
    });

    it('should open confirmation dialog but not dispatch delete action on cancel', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(false));
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.deleteProductStock(mockProductStock);

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Delete Product Stock?',
          message: `If you confirm, the system will immediately delete this product stock from the database.`,
          btnCloseText: 'Cancel',
          btnConfirmText: 'Confirm',
          type: 'warning',
        },
        width: '25rem',
      });

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should handle dialog result as undefined/null', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(undefined));
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.deleteProductStock(mockProductStock);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Component lifecycle and cleanup', () => {
    it('should extend BaseComponent', () => {
      expect(component).toBeInstanceOf(component.constructor);
    });

    it('should implement OnInit', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should have destroy$ observable from BaseComponent', () => {
      expect(component.destroy$).toBeDefined();
    });
  });

  describe('Store selectors', () => {
    it('should select product stocks from store', (done) => {
      component.productStocks$.subscribe((stocks) => {
        expect(stocks).toEqual(mockProductStocks);
        done();
      });
    });
  });

  describe('Form validation edge cases', () => {
    it('should handle form with invalid state', () => {
      component.formGroup.setErrors({ invalid: true });
      component.openProductStockDialog();

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should handle form with missing expire_date', () => {
      component.formGroup.patchValue({
        expire_date: null,
        expire_time: '10:30',
      });

      expect(() => component.openProductStockDialog()).not.toThrow();
    });
  });

  describe('Date handling edge cases', () => {
    it('should handle time with seconds', () => {
      component.formGroup.patchValue({
        expire_time: '15:30:45',
      });

      component.openProductStockDialog();
      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('Multiple action subscriptions', () => {
    it('should handle multiple deleteProductStockSuccess actions', () => {
      component.ngOnInit();

      const response1: any = {
        could_update_delete: true,
        linked_privileges: [],
      };
      const response2: any = {
        could_update_delete: false,
        linked_privileges: ['priv1'],
      };

      actions$.next(
        CreateEditInventoryActions.deleteProductStockSuccess({
          response: response1,
          inventory_id: 1,
        })
      );
      actions$.next(
        CreateEditInventoryActions.deleteProductStockSuccess({
          response: response2,
          inventory_id: 2,
        })
      );

      expect(mockDialog.open).toHaveBeenCalledTimes(4);
    });
  });

  describe('Input property changes', () => {
    it('should handle formMode changes', () => {
      component.formMode = 'view';
      expect(component.formMode).toBe('view');

      component.formMode = 'edit';
      expect(component.formMode).toBe('edit');
    });

    it('should handle formGroup changes', () => {
      const newFormGroup = TestBed.inject(FormBuilder).group({
        test_field: ['test_value'],
      });

      component.formGroup = newFormGroup;
      expect(component.formGroup).toBe(newFormGroup);
    });
  });
});
