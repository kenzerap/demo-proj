import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailDetailSectionComponent } from './email-detail-section.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ExistingFormName } from '../../utils/existing-form-name-code.enum';
import {
  healthcareFormVariables,
  voucherFormVariables,
} from '../../constants/existing-form-name-variables';
import { of } from 'rxjs';

// Mock Editor
const mockEditor = {
  quill: {
    getSelection: jest.fn().mockReturnValue({ index: 0 }),
    clipboard: {
      dangerouslyPasteHTML: jest.fn().mockImplementation((_index: number, html: string) => {
        const normalized = html
          .replace(
            'color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);',
            'background-color: rgb(251, 234, 233); color: rgb(199, 43, 41);'
          )
          .replace('&nbsp;', ' ');
        mockEditor.quill.root.innerHTML = `<p>${normalized}</p>`;
      }),
    },
    root: {
      innerHTML: '<p>mock html</p>',
    },
  },
};

describe('EmailDetailSectionComponent', () => {
  let component: EmailDetailSectionComponent;
  let fixture: ComponentFixture<EmailDetailSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        EmailDetailSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [FormBuilder, DatePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailDetailSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      send_email_when_redeemed: [false],
      to_email: [''],
      cc_email: [''],
      email_subject_english: [''],
      email_subject_thai: [''],
      email_body_english: [''],
      email_body_english_html_text: [''],
      email_body_thai: [''],
      email_body_thai_html_text: [''],
      existing_form_name_thai: [''],
      existing_form_name_english: [''],
    });

    // Mock ViewChild editors
    component.editorTh = mockEditor as any;
    component.editorEn = mockEditor as any;

    fixture.detectChanges();

    // Re-assign mocks after detectChanges in case @ViewChild resolution overrides them
    component.editorTh = mockEditor as any;
    component.editorEn = mockEditor as any;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form controls getters correctly', () => {
      expect(component.sendEmailWhenRedeemedControl).toBeDefined();
      expect(component.toEmailControl).toBeDefined();
      expect(component.ccEmailControl).toBeDefined();
      expect(component.emailSubjectEnglishControl).toBeDefined();
      expect(component.emailSubjectThaiControl).toBeDefined();
      expect(component.emailBodyEnglishControl).toBeDefined();
      expect(component.emailBodyEnglishHtmlTextControl).toBeDefined();
      expect(component.emailBodyThaiControl).toBeDefined();
      expect(component.emailBodyThaiHtmlTextControl).toBeDefined();
      expect(component.existingFormNameThaiControl).toBeDefined();
      expect(component.existingFormNameEnglishControl).toBeDefined();
    });

    it('should initialize with default values', () => {
      expect(component.formMode).toBe('create');
      expect(component.currentDate).toBeInstanceOf(Date);
      expect(component.existingFormNameOptions).toHaveLength(2);
      expect(component.variablesTh).toEqual([...healthcareFormVariables]);
      expect(component.variablesEn).toEqual([...healthcareFormVariables]);
    });
  });

  describe('ngOnInit', () => {
    it('should initialize validators on ngOnInit', () => {
      const toEmailSpy = jest.spyOn(component.toEmailControl!, 'setValidators');
      const ccEmailSpy = jest.spyOn(component.ccEmailControl!, 'setValidators');
      const emailBodyEnSpy = jest.spyOn(
        component.emailBodyEnglishControl!,
        'setValidators'
      );
      const emailBodyThSpy = jest.spyOn(
        component.emailBodyThaiControl!,
        'setValidators'
      );

      component.ngOnInit();

      expect(toEmailSpy).toHaveBeenCalled();
      expect(ccEmailSpy).toHaveBeenCalled();
      expect(emailBodyEnSpy).toHaveBeenCalled();
      expect(emailBodyThSpy).toHaveBeenCalled();
    });

    it('should setup valueChanges subscription for sendEmailWhenRedeemed', () => {
      const addValidateSpy = jest.spyOn(component, 'addValidateFormControls');

      component.ngOnInit();

      // Test when value is true
      component.sendEmailWhenRedeemedControl?.setValue(true);
      expect(addValidateSpy).toHaveBeenCalled();
    });

    it('should remove validators when sendEmailWhenRedeemed is false', () => {
      const toEmailSpy = jest.spyOn(component.toEmailControl!, 'setValidators');
      const ccEmailSpy = jest.spyOn(component.ccEmailControl!, 'setValidators');
      const updateSpy = jest.spyOn(
        component.toEmailControl!,
        'updateValueAndValidity'
      );

      component.ngOnInit();
      component.sendEmailWhenRedeemedControl?.setValue(false);

      expect(toEmailSpy).toHaveBeenCalledWith([]);
      expect(ccEmailSpy).toHaveBeenCalledWith([]);
      expect(updateSpy).toHaveBeenCalled();
    });

    it('should setup valueChanges subscription for existingFormNameThai', () => {
      component.ngOnInit();

      // Test healthcare form
      component.existingFormNameThaiControl?.setValue(
        ExistingFormName.HEALTHCARE_FORM
      );
      expect(component.variablesTh).toEqual([...healthcareFormVariables]);

      // Test voucher form
      component.existingFormNameThaiControl?.setValue(
        ExistingFormName.VOUCHER_FORM
      );
      expect(component.variablesTh).toEqual([...voucherFormVariables]);

      // Test default case
      component.existingFormNameThaiControl?.setValue('OTHER');
      // Should not change variables
    });

    it('should setup valueChanges subscription for existingFormNameEnglish', () => {
      component.ngOnInit();

      // Test healthcare form
      component.existingFormNameEnglishControl?.setValue(
        ExistingFormName.HEALTHCARE_FORM
      );
      expect(component.variablesEn).toEqual([...healthcareFormVariables]);

      // Test voucher form
      component.existingFormNameEnglishControl?.setValue(
        ExistingFormName.VOUCHER_FORM
      );
      expect(component.variablesEn).toEqual([...voucherFormVariables]);
    });

    it('should reset form controls when form mode is not view', () => {
      component.formMode = 'create';
      const resetThaiHtmlSpy = jest.spyOn(
        component.emailBodyThaiHtmlTextControl!,
        'reset'
      );
      const resetThaiSpy = jest.spyOn(component.emailBodyThaiControl!, 'reset');
      const resetEnHtmlSpy = jest.spyOn(
        component.emailBodyEnglishHtmlTextControl!,
        'reset'
      );
      const resetEnSpy = jest.spyOn(
        component.emailBodyEnglishControl!,
        'reset'
      );

      component.ngOnInit();
      component.existingFormNameThaiControl?.setValue(
        ExistingFormName.HEALTHCARE_FORM
      );
      component.existingFormNameEnglishControl?.setValue(
        ExistingFormName.HEALTHCARE_FORM
      );

      expect(resetThaiHtmlSpy).toHaveBeenCalled();
      expect(resetThaiSpy).toHaveBeenCalled();
      expect(resetEnHtmlSpy).toHaveBeenCalled();
      expect(resetEnSpy).toHaveBeenCalled();
    });

    it('should not reset form controls when form mode is view', () => {
      component.formMode = 'view';
      const resetSpy = jest.spyOn(
        component.emailBodyThaiHtmlTextControl!,
        'reset'
      );

      component.ngOnInit();
      component.existingFormNameThaiControl?.setValue(
        ExistingFormName.HEALTHCARE_FORM
      );

      expect(resetSpy).not.toHaveBeenCalled();
    });
  });

  describe('Validators', () => {
    describe('bodyLengthValidator', () => {
      it('should return null for valid length', () => {
        const control = { value: 'short text' } as AbstractControl;
        const result = component.bodyLengthValidator(control, 'en');
        expect(result).toBeNull();
      });

      it('should return maxLength error for text exceeding 2000 characters', () => {
        const longText = 'a'.repeat(2001);
        const control = { value: longText } as AbstractControl;
        const result = component.bodyLengthValidator(control, 'en');
        expect(result).toEqual({ maxLength: true });
      });

      it('should handle HTML tags and convert them properly', () => {
        const htmlText = '<p>test</p><p>more</p>';
        const control = { value: htmlText } as AbstractControl;
        const result = component.bodyLengthValidator(control, 'en');
        expect(result).toBeNull();
      });

      it('should handle &nbsp; entities', () => {
        const textWithNbsp = 'test&nbsp;text';
        const control = { value: textWithNbsp } as AbstractControl;
        const result = component.bodyLengthValidator(control, 'en');
        expect(result).toBeNull();
      });

      it('should replace variables with their values when calculating length', () => {
        component.variablesEn = [{ value: 'Hello', code: '{GREETING}' }];
        const control = { value: '{GREETING} World' } as AbstractControl;
        const result = component.bodyLengthValidator(control, 'en');
        expect(result).toBeNull();
      });
    });

    describe('emailValidator', () => {
      it('should return null for empty value', () => {
        const control = { value: '' } as AbstractControl;
        const result = component.emailValidator(control);
        expect(result).toBeNull();
      });

      it('should return null for whitespace-only value', () => {
        const control = { value: '   ' } as AbstractControl;
        const result = component.emailValidator(control);
        expect(result).toBeNull();
      });

      it('should return null for valid single email', () => {
        const control = { value: 'test@example.com' } as AbstractControl;
        const result = component.emailValidator(control);
        expect(result).toBeNull();
      });

      it('should return null for valid multiple emails', () => {
        const control = {
          value: 'test@example.com;another@example.com',
        } as AbstractControl;
        const result = component.emailValidator(control);
        expect(result).toBeNull();
      });

      it('should return invalidEmail error for invalid email', () => {
        const control = { value: 'invalid-email' } as AbstractControl;
        const result = component.emailValidator(control);
        expect(result).toEqual({ invalidEmail: true });
      });

      it('should return invalidEmail error for mixed valid and invalid emails', () => {
        const control = {
          value: 'test@example.com;invalid-email',
        } as AbstractControl;
        const result = component.emailValidator(control);
        expect(result).toEqual({ invalidEmail: true });
      });

      it('should handle emails with extra whitespace', () => {
        const control = {
          value: ' test@example.com ; another@example.com ',
        } as AbstractControl;
        const result = component.emailValidator(control);
        expect(result).toBeNull();
      });
    });
  });

  describe('Editor Functions', () => {
    describe('onEditorTouched', () => {
      it('should mark English editor as touched', () => {
        const markTouchedSpy = jest.spyOn(
          component.emailBodyEnglishHtmlTextControl!,
          'markAsTouched'
        );

        component.onEditorTouched('en');

        expect(markTouchedSpy).toHaveBeenCalled();
      });

      it('should mark Thai editor as touched', () => {
        const markTouchedSpy = jest.spyOn(
          component.emailBodyThaiHtmlTextControl!,
          'markAsTouched'
        );

        component.onEditorTouched('th');

        expect(markTouchedSpy).toHaveBeenCalled();
      });

      it('should not mark as touched when control is disabled', () => {
        const markTouchedSpy = jest.spyOn(
          component.emailBodyEnglishHtmlTextControl!,
          'markAsTouched'
        );
        jest
          .spyOn(component.emailBodyEnglishHtmlTextControl!, 'disabled', 'get')
          .mockReturnValue(true);

        component.onEditorTouched('en');

        expect(markTouchedSpy).not.toHaveBeenCalled();
      });
    });

    describe('editorTextChange', () => {
      it('should update English control with converted text', () => {
        const patchSpy = jest.spyOn(
          component.emailBodyEnglishControl!,
          'patchValue'
        );
        const convertSpy = jest
          .spyOn(component, 'convertText')
          .mockReturnValue('converted text');

        const event = { htmlValue: '<p>test</p>' };
        component.editorTextChange(event, 'en');

        expect(convertSpy).toHaveBeenCalledWith('<p>test</p>', 'en');
        expect(patchSpy).toHaveBeenCalledWith('converted text');
      });

      it('should update Thai control with converted text', () => {
        const patchSpy = jest.spyOn(
          component.emailBodyThaiControl!,
          'patchValue'
        );
        const convertSpy = jest
          .spyOn(component, 'convertText')
          .mockReturnValue('converted text');

        const event = { htmlValue: '<p>test</p>' };
        component.editorTextChange(event, 'th');

        expect(convertSpy).toHaveBeenCalledWith('<p>test</p>', 'th');
        expect(patchSpy).toHaveBeenCalledWith('converted text');
      });
    });

    describe('convertText', () => {
      beforeEach(() => {
        component.variablesEn = [
          { value: 'Hello', code: '{GREETING}' },
          { value: 'World', code: '{WORLD}' },
        ];
        component.variablesTh = [
          { value: 'สวัสดี', code: '{GREETING_TH}' },
          { value: 'โลก', code: '{WORLD_TH}' },
        ];
      });

      it('should replace &nbsp; with spaces', () => {
        const result = component.convertText('test&nbsp;text', 'en');
        expect(result).toContain('test text');
      });

      it('should replace English variables with their codes', () => {
        const htmlText =
          '<span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">Hello</span>';
        const result = component.convertText(htmlText, 'en');
        expect(result).toBe('{GREETING}');
      });

      it('should replace Thai variables with their codes', () => {
        const htmlText =
          '<span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">สวัสดี</span>';
        const result = component.convertText(htmlText, 'th');
        expect(result).toBe('{GREETING_TH}');
      });

      it('should handle alternative background-color and color order', () => {
        const htmlText =
          '<span style="background-color: rgb(251, 234, 233); color: rgb(199, 43, 41);">Hello</span>';
        const result = component.convertText(htmlText, 'en');
        expect(result).toBe('{GREETING}');
      });

      it('should handle multiple variables in text', () => {
        const htmlText =
          '<span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">Hello</span> <span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">World</span>';
        const result = component.convertText(htmlText, 'en');
        expect(result).toBe('{GREETING} {WORLD}');
      });
    });

    describe('selectVariable', () => {
      it('should insert English variable at cursor position', () => {
        const variable = { value: 'Test Variable', code: '{TEST}' };
        const mockRange = { index: 5 };
        mockEditor.quill.getSelection.mockReturnValue(mockRange);

        const editorTextChangeSpy = jest.spyOn(component, 'editorTextChange');

        component.selectVariable(variable, 'en');

        expect(editorTextChangeSpy).toHaveBeenCalledWith(
          {
            htmlValue:
              '<p><span style="background-color: rgb(251, 234, 233); color: rgb(199, 43, 41);">Test Variable</span> </p>',
          },
          'en'
        );
      });

      it('should insert Thai variable at cursor position', () => {
        const variable = { value: 'ตัวแปรทดสอบ', code: '{TEST_TH}' };
        const mockRange = { index: 10 };
        mockEditor.quill.getSelection.mockReturnValue(mockRange);

        const editorTextChangeSpy = jest.spyOn(component, 'editorTextChange');

        component.selectVariable(variable, 'th');

        expect(editorTextChangeSpy).toHaveBeenCalledWith(
          {
            htmlValue:
              '<p><span style="background-color: rgb(251, 234, 233); color: rgb(199, 43, 41);">ตัวแปรทดสอบ</span> </p>',
          },
          'th'
        );
      });
    });
  });

  describe('Utility Functions', () => {
    describe('getDropdownValue', () => {
      it('should return correct value for existing code', () => {
        const options = [
          { code: 'A', value: 'Option A' },
          { code: 'B', value: 'Option B' },
        ];

        const result = component.getDropdownValue('A', options);
        expect(result).toBe('Option A');
      });

      it('should return empty string for non-existing code', () => {
        const options = [
          { code: 'A', value: 'Option A' },
          { code: 'B', value: 'Option B' },
        ];

        const result = component.getDropdownValue('C', options);
        expect(result).toBe('');
      });

      it('should return empty string for null code', () => {
        const options = [{ code: 'A', value: 'Option A' }];

        const result = component.getDropdownValue(null, options);
        expect(result).toBe('');
      });
    });

    describe('checkBodyLength', () => {
      beforeEach(() => {
        component.variablesEn = [{ value: 'Hello', code: '{GREETING}' }];
        component.variablesTh = [{ value: 'สวัสดี', code: '{GREETING_TH}' }];
      });

      it('should calculate English body length correctly', () => {
        component.emailBodyEnglishControl?.setValue(
          '<p>Hello World</p><p>Test</p>'
        );
        const result = component.checkBodyLength('en');
        expect(result).toBe(16); // "Hello World" + "1" (for </p>) + "Test" = 11 + 1 + 4 = 16
      });

      it('should calculate Thai body length correctly', () => {
        component.emailBodyThaiControl?.setValue('<p>สวัสดี</p>');
        const result = component.checkBodyLength('th');
        expect(result).toBe(6); // "สวัสดี" = 6 characters
      });

      it('should handle &nbsp; entities in body length calculation', () => {
        component.emailBodyEnglishControl?.setValue('test&nbsp;text');
        const result = component.checkBodyLength('en');
        expect(result).toBe(9); // "test text" = 9 characters
      });

      it('should handle HTML tags removal', () => {
        component.emailBodyEnglishControl?.setValue(
          '<strong>Bold</strong> text'
        );
        const result = component.checkBodyLength('en');
        expect(result).toBe(9); // "Bold text" = 9 characters
      });

      it('should replace variables with their values for length calculation', () => {
        component.emailBodyEnglishControl?.setValue('{GREETING} World');
        const result = component.checkBodyLength('en');
        expect(result).toBe(11); // "Hello World" = 11 characters
      });

      it('should handle empty or null values', () => {
        component.emailBodyEnglishControl?.setValue('');
        const result = component.checkBodyLength('en');
        expect(result).toBe(0);

        component.emailBodyEnglishControl?.setValue(null);
        const result2 = component.checkBodyLength('en');
        expect(result2).toBe(0);
      });
    });

    describe('addValidateFormControls', () => {
      it('should add validators to all required form controls', () => {
        const toEmailSpy = jest.spyOn(
          component.toEmailControl!,
          'setValidators'
        );
        const ccEmailSpy = jest.spyOn(
          component.ccEmailControl!,
          'setValidators'
        );
        const subjectEnSpy = jest.spyOn(
          component.emailSubjectEnglishControl!,
          'setValidators'
        );
        const subjectThSpy = jest.spyOn(
          component.emailSubjectThaiControl!,
          'setValidators'
        );
        const bodyEnSpy = jest.spyOn(
          component.emailBodyEnglishControl!,
          'setValidators'
        );
        const bodyThSpy = jest.spyOn(
          component.emailBodyThaiControl!,
          'setValidators'
        );

        component.addValidateFormControls();

        expect(toEmailSpy).toHaveBeenCalled();
        expect(ccEmailSpy).toHaveBeenCalled();
        expect(subjectEnSpy).toHaveBeenCalledWith([expect.any(Function)]);
        expect(subjectThSpy).toHaveBeenCalledWith([expect.any(Function)]);
        expect(bodyEnSpy).toHaveBeenCalled();
        expect(bodyThSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should properly unsubscribe on destroy', () => {
      const destroySpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined form controls gracefully', () => {
      component.formGroup = formBuilder.group({});

      expect(component.toEmailControl).toBeNull();
      expect(component.ccEmailControl).toBeNull();
      expect(() => component.onEditorTouched('en')).not.toThrow();
    });

    it('should handle missing variables array', () => {
      component.variablesEn = [];
      component.variablesTh = [];

      const result = component.convertText('<span>test</span>', 'en');
      expect(result).toBe('<span>test</span>');
    });

    it('should handle complex HTML in convertText', () => {
      const complexHtml = '<div><p>Test</p><span>More</span></div>';
      const result = component.convertText(complexHtml, 'en');
      expect(result).toBe(complexHtml.replace(/&nbsp;/g, ' '));
    });

    it('should handle form mode changes correctly', () => {
      component.formMode = 'edit';
      expect(component.formMode).toBe('edit');

      component.formMode = 'view';
      expect(component.formMode).toBe('view');
    });
  });
});
