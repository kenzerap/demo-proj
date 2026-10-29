import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import * as CreateEditHospitalActions from '../../stores/create-edit-hospital/create-edit-hospital.actions';
import * as createEditHospitalSelectors from '../../stores/create-edit-hospital/create-edit-hospital.selectors';
import { map, Observable, takeUntil } from 'rxjs';
import { ValueCode } from '@app/shared/models/value-code.model';
import { requireDependValidator } from '@app/shared/utils/require-depend-validator';

@Component({
  selector: 'app-hospital-detail-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatCheckboxModule,
  ],
  templateUrl: './hospital-detail-section.component.html',
  styleUrl: './hospital-detail-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HospitalDetailSectionComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);
  private changeDetector = inject(ChangeDetectorRef);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  get healthInsurancesControl() {
    return this.formGroup?.get('health_insurances');
  }
  get serviceTypesControl() {
    return this.formGroup?.get('service_types');
  }
  get healthcarePackagesControl() {
    return this.formGroup?.get('healthcare_packages');
  }
  get checkupEnableControl() {
    return this.formGroup?.get('checkup_enable');
  }

  healthcarePackages$: Observable<ValueCode[]> = this.store
    .select(createEditHospitalSelectors.selectHealthcarePackages)
    .pipe(
      map((healthcarePackages) => {
        return healthcarePackages.map((healthcarePackage) => ({
          code: healthcarePackage.id.toString(),
          value: healthcarePackage.name,
        }));
      })
    );

  ngOnInit(): void {
    this.reValidateForm();

    this.healthcarePackagesControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.changeDetector.detectChanges();
      });

    this.store.dispatch(
      CreateEditHospitalActions.getHealthcarePackage({
        params: { page: 0, size: 999, is_published: true },
      })
    );
  }

  isCheckPackage(packageCode: string) {
    const valueOptions: string[] =
      this.healthcarePackagesControl?.getRawValue() || [];
    return valueOptions.includes(packageCode);
  }

  selectPackage(checked: boolean, healthcarePackage: ValueCode) {
    const valueOptions: string[] =
      this.healthcarePackagesControl?.getRawValue() || [];
    if (checked) {
      this.healthcarePackagesControl?.patchValue([
        ...valueOptions,
        healthcarePackage.code,
      ]);
    } else {
      const newOptions = valueOptions.filter(
        (item) => item !== healthcarePackage.code
      );
      this.healthcarePackagesControl?.patchValue(
        newOptions.length > 0 ? newOptions : null
      );
    }
  }

  isCheckHealthInsurance(option: 'OPD' | 'IPD' | 'DENTAL') {
    const valueOptions: string[] =
      this.healthInsurancesControl?.getRawValue() || [];
    return valueOptions.includes(option);
  }

  selectHealthInsurance(option: 'OPD' | 'IPD' | 'DENTAL') {
    const valueOptions: string[] =
      this.healthInsurancesControl?.getRawValue() || [];
    if (!valueOptions.includes(option)) {
      this.healthInsurancesControl?.patchValue([...valueOptions, option]);
    } else {
      const newOptions = valueOptions.filter((item) => item !== option);
      this.healthInsurancesControl?.patchValue(newOptions);
    }
  }

  isCheckServiceType(
    option: 'LIFE' | 'A_H' | 'GROUP' | 'HEALTH_CHECKUP' | 'DEMOPROJ365'
  ) {
    const valueOptions: string[] =
      this.serviceTypesControl?.getRawValue() || [];
    return valueOptions.includes(option);
  }

  selectServiceType(
    option: 'LIFE' | 'A_H' | 'GROUP' | 'HEALTH_CHECKUP' | 'DEMOPROJ365'
  ) {
    const valueOptions: string[] =
      this.serviceTypesControl?.getRawValue() || [];
    if (!valueOptions.includes(option)) {
      this.serviceTypesControl?.patchValue([...valueOptions, option]);
    } else {
      const newOptions = valueOptions.filter((item) => item !== option);
      this.serviceTypesControl?.patchValue(newOptions);
    }

    if (option === 'DEMOPROJ365') {
      this.healthcarePackagesControl?.reset();
    }
  }

  reValidateForm() {
    this.healthcarePackagesControl?.setValidators([
      (control) =>
        requireDependValidator(control, this.isCheckServiceType('DEMOPROJ365')),
    ]);
  }
}
