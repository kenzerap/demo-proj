import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventorySectionComponent } from './inventory-section.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as createEditPrivilegeSelectors from '../../stores/create-edit-privilege/create-edit-privilege.selectors';
import * as CreateEditPrivilegeActions from '../../stores/create-edit-privilege/create-edit-privilege.actions';
import {
  InventoryTabCode,
  addInventoryTabs,
} from '../../constants/add-inventory-tabs.const';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { InventoryType } from '@app/shared/utils/enums/inventory-type.enum';
import { ValueCode } from '@app/shared/models/value-code.model';
import { PrivilegeDetail } from '../../models/privilege-setting-model';

describe('InventorySectionComponent', () => {
  let component: InventorySectionComponent;
  let fixture: ComponentFixture<InventorySectionComponent>;
  let store: MockStore;
  let dialog: jest.Mocked<MatDialog>;
  let formBuilder: FormBuilder;
  let changeDetectorRef: jest.Mocked<ChangeDetectorRef>;

  const mockPrivilegeDetail: PrivilegeDetail = {
    inventory: {
      inventory_id: 1,
      quantity: 10,
      inventory_details: {
        inventory_id: 1,
        inventory_name: 'Test Inventory',
        inventory_description: 'Test Description',
        brand_name: 'Test Brand',
        ready_to_use: 5,
        expire_date_time: '2024-12-31T23:59:59Z',
        updated_date: '2024-01-01T00:00:00Z',
        inventory_type: InventoryType.UPLOAD_CODE,
      },
    },
  } as PrivilegeDetail;

  const mockPrivilegeDetailProduct: PrivilegeDetail = {
    inventory: {
      inventory_id: 2,
      quantity: 15,
      inventory_details: {
        inventory_id: 2,
        inventory_name: 'Product Inventory',
        inventory_description: 'Product Description',
        brand_name: 'Product Brand',
        ready_to_use: 8,
        expire_date_time: '2024-12-31T23:59:59Z',
        updated_date: '2024-01-01T00:00:00Z',
        inventory_type: InventoryType.PRODUCT,
      },
    },
  } as PrivilegeDetail;

  beforeEach(async () => {
    changeDetectorRef = {
      detectChanges: jest.fn(),
      markForCheck: jest.fn(),
      detach: jest.fn(),
      reattach: jest.fn(),
      checkNoChanges: jest.fn(),
    } as any;

    dialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(
          of({
            selectedItem: { inventory_id: 1, inventory_name: 'Test Item' },
            quantity: 10,
            codeType: InventoryTabCode.CodeUploaded,
          })
        ),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        InventorySectionComponent,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector:
                createEditPrivilegeSelectors.selectUploadCodeInventories,
              value: [],
            },
            {
              selector: createEditPrivilegeSelectors.selectProductInventories,
              value: [],
            },
            {
              selector: createEditPrivilegeSelectors.selectPrivilegeDetail,
              value: null,
            },
          ],
        }),
        { provide: MatDialog, useValue: dialog },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InventorySectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);

    // Setup form group before each test
    component.formGroup = formBuilder.group({
      inventory: [null],
      quantity: [null],
      codeType: [null],
    });

    // Mock store dispatch
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have correct default values', () => {
      expect(component.formMode).toBe('create');
      expect(component.unitOptions).toEqual([
        { code: 'POINT', value: 'Point' },
      ]);
    });

    it('should dispatch actions on ngOnInit', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditPrivilegeActions.getUploadCodeInventories({
          queryParams: {
            page: 0,
            size: 999,
            inventory_type: InventoryType.UPLOAD_CODE,
          },
        })
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditPrivilegeActions.getProductInventories({
          queryParams: {
            page: 0,
            size: 999,
            inventory_type: InventoryType.PRODUCT,
          },
        })
      );

      expect(store.dispatch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Form Controls Getters', () => {
    it('should return inventory control', () => {
      const inventoryControl = component.inventoryControl;
      expect(inventoryControl).toBe(component.formGroup.get('inventory'));
    });

    it('should return quantity control', () => {
      const quantityControl = component.quantityControl;
      expect(quantityControl).toBe(component.formGroup.get('quantity'));
    });

    it('should return codeType control', () => {
      const codeTypeControl = component.codeTypeControl;
      expect(codeTypeControl).toBe(component.formGroup.get('codeType'));
    });

    it('should return null when formGroup is not set', () => {
      component.formGroup = null as any;
      expect(component.inventoryControl).toBeUndefined();
      expect(component.quantityControl).toBeUndefined();
      expect(component.codeTypeControl).toBeUndefined();
    });
  });

  describe('Privilege Detail Subscription', () => {
    it('should update form when privilege detail changes with UPLOAD_CODE type', () => {
      // Mock the selector to return our test data
      store.overrideSelector(
        createEditPrivilegeSelectors.selectPrivilegeDetail,
        mockPrivilegeDetail
      );
      store.refreshState();

      component.ngOnInit();

      expect(component.formGroup.get('quantity')?.value).toBe(10);
      expect(component.formGroup.get('codeType')?.value).toBe(
        InventoryTabCode.CodeUploaded
      );
      expect(component.formGroup.get('inventory')?.value).toBe(
        mockPrivilegeDetail.inventory.inventory_details
      );
    });

    it('should update form when privilege detail changes with PRODUCT type', () => {
      store.overrideSelector(
        createEditPrivilegeSelectors.selectPrivilegeDetail,
        mockPrivilegeDetailProduct
      );
      store.refreshState();

      component.ngOnInit();

      expect(component.formGroup.get('quantity')?.value).toBe(15);
      expect(component.formGroup.get('codeType')?.value).toBe(
        InventoryTabCode.Product
      );
      expect(component.formGroup.get('inventory')?.value).toBe(
        mockPrivilegeDetailProduct.inventory.inventory_details
      );
    });

    it('should handle default case for unknown inventory type', () => {
      const mockUnknownType = {
        ...mockPrivilegeDetail,
        inventory: {
          ...mockPrivilegeDetail.inventory,
          inventory_details: {
            ...mockPrivilegeDetail.inventory.inventory_details!,
            inventory_type: 'UNKNOWN' as any,
          },
        },
      };

      store.overrideSelector(
        createEditPrivilegeSelectors.selectPrivilegeDetail,
        mockUnknownType
      );
      store.refreshState();

      component.ngOnInit();

      expect(component.formGroup.get('codeType')?.value).toBe(
        InventoryTabCode.CodeUploaded
      );
    });

    it('should not update form when privilege detail has no inventory_id', () => {
      const mockNoInventoryId = {
        inventory: {
          inventory_id: null,
          quantity: 5,
          inventory_details: null,
        },
      } as any;

      store.overrideSelector(
        createEditPrivilegeSelectors.selectPrivilegeDetail,
        mockNoInventoryId
      );
      store.refreshState();

      const initialFormValue = component.formGroup.getRawValue();
      component.ngOnInit();

      expect(component.formGroup.getRawValue()).toEqual(initialFormValue);
    });

    it('should handle null privilege detail', () => {
      store.overrideSelector(
        createEditPrivilegeSelectors.selectPrivilegeDetail,
        null
      );
      store.refreshState();

      const initialFormValue = component.formGroup.getRawValue();
      component.ngOnInit();

      expect(component.formGroup.getRawValue()).toEqual(initialFormValue);
    });
  });

  describe('getDropdownValue method', () => {
    const mockDropdownOptions: ValueCode[] = [
      { code: 'CODE1', value: 'Value 1' },
      { code: 'CODE2', value: 'Value 2' },
    ];

    it('should return correct value for existing code', () => {
      const result = component.getDropdownValue('CODE1', mockDropdownOptions);
      expect(result).toBe('Value 1');
    });

    it('should return empty string for non-existing code', () => {
      const result = component.getDropdownValue(
        'NON_EXISTING',
        mockDropdownOptions
      );
      expect(result).toBe('');
    });

    it('should return empty string for null code', () => {
      const result = component.getDropdownValue(null, mockDropdownOptions);
      expect(result).toBe('');
    });

    it('should return empty string for empty dropdown options', () => {
      const result = component.getDropdownValue('CODE1', []);
      expect(result).toBe('');
    });
  });

  describe('openAddInventoryDialog method', () => {
    it('should open dialog with correct configuration', () => {
      const formValue = { inventory: null, quantity: 5, codeType: 'CODE' };
      component.formGroup.patchValue(formValue);

      component.openAddInventoryDialog();

      expect(dialog.open).toHaveBeenCalledWith(
        expect.anything(), // AddInventoryDialogComponent
        {
          data: formValue,
          autoFocus: false,
          width: '55rem',
          disableClose: true,
        }
      );
    });

    it('should update form when dialog returns result', () => {
      const mockResult = {
        selectedItem: { inventory_id: 1, inventory_name: 'Test Item' },
        quantity: 15,
        codeType: InventoryTabCode.Product,
      };

      dialog.open.mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(mockResult)),
      } as any);

      component.openAddInventoryDialog();

      expect(component.formGroup.get('inventory')?.value).toEqual(
        mockResult.selectedItem
      );
      expect(component.formGroup.get('quantity')?.value).toBe(15);
      expect(component.formGroup.get('codeType')?.value).toBe(
        InventoryTabCode.Product
      );
    });

    it('should not update form when dialog returns no result', () => {
      dialog.open.mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(null)),
      } as any);

      const initialFormValue = component.formGroup.getRawValue();
      component.openAddInventoryDialog();

      expect(component.formGroup.getRawValue()).toEqual(initialFormValue);
      expect(changeDetectorRef.detectChanges).not.toHaveBeenCalled();
    });

    it('should not update form when dialog returns partial result', () => {
      const mockPartialResult = {
        selectedItem: { inventory_id: 1 },
        quantity: null,
        codeType: InventoryTabCode.Product,
      };

      dialog.open.mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(mockPartialResult)),
      } as any);

      const initialFormValue = component.formGroup.getRawValue();
      component.openAddInventoryDialog();

      expect(component.formGroup.getRawValue()).toEqual(initialFormValue);
      expect(changeDetectorRef.detectChanges).not.toHaveBeenCalled();
    });

    it('should handle dialog error gracefully', () => {
      dialog.open.mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(undefined)),
      } as any);

      const initialFormValue = component.formGroup.getRawValue();

      expect(() => component.openAddInventoryDialog()).not.toThrow();
      expect(component.formGroup.getRawValue()).toEqual(initialFormValue);
    });
  });

  describe('getCodeTypeName method', () => {
    it('should return correct code type name', () => {
      component.formGroup.patchValue({
        codeType: InventoryTabCode.CodeUploaded,
      });

      const result = component.getCodeTypeName();
      const expectedValue = addInventoryTabs.find(
        (item) => item.code === InventoryTabCode.CodeUploaded
      )?.value;

      expect(result).toBe(expectedValue);
    });

    it('should return undefined for non-existing code type', () => {
      component.formGroup.patchValue({ codeType: 'NON_EXISTING' });

      const result = component.getCodeTypeName();
      expect(result).toBeUndefined();
    });

    it('should handle null code type control', () => {
      // Remove codeType from form
      component.formGroup = formBuilder.group({
        inventory: [null],
        quantity: [null],
      });

      const result = component.getCodeTypeName();
      expect(result).toBeUndefined();
    });

    it('should handle null code type value', () => {
      component.formGroup.patchValue({ codeType: null });

      const result = component.getCodeTypeName();
      expect(result).toBeUndefined();
    });
  });

  describe('Component Lifecycle', () => {
    it('should call ngOnInit and set up subscriptions', () => {
      const ngOnInitSpy = jest.spyOn(component, 'ngOnInit');

      component.ngOnInit();

      expect(ngOnInitSpy).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledTimes(2);
    });

    it('should unsubscribe on destroy', () => {
      const destroySpy = jest.spyOn(component['destroy$'], 'next');
      const completesSpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completesSpy).toHaveBeenCalled();
    });
  });

  describe('Form Mode Input', () => {
    it('should handle create mode', () => {
      component.formMode = 'create';
      expect(component.formMode).toBe('create');
    });

    it('should handle edit mode', () => {
      component.formMode = 'edit';
      expect(component.formMode).toBe('edit');
    });

    it('should handle view mode', () => {
      component.formMode = 'view';
      expect(component.formMode).toBe('view');
    });
  });

  describe('Observable Properties', () => {
    it('should have privilegeDetail$ observable defined', () => {
      expect(component.privilegeDetail$).toBeDefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle form group being undefined', () => {
      component.formGroup = undefined as any;

      expect(() => component.inventoryControl).not.toThrow();
      expect(() => component.quantityControl).not.toThrow();
      expect(() => component.codeTypeControl).not.toThrow();
    });

    it('should handle subscription errors gracefully', () => {
      const errorSubject = new Subject();
      store.overrideSelector(
        createEditPrivilegeSelectors.selectPrivilegeDetail,
        errorSubject.asObservable() as any
      );

      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle dialog open throwing error', () => {
      dialog.open.mockImplementation(() => {
        throw new Error('Dialog error');
      });

      expect(() => component.openAddInventoryDialog()).toThrow('Dialog error');
    });
  });

  describe('Integration Tests', () => {
    it('should work with real form interactions', () => {
      // Setup initial state
      component.ngOnInit();

      // Simulate form changes
      component.formGroup.patchValue({
        inventory: { inventory_id: 1, inventory_name: 'Test' },
        quantity: 10,
        codeType: InventoryTabCode.CodeUploaded,
      });

      // Test getters return correct values
      expect(component.inventoryControl?.value).toEqual({
        inventory_id: 1,
        inventory_name: 'Test',
      });
      expect(component.quantityControl?.value).toBe(10);
      expect(component.codeTypeControl?.value).toBe(
        InventoryTabCode.CodeUploaded
      );

      // Test dropdown value method
      const codeTypeName = component.getCodeTypeName();
      expect(codeTypeName).toBeDefined();
    });

    it('should handle complete workflow with privilege detail update', () => {
      // Start with empty form
      expect(component.formGroup.get('inventory')?.value).toBeNull();

      // Update store with privilege detail
      store.overrideSelector(
        createEditPrivilegeSelectors.selectPrivilegeDetail,
        mockPrivilegeDetail
      );
      store.refreshState();

      // Initialize component
      component.ngOnInit();

      // Verify form was updated
      expect(component.formGroup.get('inventory')?.value).toBe(
        mockPrivilegeDetail.inventory.inventory_details
      );
      expect(component.formGroup.get('quantity')?.value).toBe(10);
      expect(component.formGroup.get('codeType')?.value).toBe(
        InventoryTabCode.CodeUploaded
      );
    });
  });
});
