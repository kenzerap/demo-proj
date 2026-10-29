import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { Store } from '@ngrx/store';
import * as CreateEditPrivilegeActions from '../../stores/create-edit-privilege/create-edit-privilege.actions';
import * as CreateEditPrivilegeSelectors from '@app/features/privilege-setting/stores/create-edit-privilege/create-edit-privilege.selectors';
import { combineLatest, filter, map, Observable, take, takeUntil } from 'rxjs';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { PrivilegeDetail } from '../../models/privilege-setting-model';

@Component({
  selector: 'app-healthcare-package-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    SvgPlusComponent,
    MatButtonModule,
  ],
  templateUrl: './healthcare-package-section.component.html',
  styleUrl: './healthcare-package-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcarePackageSectionComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);
  private fb = inject(FormBuilder);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  privilegeDetail$: Observable<PrivilegeDetail | null> = this.store.select(
    CreateEditPrivilegeSelectors.selectPrivilegeDetail
  );
  healthcarePackageOptions$: Observable<ValueCode<number>[]> = this.store
    .select(CreateEditPrivilegeSelectors.selectHealthcarePackages)
    .pipe(
      map((healthcarePackages) => {
        return healthcarePackages.map((healthcarePackage) => ({
          code: healthcarePackage.id,
          value: healthcarePackage.packageNameTh,
        }));
      })
    );
  healthcarePackageOptions: ValueCode<number>[] = [];

  get healthcarePackageIdsFormArray(): FormArray {
    return this.formGroup.get('health_care_package_ids') as FormArray;
  }

  ngOnInit(): void {
    this.store.dispatch(
      CreateEditPrivilegeActions.getHealthcarePackageOptions()
    );

    combineLatest([this.healthcarePackageOptions$, this.privilegeDetail$])
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ([healthcarePackages, _privilegeDetail]) =>
            healthcarePackages.length > 0
        )
      )
      .subscribe(([healthcarePackages, privilegeDetail]) => {
        if (this.formMode === 'create') {
          this.getHealthcarePackageFormControl(0)?.patchValue(
            healthcarePackages[0].code,
            {
              emitEvent: false,
            }
          );
        }

        if (this.formMode !== 'create' && privilegeDetail) {
          const health_care_package_ids =
            privilegeDetail?.health_care_package_ids || [];

          if (health_care_package_ids.length === 0) {
            const formArray = this.fb.array([
              this.fb.group({
                health_care_package_id: ['', Validators.required],
              }),
            ]);
            this.formGroup.setControl('health_care_package_ids', formArray);

            this.getHealthcarePackageFormControl(0)?.patchValue(
              healthcarePackages[0].code,
              {
                emitEvent: false,
              }
            );
          } else {
            const formArray = this.fb.array(
              health_care_package_ids.map((value) =>
                this.fb.group({
                  health_care_package_id: [value, Validators.required],
                })
              )
            );

            this.formGroup.setControl('health_care_package_ids', formArray);
          }

          if (this.formMode === 'view') {
            this.formGroup.disable();
          }
        }

        this.healthcarePackageOptions = healthcarePackages;
      });
  }

  getHealthcarePackageFormControl(index: number): FormControl {
    return this.healthcarePackageIdsFormArray
      .at(index)
      .get('health_care_package_id') as FormControl;
  }

  getDropdownValue(
    selectedCode: string | number | null,
    dropdownOptions: ValueCode<string | number>[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  removePackage(index: number) {
    this.healthcarePackageIdsFormArray.removeAt(index);
  }

  addPackage() {
    const healthcarePackageIds = (
      this.healthcarePackageIdsFormArray?.getRawValue() || []
    ).map((item) => item.health_care_package_id);
    const remainingHealthcarePackageOptions =
      this.healthcarePackageOptions.filter(
        (item) => !healthcarePackageIds.includes(item.code)
      );

    if (remainingHealthcarePackageOptions.length > 0) {
      this.healthcarePackageIdsFormArray.push(
        this.fb.group({
          health_care_package_id: [
            remainingHealthcarePackageOptions[0].code,
            Validators.required,
          ],
        })
      );
    }
  }

  getRemainingHealthcarePackageOptions(
    selectedValue: number
  ): ValueCode<number>[] {
    const healthcarePackageIds = (
      this.healthcarePackageIdsFormArray?.getRawValue() || []
    ).map((item) => item.health_care_package_id);

    const remainingHealthcarePackageOptions =
      this.healthcarePackageOptions.filter(
        (item) =>
          !healthcarePackageIds.includes(item.code) ||
          item.code === selectedValue
      );
    return remainingHealthcarePackageOptions;
  }
}
