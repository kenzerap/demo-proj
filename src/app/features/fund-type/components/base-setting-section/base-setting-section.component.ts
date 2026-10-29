import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { DemoprojInputComponent } from '@app/shared/components/demoproj-input/demoproj-input.component';
import { ValueCode } from '@app/shared/models/value-code.model';
import {
  fundClassOptions,
  fundTypeOptions,
  fxHedgingCepOptions,
  fxHedgingPriveOptions,
  fxRateFlagOptions,
  riskLevelOptions,
} from '../../constants/fund-type-dropdown-options.const';
import { FundTypeCode } from '../../enums/fund-type-code.enum';
import { FundClassCode } from '../../enums/fund-class-code.enum';
import { FxRateFlagCode } from '../../enums/fx-rate-flag-code.enum';
import { FxHedgingCepCode } from '../../enums/fx-hedging-cep-code.enum';
import { FxHedgingPriveCode } from '../../enums/fx-hedging-prive-code.enum';

@Component({
  selector: 'app-base-setting-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    DemoprojInputComponent,
  ],
  templateUrl: './base-setting-section.component.html',
  styleUrl: './base-setting-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseSettingSectionComponent
  extends BaseComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  fundTypeOptions: ValueCode<FundTypeCode>[] = fundTypeOptions;
  fundClassOptions: ValueCode<FundClassCode>[] = fundClassOptions;
  fxRateFlagOptions: ValueCode<FxRateFlagCode>[] = fxRateFlagOptions;
  fxHedgingCepOptions: ValueCode<FxHedgingCepCode>[] = fxHedgingCepOptions;
  fxHedgingPriveOptions: ValueCode<FxHedgingPriveCode>[] = fxHedgingPriveOptions;
  riskLevelOptions: ValueCode<number>[] = riskLevelOptions;

  get isActiveControl() {
    return this.formGroup?.get('isActive');
  }
  get amcsControl() {
    return this.formGroup?.get('amcs');
  }
  get fundCodeAmcsControl() {
    return this.formGroup?.get('fund_code_amcs');
  }
  get fundCodeAs400Control() {
    return this.formGroup?.get('fund_code_as400');
  }
  get fundThControl() {
    return this.formGroup?.get('fund_th');
  }
  get fundEnControl() {
    return this.formGroup?.get('fund_en');
  }
  get fundTypeControl() {
    return this.formGroup?.get('fund_type');
  }
  get fundTypeThControl() {
    return this.formGroup?.get('fund_type_th');
  }
  get fundTypeMktControl() {
    return this.formGroup?.get('fund_type_mkt');
  }
  get fundClassControl() {
    return this.formGroup?.get('fund_class');
  }
  get riskLevelControl() {
    return this.formGroup?.get('risk_level');
  }
  get fxRateFlagControl() {
    return this.formGroup?.get('fx_rate_flag');
  }
  get fxHedgingPriveControl() {
    return this.formGroup?.get('fx_hedging_prive');
  }
  get fxHedgingCepControl() {
    return this.formGroup?.get('fx_hedging_cep');
  }
  get remarkControl() {
    return this.formGroup?.get('remark');
  }

  ngOnInit(): void {}

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode<string | number>[],
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }
}
