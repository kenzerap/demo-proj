import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { filter, merge, Observable, take, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import * as CreateEditFundTypeActions from '../../stores/create-edit-fund-type/create-edit-fund-type.actions';
import * as CreateEditFundTypeSelectors from '../../stores/create-edit-fund-type/create-edit-fund-type.selectors';
import { FundType } from '../../models/fund-type.model';
import { CreateEditFundTypeQueryParams } from '../../models/create-edit-fund-type-query-params.model';
import { BaseSettingSectionComponent } from '../base-setting-section/base-setting-section.component';
import { ProductCodeSectionComponent } from '../product-code-section/product-code-section.component';
import { ChannelSectionComponent } from '../channel-section/channel-section.component';
import { NationalitySectionComponent } from '../nationality-section/nationality-section.component';
import { FundTypeCode } from '../../enums/fund-type-code.enum';
import { FundClassCode } from '../../enums/fund-class-code.enum';
import { FxRateFlagCode } from '../../enums/fx-rate-flag-code.enum';
import { FxHedgingCepCode } from '../../enums/fx-hedging-cep-code.enum';
import { FxHedgingPriveCode } from '../../enums/fx-hedging-prive-code.enum';

@Component({
  selector: 'app-create-edit-fund-type',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    HasPermissionsDirective,
    BaseSettingSectionComponent,
    ProductCodeSectionComponent,
    ChannelSectionComponent,
    NationalitySectionComponent,
  ],
  templateUrl: './create-edit-fund-type.component.html',
  styleUrl: './create-edit-fund-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditFundTypeComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private actions$ = inject(Actions);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private changeDetector = inject(ChangeDetectorRef);
  private hasPermissionService = inject(HasPermissionService);

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  loading$ = this.store.select(selectIsLoading('createEditFundType'));
  fundTypeDetail$: Observable<FundType | null> = this.store.select(
    CreateEditFundTypeSelectors.selectFundTypeDetail,
  );

  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  fundId: WritableSignal<number> = signal(0);

  baseSettingForm: FormGroup = this.fb.group({
    isActive: [false],
    amcs: ['', Validators.required],
    fund_code_amcs: ['', Validators.required],
    fund_code_as400: ['', Validators.required],
    fund_th: ['', Validators.required],
    fund_en: ['', Validators.required],
    fund_type: [FundTypeCode.EquityFund, Validators.required],
    fund_type_th: [''],
    fund_type_mkt: [''],
    fund_class: [FundClassCode.Domestic],
    risk_level: [1, Validators.required],
    fx_rate_flag: [FxRateFlagCode.Yes],
    fx_hedging_prive: [FxHedgingPriveCode.NoFxHedge],
    fx_hedging_cep: [FxHedgingCepCode.None],
    remark: [''],
  });

  productCodeForm: FormGroup = this.fb.group({
    product_codes: this.fb.array([
      this.fb.group({ product_code: ['', Validators.required] }),
    ]),
  });

  channelForm: FormGroup = this.fb.group({
    channels: this.fb.array([
      this.fb.group({ channel: ['', Validators.required], visible: [false] }),
    ]),
  });

  nationalityForm: FormGroup = this.fb.group({
    nationalities: this.fb.array([
      this.fb.group({
        nationality: ['', Validators.required],
        allowed: [false],
      }),
    ]),
  });

  get productCodesFormArray(): FormArray {
    return this.productCodeForm.get('product_codes') as FormArray;
  }
  get channelsFormArray(): FormArray {
    return this.channelForm.get('channels') as FormArray;
  }
  get nationalitiesFormArray(): FormArray {
    return this.nationalityForm.get('nationalities') as FormArray;
  }

  /* istanbul ignore next */
  ngOnInit(): void {
    this.store.dispatch(CreateEditFundTypeActions.getFundTypeOptions());

    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['fundId']),
        takeUntil(this.destroy$),
      )
      .subscribe((params) => {
        this.fundId.set(Number(params['fundId']));
        this.setFormMode('view');
        this.disableAllForm();
        this.store.dispatch(
          CreateEditFundTypeActions.getFundTypeDetail({
            fundId: this.fundId(),
          }),
        );
      });

    this.fundTypeDetail$
      .pipe(
        filter((fundTypeDetail) => !!fundTypeDetail),
        take(1),
      )
      .subscribe((fundTypeDetail) => {
        this.baseSettingForm.patchValue({
          isActive: !!fundTypeDetail?.is_active,
          amcs: fundTypeDetail?.amcs,
          fund_code_amcs: fundTypeDetail?.fund_code_amcs,
          fund_code_as400: fundTypeDetail?.fund_code_as400,
          fund_th: fundTypeDetail?.fund_th,
          fund_en: fundTypeDetail?.fund_en,
          fund_type: fundTypeDetail?.fund_type,
          fund_type_th: fundTypeDetail?.fund_type_th,
          fund_type_mkt: fundTypeDetail?.fund_type_mkt,
          fund_class: fundTypeDetail?.fund_class,
          risk_level: fundTypeDetail?.risk_level,
          fx_rate_flag: fundTypeDetail?.fx_rate_flag,
          fx_hedging_prive: fundTypeDetail?.fx_hedging_prive,
          fx_hedging_cep: fundTypeDetail?.fx_hedging_cep,
          remark: fundTypeDetail?.remark,
        });

        setTimeout(() => {
          this.changeDetector.detectChanges();
          this.store.dispatch(
            CreateEditFundTypeActions.setFormDirty({ isDirty: false }),
          );
        }, 0);
      });

    merge(
      this.baseSettingForm.valueChanges,
      this.productCodeForm.valueChanges,
      this.channelForm.valueChanges,
      this.nationalityForm.valueChanges,
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view'),
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditFundTypeActions.setFormDirty({ isDirty: true }),
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditFundTypeActions.createFundTypeSuccess,
          CreateEditFundTypeActions.updateFundTypeSuccess,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditFundTypeActions.setFormDirty({ isDirty: false }),
        );
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The fund type was created`
                : 'The fund type was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['master-data-management', 'fund-type', 'list']);
        });
      });
  }

  /* istanbul ignore next */
  onSubmit() {
    const isValidForm =
      this.baseSettingForm.valid &&
      this.productCodeForm.valid &&
      this.channelForm.valid &&
      this.nationalityForm.valid;

    if (!isValidForm) {
      this.baseSettingForm.markAllAsTouched();
      this.productCodeForm.markAllAsTouched();
      this.channelForm.markAllAsTouched();
      this.nationalityForm.markAllAsTouched();
      return;
    }

    const baseSettingFormValue = this.baseSettingForm.getRawValue();
    const productCodeFormValue = this.productCodeForm.getRawValue();
    const channelFormValue = this.channelForm.getRawValue();
    const nationalityFormValue = this.nationalityForm.getRawValue();

    const bodyQueryParams: Partial<CreateEditFundTypeQueryParams> = {
      ...baseSettingFormValue,
      is_active: !!baseSettingFormValue.isActive,
      product_codes: (productCodeFormValue.product_codes || []).map(
        (item: any) => item.product_code,
      ),
      channels: (channelFormValue.channels || []).map((item: any) => ({
        channel_id: item.channel,
        visible: !!item.visible,
      })),
      nationalities: (nationalityFormValue.nationalities || []).map(
        (item: any) => ({
          nationality_id: item.nationality,
          allowed: !!item.allowed,
        }),
      ),
    };
    delete (bodyQueryParams as Record<string, unknown>)['isActive'];

    if (this.formMode() === 'edit') {
      this.store.dispatch(
        CreateEditFundTypeActions.updateFundType({
          data: { ...bodyQueryParams, fund_id: this.fundId() },
        }),
      );
    } else {
      this.store.dispatch(
        CreateEditFundTypeActions.createFundType({
          queryParams: bodyQueryParams,
        }),
      );
    }
  }

  setFormMode(mode: 'create' | 'edit' | 'view') {
    this.formMode.set(mode);
    if (mode === 'edit') {
      this.enableAllForm();
    }
    setTimeout(() => {
      this.store.dispatch(
        CreateEditFundTypeActions.setFormDirty({ isDirty: false }),
      );
    }, 0);
  }

  disableAllForm() {
    this.baseSettingForm.disable({ emitEvent: false });
    this.productCodeForm.disable({ emitEvent: false });
    this.channelForm.disable({ emitEvent: false });
    this.nationalityForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.baseSettingForm.enable({ emitEvent: false });
    this.productCodeForm.enable({ emitEvent: false });
    this.channelForm.enable({ emitEvent: false });
    this.nationalityForm.enable({ emitEvent: false });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditFundTypeActions.reset());
  }
}
