import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Editor, EditorModule } from 'primeng/editor';
import { noSpacesValidator } from '@app/shared/utils/no-spaces-validator';
import { filter, takeUntil } from 'rxjs';
import { ValueCode } from '@app/shared/models/value-code.model';
import { ExistingFormName } from '../../utils/existing-form-name-code.enum';
import {
  healthcareFormVariables,
  voucherFormVariables,
} from '../../constants/existing-form-name-variables';
import { Range } from 'quill';

@Component({
  selector: 'app-email-detail-section',
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
    MatButtonModule,
    MatDividerModule,
    EditorModule,
    DemoprojInputComponent,
  ],
  providers: [DatePipe],
  templateUrl: './email-detail-section.component.html',
  styleUrl: './email-detail-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailDetailSectionComponent
  extends BaseComponent
  implements OnInit
{
  @ViewChild('EditorTH') editorTh!: Editor;
  @ViewChild('EditorEN') editorEn!: Editor;

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  get sendEmailWhenRedeemedControl() {
    return this.formGroup?.get('send_email_when_redeemed');
  }
  get toEmailControl() {
    return this.formGroup?.get('to_email');
  }
  get ccEmailControl() {
    return this.formGroup?.get('cc_email');
  }
  get emailSubjectEnglishControl() {
    return this.formGroup?.get('email_subject_english');
  }
  get emailSubjectThaiControl() {
    return this.formGroup?.get('email_subject_thai');
  }
  get emailBodyEnglishControl() {
    return this.formGroup?.get('email_body_english');
  }
  get emailBodyEnglishHtmlTextControl() {
    return this.formGroup?.get('email_body_english_html_text');
  }
  get emailBodyThaiControl() {
    return this.formGroup?.get('email_body_thai');
  }
  get emailBodyThaiHtmlTextControl() {
    return this.formGroup?.get('email_body_thai_html_text');
  }
  get existingFormNameThaiControl() {
    return this.formGroup?.get('existing_form_name_thai');
  }
  get existingFormNameEnglishControl() {
    return this.formGroup?.get('existing_form_name_english');
  }

  currentDate = new Date();

  existingFormNameOptions: ValueCode[] = [
    {
      value: 'Healthcare Form',
      code: ExistingFormName.HEALTHCARE_FORM,
    },
    {
      value: 'Voucher Form',
      code: ExistingFormName.VOUCHER_FORM,
    },
  ];
  variablesTh: ValueCode[] = [...healthcareFormVariables];
  variablesEn: ValueCode[] = [...healthcareFormVariables];

  ngOnInit(): void {
    this.toEmailControl?.setValidators([this.emailValidator]);

    this.ccEmailControl?.setValidators([this.emailValidator]);

    this.emailSubjectEnglishControl?.setValidators([]);

    this.emailSubjectThaiControl?.setValidators([]);

    this.emailBodyEnglishControl?.setValidators([(control: AbstractControl) => this.bodyLengthValidator(control, 'en')]);

    this.emailBodyThaiControl?.setValidators([(control: AbstractControl) => this.bodyLengthValidator(control, 'th')]);

    this.sendEmailWhenRedeemedControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.addValidateFormControls();
        } else {
          this.toEmailControl?.setValidators([]);
          this.ccEmailControl?.setValidators([]);
          this.emailSubjectEnglishControl?.setValidators([]);
          this.emailSubjectThaiControl?.setValidators([]);
          this.emailBodyEnglishControl?.setValidators([]);
          this.emailBodyThaiControl?.setValidators([]);
        }

        this.toEmailControl?.updateValueAndValidity();
        this.ccEmailControl?.updateValueAndValidity();
        this.emailSubjectEnglishControl?.updateValueAndValidity();
        this.emailSubjectThaiControl?.updateValueAndValidity();
        this.emailBodyEnglishControl?.updateValueAndValidity();
        this.emailBodyThaiControl?.updateValueAndValidity();
      });

    this.existingFormNameThaiControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        switch (value) {
          case ExistingFormName.HEALTHCARE_FORM:
            this.variablesTh = [...healthcareFormVariables];
            break;
          case ExistingFormName.VOUCHER_FORM:
            this.variablesTh = [...voucherFormVariables];
            break;

          default:
            break;
        }

        if (this.formMode !== 'view') {
          this.emailBodyThaiHtmlTextControl?.reset();
          this.emailBodyThaiControl?.reset();
        }
      });

    this.existingFormNameEnglishControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        switch (value) {
          case ExistingFormName.HEALTHCARE_FORM:
            this.variablesEn = [...healthcareFormVariables];
            break;
          case ExistingFormName.VOUCHER_FORM:
            this.variablesEn = [...voucherFormVariables];
            break;

          default:
            break;
        }

        if (this.formMode !== 'view') {
          this.emailBodyEnglishHtmlTextControl?.reset();
          this.emailBodyEnglishControl?.reset();
        }
      });
  }

  bodyLengthValidator(control: AbstractControl, language: 'en' | 'th'): ValidationErrors | null {
    // convert newline to count
    const value = (control?.value || '')
      .replace(/&nbsp;/g, ' ')
      .replace(/<\/p>$/, '')
      .replace(/<\/p>/g, '1');

    // remove HTML tags
    let pureText = value.replace(/<[^>]+>/g, '');

    let variables: ValueCode[] =
      language === 'en' ? this.variablesEn : this.variablesTh;
    (variables || []).forEach((variable) => {
      pureText = pureText.split(`${variable.code}`).join(`${variable.value}`);
    });

    if (pureText.length > 2000) {
      return { maxLength: true };
    }
    return null;
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!(value || '').trim()) {
      return null;
    }

    const valuesSplited: string[] = (value || '').split(';');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (
      valuesSplited.some(
        (email) => !!email.trim() && !emailRegex.test(email.trim())
      )
    ) {
      return { invalidEmail: true };
    }

    return null;
  }

  onEditorTouched(language: 'en' | 'th') {
    const control =
      language === 'en'
        ? this.emailBodyEnglishHtmlTextControl
        : this.emailBodyThaiHtmlTextControl;

    if (control?.disabled) {
      return;
    }

    control?.markAsTouched();
  }

  editorTextChange(event: any, language: 'en' | 'th') {
    const control =
      language === 'en'
        ? this.emailBodyEnglishControl
        : this.emailBodyThaiControl;

    control?.patchValue(this.convertText(event.htmlValue, language));
  }

  convertText(htmlText: string, language: 'en' | 'th'): string {
    let replacedValueText = htmlText.replace(/&nbsp;/g, ' ');

    let variables: ValueCode[] =
      language === 'en' ? this.variablesEn : this.variablesTh;
    (variables || []).forEach((variable) => {
      replacedValueText = replacedValueText
        .split(
          `<span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">${variable.value}</span>`
        )
        .join(`${variable.code}`);

      replacedValueText = replacedValueText
        .split(
          `<span style="background-color: rgb(251, 234, 233); color: rgb(199, 43, 41);">${variable.value}</span>`
        )
        .join(`${variable.code}`);
    });

    return replacedValueText;
  }

  checkBodyLength(language: 'en' | 'th') {
    const control =
      language === 'en'
        ? this.emailBodyEnglishControl
        : this.emailBodyThaiControl;

    // convert newline to count
    const value = (control?.value || '')
      .replace(/&nbsp;/g, ' ')
      .replace(/<\/p>$/, '')
      .replace(/<\/p>/g, '1');

    // remove HTML tags
    let pureText = value.replace(/<[^>]+>/g, '');

    let variables: ValueCode[] =
      language === 'en' ? this.variablesEn : this.variablesTh;
    (variables || []).forEach((variable) => {
      pureText = pureText.split(`${variable.code}`).join(`${variable.value}`);
    });

    return pureText.length;
  }

  addValidateFormControls() {
    this.toEmailControl?.setValidators([
      Validators.required,
      noSpacesValidator,
      this.emailValidator,
    ]);

    this.ccEmailControl?.setValidators([
      Validators.required,
      noSpacesValidator,
      this.emailValidator,
    ]);

    this.emailSubjectEnglishControl?.setValidators([Validators.required]);

    this.emailSubjectThaiControl?.setValidators([Validators.required]);

    this.emailBodyEnglishControl?.setValidators([
      Validators.required,
      noSpacesValidator,
      (control: AbstractControl) => this.bodyLengthValidator(control, 'en')
    ]);

    this.emailBodyThaiControl?.setValidators([
      Validators.required,
      noSpacesValidator,
      (control: AbstractControl) => this.bodyLengthValidator(control, 'th')
    ]);
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  selectVariable(variable: ValueCode, language: 'en' | 'th') {
    const style = `color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);`;
    const htmlText = `<span style=\"${style}\">${variable.value}</span>&nbsp;`;
    const editor = language === 'en' ? this.editorEn : this.editorTh;

    const range: Range = editor.quill.getSelection();
    editor.quill.clipboard.dangerouslyPasteHTML(range?.index || 0, htmlText);
    const htmlTextValue = editor.quill.root.innerHTML;
    this.editorTextChange({ htmlValue: htmlTextValue }, language);
  }
}
