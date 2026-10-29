import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
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
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { filter, merge, Observable, takeUntil } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseComponent } from '@app/shared/components/base/base.component';
import * as CreateEditCustomerSegmentationActions from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.actions';
import * as CreateEditCustomerSegmentationSelectors from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.selectors';
import { CreateEditCustomerSegmentationQueryParams } from '../../models/create-edit-customer-segmentation-query-params.model';
import { CustSegmentGroupConditionSectionComponent } from '../cust-segment-group-condition-section/cust-segment-group-condition-section.component';
import { CustSegmentBaseDetailSectionComponent } from '../cust-segment-base-detail-section/cust-segment-base-detail-section.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { SetSegmentType } from '../../enums/set-segment-type.enum';
import { CustomerSegmentationDetail } from '../../models/customer-segmentation.model';
import { NewLineFormat } from '@app/shared/pipes/new-line-format.pipe';
import { CustomerSegmentRuleAttribute } from '@app/shared/constants/segment-attribute-options.const';
import { PartyIdFileInfo } from '../../models/party-id-file-info.model';

@Component({
  selector: 'app-create-edit-customer-segmentation',
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
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDividerModule,
    CustSegmentBaseDetailSectionComponent,
    CustSegmentGroupConditionSectionComponent,
  ],
  providers: [DatePipe, NewLineFormat],
  templateUrl: './create-edit-customer-segmentation.component.html',
  styleUrls: ['./create-edit-customer-segmentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditCustomerSegmentationComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private actions$ = inject(Actions);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  private newLinePipe = inject(NewLineFormat);

  loading$ = this.store.select(selectIsLoading(`createCustomerSegmentation`));
  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  customerSegmentationId: WritableSignal<string> = signal('');
  SetSegmentType: any = SetSegmentType;
  customerSegmentationDetail$: Observable<CustomerSegmentationDetail | null> =
    this.store.select(
      CreateEditCustomerSegmentationSelectors.selectCustomerSegmentationDetail,
    );

  baseDetailForm: FormGroup = this.fb.group({
    status: [true],
    name: [null, Validators.required],
    description: [null, Validators.required],
    description_html: [null],
    segment_type: [SetSegmentType.SET_MANUALLY],
  });

  segmentGroupConditionForm: FormGroup = this.fb.group({
    segment_groups: this.fb.array([]),
  });

  get statusControl() {
    return this.baseDetailForm.get('status');
  }

  get segmentTypeControl() {
    return this.baseDetailForm.get('segment_type');
  }

  /* istanbul ignore next */
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['id']),
        takeUntil(this.destroy$),
      )
      .subscribe((params) => {
        this.customerSegmentationId.set(params['id']);
        this.setFormMode('view');
        this.disableAllForm();
        this.store.dispatch(
          CreateEditCustomerSegmentationActions.getCustomerSegmentationDetail({
            id: Number(this.customerSegmentationId()),
          }),
        );
      });

    this.customerSegmentationDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((customerSegmentationDetail) => !!customerSegmentationDetail),
      )
      .subscribe((customerSegmentationDetail: CustomerSegmentationDetail) => {
        this.baseDetailForm.patchValue({
          name: customerSegmentationDetail?.segment_name,
          status: customerSegmentationDetail?.status === 'ACTIVE',
          description_html: this.newLinePipe.transform(
            customerSegmentationDetail?.description,
          ),
        });

        const segmentGroupsArray = this.segmentGroupConditionForm.get(
          'segment_groups',
        ) as FormArray;
        segmentGroupsArray.clear();
        (customerSegmentationDetail?.segment_group_list || []).forEach(
          (item) => {
            segmentGroupsArray.push(
              this.fb.group({
                group_name: item.group_name,
                logical_operator: item.logical_operator,
                segment_rules: this.fb.array(
                  item.segment_rule_list.map((rule) => {
                    let rule_value: any = '';

                    switch (rule.attribute) {
                      case CustomerSegmentRuleAttribute.PRODUCT_NAME:
                        rule_value = rule.rule_code;
                        break;
                      case CustomerSegmentRuleAttribute.IS_BLOCK:
                      case CustomerSegmentRuleAttribute.IS_FRAUD:
                        rule_value = rule.rule_value === 'true' ? true : false;
                        break;

                      default:
                        rule_value = rule.rule_value;
                        break;
                    }

                    return this.fb.group({
                      attribute: rule.attribute,
                      rule_value,
                      rule_expression: rule.rule_expression,
                      active_from_date: rule.active_from_date
                        ? new Date(rule.active_from_date)
                        : null,
                      active_to_date: rule.active_to_date
                        ? new Date(rule.active_to_date)
                        : null,
                      segmentation_source: rule.segmentation_source,
                      party_id_file_list: this.fb.array(
                        (rule.party_id_file_list || []).map(
                          (partyIdFileItem: PartyIdFileInfo) =>
                            this.fb.group({
                              id: partyIdFileItem.id,
                              file_name: partyIdFileItem.file_name,
                              volume: partyIdFileItem.volume,
                              status: partyIdFileItem.status,
                              imported_date: partyIdFileItem.imported_date,
                              imported_by: partyIdFileItem.imported_by,
                              file_url: partyIdFileItem.file_url,
                            }),
                        ),
                      ),
                    });
                  }),
                ),
              }),
            );
          },
        );
        segmentGroupsArray.markAsDirty();
        this.disableAllForm();
      });

    merge(
      this.baseDetailForm.valueChanges,
      this.segmentGroupConditionForm.valueChanges,
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.store.dispatch(
          CreateEditCustomerSegmentationActions.setFormDirty({ isDirty: true }),
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditCustomerSegmentationActions.createCustomerSegmentationSuccess,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditCustomerSegmentationActions.setFormDirty({
            isDirty: false,
          }),
        );

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The customer segmentation was created`
                : 'The customer segmentation was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([
            'user-management',
            'customer-segmentation',
            'list',
          ]);
        });
      });
  }

  /* istanbul ignore next */
  onSubmit() {
    // check validate
    const isValidForm = this.baseDetailForm.valid;
    this.segmentGroupConditionForm.valid;

    if (!isValidForm) {
      this.baseDetailForm.markAllAsTouched();
      this.segmentGroupConditionForm.markAllAsTouched();

      return;
    }

    const bodyQueryParams: Partial<CreateEditCustomerSegmentationQueryParams> =
      {
        status: this.baseDetailForm.value.status ? 'ACTIVE' : 'INACTIVE',
        name: this.baseDetailForm.value.name,
        description: this.baseDetailForm.value.description,
        segment_groups: this.segmentGroupConditionForm.value.segment_groups.map(
          (group: any) => {
            return {
              group_name: group.group_name,
              logical_operator: group.logical_operator,
              segment_rules: group.segment_rules.map((rule: any) => {
                const newFile = (rule.party_id_file_list || []).find((item: any) => item.status === 'New (unsaved)');
                return {
                  logical_operator: 'AND',
                  type: 'FIXED',
                  attribute: rule.attribute,
                  rule_value: rule.rule_value,
                  rule_expression: rule.rule_expression,
                  active_from_date: rule.active_from_date
                    ? new Date(rule.active_from_date).toISOString()
                    : '',
                  active_to_date: rule.active_to_date
                    ? new Date(rule.active_to_date).toISOString()
                    : '',
                  segmentation_source: rule.segmentation_source,
                  file_id: newFile?.id || null,
                };
              }),
            };
          },
        ),
      };

    if (this.formMode() === 'edit') {
      // todo: edit
    } else {
      this.store.dispatch(
        CreateEditCustomerSegmentationActions.createCustomerSegmentation({
          data: bodyQueryParams,
        }),
      );
    }
  }

  setFormMode(mode: 'create' | 'edit' | 'view') {
    this.formMode.set(mode);

    if (mode === 'edit' || mode === 'view') {
      this.enableAllForm();
    }

    setTimeout(() => {
      this.store.dispatch(
        CreateEditCustomerSegmentationActions.setFormDirty({ isDirty: false }),
      );
    }, 0);
  }

  trimSpaces(controlName: string) {
    const value = this.baseDetailForm.get(controlName)?.value || '';
    this.baseDetailForm
      .get(controlName)
      ?.setValue(value.trim(), { emitEvent: false });
  }

  disableAllForm() {
    this.baseDetailForm.disable({ emitEvent: false });
    this.segmentGroupConditionForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.baseDetailForm.enable({ emitEvent: false });
    this.segmentGroupConditionForm.enable({ emitEvent: false });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditCustomerSegmentationActions.resetAll());
  }

  public onBlockToggle(value: MatSlideToggleChange) {
    this.statusControl?.setValue(value.checked);
  }
}
