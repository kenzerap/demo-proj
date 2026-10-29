import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryStocksSettingSectionComponent } from './inventory-stocks-setting-section.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import * as CreateEditInventorySelectors from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InventoryStocksSettingSectionComponent', () => {
  let component: InventoryStocksSettingSectionComponent;
  let fixture: ComponentFixture<InventoryStocksSettingSectionComponent>;
  let store: MockStore;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InventoryStocksSettingSectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatNativeDateModule
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryStocksSettingSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);

    // Mock selectors
    store.overrideSelector(CreateEditInventorySelectors.selectBrands, [
      { brand_name_thai: 'Brand 1', brand_id: 1, brand_name_english: 'Brand 1' },
      { brand_name_thai: 'Brand 2', brand_id: 2, brand_name_english: 'Brand 2' },
    ]);
    store.overrideSelector(CreateEditInventorySelectors.selectInventoryId, 123);

    // Initialize form group
    component.formGroup = formBuilder.group({
      inventory_name: [''],
      description: [''],
      brand_id: [''],
      inventory_type: [''],
      status: [false],
      expire_date: [''],
      expire_time: [''],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getBrandOptions on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditInventoryActions.getBrandOptions()
    );
  });

  it('should patch brand_id with the first brand on init in create mode', () => {
    component.formMode = 'create';
    component.ngOnInit();
    expect(component.brandIdControl?.value).toBe('1');
  });

  it('should disable brand_id and inventory_type controls if inventoryId exists', () => {
    component.ngOnInit();
    expect(component.brandIdControl?.disabled).toBe(true);
    expect(component.inventoryTypeControl?.disabled).toBe(true);
  });

  it('should validate expireTimeControl with custom validator', () => {
    const expireTimeControl = component.expireTimeControl!;
    component.formGroup.patchValue({
      expire_date: '2023-10-01',
      expire_time: '08:00',
    });

    const errors = component.expireTimeValidator(expireTimeControl);
    expect(errors).toEqual({ invalidExpireTime: true });
  });

  it('should return dropdown value for a given code', () => {
    const dropdownOptions = [
      { value: 'Option 1', code: '1' },
      { value: 'Option 2', code: '2' },
    ];
    const result = component.getDropdownValue('1', dropdownOptions);
    expect(result).toBe('Option 1');
  });

  it('should return null if dropdown value is not found', () => {
    const dropdownOptions = [
      { value: 'Option 1', code: '1' },
      { value: 'Option 2', code: '2' },
    ];
    const result = component.getDropdownValue('3', dropdownOptions);
    expect(result).toBe('');
  });

  it('should re-validate the form on reValidateForm call', () => {
    const setValidatorsSpy = jest.spyOn(
      component.expireTimeControl!,
      'setValidators'
    );
    component.reValidateForm();
    expect(setValidatorsSpy).toHaveBeenCalled();
  });

  it('should validate expireTimeValidator correctly', () => {
    const control = component.expireTimeControl!;
    component.formGroup.patchValue({
      expire_date: '2029-10-01',
      expire_time: '10:00',
    });

    const errors = component.expireTimeValidator(control);
    expect(errors).toBeNull();
  });

  it('should invalidate expireTimeValidator for past time', () => {
    const control = component.expireTimeControl!;
    component.formGroup.patchValue({
      expire_date: '2023-10-01',
      expire_time: '08:00',
    });

    const errors = component.expireTimeValidator(control);
    expect(errors).toEqual({ invalidExpireTime: true });
  });
});
