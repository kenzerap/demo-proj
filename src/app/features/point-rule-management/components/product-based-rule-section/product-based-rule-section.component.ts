import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { filter, map, Observable, takeUntil } from 'rxjs';
import { PointRuleDetail } from '../../models/point-rule-model';
import { Store } from '@ngrx/store';
import * as createEditPointRuleSelectors from '../../stores/create-edit-point-rule/create-edit-point-rule.selectors';
import { ProductName } from '@app/shared/models/product-name.model';
import { DemoprojAutocompleteDropdownComponent } from '@app/shared/components/demoproj-autocomplete-dropdown/demoproj-autocomplete-dropdown.component';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';

@Component({
  selector: 'app-product-based-rule-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    DemoprojInputComponent,
    SvgPlusComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    DemoprojAutocompleteDropdownComponent,
  ],
  providers: [DatePipe],
  templateUrl: './product-based-rule-section.component.html',
  styleUrl: './product-based-rule-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBasedRuleSectionComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private store = inject(Store);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  pointRuleDetail$: Observable<PointRuleDetail | null> = this.store.select(
    createEditPointRuleSelectors.selectPointRuleDetail
  );

  channelOptions$: Observable<ValueCode[]> = this.store
    .select(createEditPointRuleSelectors.selectPolicyChannels)
    .pipe(
      map((policyChannels: PolicyChannel[]) => {
        return policyChannels.map((item) => {
          const key = `${item.system_id} - ${item.name} (${item.channel_code})`;
          return {
            code: key,
            value: key,
          };
        });
      })
    );

  productNames$: Observable<ProductName[]> = this.store.select(
    createEditPointRuleSelectors.selectProductNames
  );
  productNameOptions$: Observable<ValueCode[]> = this.store
    .select(createEditPointRuleSelectors.selectProductNames)
    .pipe(
      map((productNames) =>
        productNames.map((productName) => ({
          value: `${productName.product_name} - ${productName.product_code}`,
          code: `${productName.product_name} - ${productName.product_code}`,
        }))
      )
    );

  productNames: WritableSignal<ProductName[]> = signal([]);

  get productNameControl() {
    return this.formGroup.get('product_name');
  }
  get planCodeControl() {
    return this.formGroup.get('plan_code');
  }
  get marketingNameEnControl() {
    return this.formGroup.get('marketing_name_en');
  }
  get marketingNameThControl() {
    return this.formGroup.get('marketing_name_th');
  }
  get freeLookPeriodControl() {
    return this.formGroup.get('free_look_period');
  }

  get rulesFormArray(): FormArray {
    return this.formGroup.get('channel_rules') as FormArray;
  }

  ngOnInit(): void {
    this.productNames$
      .pipe(
        takeUntil(this.destroy$),
        filter((productNames) => productNames.length > 0)
      )
      .subscribe((productNames) => {
        this.productNames.set(productNames);
      });

    this.productNameControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((productName) => {
        const nameSplited = productName?.split(' - ');
        const code = nameSplited?.[1] || '';
        const selectedProduct = this.productNames().find(
          (product) => product.product_code === code
        );
        this.planCodeControl?.setValue(selectedProduct?.product_code);
        this.marketingNameEnControl?.setValue(
          selectedProduct?.product_mkt_name_english
        );
        this.marketingNameThControl?.setValue(
          selectedProduct?.product_mkt_name_thai
        );
        this.freeLookPeriodControl?.setValue(selectedProduct?.free_look_period);
      });
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  addRule() {
    this.rulesFormArray.push(
      this.fb.group({
        channel: ['', [Validators.required]],
        point_rate: [
          '',
          [Validators.required, Validators.min(0.01), Validators.max(999)],
        ],
      })
    );
  }

  removeCondition(index: number) {
    this.rulesFormArray.removeAt(index);
  }
}
