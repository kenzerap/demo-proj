import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { filter, merge, Observable, take, takeUntil } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as CreateEditHospitalActions from '../../stores/create-edit-hospital/create-edit-hospital.actions';
import * as CreateEditHospitalSelectors from '../../stores/create-edit-hospital/create-edit-hospital.selectors';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseSettingSectionComponent } from '../base-setting-section/base-setting-section.component';
import { MasterListNameSectionComponent } from '../master-list-name-section/master-list-name-section.component';
import { HospitalAddressSectionComponent } from '../hospital-address-section/hospital-address-section.component';
import { HospitalDetailSectionComponent } from '../hospital-detail-section/hospital-detail-section.component';
import { CreateEditHospitalQueryParams } from '../../models/create-edit-hospital-query-params.model';
import { isEmptyValue } from '@app/shared/utils/is-empty-value';
import { Hospital } from '../../models/hospital.model';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';

@Component({
  selector: 'app-create-edit-hospital',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    BaseSettingSectionComponent,
    MasterListNameSectionComponent,
    HospitalAddressSectionComponent,
    HospitalDetailSectionComponent,
    HasPermissionsDirective,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-hospital.component.html',
  styleUrl: './create-edit-hospital.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditHospitalComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private actions$ = inject(Actions);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private changeDetector = inject(ChangeDetectorRef);
  private hasPermissionService = inject(HasPermissionService);

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.Hospital,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  loading$ = this.store.select(selectIsLoading(`createEditHospital`));
  hospitalDetail$: Observable<Hospital | null> = this.store.select(
    CreateEditHospitalSelectors.selectHospitalDetail
  );

  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  hospitalId: WritableSignal<number> = signal(0);

  baseSettingForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    is_published: [false],
  });

  masterListNameForm: FormGroup = this.fb.group({
    name_th: ['', Validators.required],
    name_en: ['', Validators.required],
  });

  hospitalDetailForm: FormGroup = this.fb.group({
    health_insurances: [''],
    service_types: [''],
    healthcare_packages: [''],
    checkup_enable: [''],
  });

  hospitalAddressForm: FormGroup = this.fb.group({
    telephone: ['', [Validators.required]],
    latitude: ['', [Validators.required, this.latitudeValidator()]],
    longitude: ['', [Validators.required, this.longitudeValidator()]],
    province: ['', Validators.required],
    district: [{ value: '', disabled: true }, Validators.required],
    address_th: ['', Validators.required],
    address_en: ['', Validators.required],
  });

  /* istanbul ignore next */
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['hospitalId']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.hospitalId.set(Number(params['hospitalId']));
        this.setFormMode('view');
        this.disableAllForm();
        this.store.dispatch(
          CreateEditHospitalActions.getHospitalDetail({
            hospitalId: this.hospitalId(),
          })
        );
      });
    this.hospitalDetail$
      .pipe(
        filter((hospitalDetail) => !!hospitalDetail),
        take(1)
      )
      .subscribe((hospitalDetail) => {
        this.baseSettingForm.patchValue({
          name: hospitalDetail?.hospital_name,
          description: hospitalDetail?.description,
          is_published: hospitalDetail.is_published,
        });

        this.masterListNameForm.patchValue({
          name_th: hospitalDetail?.name_th,
          name_en: hospitalDetail?.name_en,
        });

        this.hospitalDetailForm.patchValue({
          health_insurances: hospitalDetail?.health_insurances || [],
          service_types: hospitalDetail?.service_types || [],
          healthcare_packages:
            hospitalDetail?.healthcare_packages?.map(String) || [],
          checkup_enable: hospitalDetail?.checkup_enable,
        });

        this.hospitalAddressForm.patchValue({
          telephone: hospitalDetail?.telephone,
          latitude: hospitalDetail?.latitude,
          longitude: hospitalDetail?.longitude,
          province: hospitalDetail?.province_id?.toString(),
          district: hospitalDetail?.amphur_id?.toString(),
          address_th: hospitalDetail?.address_th,
          address_en: hospitalDetail?.address_en,
        });

        setTimeout(() => {
          this.changeDetector.detectChanges();
          this.store.dispatch(
            CreateEditHospitalActions.setFormDirty({ isDirty: false })
          );
        }, 0);
      });

    merge(
      this.baseSettingForm.valueChanges,
      this.masterListNameForm.valueChanges,
      this.hospitalDetailForm.valueChanges,
      this.hospitalAddressForm.valueChanges
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditHospitalActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditHospitalActions.createHospitalSuccess,
          CreateEditHospitalActions.updateHospitalSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditHospitalActions.setFormDirty({ isDirty: false })
        );
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The master data was created`
                : 'The master data was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['master-data-management', 'hospital', 'list']);
        });
      });
  }

  /* istanbul ignore next */
  onSubmit() {
    // check validate
    const isValidForm =
      this.baseSettingForm.valid &&
      this.masterListNameForm.valid &&
      this.hospitalDetailForm.valid &&
      this.hospitalAddressForm.valid;

    if (!isValidForm) {
      this.baseSettingForm.markAllAsTouched();
      this.masterListNameForm.markAllAsTouched();
      this.hospitalDetailForm.markAllAsTouched();
      this.hospitalAddressForm.markAllAsTouched();

      this.hospitalDetailForm
        .get('healthcare_packages')
        ?.updateValueAndValidity();
      return;
    }

    const baseSettingFormValue = this.baseSettingForm.getRawValue();
    const masterListNameFormValue = this.masterListNameForm.getRawValue();
    const hospitalDetailFormValue = this.hospitalDetailForm.getRawValue();
    const hospitalAddressFormValue = this.hospitalAddressForm.getRawValue();

    const bodyQueryParams: Partial<CreateEditHospitalQueryParams> = {
      hospital_name: baseSettingFormValue.name,
      description: baseSettingFormValue?.description,
      is_published: !!baseSettingFormValue?.is_published,
      ...masterListNameFormValue,
      health_insurances: hospitalDetailFormValue.health_insurances || [],
      service_types: hospitalDetailFormValue.service_types || [],
      healthcare_packages: hospitalDetailFormValue.healthcare_packages || [],
      checkup_enable: !!hospitalDetailFormValue.checkup_enable,
      telephone: hospitalAddressFormValue.telephone,
      latitude: hospitalAddressFormValue.latitude,
      longitude: hospitalAddressFormValue.longitude,
      province_id: hospitalAddressFormValue.province,
      amphur_id: hospitalAddressFormValue.district,
      address_en: hospitalAddressFormValue.address_en,
      address_th: hospitalAddressFormValue.address_th,
    };
    if (this.formMode() === 'edit') {
      this.store.dispatch(
        CreateEditHospitalActions.updateHospital({
          data: { ...bodyQueryParams, id: this.hospitalId() },
        })
      );
    } else {
      this.store.dispatch(
        CreateEditHospitalActions.createHospital({
          queryParams: bodyQueryParams,
        })
      );
    }
  }

  setFormMode(mode: 'create' | 'edit' | 'view') {
    this.formMode.set(mode);
    if (mode === 'edit') {
      this.enableAllForm();
    }
    setTimeout(() => {
      this.store.dispatch(
        CreateEditHospitalActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.baseSettingForm.disable({ emitEvent: false });
    this.masterListNameForm.disable({ emitEvent: false });
    this.hospitalDetailForm.disable({ emitEvent: false });
    this.hospitalAddressForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.baseSettingForm.enable({ emitEvent: false });
    this.masterListNameForm.enable({ emitEvent: false });
    this.hospitalDetailForm.enable({ emitEvent: false });
    this.hospitalAddressForm.enable({ emitEvent: false });
  }

  latitudeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isEmptyValue(control.value)) {
        return null;
      }

      const value = parseFloat(control.value);
      return isNaN(control.value) || value < -90 || value > 90
        ? { invalidLatitude: true }
        : null;
    };
  }

  longitudeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isEmptyValue(control.value)) {
        return null;
      }

      const value = parseFloat(control.value);
      return isNaN(control.value) || value < -180 || value > 180
        ? { invalidLongitude: true }
        : null;
    };
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditHospitalActions.reset());
  }
}
