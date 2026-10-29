import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HospitalAddressSectionComponent } from './hospital-address-section.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import * as CreateEditHospitalActions from '../../stores/create-edit-hospital/create-edit-hospital.actions';
import * as createEditHospitalSelectors from '../../stores/create-edit-hospital/create-edit-hospital.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HospitalAddressSectionComponent', () => {
  let component: HospitalAddressSectionComponent;
  let fixture: ComponentFixture<HospitalAddressSectionComponent>;
  let store: MockStore;
  let formBuilder: FormBuilder;
  let dispatchSpy: jest.SpyInstance;
  let destroy$: Subject<void>;

  const mockProvinces = [
    { province_id: 1, province_name_th: 'Bangkok' },
    { province_id: 2, province_name_th: 'Chiang Mai' },
  ];
  const mockDistricts = [
    { amphur_id: 10, amphur_name_th: 'District A' },
    { amphur_id: 20, amphur_name_th: 'District B' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HospitalAddressSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: createEditHospitalSelectors.selectProvinces,
              value: mockProvinces,
            },
            {
              selector: createEditHospitalSelectors.selectDistricts,
              value: mockDistricts,
            },
          ],
        }),
        FormBuilder,
        { provide: MatDialog, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HospitalAddressSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);
    destroy$ = new Subject<void>();

    component.formGroup = formBuilder.group({
      telephone: ['', []],
      latitude: ['', []],
      longitude: ['', []],
      province: ['', []],
      district: ['', []],
      address_th: ['', []],
      address_en: ['', []],
    });
    component.formMode = 'create';
    // Patch destroy$ for takeUntil
    (component as any).destroy$ = destroy$;

    fixture.detectChanges();
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getters', () => {
    it('should get telephoneControl', () => {
      expect(component.telephoneControl).toBe(
        component.formGroup.get('telephone')
      );
    });
    it('should get latitudeControl', () => {
      expect(component.latitudeControl).toBe(
        component.formGroup.get('latitude')
      );
    });
    it('should get longitudeControl', () => {
      expect(component.longitudeControl).toBe(
        component.formGroup.get('longitude')
      );
    });
    it('should get provinceControl', () => {
      expect(component.provinceControl).toBe(
        component.formGroup.get('province')
      );
    });
    it('should get districtControl', () => {
      expect(component.districtControl).toBe(
        component.formGroup.get('district')
      );
    });
    it('should get addressThControl', () => {
      expect(component.addressThControl).toBe(
        component.formGroup.get('address_th')
      );
    });
    it('should get addressEnControl', () => {
      expect(component.addressEnControl).toBe(
        component.formGroup.get('address_en')
      );
    });
  });

  it('should emit provinceOptions$ as ValueCode[]', (done) => {
    component.provinceOptions$.subscribe((options) => {
      expect(options).toEqual([
        { value: 'Bangkok', code: '1' },
        { value: 'Chiang Mai', code: '2' },
      ]);
      done();
    });
  });

  it('should emit districtOptions$ as ValueCode[]', (done) => {
    component.districtOptions$.subscribe((options) => {
      expect(options).toEqual([
        { value: 'District A', code: '10' },
        { value: 'District B', code: '20' },
      ]);
      done();
    });
  });

  it('should patch provinceControl with first province code on provinceOptions$ emit in create mode', () => {
    const patchSpy = jest.spyOn(component.provinceControl!, 'patchValue');
    component.ngOnInit();
    expect(patchSpy).toHaveBeenCalledWith('1');
  });

  it('should patch districtControl with first district code on districtOptions$ emit in create mode', () => {
    const patchSpy = jest.spyOn(component.districtControl!, 'patchValue');
    component.ngOnInit();
    expect(patchSpy).toHaveBeenCalled();
  });

  it('should dispatch getDistricts when provinceControl value changes', () => {
    component.provinceControl?.setValue(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditHospitalActions.getDistricts({ provinceId: 2 })
    );
  });

  it('should enable and reset districtControl when province changes', () => {
    const enableSpy = jest.spyOn(component.districtControl!, 'enable');
    const resetSpy = jest.spyOn(component.districtControl!, 'reset');
    component.provinceControl?.setValue('1');
    expect(enableSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should dispatch getProvinces on ngOnInit', () => {
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditHospitalActions.getProvinces()
    );
  });

  it('should get dropdown value by code', () => {
    const options = [
      { code: 'A', value: 'Alpha' },
      { code: 'B', value: 'Beta' },
    ];
    expect(component.getDropdownValue('A', options)).toBe('Alpha');
    expect(component.getDropdownValue('B', options)).toBe('Beta');
    expect(component.getDropdownValue('C', options)).toBe('');
  });

  describe('reValidateForm', () => {
    it('should set validators for telephoneControl', () => {
      component.reValidateForm();
      const validators = (component.telephoneControl as any)._rawValidators;
      expect(validators.length).toBeGreaterThan(0);
    });
  });

  it('should return undefined if formGroup is undefined', () => {
    component.formGroup = undefined as unknown as FormGroup;
    expect(component.telephoneControl).toBeUndefined();
    expect(component.latitudeControl).toBeUndefined();
    expect(component.longitudeControl).toBeUndefined();
    expect(component.provinceControl).toBeUndefined();
    expect(component.districtControl).toBeUndefined();
    expect(component.addressThControl).toBeUndefined();
    expect(component.addressEnControl).toBeUndefined();
  });
});
