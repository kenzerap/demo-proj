import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { MatIconModule } from '@angular/material/icon';
import { filter, map, Observable, takeUntil } from 'rxjs';
import * as CreateEditHospitalActions from '../../stores/create-edit-hospital/create-edit-hospital.actions';
import * as createEditHospitalSelectors from '../../stores/create-edit-hospital/create-edit-hospital.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-hospital-address-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    DemoprojInputComponent,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './hospital-address-section.component.html',
  styleUrl: './hospital-address-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HospitalAddressSectionComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  get telephoneControl() {
    return this.formGroup?.get('telephone');
  }
  get latitudeControl() {
    return this.formGroup?.get('latitude');
  }
  get longitudeControl() {
    return this.formGroup?.get('longitude');
  }
  get provinceControl() {
    return this.formGroup?.get('province');
  }
  get districtControl() {
    return this.formGroup?.get('district');
  }
  get addressThControl() {
    return this.formGroup?.get('address_th');
  }
  get addressEnControl() {
    return this.formGroup?.get('address_en');
  }

  provinceOptions$: Observable<ValueCode<string>[]> = this.store
    .select(createEditHospitalSelectors.selectProvinces)
    .pipe(
      map((provinces) => {
        return provinces.map((province) => ({
          value: province.province_name_th,
          code: province.province_id.toString(),
        }));
      })
    );
  districtOptions$: Observable<ValueCode<string>[]> = this.store
    .select(createEditHospitalSelectors.selectDistricts)
    .pipe(
      map((districts) => {
        return districts.map((district) => ({
          value: district.amphur_name_th,
          code: district.amphur_id.toString(),
        }));
      })
    );

  ngOnInit(): void {
    this.reValidateForm();

    this.provinceOptions$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (provinceOptions) =>
            provinceOptions.length > 0 && this.formMode === 'create'
        )
      )
      .subscribe((provinceOptions) => {
        this.provinceControl?.patchValue(provinceOptions[0].code);
        this.store.dispatch(
          CreateEditHospitalActions.setFormDirty({ isDirty: false })
        );
      });

    this.districtOptions$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (districtOptions) =>
            districtOptions.length > 0 && this.formMode === 'create'
        )
      )
      .subscribe((districtOptions) => {
        this.districtControl?.patchValue(districtOptions[0].code, {
          emitEvent: false,
        });
      });

    this.provinceControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((provinceId) => !!provinceId)
      )
      .subscribe((provinceId) => {
        this.store.dispatch(
          CreateEditHospitalActions.setFormDirty({ isDirty: true })
        );
        if (this.formMode !== 'view') {
          this.districtControl?.enable();
          this.districtControl?.reset();
        }
        this.store.dispatch(
          CreateEditHospitalActions.getDistricts({ provinceId })
        );
      });

    this.store.dispatch(CreateEditHospitalActions.getProvinces());
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  reValidateForm() {
    this.telephoneControl?.setValidators([Validators.required]);
  }
}
