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
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { map, Observable, take, takeUntil } from 'rxjs';
import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { segmentRuleExpressionOptions } from '../../consts/segment-rule-expression-options.const';
import {
  segmentationSourceValuesOptions,
  segmentCustomerTypeValuesOptions,
  segmentIsBlockValuesOptions,
  segmentIsFraudValuesOptions,
} from '../../consts/segment-attribute-values-options.const';
import { Store } from '@ngrx/store';
import * as CreateEditCustomerSegmentationActions from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.actions';
import * as CreateEditCustomerSegmentationSelectors from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.selectors';

import { PolicyChannel } from '../../../../shared/models/policy-channel.model';
import { LogicalConditionType } from '@app/shared/utils/enums/logical-condition-type.enum';
import {
  customerSegmentAttrOptions,
  CustomerSegmentRuleAttribute,
} from '@app/shared/constants/segment-attribute-options.const';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';
import { SegmentRuleType } from '../../enums/segment-rule-type.enum';
import { SvgDeleteComponent } from '@app/shared/icons/svg-delete/svg-delete.component';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { DemoprojAutocompleteDropdownComponent } from '../../../../shared/components/demoproj-autocomplete-dropdown/demoproj-autocomplete-dropdown.component';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { ProductGroupType } from '../../../../shared/models/product-group-type.model';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { PartyIdFileInfo } from '../../models/party-id-file-info.model';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { segmentPartyIdFileListColumns } from '../../consts/segment-party-id-file-list-columns.const';
import { SegmentationSourceCode } from '@app/shared/utils/enums/segmentation-source-code.enum';
import { SvgBtnDownloadComponent } from '@app/shared/icons/svg-btn-download/svg-btn-download.component';
import { MatDialog } from '@angular/material/dialog';
import { UploadPartyIdDialogComponent } from '../upload-party-id-dialog/upload-party-id-dialog.component';
import { Actions, ofType } from '@ngrx/effects';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cust-segment-group-condition-section',
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
    SvgCalendarComponent,
    SvgDeleteComponent,
    DemoprojInputComponent,
    DemoprojAutocompleteDropdownComponent,
    DemoprojTableComponent,
    SvgBtnDownloadComponent,
  ],
  providers: [DatePipe],
  templateUrl: './cust-segment-group-condition-section.component.html',
  styleUrl: './cust-segment-group-condition-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustSegmentGroupConditionSectionComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private changeDetector = inject(ChangeDetectorRef);
  private actions$ = inject(Actions);

  @Input() formDetailGroup!: FormGroup;
  @Input() formGroup!: FormGroup;
  @Input() isCreateMode!: boolean;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  productTypeOptions: ValueCode[] = [];
  productTypes$: Observable<ProductGroupType[]> = this.store.select(
    CreateEditCustomerSegmentationSelectors.selectProductTypes,
  );
  policyChannelOptions: ValueCode[] = [];
  policyChannels$: Observable<PolicyChannel[]> = this.store.select(
    CreateEditCustomerSegmentationSelectors.selectPolicyChannels,
  );
  productNameOptions: ValueCode[] = [];
  productNameOptions$: Observable<ValueCode[]> = this.store
    .select(CreateEditCustomerSegmentationSelectors.selectProductNames)
    .pipe(
      map((productNames) =>
        productNames.map((productName) => ({
          value: `${productName.product_name} - ${productName.product_code}`,
          code: productName.product_code,
        })),
      ),
    );

  CustomerSegmentRuleAttribute = CustomerSegmentRuleAttribute;
  segmentationSourceCode = SegmentationSourceCode;
  segmentCustomerTypeValuesOptions: ValueCode[] =
    segmentCustomerTypeValuesOptions;
  segmentIsBlockValuesOptions: ValueCode<boolean>[] =
    segmentIsBlockValuesOptions;
  segmentIsFraudValuesOptions: ValueCode<boolean>[] =
    segmentIsFraudValuesOptions;
  selectAttributeOptions: ValueCode[] = customerSegmentAttrOptions;
  selectSegmentRuleExpressionOptions: ValueCode[] =
    segmentRuleExpressionOptions;
  selectSegmentationSourceValuesOptions: ValueCode<string>[] =
    segmentationSourceValuesOptions;

  tableColumns: WritableSignal<TableColumn[]> = signal(
    segmentPartyIdFileListColumns,
  );

  ngOnInit(): void {
    this.store.dispatch(
      CreateEditCustomerSegmentationActions.getProductTypes(),
    );
    this.store.dispatch(
      CreateEditCustomerSegmentationActions.getPolicyChannels(),
    );
    this.store.dispatch(
      CreateEditCustomerSegmentationActions.getProductNames(),
    );

    this.productTypes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((productTypes: ProductGroupType[]) => {
        const convertOptions = productTypes.map((productType) => ({
          value: productType.product_type,
          code: productType.product_type,
        }));

        this.productTypeOptions = convertOptions;
      });
    this.policyChannels$
      .pipe(takeUntil(this.destroy$))
      .subscribe((policyChannels) => {
        const convertOptions = policyChannels.map((policyChannel) => ({
          value: policyChannel.name,
          code: policyChannel.name,
        }));

        this.policyChannelOptions = convertOptions;
      });

    this.productNameOptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((productNames) => {
        this.productNameOptions = productNames;
      });

    this.addSegmentGroup(true);
    if (this.isCreateMode) {
      this.initSegmentRuleData(0, 0);
    }

    this.reValidateForm();
  }

  get segment_groups() {
    return this.formGroup?.get('segment_groups') as FormArray;
  }

  get segmentTypeControl() {
    return this.formDetailGroup?.get('segment_type');
  }

  isHasSegmentRule(groupIndex: number) {
    const segmentGroup = this.segment_groups?.at(groupIndex);
    const segmentRules = segmentGroup?.get('segment_rules') as FormArray;
    return segmentRules?.controls.length > 0;
  }

  segmentRuleControls(groupIndex: number) {
    const segmentGroup = this.segment_groups?.at(groupIndex);
    return (segmentGroup?.get('segment_rules') as FormArray).controls;
  }

  segmentRuleControl(groupIndex: number, ruleIndex: number) {
    const segmentGroup = this.segment_groups?.at(groupIndex);
    const segmentRules = segmentGroup?.get('segment_rules') as FormArray;
    const segmentRule = segmentRules?.at(ruleIndex);
    return segmentRule;
  }

  segmentAttributeControl(groupIndex: number, ruleIndex: number) {
    const segmentRule = this.segmentRuleControl(groupIndex, ruleIndex);
    return segmentRule?.get('attribute') as FormControl;
  }

  segmentRuleExpressionControl(groupIndex: number, ruleIndex: number) {
    const segmentRule = this.segmentRuleControl(groupIndex, ruleIndex);
    return segmentRule?.get('rule_expression') as FormControl;
  }

  segmentValueControl(groupIndex: number, ruleIndex: number) {
    const segmentRule = this.segmentRuleControl(groupIndex, ruleIndex);
    return segmentRule?.get('rule_value') as FormControl;
  }

  segmentSegmentationSourceControl(groupIndex: number, ruleIndex: number) {
    const segmentRule = this.segmentRuleControl(groupIndex, ruleIndex);
    return segmentRule?.get('segmentation_source') as FormControl;
  }

  segmentPartyIdFileListFormArray(groupIndex: number, ruleIndex: number) {
    const segmentRule = this.segmentRuleControl(groupIndex, ruleIndex);
    return segmentRule?.get('party_id_file_list') as FormArray;
  }

  addSegmentGroup(isInit: boolean = false) {
    this.segment_groups?.push(
      this.fb.group({
        group_name: [`Group ${this.segment_groups?.length + 1}`],
        logical_operator: [LogicalConditionType.OR],
        segment_rules: this.fb.array([]),
      }),
      { emitEvent: !isInit },
    );
    this.segment_groups?.markAsPristine();

    this.addSegmentRule(this.segment_groups?.length - 1, isInit);
  }

  addSegmentRule(groupIndex: number, isInit: boolean = false) {
    const segmentGroup = this.segment_groups?.at(groupIndex);
    const segmentRules = segmentGroup?.get('segment_rules') as FormArray;
    segmentRules?.push(
      this.fb.group({
        logical_operator: [LogicalConditionType.AND],
        type: [SegmentRuleType.FIXED],
        attribute: [null],
        rule_value: [
          segmentCustomerTypeValuesOptions[0].code,
          Validators.required,
        ],
        rule_expression: [CompareConditionType.EQUAL],
        active_from_date: [null],
        active_to_date: [null],
        segmentation_source: [SegmentationSourceCode.MANUAL],
        party_id_file_list: this.fb.array([]),
      }),
      { emitEvent: !isInit },
    );
    this.initSegmentRuleData(groupIndex, segmentRules?.length - 1);
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

  addNewSegmentRule(groupIndex: number) {
    this.addSegmentRule(groupIndex);
  }

  addNewSegmentGroup() {
    this.addSegmentGroup();
  }

  onDeleteSegmentRule(groupIndex: number, ruleIndex: number) {
    const segmentGroup = this.segment_groups?.at(groupIndex);
    const segmentRules = segmentGroup?.get('segment_rules') as FormArray;
    segmentRules?.removeAt(ruleIndex);
  }

  onDeleteSegmentGroup(groupIndex: number) {
    this.segment_groups?.removeAt(groupIndex);
  }

  connectAllGroupConnector() {
    const groupNum = this.segment_groups?.controls.length;
    const groupHeight = groupNum * 14.7;
    const orHeight = groupNum - 1 > 0 ? (groupNum - 1) * 7.55 : 0;
    let ruleHeight = 0;
    this.segment_groups?.controls.forEach((group) => {
      const segmentRules = (group as FormGroup).get(
        'segment_rules',
      ) as FormArray;
      const ruleNum = segmentRules?.controls.length - 1;
      ruleHeight += ruleNum * 12.2;
    });
    return groupHeight + orHeight + ruleHeight + 'rem';
  }

  connectGroupItem(groupIndex: number) {
    const group = this.segment_groups?.at(groupIndex) as FormGroup;
    const segmentRules = group.get('segment_rules') as FormArray;
    const numControl = segmentRules?.controls.length;
    return (numControl / 2) * 14 + ((numControl - 1) / 2) * 2.8 + 'rem';
  }

  onAttributeChange(
    segment_group_index: number,
    segment_rule_index: number,
    segmentAttributeValue: CustomerSegmentRuleAttribute,
  ) {
    switch (segmentAttributeValue) {
      case CustomerSegmentRuleAttribute.CUSTOMER_TYPE:
        this.segmentValueControl(
          segment_group_index,
          segment_rule_index,
        )?.patchValue(this.segmentCustomerTypeValuesOptions[0]?.code, {
          emitEvent: false,
        });
        break;
      case CustomerSegmentRuleAttribute.IS_BLOCK:
        this.segmentValueControl(
          segment_group_index,
          segment_rule_index,
        )?.patchValue(this.segmentIsBlockValuesOptions[0]?.code, {
          emitEvent: false,
        });
        break;
      case CustomerSegmentRuleAttribute.IS_FRAUD:
        this.segmentValueControl(
          segment_group_index,
          segment_rule_index,
        )?.patchValue(this.segmentIsFraudValuesOptions[0]?.code, {
          emitEvent: false,
        });
        break;
      case CustomerSegmentRuleAttribute.PRODUCT_TYPE:
        this.segmentValueControl(
          segment_group_index,
          segment_rule_index,
        )?.patchValue(this.productTypeOptions[0]?.code, {
          emitEvent: false,
        });
        break;
      case CustomerSegmentRuleAttribute.PRODUCT_NAME:
      case CustomerSegmentRuleAttribute.CHANNEL_DESC:
        this.segmentValueControl(
          segment_group_index,
          segment_rule_index,
        )?.patchValue(null, {
          emitEvent: false,
        });
        break;
      case CustomerSegmentRuleAttribute.PARTY_ID:
        this.segmentValueControl(
          segment_group_index,
          segment_rule_index,
        )?.patchValue(null, { emitEvent: false });

        this.segmentSegmentationSourceControl(
          segment_group_index,
          segment_rule_index,
        )?.patchValue(SegmentationSourceCode.MANUAL, { emitEvent: false });

        this.segmentPartyIdFileListFormArray(
          segment_group_index,
          segment_rule_index,
        ).clear();
        break;

      default:
        break;
    }

    this.segmentRuleExpressionControl(
      segment_group_index,
      segment_rule_index,
    )?.patchValue(CompareConditionType.EQUAL);
  }

  onSegmentationSourceChange(
    segment_group_index: number,
    segment_rule_index: number,
  ) {
    this.segmentValueControl(
      segment_group_index,
      segment_rule_index,
    )?.patchValue(null, { emitEvent: false });

    this.segmentPartyIdFileListFormArray(
      segment_group_index,
      segment_rule_index,
    ).clear();
  }

  getSegmentRuleExpressionOptions(
    segmentAttributeValue: CustomerSegmentRuleAttribute,
  ): ValueCode[] {
    switch (segmentAttributeValue) {
      case CustomerSegmentRuleAttribute.PRODUCT_NAME:
        return [
          { value: 'Is', code: CompareConditionType.EQUAL },
          { value: 'Is not', code: CompareConditionType.IsNot },
        ];
        break;

      default:
        return [{ value: 'Is', code: CompareConditionType.EQUAL }];
        break;
    }
  }

  private initSegmentRuleData(
    segment_group_index: number,
    segment_rule_index: number,
  ) {
    this.segmentAttributeControl(
      segment_group_index,
      segment_rule_index,
    )?.patchValue(this.selectAttributeOptions[0]?.code, {
      emitEvent: false,
    });
    this.segmentRuleExpressionControl(
      segment_group_index,
      segment_rule_index,
    )?.patchValue(CompareConditionType.EQUAL, {
      emitEvent: false,
    });
    this.segmentValueControl(
      segment_group_index,
      segment_rule_index,
    )?.patchValue(this.segmentCustomerTypeValuesOptions[0]?.code, {
      emitEvent: false,
    });
    this.segmentPartyIdFileListFormArray(
      segment_group_index,
      segment_rule_index,
    )?.patchValue([], { emitEvent: false });
  }

  downloadPartyIdFile(partyIdFileItem: PartyIdFileInfo) {
    const a = document.createElement('a');
    a.href = partyIdFileItem.file_url || '';
    a.download = partyIdFileItem.file_name || 'party-ids.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href);
  }

  deletePartyIdFile(
    partyIdFileItem: PartyIdFileInfo,
    segment_group_index: number,
    segment_rule_index: number,
  ) {
    this.actions$
      .pipe(
        ofType(
          CreateEditCustomerSegmentationActions.deleteUploadPartyIdSuccess,
        ),
        take(1),
      )
      .subscribe(() => {
        const value = this.segmentPartyIdFileListFormArray(
          segment_group_index,
          segment_rule_index,
        )?.value as PartyIdFileInfo[];

        const itemIndex = value.findIndex(
          (item) => item.id === partyIdFileItem.id,
        );

        this.segmentPartyIdFileListFormArray(
          segment_group_index,
          segment_rule_index,
        )?.removeAt(itemIndex);

        this.changeDetector.detectChanges();
      });

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Party ID File?',
        message: `Are you sure you want to delete the file "${partyIdFileItem.file_name}"?`,
        btnCloseText: 'Cancel',
        btnConfirmText: 'Confirm',
        type: 'warning',
      },
      width: '25rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          CreateEditCustomerSegmentationActions.deleteUploadPartyId({
            fileId: partyIdFileItem.id,
          }),
        );
      }
    });
  }

  getSegmentPartyIdFileList(
    segment_group_index: number,
    segment_rule_index: number,
  ): PartyIdFileInfo[] {
    const partyIdFileList = this.segmentPartyIdFileListFormArray(
      segment_group_index,
      segment_rule_index,
    )?.value as PartyIdFileInfo[];

    return partyIdFileList || [];
  }

  openUploadFileDialog(
    segment_group_index: number,
    segment_rule_index: number,
  ) {
    const dialogRef = this.dialog.open(UploadPartyIdDialogComponent, {
      data: {},
      width: '36rem',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data: PartyIdFileInfo) => {
      if (!!data) {
        const formArray = this.segmentPartyIdFileListFormArray(
          segment_group_index,
          segment_rule_index,
        );
        const value = formArray?.value as PartyIdFileInfo[];
        const filteredList = value.filter(
          (item) => item.status !== 'New (unsaved)',
        );
        const updatedList = [
          {
            id: data.id,
            file_name: data.file_name,
            volume: data.volume,
            status: 'New (unsaved)',
            imported_date: data.imported_date,
            imported_by: data.imported_by,
            file_url: data.file_url,
          },
          ...filteredList,
        ];

        this.patchDataPartyIdFileList(
          segment_group_index,
          segment_rule_index,
          updatedList,
        );

        this.changeDetector.detectChanges();
      }
    });
  }

  patchDataPartyIdFileList(
    segment_group_index: number,
    segment_rule_index: number,
    values: PartyIdFileInfo[],
  ) {
    const formArray = this.segmentPartyIdFileListFormArray(
      segment_group_index,
      segment_rule_index,
    );
    formArray.clear();
    values.forEach((item) => {
      formArray.push(
        this.fb.group({
          id: item.id,
          file_name: item.file_name,
          volume: item.volume,
          status: item.status,
          imported_date: item.imported_date,
          imported_by: item.imported_by,
          file_url: item.file_url,
        }),
      );
    });
  }

  isDisablePartyId(attributeCode: string, groupIndex: number): boolean {
    const segmentRules = this.segmentRuleControls(groupIndex);
    const hasPartyId = (segmentRules || []).some((segmentRule) => {
      const attributeControl = segmentRule.get('attribute') as FormControl;
      return attributeControl?.value === CustomerSegmentRuleAttribute.PARTY_ID;
    });
    return (
      attributeCode === CustomerSegmentRuleAttribute.PARTY_ID && hasPartyId
    );
  }
}
