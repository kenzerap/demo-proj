import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, take, takeUntil } from 'rxjs';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { ValueCode } from '@app/shared/models/value-code.model';
import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import * as CreateEditFundTypeSelectors from '../../stores/create-edit-fund-type/create-edit-fund-type.selectors';
import { FundType } from '../../models/fund-type.model';

@Component({
  selector: 'app-nationality-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    SvgPlusComponent,
  ],
  templateUrl: './nationality-section.component.html',
  styleUrl: './nationality-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NationalitySectionComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private changeDetection = inject(ChangeDetectorRef);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  nationalityOptions: WritableSignal<ValueCode<number>[]> = signal([]);
  nationalityOptions$: Observable<ValueCode<number>[]> = this.store
    .select(CreateEditFundTypeSelectors.selectNationalityOptions)
    .pipe(
      map((nationalities) =>
        nationalities.map((nationality) => ({
          value: nationality.name_en,
          code: nationality.nationality_id,
        })),
      ),
    );

  fundTypeDetail$: Observable<FundType | null> = this.store.select(
    CreateEditFundTypeSelectors.selectFundTypeDetail,
  );

  get nationalitiesFormArray(): FormArray {
    return this.formGroup.get('nationalities') as FormArray;
  }

  ngOnInit(): void {
    this.nationalityOptions$
      .pipe(
        filter((options) => options?.length > 0),
        take(1),
      )
      .subscribe((options) => {
        this.nationalityOptions.set(options);
      });

    combineLatest([this.fundTypeDetail$, this.nationalityOptions$])
      .pipe(
        filter(
          ([fundTypeDetail, nationalityOptions]) =>
            nationalityOptions?.length > 0,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(([fundTypeDetail, nationalityOptions]) => {
        if (this.formMode !== 'create' && fundTypeDetail) {
          this.nationalitiesFormArray.clear();
          (fundTypeDetail.nationalities || []).forEach((nationality) => {
            this.addNationality({
              nationality: nationality.nationality_id,
              allowed: !!nationality.allowed,
            });
          });
        }

        if (this.formMode === 'create') {
          const nationalitiesFormValue =
            this.nationalitiesFormArray.getRawValue();
          const newFormValue = (nationalitiesFormValue || []).map((item) => ({
            ...item,
            nationality: nationalityOptions[0]?.code || '',
          }));

          this.nationalitiesFormArray.patchValue(newFormValue, {
            emitEvent: false,
          });
        }

        if (this.formMode === 'view') {
          this.formGroup.disable();
        }

        this.changeDetection.detectChanges();
        this.formGroup.markAsUntouched();
      });
  }

  getDropdownValue(
    selectedCode: number | null,
    dropdownOptions: ValueCode<number>[],
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  disableItemDropdown(code: number): boolean {
    const nationalities = (
      this.nationalitiesFormArray.getRawValue() || []
    ).map((item) => item.nationality);
    return nationalities.includes(code);
  }

  addNationality(
    value: { nationality: number; allowed: boolean } | null = null,
  ) {
    const nationalities = (
      this.nationalitiesFormArray.getRawValue() || []
    ).map((item) => item.nationality);

    const availableOptions = this.nationalityOptions().filter(
      (option) => !nationalities.includes(option.code),
    );

    this.nationalitiesFormArray.push(
      this.fb.group({
        nationality: [
          value ? value.nationality : availableOptions[0]?.code || '',
          Validators.required,
        ],
        allowed: [value ? value.allowed : false],
      }),
    );
  }

  isAllNationalitiesSelected(): boolean {
    return (
      this.nationalityOptions().length ===
      this.nationalitiesFormArray.controls.length
    );
  }

  removeNationality(index: number) {
    this.nationalitiesFormArray.removeAt(index);
  }
}
