import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddInventoryDialogComponent } from './add-inventory-dialog.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, Subject } from 'rxjs';
import { InventoryTabCode } from '../../constants/add-inventory-tabs.const';
import { Inventory } from '@app/shared/models/inventory-model';
import * as createEditPrivilegeSelectors from '../../stores/create-edit-privilege/create-edit-privilege.selectors';
import { InventoryType } from '@app/shared/utils/enums/inventory-type.enum';

describe('AddInventoryDialogComponent', () => {
  let component: AddInventoryDialogComponent;
  let fixture: ComponentFixture<AddInventoryDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<AddInventoryDialogComponent>>;
  let mockStore: MockStore;
  let mockData: {
    inventory: Inventory;
    quantity: number;
    codeType: InventoryTabCode;
  };

  const mockInventory: Inventory = {
    inventory_id: 1,
    inventory_name: 'Test Inventory',
    brand_id: 1,
    brand_name: 'Test Brand',
    ready_to_use: 100,
    reserved: 10,
    redeemed: 5,
    used: 2,
    created_date: '2024-01-01T00:00:00Z',
    updated_date: '2024-01-02T00:00:00Z',
    expire_date_time: '2024-12-31T23:59:59Z',
    inventory_description: 'Test Description',
    inventory_type: InventoryType.UPLOAD_CODE,
  };

  const mockInventories: Inventory[] = [
    {
      inventory_id: 2,
      inventory_name: 'Test Inventory 2',
      brand_id: 2,
      brand_name: 'Test Brand 2',
      ready_to_use: 50,
      reserved: 5,
      redeemed: 3,
      used: 1,
      created_date: '2024-01-01T00:00:00Z',
      updated_date: '2024-01-02T00:00:00Z',
      expire_date_time: '2024-12-31T23:59:59Z',
      inventory_description: 'Test Description 2',
      inventory_type: InventoryType.PRODUCT,
    },
    {
      inventory_id: 3,
      inventory_name: 'Test Inventory 3',
      brand_id: 3,
      brand_name: 'Test Brand 3',
      ready_to_use: 75,
      reserved: 8,
      redeemed: 4,
      used: 2,
      created_date: '2024-01-01T00:00:00Z',
      updated_date: '2024-01-02T00:00:00Z',
      expire_date_time: '2024-12-31T23:59:59Z',
      inventory_description: 'Test Description 3',
      inventory_type: InventoryType.UPLOAD_CODE,
    },
  ];

  const setupTestBed = (testData: any) => {
    return TestBed.configureTestingModule({
      imports: [
        AddInventoryDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: testData },
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector:
                createEditPrivilegeSelectors.selectUploadCodeInventories,
              value: mockInventories,
            },
            {
              selector: createEditPrivilegeSelectors.selectProductInventories,
              value: mockInventories,
            },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  };

  beforeEach(() => {
    mockDialogRef = {
      close: jest.fn(),
    } as any;

    mockData = {
      inventory: mockInventory,
      quantity: 10,
      codeType: InventoryTabCode.CodeUploaded,
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.tabs()).toEqual(expect.any(Array));
      expect(component.activeTabCode()).toBe(InventoryTabCode.CodeUploaded);
      expect(component.selectedItem()).toBeNull();
      expect(component.inventoryTabCode).toBe(InventoryTabCode);
    });

    it('should initialize form with correct validators', () => {
      expect(component.addInventoryForm).toBeDefined();
      expect(component.quantityControl?.hasError('required')).toBe(true);

      component.addInventoryForm.patchValue({ quantity: -1 });
      expect(component.quantityControl?.hasError('min')).toBe(true);

      component.addInventoryForm.patchValue({ quantity: 5 });
      expect(component.quantityControl?.valid).toBe(true);
    });

    it('should set activeTabCode from data on init', () => {
      component.ngOnInit();
      expect(component.activeTabCode()).toBe(mockData.codeType);
    });

    it('should patch form with data quantity on init', () => {
      component.ngOnInit();
      expect(component.addInventoryForm.get('quantity')?.value).toBe(
        mockData.quantity
      );
    });
  });

  describe('Data Subscriptions - Upload Code Inventories', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should handle uploadCodeInventories$ subscription with existing inventory', () => {
      const spy = jest.spyOn(component.selectedItem, 'set');

      component.ngOnInit();

      expect(component.uploadCodeInventories).toEqual([
        mockData.inventory,
        ...mockInventories,
      ]);
      expect(spy).toHaveBeenCalledWith(mockData.inventory);
    });

    it('should handle uploadCodeInventories$ with existing inventory not found in list', () => {
      const spy = jest.spyOn(component.selectedItem, 'set');

      component.ngOnInit();

      expect(component.uploadCodeInventories).toEqual([
        mockData.inventory,
        ...mockInventories,
      ]);
      expect(spy).toHaveBeenCalledWith(mockData.inventory);
    });

    it('should not execute subscription callback for empty uploadCodeInventories array', () => {
      mockStore.overrideSelector(
        createEditPrivilegeSelectors.selectUploadCodeInventories,
        []
      );

      component.ngOnInit();

      expect(component.uploadCodeInventories).toEqual([]);
    });
  });

  describe('Data Subscriptions - Product Inventories', () => {
    beforeEach(async () => {
      const productData = {
        inventory: mockInventory,
        quantity: 15,
        codeType: InventoryTabCode.Product,
      };
      await setupTestBed(productData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should handle productInventories$ subscription with existing inventory and Product code type', () => {
      const spy = jest.spyOn(component.selectedItem, 'set');

      component.ngOnInit();

      expect(component.productInventories).toEqual([
        component.data.inventory,
        ...mockInventories,
      ]);
      expect(spy).toHaveBeenCalledWith(component.data.inventory);
    });

    it('should not execute subscription callback for empty productInventories array', () => {
      mockStore.overrideSelector(
        createEditPrivilegeSelectors.selectProductInventories,
        []
      );

      component.ngOnInit();

      expect(component.productInventories).toEqual([]);
    });
  });

  describe('Tab Management', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should change active tab to Product', () => {
      component.changeTab(InventoryTabCode.Product);
      expect(component.activeTabCode()).toBe(InventoryTabCode.Product);
    });

    it('should change active tab to CodeUploaded', () => {
      component.changeTab(InventoryTabCode.CodeUploaded);
      expect(component.activeTabCode()).toBe(InventoryTabCode.CodeUploaded);
    });
  });

  describe('Item Selection', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should handle selected items change with valid toggle item', () => {
      const event = {
        items: [mockInventory],
        toggleItem: mockInventory,
      };

      const spy = jest.spyOn(component.selectedItem, 'set');

      component.onSelectedItemsChange(event);

      expect(spy).toHaveBeenCalledWith(mockInventory);
    });

    it('should handle selected items change with null toggle item', () => {
      const event = {
        items: [],
        toggleItem: null,
      };

      const spy = jest.spyOn(component.selectedItem, 'set');

      component.onSelectedItemsChange(event);

      expect(spy).toHaveBeenCalledWith(null);
    });
  });

  describe('Form Submission', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
      component.ngOnInit();
      component.selectedItem.set(mockInventory);
    });

    it('should submit successfully with valid form and selected item', () => {
      component.addInventoryForm.patchValue({ quantity: 15 });
      component.activeTabCode.set(InventoryTabCode.Product);

      component.onSubmit();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        selectedItem: mockInventory,
        quantity: 15,
        codeType: InventoryTabCode.Product,
      });
    });

    it('should not submit with invalid form - required field empty', () => {
      component.addInventoryForm.patchValue({ quantity: '' });
      const markAllAsTouchedSpy = jest.spyOn(
        component.addInventoryForm,
        'markAllAsTouched'
      );

      component.onSubmit();

      expect(mockDialogRef.close).not.toHaveBeenCalled();
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('should not submit without selected item', () => {
      component.selectedItem.set(null);
      component.addInventoryForm.patchValue({ quantity: 10 });
      const markAllAsTouchedSpy = jest.spyOn(
        component.addInventoryForm,
        'markAllAsTouched'
      );

      component.onSubmit();

      expect(mockDialogRef.close).not.toHaveBeenCalled();
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('Dialog Actions', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should close dialog on cancel', () => {
      component.onCancel();
      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });
  });

  describe('Form Controls', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should return quantity control', () => {
      const quantityControl = component.quantityControl;
      expect(quantityControl).toBe(component.addInventoryForm.get('quantity'));
    });

    it('should handle quantity control validation states', () => {
      const quantityControl = component.quantityControl;

      // Test required validation
      quantityControl?.setValue('');
      quantityControl?.markAsTouched();
      expect(quantityControl?.hasError('required')).toBe(true);

      // Test min validation
      quantityControl?.setValue(-1);
      expect(quantityControl?.hasError('min')).toBe(true);

      // Test valid value
      quantityControl?.setValue(10);
      expect(quantityControl?.valid).toBe(true);
    });
  });

  describe('Table Columns', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should have codeUploadedTableColumns signal', () => {
      expect(component.codeUploadedTableColumns()).toBeDefined();
      expect(Array.isArray(component.codeUploadedTableColumns())).toBe(true);
    });

    it('should have productListTableColumns signal', () => {
      expect(component.productListTableColumns()).toBeDefined();
      expect(Array.isArray(component.productListTableColumns())).toBe(true);
    });
  });

  describe('Special Cases with Different Data', () => {
    it('should initialize with default CodeUploaded tab when no codeType provided', async () => {
      const dataWithoutCodeType = {
        inventory: null,
        quantity: 0,
        codeType: null as any,
      };

      await setupTestBed(dataWithoutCodeType);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);

      expect(component.activeTabCode()).toBe(InventoryTabCode.CodeUploaded);
    });

    it('should handle uploadCodeInventories$ subscription without existing inventory', async () => {
      const dataWithoutInventory = {
        inventory: null,
        quantity: 10,
        codeType: InventoryTabCode.CodeUploaded,
      };

      await setupTestBed(dataWithoutInventory);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);

      component.ngOnInit();

      expect(component.uploadCodeInventories).toEqual(mockInventories);
    });

    it('should handle productInventories$ subscription with inventory found in list', async () => {
      const existingInventory = mockInventories[0];
      const productData = {
        inventory: existingInventory,
        quantity: 20,
        codeType: InventoryTabCode.Product,
      };

      await setupTestBed(productData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);

      const spy = jest.spyOn(component.selectedItem, 'set');

      component.ngOnInit();

      expect(component.productInventories).toEqual(mockInventories);
      expect(spy).toHaveBeenCalledWith(existingInventory);
    });

    it('should handle productInventories$ subscription without existing inventory', async () => {
      const productData = {
        inventory: null,
        quantity: 10,
        codeType: InventoryTabCode.Product,
      };

      await setupTestBed(productData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);

      component.ngOnInit();

      expect(component.productInventories).toEqual(mockInventories);
    });

    it('should handle data with different inventory types', async () => {
      const productInventory = {
        ...mockInventory,
        inventory_type: InventoryType.PRODUCT,
      };
      const dataWithProductInventory = {
        inventory: productInventory,
        quantity: 25,
        codeType: InventoryTabCode.Product,
      };

      await setupTestBed(dataWithProductInventory);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);

      expect(component.data.inventory.inventory_type).toBe(
        InventoryType.PRODUCT
      );
    });
  });

  describe('Component Integration', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should integrate all features in a complete workflow', () => {
      // Initialize component
      component.ngOnInit();

      // Change tab
      component.changeTab(InventoryTabCode.Product);
      expect(component.activeTabCode()).toBe(InventoryTabCode.Product);

      // Select an item
      const selectionEvent = {
        items: [mockInventory],
        toggleItem: mockInventory,
      };
      component.onSelectedItemsChange(selectionEvent);
      expect(component.selectedItem()).toBe(mockInventory);

      // Fill form
      component.addInventoryForm.patchValue({ quantity: 25 });
      expect(component.addInventoryForm.valid).toBe(true);

      // Submit
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        selectedItem: mockInventory,
        quantity: 25,
        codeType: InventoryTabCode.Product,
      });
    });
  });

  describe('Edge Cases', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should handle multiple rapid tab changes', () => {
      component.changeTab(InventoryTabCode.Product);
      component.changeTab(InventoryTabCode.CodeUploaded);
      component.changeTab(InventoryTabCode.Product);

      expect(component.activeTabCode()).toBe(InventoryTabCode.Product);
    });

    it('should handle form with decimal quantities', () => {
      component.addInventoryForm.patchValue({ quantity: 10.5 });
      expect(component.quantityControl?.valid).toBe(true);
    });

    it('should handle selector updates dynamically', () => {
      component.ngOnInit();

      // Update selectors
      const newInventories = [{ ...mockInventory, inventory_id: 99 }];
      mockStore.overrideSelector(
        createEditPrivilegeSelectors.selectUploadCodeInventories,
        newInventories
      );
      mockStore.refreshState();

      // Component should react to the change
      expect(component.uploadCodeInventories).toEqual([
        mockData.inventory,
        ...newInventories,
      ]);
    });
  });

  describe('Signal Behavior', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should update signals correctly', () => {
      const initialTab = component.activeTabCode();
      component.activeTabCode.set(InventoryTabCode.Product);
      expect(component.activeTabCode()).not.toBe(initialTab);
      expect(component.activeTabCode()).toBe(InventoryTabCode.Product);
    });

    it('should handle selectedItem signal updates', () => {
      expect(component.selectedItem()).toBeNull();

      component.selectedItem.set(mockInventory);
      expect(component.selectedItem()).toBe(mockInventory);

      component.selectedItem.set(null);
      expect(component.selectedItem()).toBeNull();
    });
  });

  describe('Store Selector Behavior', () => {
    beforeEach(async () => {
      await setupTestBed(mockData);
      fixture = TestBed.createComponent(AddInventoryDialogComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
    });

    it('should handle selector state changes', () => {
      const spy = jest.spyOn(component.selectedItem, 'set');

      component.ngOnInit();

      // Verify initial call
      expect(spy).toHaveBeenCalledWith(mockData.inventory);

      // Update selector value
      const updatedInventories = [{ ...mockInventory, inventory_id: 999 }];
      mockStore.overrideSelector(
        createEditPrivilegeSelectors.selectUploadCodeInventories,
        updatedInventories
      );
      mockStore.refreshState();

      // Should update component state
      expect(component.uploadCodeInventories.length).toBeGreaterThan(0);
    });

    it('should handle empty selector results gracefully', () => {
      mockStore.overrideSelector(
        createEditPrivilegeSelectors.selectUploadCodeInventories,
        []
      );
      mockStore.overrideSelector(
        createEditPrivilegeSelectors.selectProductInventories,
        []
      );

      component.ngOnInit();

      expect(component.uploadCodeInventories).toEqual([]);
      expect(component.productInventories).toEqual([]);
    });
  });
});
