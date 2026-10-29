import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesSectionComponent } from './messages-section.component';
import {
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as CreateEditPushNotificationActions from '../../stores/create-edit-push-notification/create-edit-push-notification.actions';
import { Editor } from 'primeng/editor';
import { noSpacesValidator } from '@app/shared/utils/no-spaces-validator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MessagesSectionComponent', () => {
  let component: MessagesSectionComponent;
  let fixture: ComponentFixture<MessagesSectionComponent>;
  let store: MockStore;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MessagesSectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fb = TestBed.inject(FormBuilder);

    component.formGroup = fb.group({
      message_title_thai: ['', [Validators.required, noSpacesValidator]],
      message_title_en: ['', [Validators.required, noSpacesValidator]],
      message_body_thai: ['', Validators.required],
      message_body_thai_html_text: [''],
      message_body_en: ['', Validators.required],
      message_body_en_html_text: [''],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set preview message correctly', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.previewLanguage.set('en');
    component.formGroup.patchValue({
      message_title_en: 'Test Title EN',
      message_body_en: 'Test Body EN {{user_name}}',
    });

    component.setPreviewMessage();

    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPushNotificationActions.setPreviewMessage({
        title: 'Test Title EN',
        body: 'Test Body EN <span class="bg-[#fbeae9] text-[#c72b29]">User Name</span>',
      })
    );
  });

  it('should handle variable selection', () => {
    const mockEditor = {
      quill: {
        getSelection: jest.fn().mockReturnValue({ index: 0 }),
        clipboard: { dangerouslyPasteHTML: jest.fn() },
        root: { innerHTML: '<p>Test</p>' },
      },
    } as unknown as Editor;

    component.enEditor = mockEditor;
    const variable = { value: 'User Name', code: '{{user_name}}' };

    component.selectVariable(variable, 'en');

    expect(
      mockEditor.quill.clipboard.dangerouslyPasteHTML
    ).toHaveBeenCalledWith(
      0,
      `<span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">User Name</span>&nbsp;`
    );
  });

  it('should handle editor text change', () => {
    const event = { htmlValue: '<p>Test {{user_name}}</p>' };
    component.editorTextChange(event, 'en');
    expect(component.messageBodyEnControl?.value).toBe('Test {{user_name}}');
  });

  it('should handle editor touched', () => {
    component.onEditorTouched('en');
    expect(component.messageBodyEnControl?.touched).toBeTruthy();
  });

  it('should convert text correctly', () => {
    const htmlText =
      '<span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">User Name</span>';
    const result = component.convertText(htmlText);
    expect(result).toBe('{{user_name}}');
  });

  it('should validate body length', () => {
    const control = { value: 'a'.repeat(501) } as FormControl;
    const result = component.bodyLengthValidator(control);
    expect(result).toEqual({ maxLength: true });
  });

  it('should change preview language and update preview message', () => {
    const setPreviewMessageSpy = jest.spyOn(component, 'setPreviewMessage');
    component.changePreviewLanguage('th');
    expect(component.previewLanguage()).toBe('th');
    expect(setPreviewMessageSpy).toHaveBeenCalled();
  });

  it('should check body length for English', () => {
    component.formGroup.patchValue({ message_body_en: 'Test {{user_name}}' });
    const length = component.checkBodyLength('en');
    expect(length).toBe(14);
  });

  it('should check body length for Thai', () => {
    component.formGroup.patchValue({
      message_body_thai: 'ทดสอบ {{user_name}}',
    });
    const length = component.checkBodyLength('th');
    expect(length).toBe(15);
  });

  it('should initialize validators on ngOnInit', () => {
    const updateSpy = jest.spyOn(
      component.messageBodyEnControl!,
      'updateValueAndValidity'
    );
    component.ngOnInit();
    expect(updateSpy).toHaveBeenCalledWith({ emitEvent: false });
  });

  it('should update preview message on form value changes', () => {
    const setPreviewMessageSpy = jest.spyOn(component, 'setPreviewMessage');
    component.formGroup.patchValue({ message_body_en: 'Updated Body' });
    expect(setPreviewMessageSpy).toHaveBeenCalled();
  });

  it('should insert variable into the editor and update the form control', () => {
    const mockEditor = {
      quill: {
        getSelection: jest.fn().mockReturnValue({ index: 0 }),
        clipboard: { dangerouslyPasteHTML: jest.fn() },
        root: { innerHTML: '<p>Test</p>' },
      },
    } as unknown as Editor;

    component.enEditor = mockEditor;
    const variable = { value: 'User Name', code: '{{user_name}}' };

    component.selectVariable(variable, 'en');

    expect(mockEditor.quill.getSelection).toHaveBeenCalled();
    expect(
      mockEditor.quill.clipboard.dangerouslyPasteHTML
    ).toHaveBeenCalledWith(
      0,
      `<span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">User Name</span>&nbsp;`
    );
    expect(component.messageBodyEnControl?.value).toBe('Test');
  });

  it('should update the form control value on editor text change', () => {
    const event = { htmlValue: '<p>Test {{user_name}}</p>' };

    component.editorTextChange(event, 'en');
    expect(component.messageBodyEnControl?.value).toBe('Test {{user_name}}');

    component.editorTextChange(event, 'th');
    expect(component.messageBodyThaiControl?.value).toBe('Test {{user_name}}');
  });

  it('should mark the form control as touched on editor interaction', () => {
    component.onEditorTouched('en');
    expect(component.messageBodyEnControl?.touched).toBeTruthy();

    component.onEditorTouched('th');
    expect(component.messageBodyThaiControl?.touched).toBeTruthy();
  });

  it('should convert HTML text to plain text with variable codes', () => {
    const htmlText =
      '<span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">User Name</span>';
    const result = component.convertText(htmlText);
    expect(result).toBe('{{user_name}}');
  });
});
