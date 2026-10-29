import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { HealthcarePackageSectionComponent } from './healthcare-package-section.component';
import * as CreateEditPrivilegeActions from '../../stores/create-edit-privilege/create-edit-privilege.actions';
import * as CreateEditPrivilegeSelectors from '../../stores/create-edit-privilege/create-edit-privilege.selectors';
import { ValueCode } from '@app/shared/models/value-code.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PrivilegeDetail } from '../../models/privilege-setting-model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HealthcarePackageSectionComponent', () => {
  let component: HealthcarePackageSectionComponent;
  let fixture: ComponentFixture<HealthcarePackageSectionComponent>;
  let store: MockStore;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HealthcarePackageSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthcarePackageSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);

    // Mock selectors
    store.overrideSelector(CreateEditPrivilegeSelectors.selectPrivilegeDetail, {
      health_care_package_ids: [1, 2],
    } as PrivilegeDetail);

    store.overrideSelector(
      CreateEditPrivilegeSelectors.selectHealthcarePackages,
      [
        { id: 1, packageNameTh: 'Package 1', packageNameEn: 'Package 1' },
        { id: 2, packageNameTh: 'Package 2', packageNameEn: 'Package 2' },
        { id: 3, packageNameTh: 'Package 3', packageNameEn: 'Package 3' },
      ]
    );

    // Initialize form group
    component.formGroup = formBuilder.group({
      health_care_package_ids: formBuilder.array([]),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getHealthcarePackageOptions on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPrivilegeActions.getHealthcarePackageOptions()
    );
  });

  it('should initialize formGroup with healthcare packages in edit mode', () => {
    component.formMode = 'edit';
    component.ngOnInit();
    expect(component.healthcarePackageIdsFormArray.length).toBe(2);
    expect(component.healthcarePackageIdsFormArray.at(0).value).toEqual({
      health_care_package_id: 1,
    });
    expect(component.healthcarePackageIdsFormArray.at(1).value).toEqual({
      health_care_package_id: 2,
    });
  });

  it('should disable formGroup in view mode', () => {
    component.formMode = 'view';
    component.ngOnInit();
    expect(component.formGroup.disabled).toBe(true);
  });

  it('should add a new package', () => {
    component.healthcarePackageOptions = [
      { code: 1, value: 'Package 1' },
      { code: 2, value: 'Package 2' },
      { code: 3, value: 'Package 3' },
    ];
    component.addPackage();
    expect(component.healthcarePackageIdsFormArray.length).toBe(1);
    expect(component.healthcarePackageIdsFormArray.at(0).value).toEqual({
      health_care_package_id: 1,
    });
  });

  it('should remove a package', () => {
    component.healthcarePackageIdsFormArray.push(
      formBuilder.group({ health_care_package_id: [1] })
    );
    component.removePackage(0);
    expect(component.healthcarePackageIdsFormArray.length).toBe(0);
  });

  it('should return the correct dropdown value', () => {
    const dropdownOptions: ValueCode<number>[] = [
      { code: 1, value: 'Package 1' },
      { code: 2, value: 'Package 2' },
    ];
    const result = component.getDropdownValue(1, dropdownOptions);
    expect(result).toBe('Package 1');
  });

  it('should return remaining healthcare package options', () => {
    component.healthcarePackageOptions = [
      { code: 1, value: 'Package 1' },
      { code: 2, value: 'Package 2' },
      { code: 3, value: 'Package 3' },
    ];
    component.healthcarePackageIdsFormArray.push(
      formBuilder.group({ health_care_package_id: 1 })
    );
    const remainingOptions = component.getRemainingHealthcarePackageOptions(2);
    expect(remainingOptions).toEqual([
      { code: 2, value: 'Package 2' },
      { code: 3, value: 'Package 3' },
    ]);
  });
});
