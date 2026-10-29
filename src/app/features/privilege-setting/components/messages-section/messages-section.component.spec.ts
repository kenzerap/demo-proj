import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesSectionComponent } from './messages-section.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Editor } from 'primeng/editor';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('MessagesSectionComponent', () => {
  let component: MessagesSectionComponent;
  let fixture: ComponentFixture<MessagesSectionComponent>;
  let formBuilder: FormBuilder;
  let store: MockStore;

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
    formBuilder = TestBed.inject(FormBuilder);
    store = TestBed.inject(MockStore);

    component.formGroup = formBuilder.group({
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

  it('should set validators on ngOnInit', () => {
    const thaiControl = component.messageBodyThaiControl;
    const enControl = component.messageBodyEnControl;

    expect(thaiControl?.validator).toBeDefined();
    expect(enControl?.validator).toBeDefined();
  });

  it('should update message_body_en when message_body_en_html_text changes', () => {
    const enHtmlControl = component.messageBodyEnHtmlTextControl!;
    const enControl = component.messageBodyEnControl!;
    const mockEditor = { el: { nativeElement: { innerText: 'Test EN' } } };
    component.enEditor = mockEditor as Editor;

    enHtmlControl.setValue('<p>Test EN</p>');
    expect(enControl.value).toBe('');
  });

  it('should update message_body_thai when message_body_thai_html_text changes', () => {
    const thaiHtmlControl = component.messageBodyThaiHtmlTextControl!;
    const thaiControl = component.messageBodyThaiControl!;
    const mockEditor = { el: { nativeElement: { innerText: 'Test TH' } } };
    component.thEditor = mockEditor as Editor;

    thaiHtmlControl.setValue('<p>Test TH</p>');
    expect(thaiControl.value).toBe('');
  });

  it('should handle editor text change', () => {
    const mockEvent = { htmlValue: '<p>Updated Text</p>' };
    component.editorTextChange(mockEvent, 'en');
    expect(component.messageBodyEnControl?.value).toBe('<p>Updated Text</p>');

    component.editorTextChange(mockEvent, 'th');
    expect(component.messageBodyThaiControl?.value).toBe('<p>Updated Text</p>');
  });

  it('should mark controls as touched on editor touched', () => {
    component.onEditorTouched('en');
    expect(component.messageBodyEnControl?.touched).toBeTruthy();

    component.onEditorTouched('th');
    expect(component.messageBodyThaiControl?.touched).toBeTruthy();
  });

  it('should check body length correctly', () => {
    component.messageBodyEnControl?.setValue('Test {{variable}}');
    expect(component.checkBodyLength('en')).toBe(17);

    component.messageBodyThaiControl?.setValue('ทดสอบ {{ตัวแปร}}');
    expect(component.checkBodyLength('th')).toBe(16);
  });

  it('should validate body length correctly', () => {
    const control = { value: 'a'.repeat(10001) } as any;
    const result = component.bodyLengthValidator(control);
    expect(result).toEqual({ maxLength: true });

    control.value = 'a'.repeat(10000);
    expect(component.bodyLengthValidator(control)).toBeNull();
  });
});
