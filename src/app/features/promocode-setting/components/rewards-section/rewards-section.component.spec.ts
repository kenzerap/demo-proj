import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RewardsSectionComponent } from './rewards-section.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import * as CreateEditPromocodeActions from '../../stores/create-edit-promocode/create-edit-promocode.actions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RewardsSectionComponent', () => {
  let component: RewardsSectionComponent;
  let fixture: ComponentFixture<RewardsSectionComponent>;
  let store: MockStore;
  let dialog: jest.Mocked<MatDialog>;
  let destroy$: Subject<void>;

  beforeEach(async () => {
    dialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ selectedItem: { id: 1 } })),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RewardsSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: dialog },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RewardsSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    destroy$ = new Subject<void>();

    component.formGroup = new FormBuilder().group({
      is_point: [false],
      is_privilege: [false],
      earning_point: ['', Validators.required],
      earning_point_expiry_date: ['', Validators.required],
      is_advance_reward: [false],
      is_special_condition_fraud_user: [false],
      fraud_condition_point: ['', Validators.required],
      fraud_condition_point_expire_date: ['', Validators.required],
      privilege: ['', Validators.required],
    });

    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getPrivileges on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      CreateEditPromocodeActions.getPrivileges()
    );
  });

  it('should reset earningPointControl and earningPointExpiryDateControl when isPointControl changes', () => {
    component.isPointControl?.setValue(true);
    expect(component.earningPointControl?.value).toBeNull();
    expect(component.earningPointExpiryDateControl?.value).toBeNull();
  });

  it('should reset privilegeControl when isPrivilegeControl changes', () => {
    component.isPrivilegeControl?.setValue(true);
    expect(component.privilegeControl?.value).toBeNull();
  });

  it('should reset fraudConditionPointControl and fraudConditionPointExpireDateControl when isSpecialConditionFraudUserControl changes', () => {
    component.isSpecialConditionFraudUserControl?.setValue(true);
    expect(component.fraudConditionPointControl?.value).toBeNull();
    expect(component.fraudConditionPointExpireDateControl?.value).toBeNull();
  });

  it('should open the AddPrivilegeDialog and update privilegeControl on dialog close', () => {
    component.openAddPrivilegeDialog();
    expect(dialog.open).toHaveBeenCalled();
    expect(component.privilegeControl?.value).toEqual({ id: 1 });
  });

  it('should re-validate form controls on reValidateForm', () => {
    component.reValidateForm();
    expect(component.earningPointControl?.validator).toBeDefined();
    expect(component.earningPointExpiryDateControl?.validator).toBeDefined();
    expect(component.privilegeControl?.validator).toBeDefined();
    expect(component.fraudConditionPointControl?.validator).toBeDefined();
    expect(
      component.fraudConditionPointExpireDateControl?.validator
    ).toBeDefined();
  });

  it('should toggle form control value and mark it as dirty on changeGroup', () => {
    const control = component.isPointControl;
    control?.setValue(false);
    component.changeGroup(control);
    expect(control?.value).toBe(true);
    expect(control?.dirty).toBe(true);
  });

  it('should return correct dropdown value from getDropdownValue', () => {
    const dropdownOptions = [
      { code: 'OPTION_1', value: 'Option 1' },
      { code: 'OPTION_2', value: 'Option 2' },
    ];
    expect(component.getDropdownValue('OPTION_1', dropdownOptions)).toBe(
      'Option 1'
    );
    expect(component.getDropdownValue('INVALID', dropdownOptions)).toBe('');
  });
});
