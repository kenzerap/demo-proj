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
  selector: 'app-product-code-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    SvgPlusComponent,
  ],
  templateUrl: './product-code-section.component.html',
  styleUrl: './product-code-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCodeSectionComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private changeDetection = inject(ChangeDetectorRef);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  productCodeOptions: WritableSignal<ValueCode<number>[]> = signal([]);
  productCodeOptions$: Observable<ValueCode<number>[]> = this.store
    .select(CreateEditFundTypeSelectors.selectProductCodeOptions)
    .pipe(
      map((productCodes) =>
        productCodes.map((productCode) => ({
          value: productCode.product_code,
          code: productCode.product_code_id,
        })),
      ),
    );

  fundTypeDetail$: Observable<FundType | null> = this.store.select(
    CreateEditFundTypeSelectors.selectFundTypeDetail,
  );

  get productCodesFormArray(): FormArray {
    return this.formGroup.get('product_codes') as FormArray;
  }

  ngOnInit(): void {
    this.productCodeOptions$
      .pipe(
        filter((options) => options?.length > 0),
        take(1),
      )
      .subscribe((options) => {
        this.productCodeOptions.set(options);
      });

    combineLatest([this.fundTypeDetail$, this.productCodeOptions$])
      .pipe(
        filter(
          ([fundTypeDetail, productCodeOptions]) =>
            productCodeOptions?.length > 0,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(([fundTypeDetail, productCodeOptions]) => {
        if (this.formMode !== 'create' && fundTypeDetail) {
          this.productCodesFormArray.clear();
          (fundTypeDetail.product_codes || []).forEach((productCode) => {
            this.addProductCode({ product_code: productCode });
          });
        }

        if (this.formMode === 'create') {
          const productCodesFormValue =
            this.productCodesFormArray.getRawValue();
          const newFormValue = (productCodesFormValue || []).map((item) => ({
            ...item,
            product_code: productCodeOptions[0]?.code || '',
          }));

          this.productCodesFormArray.patchValue(newFormValue, {
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
    const productCodes = (this.productCodesFormArray.getRawValue() || []).map(
      (item) => item.product_code,
    );
    return productCodes.includes(code);
  }

  addProductCode(value: { product_code: number } | null = null) {
    const productCodes = (this.productCodesFormArray.getRawValue() || []).map(
      (item) => item.product_code,
    );

    const availableOptions = this.productCodeOptions().filter(
      (option) => !productCodes.includes(option.code),
    );

    this.productCodesFormArray.push(
      this.fb.group({
        product_code: [
          value ? value.product_code : availableOptions[0]?.code || '',
          Validators.required,
        ],
      }),
    );
  }

  isAllProductCodesSelected(): boolean {
    return (
      this.productCodeOptions().length ===
      this.productCodesFormArray.controls.length
    );
  }

  removeProductCode(index: number) {
    this.productCodesFormArray.removeAt(index);
  }
}
