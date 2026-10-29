import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { SvgDeleteComponent } from '../../../../shared/icons/svg-delete/svg-delete.component';
import { WelcomeRuleConditionCode } from '../../utils/welcome-rule-condition-code.enum';
import { WelcomeRuleValueCode } from '../../utils/welcome-rule-value-code.enum';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, takeUntil } from 'rxjs';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { Store } from '@ngrx/store';
import * as CreateEditPointRuleActions from '../../stores/create-edit-point-rule/create-edit-point-rule.actions';
import * as createEditPointRuleSelectors from '../../stores/create-edit-point-rule/create-edit-point-rule.selectors';
import { welcomeRuleValueOptions } from '../../constants/welcome-rule-value-options.const';

@Component({
  selector: 'app-welcome-rule-section',
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
    SvgPlusComponent,
    MatButtonModule,
    SvgDeleteComponent,
    MatButtonToggleModule,
    MatDividerModule,
  ],
  templateUrl: './welcome-rule-section.component.html',
  styleUrl: './welcome-rule-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeRuleSectionComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private changeDetector = inject(ChangeDetectorRef);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  tierGroups$: Observable<TierGroup[]> = this.store.select(
    createEditPointRuleSelectors.selectTierGroups
  );

  attributeOptions: ValueCode<WelcomeRuleConditionCode>[] = [
    { value: 'Customer Type', code: WelcomeRuleConditionCode.UserType },
    { value: 'Tier', code: WelcomeRuleConditionCode.Tier },
  ];

  compareConditionType = CompareConditionType;
  conditionOptions: ValueCode[] = [
    { value: 'Is', code: CompareConditionType.Is },
  ];

  valueOptions: ValueCode<WelcomeRuleValueCode>[] = welcomeRuleValueOptions;
  tierGroupOptions: ValueCode[] = [];

  get rulesFormArray(): FormArray {
    return this.formGroup.get('rules') as FormArray;
  }

  ngOnInit(): void {
    this.tierGroups$.pipe(takeUntil(this.destroy$)).subscribe((tierGroups) => {
      this.tierGroupOptions = tierGroups.map((tierGroup) => ({
        value: tierGroup.tier_name_thai,
        code: tierGroup.tier_id.toString(),
      }));

      if (this.tierGroupOptions.length > 0) {
        this.changeDetector.detectChanges();
      }
    });

    this.rulesFormArray.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.changeDetector.detectChanges();
      });
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode<string | number>[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  getValueOptions(
    attributeValue: WelcomeRuleConditionCode
  ): ValueCode<string | number>[] {
    if (attributeValue === WelcomeRuleConditionCode.Tier) {
      return this.tierGroupOptions;
    }
    return this.valueOptions;
  }

  attributeChange(event: MatSelectChange, conditionFormGroup: AbstractControl) {
    switch (event.value) {
      case WelcomeRuleConditionCode.Tier:
        conditionFormGroup.patchValue({
          value:
            this.tierGroupOptions.length > 0
              ? this.tierGroupOptions[0].code
              : null,
        });
        break;
      case WelcomeRuleConditionCode.UserType:
        conditionFormGroup.patchValue({
          value: this.valueOptions[0].code,
        });
        break;

      default:
        break;
    }
  }

  getConditionsFormArray(index: number): FormArray {
    return this.rulesFormArray.at(index).get('rule_conditions') as FormArray;
  }

  addCondition(index: number) {
    this.getConditionsFormArray(index).push(
      this.fb.group({
        attribute: [WelcomeRuleConditionCode.UserType, Validators.required],
        condition: [CompareConditionType.Is, Validators.required],
        value: [WelcomeRuleValueCode.Customer, [Validators.required]],
        group_condition: [null],
      })
    );

    if (this.getConditionsFormArray(index).controls.length > 1) {
      this.getConditionsFormArray(index)
        .at(this.getConditionsFormArray(index).controls.length - 2)
        ?.patchValue({ group_condition: CompareConditionType.AND });
    }
  }

  addWelcomeRule() {
    this.rulesFormArray.push(
      this.fb.group({
        earning_point: ['', [Validators.required, Validators.min(0)]],
        rule_conditions: this.fb.array([
          this.fb.group({
            attribute: [WelcomeRuleConditionCode.UserType, Validators.required],
            condition: [CompareConditionType.Is, Validators.required],
            value: [WelcomeRuleValueCode.Customer, [Validators.required]],
            group_condition: [null],
          }),
        ]),
      })
    );
  }

  removeCondition(conditionsFormArray: FormArray, index: number) {
    conditionsFormArray.removeAt(index);

    if (conditionsFormArray.controls.length > 0) {
      conditionsFormArray
        .at(conditionsFormArray.controls.length - 1)
        .patchValue({ group_condition: null });
    }
  }

  deleteWelcomeRule(index: number) {
    this.rulesFormArray.removeAt(index);
  }
}
