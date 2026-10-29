import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { Editor, EditorModule } from 'primeng/editor';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { noSpacesValidator } from '@app/shared/utils/no-spaces-validator';
import { Observable, takeUntil } from 'rxjs';
import { PrivilegeDetail } from '../../models/privilege-setting-model';
import * as createEditPrivilegeSelectors from '../../stores/create-edit-privilege/create-edit-privilege.selectors';
import { Store } from '@ngrx/store';

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
  private changeDetection = inject(ChangeDetectorRef);
  private store = inject(Store);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  previewLanguage: WritableSignal<'th' | 'en'> = signal('th');

  @ViewChild('EnEditor') enEditor!: Editor;
  @ViewChild('ThEditor') thEditor!: Editor;

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

  privilegeDetail$: Observable<PrivilegeDetail | null> = this.store.select(
    createEditPrivilegeSelectors.selectPrivilegeDetail
  );

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

    this.privilegeDetail$.pipe(takeUntil(this.destroy$)).subscribe((detail) => {
      this.changeDetection.detectChanges();
    });
  }

  editorTextChange(event: any, language: 'en' | 'th') {
    const text = event.htmlValue;
    if (language === 'en') {
      this.messageBodyEnControl?.patchValue(text);
    }

    if (language === 'th') {
      this.messageBodyThaiControl?.patchValue(text);
    }

    this.changeDetection.detectChanges();
  }

  onEditorTouched(language: 'en' | 'th') {
    if (language === 'en') {
      this.messageBodyEnControl?.markAsTouched();
    }

    if (language === 'th') {
      this.messageBodyThaiControl?.markAsTouched();
    }
  }

  checkBodyLength(language: 'en' | 'th') {
    const control =
      language === 'en'
        ? this.messageBodyEnControl
        : this.messageBodyThaiControl;

    // convert newline to count
    const value = (control?.value || '').replace(/&nbsp;/g, ' ');

    // remove HTML tags
    let pureText = value.replace(/<[^>]+>/g, '');

    return pureText.length;
  }

  bodyLengthValidator(control: AbstractControl): ValidationErrors | null {
    // convert newline to count
    const value = (control?.value || '').replace(/&nbsp;/g, ' ');

    // remove HTML tags
    let pureText = value.replace(/<[^>]+>/g, '');

    if (pureText.length > 10000) {
      return { maxLength: true };
    }
    return null;
  }
}
