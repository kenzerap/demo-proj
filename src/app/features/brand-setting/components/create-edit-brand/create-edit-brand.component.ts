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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { filter, map, merge, Observable, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { noSpacesValidatorAsync } from '@app/shared/utils/no-spaces-validator';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { BaseSettingSectionComponent } from '../base-setting-section/base-setting-section.component';
import { CreateEditBrandQueryParams } from '../../models/create-edit-brand-query-params.model';
import * as CreateEditBrandActions from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.actions';
import * as CreateEditBrandSelectors from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.selectors';
import { BrandDetail } from '../../../../shared/models/brand-model';
import { EmailDetailSectionComponent } from '../email-detail-section/email-detail-section.component';
import { ExistingFormName } from '../../utils/existing-form-name-code.enum';
import {
  healthcareFormVariables,
  voucherFormVariables,
} from '../../constants/existing-form-name-variables';
import { ValueCode } from '@app/shared/models/value-code.model';

@Component({
  selector: 'app-create-edit-brand',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    BaseSettingSectionComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    EmailDetailSectionComponent,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-brand.component.html',
  styleUrls: ['./create-edit-brand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditBrandComponent
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

  createLoading$ = this.store.select(selectIsLoading(`createBrand`));
  updateLoading$ = this.store.select(selectIsLoading(`updateBrand`));

  brandDetail$: Observable<BrandDetail | null> = this.store.select(
    CreateEditBrandSelectors.selectBrandDetail
  );

  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  brandId: WritableSignal<number> = signal(0);

  baseSettingForm: FormGroup = this.fb.group({
    is_active: [false, Validators.required],
    brand_name_english: ['', Validators.required, noSpacesValidatorAsync],
    brand_name_thai: ['', Validators.required, noSpacesValidatorAsync],
    brand_category_id: [''],
    display_order: ['', Validators.required],
    imageFile: ['', Validators.required],
    imageUrl: [''],
    imageName: [''],
  });

  emailDetailForm: FormGroup = this.fb.group({
    send_email_when_redeemed: [false],
    to_email: [''],
    cc_email: [''],
    email_subject_english: [''],
    email_subject_thai: [''],
    email_body_english: [''],
    email_body_english_html_text: [''],
    email_body_thai: [''],
    email_body_thai_html_text: [''],
    existing_form_name_thai: [ExistingFormName.HEALTHCARE_FORM],
    existing_form_name_english: [ExistingFormName.HEALTHCARE_FORM],
  });

  /* istanbul ignore next */
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['brandId']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.brandId.set(params['brandId']);
        this.setFormMode('view');
        this.disableAllForm();

        this.store.dispatch(
          CreateEditBrandActions.getBrandDetail({
            id: this.brandId(),
          })
        );
      });

    this.brandDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((brandDetail) => !!brandDetail)
      )
      .subscribe((brandDetail: BrandDetail) => {
        this.baseSettingForm.patchValue({
          is_active: brandDetail.is_active,
          brand_name_english: brandDetail.brand_name_english,
          brand_name_thai: brandDetail.brand_name_thai,
          brand_category_id: brandDetail.brand_category_id,
          display_order: brandDetail.display_order,
        });

        this.baseSettingForm.patchValue({
          imageUrl: brandDetail.preview_brand_logo_url,
          imageName: brandDetail.brand_logo,
          imageFile: brandDetail.preview_brand_logo_url,
        });

        const emailBodyEnglish = (brandDetail.email_body_english || '').replace(
          / <\/p>/g,
          '</p>'
        );
        const emailBodyThai = (brandDetail.email_body_thai || '').replace(
          / <\/p>/g,
          '</p>'
        );
        this.emailDetailForm.patchValue({
          send_email_when_redeemed: brandDetail.send_email_when_redeemed,
          to_email: brandDetail.to_email,
          cc_email: brandDetail.cc_email,
          email_subject_english: brandDetail.email_subject_english,
          email_subject_thai: brandDetail.email_subject_thai,
          email_body_english_html_text: this.convertMessageBodyToHtmlText(
            brandDetail.email_body_english || ''
          ),
          email_body_english: emailBodyEnglish,
          email_body_thai_html_text: this.convertMessageBodyToHtmlText(
            brandDetail.email_body_thai || ''
          ),
          email_body_thai: emailBodyThai,
          existing_form_name_thai: brandDetail.form_type_thai,
          existing_form_name_english: brandDetail.form_type_english,
        });

        this.baseSettingForm.markAsPristine();
        this.emailDetailForm.markAsPristine();

        setTimeout(() => {
          this.store.dispatch(
            CreateEditBrandActions.setFormDirty({
              isDirty: false,
            })
          );
        }, 0);
      });

    merge(this.baseSettingForm.valueChanges, this.emailDetailForm.valueChanges)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditBrandActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditBrandActions.createBrandSuccess,
          CreateEditBrandActions.updateBrandSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditBrandActions.setFormDirty({ isDirty: false })
        );

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The brand was created`
                : 'The brand was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([
            'privilege-management',
            'brand-setting',
            'list',
          ]);
        });
      });
  }

  /* istanbul ignore next */
  onSubmit() {
    // check validate
    const isValidForm =
      this.baseSettingForm.valid && this.emailDetailForm.valid;
    if (!isValidForm) {
      this.baseSettingForm.markAllAsTouched();
      this.emailDetailForm.markAllAsTouched();
      return;
    }

    const file = this.baseSettingForm.getRawValue().imageFile;
    const bodyQueryParams: Partial<CreateEditBrandQueryParams> = {
      is_active: this.baseSettingForm.getRawValue().is_active,
      brand_name_english: this.baseSettingForm.getRawValue().brand_name_english,
      brand_name_thai: this.baseSettingForm.getRawValue().brand_name_thai,
      brand_category_id: this.baseSettingForm.getRawValue().brand_category_id,
      display_order: this.baseSettingForm.getRawValue().display_order,
      send_email_when_redeemed:
        this.emailDetailForm.getRawValue().send_email_when_redeemed,
      to_email: this.emailDetailForm.getRawValue().to_email || null,
      cc_email: this.emailDetailForm.getRawValue().cc_email || null,
      email_subject_english:
        this.emailDetailForm.getRawValue().email_subject_english || null,
      email_subject_thai:
        this.emailDetailForm.getRawValue().email_subject_thai || null,
      email_body_english:
        this.emailDetailForm.getRawValue().email_body_english || null,
      email_body_thai:
        this.emailDetailForm.getRawValue().email_body_thai || null,
      form_type_english:
        this.emailDetailForm.getRawValue().existing_form_name_english || null,
      form_type_thai:
        this.emailDetailForm.getRawValue().existing_form_name_thai || null,
    };

    if (this.formMode() === 'edit') {
      this.store.dispatch(
        CreateEditBrandActions.updateBrand({
          id: this.brandId(),
          data: { ...bodyQueryParams },
          file: file.name ? file : null,
        })
      );
    } else {
      this.store.dispatch(
        CreateEditBrandActions.createBrand({
          data: bodyQueryParams,
          file: file,
        })
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
        CreateEditBrandActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.baseSettingForm.disable({ emitEvent: false });
    this.emailDetailForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.baseSettingForm.enable({ emitEvent: false });
    this.emailDetailForm.enable({ emitEvent: false });
  }

  convertMessageBodyToHtmlText(messageBody: string): string {
    const variables: ValueCode[] = [
      ...healthcareFormVariables,
      ...voucherFormVariables,
    ].reduce((acc, item) => {
      if (!acc.some((variable: ValueCode) => variable.code === item.code)) {
        acc.push(item);
      }

      return acc;
    }, [] as ValueCode[]);

    const existedVariables = variables.filter((variable) =>
      messageBody.includes(variable.code)
    );

    existedVariables.forEach((existedVariable) => {
      messageBody = messageBody
        .split(existedVariable.code)
        .join(
          `<span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">${existedVariable.value}</span>`
        );
    });
    messageBody = messageBody.replace(/ <\/p>/g, '</p>');
    return messageBody;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditBrandActions.resetAll());
  }
}
