import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditInventoryComponent } from './create-edit-inventory.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InventoryType } from '../../../../shared/utils/enums/inventory-type.enum';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateEditInventoryComponent', () => {
  let component: CreateEditInventoryComponent;
  let fixture: ComponentFixture<CreateEditInventoryComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      params: of({ inventory_id: '1' }),
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [
        CreateEditInventoryComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatNativeDateModule,
      ],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditInventoryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as dirty on value changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.inventoryStocksSettingForm.patchValue({
      inventory_name: 'Test Inventory',
    });
    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditInventoryActions.setFormDirty({ isDirty: true })
      );
    }, 0);
  });

  it('should handle successful inventory creation', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.inventoryStocksSettingForm.patchValue({
      inventory_name: 'Test Inventory',
      description: 'Test Description',
      brand_id: 1,
      inventory_type: InventoryType.UPLOAD_CODE,
      status: true,
      expire_date: '2023-10-01',
      expire_time: '10:00',
    });

    component.ngOnInit();
    component.onSubmit();

    setTimeout(() => {
      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          message: 'The inventory stocks was created',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'success',
        },
        width: '25rem',
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        'privilege-management',
        'inventory-setting',
        'list',
      ]);
    }, 0);
  });

  it('should validate and submit the form in create mode', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.inventoryStocksSettingForm.patchValue({
      inventory_name: 'Test Inventory',
      description: 'Test Description',
      brand_id: 1,
      inventory_type: InventoryType.UPLOAD_CODE,
      status: true,
      expire_date: '2023-10-01',
      expire_time: '10:00',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditInventoryActions.createInventory({
          data: {
            inventory_name: 'Test Inventory',
            description: 'Test Description',
            brand_id: 1,
            inventory_type: InventoryType.UPLOAD_CODE,
            status: 'ACTIVE',
            expire_date_time: '2023-10-01T10:00:00.000Z',
          },
        })
      );
    }, 0);
  });

  it('should mark all fields as touched if form is invalid', () => {
    jest.spyOn(component.inventoryStocksSettingForm, 'markAllAsTouched');
    component.onSubmit();
    expect(
      component.inventoryStocksSettingForm.markAllAsTouched
    ).toHaveBeenCalled();
  });

  it('should set form mode and enable/disable forms accordingly', () => {
    jest.spyOn(component, 'enableAllForm');
    jest.spyOn(store, 'dispatch');

    component.setFormMode('edit');
    expect(component.formMode()).toBe('edit');
    expect(component.enableAllForm).toHaveBeenCalled();

    component.setFormMode('view');
    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditInventoryActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  });

  it('should enable all forms', () => {
    jest.spyOn(component.inventoryStocksSettingForm, 'enable');
    component.enableAllForm();
    expect(component.inventoryStocksSettingForm.enable).toHaveBeenCalledWith({
      emitEvent: false,
    });
  });

  it('should reset state on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditInventoryActions.resetAll()
    );
  });
});
