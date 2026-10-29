import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';

import { Store } from '@ngrx/store';

import {
  AttributeCode,
  campaignTypeValuesOptions,
  conditionOptions,
  dateValuesOptions,
  privilegeAttributeOptions,
  privilegeTypeValuesOptions,
  ValueOptionsCode,
} from '../../utils/privilege-attribute-code.enum';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PrivilegeTypeEnum } from '@app/shared/utils/enums/privilege-type.enums';
import { CampaignType } from '@app/shared/utils/enums/campaign-type.enums';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import * as createEditHomeScreenSelectors from '../../stores/create-edit-home-screen/create-edit-home-screen.selectors';
import { map, Observable, takeUntil } from 'rxjs';
import { TierGroup } from '@app/shared/models/tier-group.model';

@Component({
  selector: 'app-home-group-condition-section',
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
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    SvgPlusComponent,
    MatButtonToggleModule,
    DemoprojInputComponent,
  ],
  providers: [DatePipe],
  templateUrl: './home-group-condition-section.component.html',
  styleUrl: './home-group-condition-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeGroupConditionSectionComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private changeDetector = inject(ChangeDetectorRef);

  @Input() formGroup!: FormGroup;
  @Input() isCreateMode!: boolean;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  get conditionsFormArray(): FormArray {
    return this.formGroup.get('conditions') as FormArray;
  }

  getAtributeControl(i: number) {
    return this.conditionsFormArray.at(i).get('attribute');
  }
  getConditionControl(i: number) {
    return this.conditionsFormArray.at(i).get('condition');
  }
  getValueControl(i: number) {
    return this.conditionsFormArray.at(i).get('value');
  }

  attributeOptions: ValueCode[] = privilegeAttributeOptions;
  tierGroupsOptions$: Observable<ValueCode[]> = this.store
    .select(createEditHomeScreenSelectors.selectTierGroups)
    .pipe(
      map((tierGroups: TierGroup[]) => {
        return tierGroups
          .filter((tierGroup) => tierGroup.status === 'Active')
          .map((tierGroup) => ({
            code: tierGroup.tier_name_english,
            value: tierGroup.tier_name_english,
          }));
      }),
    );
  tierGroupsOptions: ValueCode[] = [];

  compareConditionType = CompareConditionType;
  attributeCode = AttributeCode;

  ngOnInit(): void {
    this.tierGroupsOptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tierGroupsOptions) => {
        this.tierGroupsOptions = [
          { value: '{User matched}', code: 'User matched' },
          ...tierGroupsOptions,
        ];

        this.changeDetector.markForCheck();
      });
  }

  getValueOptions(attributeValue: AttributeCode): ValueCode<string | number>[] {
    switch (attributeValue) {
      case AttributeCode.CAMPAIGN_TYPE:
        return campaignTypeValuesOptions;
      case AttributeCode.PRIVILEGE_TYPE:
        return privilegeTypeValuesOptions;
      case AttributeCode.TIER:
        return this.tierGroupsOptions;
      case AttributeCode.USER_REMAINING_POINT:
        return [];
      default:
        return dateValuesOptions;
    }
  }

  getConditionOptions(
    attributeValue: AttributeCode | string | null,
  ): ValueCode<string | number>[] {
    if (attributeValue === AttributeCode.USER_REMAINING_POINT) {
      return [...conditionOptions].filter(
        (opt) => opt.code === CompareConditionType.GREATER_THAN,
      );
    }
    return [...conditionOptions].filter(
      (opt) => opt.code === CompareConditionType.Is,
    );
  }

  reValidateForm() {}

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode<any>[],
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  addCondition() {
    this.conditionsFormArray.push(
      this.fb.group({
        privilegeConditionsId: [''],
        attribute: [AttributeCode.START_DATE, Validators.required],
        condition: [CompareConditionType.Is, Validators.required],
        value: [ValueOptionsCode.Today, [Validators.required]],
        group_condition: [null],
      }),
    );

    if (this.conditionsFormArray.controls.length > 1) {
      this.conditionsFormArray
        .at(this.conditionsFormArray.controls.length - 2)
        ?.patchValue({ group_condition: CompareConditionType.AND });
    }
  }

  removeCondition(index: number) {
    this.conditionsFormArray.removeAt(index);

    if (this.conditionsFormArray.controls.length > 0) {
      this.conditionsFormArray
        .at(this.conditionsFormArray.controls.length - 1)
        .patchValue({ group_condition: null });
    }
  }

  attributeChange(event: MatSelectChange, conditionFormGroup: AbstractControl) {
    switch (event.value) {
      case AttributeCode.START_DATE:
      case AttributeCode.END_DATE:
        conditionFormGroup.patchValue({
          condition: CompareConditionType.Is,
          value: ValueOptionsCode.Today,
        });
        conditionFormGroup.get('value')?.enable();
        break;
      case AttributeCode.TIER:
        conditionFormGroup.patchValue({
          condition: CompareConditionType.Is,
          value: 'User matched',
        });
        conditionFormGroup.get('value')?.enable();
        break;
      case AttributeCode.USER_REMAINING_POINT:
        conditionFormGroup.patchValue({
          condition: CompareConditionType.GREATER_THAN,
          value: 'Privilege Redemption',
        });
        conditionFormGroup.get('value')?.disable();
        break;
      case AttributeCode.PRIVILEGE_TYPE:
        conditionFormGroup.patchValue({
          condition: CompareConditionType.Is,
          value: PrivilegeTypeEnum.E_VOUCHER,
        });
        conditionFormGroup.get('value')?.enable();
        break;
      case AttributeCode.CAMPAIGN_TYPE:
        conditionFormGroup.patchValue({
          condition: CompareConditionType.Is,
          value: CampaignType.NORMAL,
        });
        conditionFormGroup.get('value')?.enable();
        break;

      default:
        break;
    }
  }

  isDisableItem(itemCode: string | number): boolean {
    const conditionsFormArrayValue =
      (this.conditionsFormArray.value as any[]) || [];
    if (
      conditionsFormArrayValue.some(
        (condition) => condition.attribute === AttributeCode.TIER,
      ) &&
      itemCode === AttributeCode.TIER
    ) {
      return true;
    }

    return false;
  }
}
