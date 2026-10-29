import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditHospitalComponent } from './create-edit-hospital.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, ReplaySubject, Subject } from 'rxjs';
import * as CreateEditHospitalActions from '../../stores/create-edit-hospital/create-edit-hospital.actions';

describe('CreateEditHospitalComponent', () => {
  let component: CreateEditHospitalComponent;
  let fixture: ComponentFixture<CreateEditHospitalComponent>;
  let store: MockStore;
  let datePipe: DatePipe;
  let actions$: ReplaySubject<any>;
  let mockDialog: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockActivatedRoute = {
      params: of({ point_rule_id: 123 }),
      snapshot: { params: { point_rule_id: 123 } },
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditHospitalComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatNativeDateModule,
      ],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        FormBuilder,
        DatePipe,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditHospitalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    datePipe = TestBed.inject(DatePipe);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set form dirty on value change (not view mode)', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.formMode.set('edit');
    component.baseSettingForm.get('name')?.setValue('Test Hospital');
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditHospitalActions.setFormDirty({ isDirty: true })
    );
  });

  it('should dispatch setFormDirty(false) and open dialog on createHospitalSuccess', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    actions$.next({
      type: CreateEditHospitalActions.createHospitalSuccess.type,
    });
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditHospitalActions.setFormDirty({ isDirty: false })
    );
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should navigate after dialog closed on createHospitalSuccess', () => {
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');
    actions$.next({
      type: CreateEditHospitalActions.createHospitalSuccess.type,
    });
    // Simulate dialog close
    mockDialog
      .open()
      .afterClosed()
      .subscribe(() => {
        expect(navigateSpy).toHaveBeenCalledWith([
          'master-data-management',
          'hospital',
          'list',
        ]);
      });
  });

  it('should mark all forms as touched and not dispatch if invalid onSubmit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.baseSettingForm.get('name')?.setValue('');
    component.masterListNameForm.get('name_th')?.setValue('');
    component.hospitalAddressForm.get('telephone')?.setValue('');

    component.onSubmit();
    expect(component.baseSettingForm.touched).toBeTruthy();
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      CreateEditHospitalActions.createHospital({ queryParams: {} })
    );
  });

  it('should dispatch createHospital if all forms valid and mode is create', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.baseSettingForm.setValue({
      name: 'A',
      description: 'B',
      is_published: true,
    });
    component.masterListNameForm.setValue({
      name_th: 'ไทย',
      name_en: 'EN',
    });
    component.hospitalDetailForm.setValue({
      health_insurances: [],
      service_types: [],
      healthcare_packages: [],
      checkup_enable: true,
    });
    component.hospitalAddressForm.setValue({
      telephone: '1234567890',
      latitude: '10',
      longitude: '20',
      province: '1',
      district: '2',
      address_th: 'ที่อยู่',
      address_en: 'Address',
    });
    component.formMode.set('create');
    component.onSubmit();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should set form mode and enable forms on setFormMode(edit)', () => {
    const enableSpy = jest.spyOn(component, 'enableAllForm');
    component.setFormMode('edit');
    expect(component.formMode()).toBe('edit');
    expect(enableSpy).toHaveBeenCalled();
  });

  it('should enable all forms', () => {
    component.disableAllForm();
    component.enableAllForm();
    expect(component.baseSettingForm.enabled).toBeTruthy();
    expect(component.masterListNameForm.enabled).toBeTruthy();
    expect(component.hospitalDetailForm.enabled).toBeTruthy();
    expect(component.hospitalAddressForm.enabled).toBeTruthy();
  });

  it('should validate latitude and longitude', () => {
    const latValidator = component.latitudeValidator();
    const longValidator = component.longitudeValidator();
    expect(latValidator({ value: '91' } as any)).toEqual({
      invalidLatitude: true,
    });
    expect(latValidator({ value: '45' } as any)).toBeNull();
    expect(longValidator({ value: '181' } as any)).toEqual({
      invalidLongitude: true,
    });
    expect(longValidator({ value: '100' } as any)).toBeNull();
  });

  it('should dispatch reset on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(CreateEditHospitalActions.reset());
  });
});
