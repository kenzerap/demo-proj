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
  AbstractControl,
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
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import {
  EngagementBasedRuleAttributeCode,
  engagementBasedRuleAttributeOptions,
} from '../../constants/engagement-based-rule-attribute-options.const';
import { filter, Observable, take, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { PointRuleDetail } from '../../models/point-rule-model';
import { Store } from '@ngrx/store';
import * as createEditPointRuleSelectors from '../../stores/create-edit-point-rule/create-edit-point-rule.selectors';

@Component({
  selector: 'app-criteria-engagement-rule-section',
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
  ],
  providers: [DatePipe],
  templateUrl: './criteria-engagement-rule-section.component.html',
  styleUrl: './criteria-engagement-rule-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriteriaEngagementRuleSectionComponent
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

  attributeOptions: ValueCode<EngagementBasedRuleAttributeCode>[] =
    engagementBasedRuleAttributeOptions;
  engagementBasedRuleAttributeCode = EngagementBasedRuleAttributeCode;
  selectedConditionId: WritableSignal<string | null> = signal(null);

  conditionOptions: ValueCode[] = [
    { value: 'Is', code: CompareConditionType.Is },
  ];

  get defaultAttributeControl() {
    return this.formGroup.get('default_attribute');
  }
  get defaultConditionControl() {
    return this.formGroup.get('default_condition');
  }
  get defaultValueControl() {
    return this.formGroup.get('default_value');
  }
  get defaultEarningPointControl() {
    return this.formGroup.get('default_earning_point');
  }
  get isUnlimitedValueControl() {
    return this.formGroup.get('is_unlimited_value');
  }

  get rulesFormArray(): FormArray {
    return this.formGroup.get('criteria_feature_engagement_rules') as FormArray;
  }

  ngOnInit(): void {
    this.defaultAttributeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === EngagementBasedRuleAttributeCode.TaxCertificate) {
          this.isUnlimitedValueControl?.disable({ emitEvent: false });
          this.rulesFormArray.clear();
          this.isUnlimitedValueControl?.patchValue(false);
        } else {
          this.isUnlimitedValueControl?.enable();
        }
      });

    this.isUnlimitedValueControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isUnlimited) => {
        if (!!isUnlimited) {
          const selectedConditionControl = this.rulesFormArray.controls.find(
            (control) =>
              control.getRawValue().virtualId === this.selectedConditionId()
          );

          if (selectedConditionControl) {
            const valueControl = selectedConditionControl.get('value');
            selectedConditionControl.patchValue({
              value: 'Unlimited',
              unlimited_value: true,
            });
            valueControl?.disable({ emitEvent: false });
            return;
          }

          if (
            !selectedConditionControl &&
            this.rulesFormArray.controls.length > 0
          ) {
            const index = this.rulesFormArray.controls.length - 1;
            const valueControl = this.rulesFormArray.at(index).get('value');
            this.rulesFormArray
              .at(index)
              ?.patchValue({ value: 'Unlimited', unlimited_value: true });

            valueControl?.disable({ emitEvent: false });
            this.selectedConditionId.set(
              this.rulesFormArray.at(index).get('virtualId')?.getRawValue()
            );
            return;
          }

          // add new unlimited when this.rulesFormArray.controls.length === 0
          this.selectedConditionId.set(uuidv4());
          const formControl = this.fb.group({
            virtualId: [this.selectedConditionId(), [Validators.required]],
            attribute: [
              {
                value: EngagementBasedRuleAttributeCode.Eclaim,
                disabled: true,
              },
              [Validators.required],
            ],
            condition: [CompareConditionType.Is, [Validators.required]],
            value: [
              { value: 'Unlimited', disabled: true },
              [Validators.required],
            ],
            unlimited_value: [true],
            earning_point: ['', [Validators.required, Validators.min(1)]],
          });

          this.rulesFormArray.push(formControl);
        } else {
          const selectedConditionControl = this.rulesFormArray.controls.find(
            (control) =>
              control.getRawValue().virtualId === this.selectedConditionId()
          );

          if (selectedConditionControl) {
            const valueControl = selectedConditionControl.get('value');
            const unlimitedValueControl =
              selectedConditionControl.get('unlimited_value');
            valueControl?.reset();
            valueControl?.enable({ emitEvent: false });
            unlimitedValueControl?.patchValue(false, { emitEvent: false });
          }

          this.selectedConditionId.set(null);
        }
      });

    this.pointRuleDetail$
      .pipe(
        filter((pointRuleDetail) => !!pointRuleDetail),
        take(1)
      )
      .subscribe(() => {
        const formValue = this.formGroup.getRawValue();
        const unlimittedCondition = (
          formValue.criteria_feature_engagement_rules || []
        ).find((rule: any) => rule.unlimited_value);

        if (unlimittedCondition) {
          this.selectedConditionId.set(unlimittedCondition.virtualId || null);
        }
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
        virtualId: [uuidv4(), [Validators.required]],
        attribute: [
          { value: EngagementBasedRuleAttributeCode.Eclaim, disabled: true },
          [Validators.required],
        ],
        condition: [CompareConditionType.Is, [Validators.required]],
        value: ['', [Validators.required]],
        unlimited_value: [false],
        earning_point: ['', [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeCondition(index: number) {
    const isUnlimited =
      this.rulesFormArray.at(index).get('virtualId')?.getRawValue() ===
      this.selectedConditionId();
    if (isUnlimited) {
      this.selectedConditionId.set(null);
      this.isUnlimitedValueControl?.patchValue(false, { emitEvent: false });
    }

    this.rulesFormArray.removeAt(index);
  }

  selectConditionRow(rowControl: AbstractControl) {
    if (this.isUnlimitedValueControl?.getRawValue()) {
      return;
    }

    const virtualId = rowControl.get('virtualId')?.getRawValue();
    this.selectedConditionId.set(virtualId);
  }
}
