import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ValueCode } from '@app/shared/models/value-code.model';
import { TriggerEventType } from '@app/shared/utils/enums/trigger-event-type.enum';
import { Store } from '@ngrx/store';
import { Editor, EditorModule } from 'primeng/editor';
import { Range } from 'quill';
import * as CreateEditPushNotificationActions from '../../stores/create-edit-push-notification/create-edit-push-notification.actions';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { takeUntil } from 'rxjs';
import { noSpacesValidator } from '@app/shared/utils/no-spaces-validator';
import {
  defaultMessageVariables,
  messageVariables,
} from '../../constants/message-variables';

@Component({
  selector: 'app-messages-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    EditorModule,
    MatButtonModule,
  ],
  templateUrl: './messages-section.component.html',
  styleUrl: './messages-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesSectionComponent extends BaseComponent implements OnInit {
  private store = inject(Store);

  @Input() formGroup!: FormGroup;

  @Input() set isSendTriggerEvent(value: boolean) {
    if (!value) {
      this.variables = [...defaultMessageVariables];
    }
  }

  _triggerEventTypeValue!: TriggerEventType | null;
  @Input() set triggerEventTypeValue(value: TriggerEventType | null) {
    this._triggerEventTypeValue = value;
    let newVariables: ValueCode<string>[] = [];
    if (value) {
      newVariables = [
        ...defaultMessageVariables,
        { value: 'Condition Value', code: `{{condition_value}}` },
        { value: 'Condition Unit', code: `{{condition_unit}}` },
      ];
    }

    switch (value) {
      case TriggerEventType.ClaimStatus:
        newVariables = [
          ...newVariables,
          { value: 'Claim Status', code: `{{claim_status}}` },
          { value: 'Claim No', code: `{{claim_no}}` },
        ];
        break;
      case TriggerEventType.PaymentDueDate:
        newVariables = [
          ...newVariables,
          { value: 'Payment Expiry Date', code: `{{payment_expiry_date}}` },
          { value: 'Paid Amount', code: `{{paid_amount}}` },
        ];
        break;
      case TriggerEventType.PointsExpiryDate:
        newVariables = [
          ...newVariables,
          { value: 'Current Points', code: `{{current_points}}` },
          { value: 'Point Expiry Date', code: `{{point_expiry_date}}` },
          { value: 'Expiring Points', code: `{{Expiring_Points}}` },
        ];
        break;

      default:
        break;
    }

    this.variables = newVariables;
  }

  previewLanguage: WritableSignal<'th' | 'en'> = signal('th');

  @ViewChild('EnEditor') enEditor!: Editor;
  @ViewChild('ThEditor') thEditor!: Editor;

  variables: ValueCode[] = [...defaultMessageVariables];

  get messageTitleThaiControl() {
    return this.formGroup?.get('message_title_thai');
  }
  get messageTitleEnControl() {
    return this.formGroup?.get('message_title_en');
  }
  get messageBodyThaiControl() {
    return this.formGroup?.get('message_body_thai');
  }
  get messageBodyEnControl() {
    return this.formGroup?.get('message_body_en');
  }
  get messageBodyEnHtmlTextControl() {
    return this.formGroup?.get('message_body_en_html_text');
  }
  get messageBodyThaiHtmlTextControl() {
    return this.formGroup?.get('message_body_thai_html_text');
  }

  ngOnInit(): void {
    this.messageBodyEnControl?.setValidators([
      Validators.required,
      this.bodyLengthValidator,
      noSpacesValidator,
    ]);

    this.messageBodyThaiControl?.setValidators([
      Validators.required,
      this.bodyLengthValidator,
      noSpacesValidator,
    ]);

    this.messageBodyEnControl?.updateValueAndValidity({ emitEvent: false });
    this.messageBodyThaiControl?.updateValueAndValidity({ emitEvent: false });

    this.formGroup?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setPreviewMessage();
      });
  }

  selectVariable(variable: ValueCode, language: 'en' | 'th') {
    const style = `color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);`;
    const htmlText = `<span style=\"${style}\">${variable.value}</span>&nbsp;`;
    const editor = language === 'en' ? this.enEditor : this.thEditor;

    const range: Range = editor.quill.getSelection();
    editor.quill.clipboard.dangerouslyPasteHTML(range?.index || 0, htmlText);
    const htmlTextValue = editor.quill.root.innerHTML;
    this.editorTextChange({ htmlValue: htmlTextValue }, language);
  }

  editorTextChange(event: any, language: 'en' | 'th') {
    if (language === 'en') {
      this.messageBodyEnControl?.patchValue(this.convertText(event.htmlValue));
    }

    if (language === 'th') {
      this.messageBodyThaiControl?.patchValue(
        this.convertText(event.htmlValue)
      );
    }
  }

  onEditorTouched(language: 'en' | 'th') {
    if (language === 'en') {
      this.messageBodyEnControl?.markAsTouched();
    }

    if (language === 'th') {
      this.messageBodyThaiControl?.markAsTouched();
    }
  }

  convertText(htmlText: string): string {
    let replacedValueText = htmlText.replace(/&nbsp;/g, ' ');
    (messageVariables || []).forEach((variable) => {
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

    // replace html tags
    const pureText = replacedValueText.replace(/<[^>]+>/g, '');

    return pureText;
  }

  checkBodyLength(language: 'en' | 'th') {
    if (language === 'en') {
      const enText = (this.messageBodyEnControl?.value || '')
        .replace(/{{/g, '')
        .replace(/}}/g, '');

      return enText.length;
    }

    if (language === 'th') {
      const thText = (this.messageBodyThaiControl?.value || '')
        .replace(/{{/g, '')
        .replace(/}}/g, '');

      return thText.length;
    }
  }

  bodyLengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    const enText = (value || '').replace(/{{/g, '').replace(/}}/g, '');

    if (enText.length > 500) {
      return { maxLength: true };
    }
    return null;
  }

  changePreviewLanguage(language: 'en' | 'th') {
    this.previewLanguage.set(language);
    this.setPreviewMessage();
  }

  setPreviewMessage() {
    const title =
      this.previewLanguage() === 'en'
        ? this.messageTitleEnControl?.value
        : this.messageTitleThaiControl?.value;
    let body =
      this.previewLanguage() === 'en'
        ? this.messageBodyEnControl?.value
        : this.messageBodyThaiControl?.value;

    messageVariables.forEach((variable) => {
      body = body
        ?.split(variable.code)
        .join(
          `<span class="bg-[#fbeae9] text-[#c72b29]">${variable.value}</span>`
        );
    });

    this.store.dispatch(
      CreateEditPushNotificationActions.setPreviewMessage({ title, body })
    );
  }
}
