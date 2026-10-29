import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HospitalDetailSectionComponent } from './hospital-detail-section.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ChangeDetectorRef } from '@angular/core';
import * as CreateEditHospitalActions from '../../stores/create-edit-hospital/create-edit-hospital.actions';
import * as createEditHospitalSelectors from '../../stores/create-edit-hospital/create-edit-hospital.selectors';
import { of, Subject } from 'rxjs';
import { ValueCode } from '@app/shared/models/value-code.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HospitalDetailSectionComponent', () => {
  let component: HospitalDetailSectionComponent;
  let fixture: ComponentFixture<HospitalDetailSectionComponent>;
  let store: MockStore;
  let formBuilder: FormBuilder;
  let changeDetector: ChangeDetectorRef;

  const mockHealthcarePackages = [
    { id: 1, name: 'Package 1' },
    { id: 2, name: 'Package 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HospitalDetailSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: createEditHospitalSelectors.selectHealthcarePackages,
              value: mockHealthcarePackages,
            },
          ],
        }),
        FormBuilder,
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HospitalDetailSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);
    changeDetector = (component as any).changeDetector;

    component.formGroup = formBuilder.group({
      health_insurances: [[]],
      service_types: [[]],
      healthcare_packages: [[]],
      checkup_enable: [false],
    });

    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Getters', () => {
    it('should get healthInsurancesControl', () => {
      expect(component.healthInsurancesControl).toBe(
        component.formGroup.get('health_insurances')
      );
    });
    it('should get serviceTypesControl', () => {
      expect(component.serviceTypesControl).toBe(
        component.formGroup.get('service_types')
      );
    });
    it('should get healthcarePackagesControl', () => {
      expect(component.healthcarePackagesControl).toBe(
        component.formGroup.get('healthcare_packages')
      );
    });
    it('should get checkupEnableControl', () => {
      expect(component.checkupEnableControl).toBe(
        component.formGroup.get('checkup_enable')
      );
    });
  });

  describe('healthcarePackages$', () => {
    it('should map healthcarePackages to ValueCode[]', (done) => {
      component.healthcarePackages$.subscribe((result) => {
        expect(result).toEqual([
          { code: '1', value: 'Package 1' },
          { code: '2', value: 'Package 2' },
        ]);
        done();
      });
    });
  });

  describe('ngOnInit', () => {
    it('should call reValidateForm and subscribe to valueChanges', () => {
      const reValidateFormSpy = jest.spyOn(component, 'reValidateForm');
      const detectChangesSpy = jest.spyOn(changeDetector, 'detectChanges');
      component.ngOnInit();
      component.healthcarePackagesControl?.setValue(['1']);
      expect(reValidateFormSpy).toHaveBeenCalled();
      expect(detectChangesSpy).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditHospitalActions.getHealthcarePackage({
          params: { page: 0, size: 999, is_published: true },
        })
      );
    });
  });

  describe('isCheckPackage', () => {
    it('should return true if packageCode is selected', () => {
      component.healthcarePackagesControl?.setValue(['1']);
      expect(component.isCheckPackage('1')).toBe(true);
    });
    it('should return false if packageCode is not selected', () => {
      component.healthcarePackagesControl?.setValue(['2']);
      expect(component.isCheckPackage('1')).toBe(false);
    });
    it('should handle undefined value', () => {
      component.formGroup.get('healthcare_packages')?.setValue(undefined);
      expect(component.isCheckPackage('1')).toBe(false);
    });
  });

  describe('selectPackage', () => {
    it('should add package code when checked', () => {
      component.healthcarePackagesControl?.setValue(['1']);
      component.selectPackage(true, { code: '2', value: 'Package 2' });
      expect(component.healthcarePackagesControl?.value).toEqual(['1', '2']);
    });
    it('should remove package code when unchecked', () => {
      component.healthcarePackagesControl?.setValue(['1', '2']);
      component.selectPackage(false, { code: '2', value: 'Package 2' });
      expect(component.healthcarePackagesControl?.value).toEqual(['1']);
    });
    it('should set null when all packages are removed', () => {
      component.healthcarePackagesControl?.setValue(['2']);
      component.selectPackage(false, { code: '2', value: 'Package 2' });
      expect(component.healthcarePackagesControl?.value).toBeNull();
    });
  });

  describe('isCheckHealthInsurance', () => {
    it('should return true if option is selected', () => {
      component.healthInsurancesControl?.setValue(['OPD']);
      expect(component.isCheckHealthInsurance('OPD')).toBe(true);
    });
    it('should return false if option is not selected', () => {
      component.healthInsurancesControl?.setValue(['IPD']);
      expect(component.isCheckHealthInsurance('OPD')).toBe(false);
    });
    it('should handle undefined value', () => {
      component.formGroup.get('health_insurances')?.setValue(undefined);
      expect(component.isCheckHealthInsurance('OPD')).toBe(false);
    });
  });

  describe('selectHealthInsurance', () => {
    it('should add option if not present', () => {
      component.healthInsurancesControl?.setValue(['OPD']);
      component.selectHealthInsurance('IPD');
      expect(component.healthInsurancesControl?.value).toEqual(['OPD', 'IPD']);
    });
    it('should remove option if present', () => {
      component.healthInsurancesControl?.setValue(['OPD', 'IPD']);
      component.selectHealthInsurance('IPD');
      expect(component.healthInsurancesControl?.value).toEqual(['OPD']);
    });
  });

  describe('isCheckServiceType', () => {
    it('should return true if option is selected', () => {
      component.serviceTypesControl?.setValue(['LIFE']);
      expect(component.isCheckServiceType('LIFE')).toBe(true);
    });
    it('should return false if option is not selected', () => {
      component.serviceTypesControl?.setValue(['GROUP']);
      expect(component.isCheckServiceType('LIFE')).toBe(false);
    });
    it('should handle undefined value', () => {
      component.formGroup.get('service_types')?.setValue(undefined);
      expect(component.isCheckServiceType('LIFE')).toBe(false);
    });
  });

  describe('selectServiceType', () => {
    it('should add option if not present', () => {
      component.serviceTypesControl?.setValue(['LIFE']);
      component.selectServiceType('A_H');
      expect(component.serviceTypesControl?.value).toEqual(['LIFE', 'A_H']);
    });
    it('should remove option if present', () => {
      component.serviceTypesControl?.setValue(['LIFE', 'A_H']);
      component.selectServiceType('A_H');
      expect(component.serviceTypesControl?.value).toEqual(['LIFE']);
    });
    it('should reset healthcarePackagesControl if DEMOPROJ365 is selected', () => {
      const resetSpy = jest.spyOn(
        component.healthcarePackagesControl!,
        'reset'
      );
      component.selectServiceType('DEMOPROJ365');
      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('reValidateForm', () => {
    it('should set validators for healthcarePackagesControl', () => {
      const setValidatorsSpy = jest.spyOn(
        component.healthcarePackagesControl!,
        'setValidators'
      );
      component.reValidateForm();
      expect(setValidatorsSpy).toHaveBeenCalled();
    });
  });

  it('should return undefined if formGroup is undefined', () => {
    component.formGroup = undefined as unknown as FormGroup;
    expect(component.healthInsurancesControl).toBeUndefined();
    expect(component.serviceTypesControl).toBeUndefined();
    expect(component.healthcarePackagesControl).toBeUndefined();
    expect(component.checkupEnableControl).toBeUndefined();
  });
});
