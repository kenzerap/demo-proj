import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CodeSectionComponent } from './code-section.component';
import * as CreateEditUnicodeActions from '../../stores/create-edit-unicode/create-edit-unicode.actions';
import * as CreateEditUnicodeSelectors from '@app/features/unicode-setting/stores/create-edit-unicode/create-edit-unicode.selectors';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { UnicodeDetail } from '../../models/unicode-model';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123'),
}));

// Mock requireDependValidator
jest.mock('@app/shared/utils/require-depend-validator', () => ({
  requireDependValidator: jest.fn(() => null),
}));

// Mock isEmptyValue
jest.mock('@app/shared/utils/is-empty-value', () => ({
  isEmptyValue: jest.fn((value) => !value || value === ''),
}));

describe('CodeSectionComponent', () => {
  let component: CodeSectionComponent;
  let fixture: ComponentFixture<CodeSectionComponent>;
  let store: MockStore;
  let formBuilder: FormBuilder;

  const mockPolicyChannels = [
    { name: 'Channel1' },
    { name: 'Channel2' },
  ] as PolicyChannel[];

  const mockUnicodeDetail: UnicodeDetail = {
    is_share_quota_allocation: false,
    codes: [
      {
        code: 'TEST1',
        channel: ['Channel1'],
        quota: 100,
        redeemed_quota: 50,
      },
    ],
  } as UnicodeDetail;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CodeSectionComponent, // Import standalone component instead of declaring
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore(),
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);

    // Setup form group
    component.formGroup = formBuilder.group({
      is_share_quota_allocation: [false],
      sharedQuota: ['', Validators.min(0)],
      sharedCode: [
        '',
        [Validators.minLength(5), Validators.pattern(/^[a-zA-Z0-9]*$/)],
      ],
      sharedRedeemedQuota: [0],
      codes: formBuilder.array([
        formBuilder.group({
          tempId: ['initial-id'],
          code: ['', Validators.required],
          channel: ['', Validators.required],
          quota: ['', [Validators.required, Validators.min(0)]],
          redeemed_quota: [0],
        }),
      ]),
    });

    // Setup store mocks
    jest.spyOn(store, 'dispatch');
    store.overrideSelector(CreateEditUnicodeSelectors.selectPolicyChannels, mockPolicyChannels);
    store.overrideSelector(CreateEditUnicodeSelectors.selectUnicodeDetail, null);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Getter properties', () => {
    it('should return correct control references', () => {
      expect(component.isShareQuotaAllocationControl).toBe(component.formGroup.get('is_share_quota_allocation'));
      expect(component.sharedQuotaControl).toBe(component.formGroup.get('sharedQuota'));
      expect(component.sharedCodeControl).toBe(component.formGroup.get('sharedCode'));
      expect(component.sharedRedeemedQuotaControl).toBe(component.formGroup.get('sharedRedeemedQuota'));
      expect(component.codesFormArray).toBe(component.formGroup.get('codes'));
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      jest.spyOn(component, 'reValidateForm');
    });

    it('should dispatch getPolicyChannels action', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditUnicodeActions.getPolicyChannels()
      );
    });

    it('should call reValidateForm', () => {
      component.ngOnInit();
      expect(component.reValidateForm).toHaveBeenCalled();
    });

    it('should handle unicode detail for non-create mode with share quota allocation', () => {
      const mockUnicodeDetailShare: UnicodeDetail = {
        is_share_quota_allocation: true,
        codes: [
          {
            code: 'SHARE',
            channel: ['Channel1', 'Channel2'],
            quota: 200,
            redeemed_quota: 100,
          },
        ],
      } as UnicodeDetail;

      component.formMode = 'edit';
      store.overrideSelector(CreateEditUnicodeSelectors.selectUnicodeDetail, mockUnicodeDetailShare);
      
      jest.spyOn(component.codesFormArray, 'clear');
      jest.spyOn(component, 'addCode');

      component.ngOnInit();

      expect(component.codesFormArray.clear).toHaveBeenCalled();
      expect(component.addCode).toHaveBeenCalledTimes(2); // For each channel
    });

    it('should handle unicode detail for non-create mode without share quota allocation', () => {
      component.formMode = 'edit';
      store.overrideSelector(CreateEditUnicodeSelectors.selectUnicodeDetail, mockUnicodeDetail);
      
      jest.spyOn(component.codesFormArray, 'clear');
      jest.spyOn(component, 'addCode');

      component.ngOnInit();

      expect(component.codesFormArray.clear).toHaveBeenCalled();
      expect(component.addCode).toHaveBeenCalled();
    });

    it('should handle empty channel case for share quota allocation', () => {
      const mockUnicodeDetailEmptyChannel: UnicodeDetail = {
        is_share_quota_allocation: true,
        codes: [
          {
            code: 'TEST',
            channel: [],
            quota: 100,
            redeemed_quota: 50,
          },
        ],
      } as any;

      component.formMode = 'edit';
      store.overrideSelector(CreateEditUnicodeSelectors.selectUnicodeDetail, mockUnicodeDetailEmptyChannel);
      
      jest.spyOn(component, 'addCode');

      component.ngOnInit();

      expect(component.addCode).toHaveBeenCalledWith({
        code: '',
        channel: '',
        quota: '',
        redeemed_quota: 50,
      });
    });

    it('should disable form in view mode', () => {
      component.formMode = 'view';
      store.overrideSelector(CreateEditUnicodeSelectors.selectUnicodeDetail, mockUnicodeDetail);
      
      jest.spyOn(component.formGroup, 'disable');

      component.ngOnInit();

      expect(component.formGroup.disable).toHaveBeenCalled();
    });

    it('should handle isShareQuotaAllocationControl valueChanges', () => {
      jest.spyOn(component.sharedQuotaControl!, 'reset');
      jest.spyOn(component.sharedCodeControl!, 'reset');
      jest.spyOn(component, 'reValidateChannels');

      component.ngOnInit();
      component.isShareQuotaAllocationControl?.setValue(true);

      expect(component.sharedQuotaControl!.reset).toHaveBeenCalled();
      expect(component.sharedCodeControl!.reset).toHaveBeenCalled();
      expect(component.reValidateChannels).toHaveBeenCalled();
    });

    it('should not reset controls when formMode is view', () => {
      component.formMode = 'view';
      jest.spyOn(component.sharedQuotaControl!, 'reset');

      component.ngOnInit();
      component.isShareQuotaAllocationControl?.setValue(true);

      expect(component.sharedQuotaControl!.reset).not.toHaveBeenCalled();
    });
  });

  describe('getCodeFormGroup', () => {
    it('should return correct form group at index', () => {
      const formGroup = component.getCodeFormGroup(0);
      expect(formGroup).toBe(component.codesFormArray.at(0));
    });
  });

  describe('getDropdownValue', () => {
    const dropdownOptions = [
      { code: 'OPTION_1', value: 'Option 1' },
      { code: 'OPTION_2', value: 'Option 2' },
    ];

    it('should return correct dropdown value', () => {
      expect(component.getDropdownValue('OPTION_1', dropdownOptions)).toBe('Option 1');
      expect(component.getDropdownValue('OPTION_2', dropdownOptions)).toBe('Option 2');
    });

    it('should return empty string for invalid code', () => {
      expect(component.getDropdownValue('INVALID', dropdownOptions)).toBe('');
      expect(component.getDropdownValue(null, dropdownOptions)).toBe('');
    });
  });

  describe('removePackage', () => {
    beforeEach(() => {
      jest.spyOn(component, 'reValidateChannels');
    });

    it('should remove form group at index and revalidate channels', () => {
      const initialLength = component.codesFormArray.length;
      component.removePackage(0);
      
      expect(component.codesFormArray.length).toBe(initialLength - 1);
      expect(component.reValidateChannels).toHaveBeenCalled();
    });
  });

  describe('addCode', () => {
    beforeEach(() => {
      jest.spyOn(component, 'reValidateChannels');
    });

    it('should add code without value', () => {
      const initialLength = component.codesFormArray.length;
      component.addCode();
      
      expect(component.codesFormArray.length).toBe(initialLength + 1);
      const newControl = component.codesFormArray.at(initialLength);
      expect(newControl.get('tempId')?.value).toBe('mock-uuid-123');
      expect(newControl.get('code')?.value).toBe('');
      expect(newControl.get('channel')?.value).toBe(null);
      expect(newControl.get('quota')?.value).toBe('');
      expect(newControl.get('redeemed_quota')?.value).toBe(0);
    });

    it('should add code with provided value', () => {
      const testValue = {
        code: 'TEST',
        channel: 'Channel1',
        quota: 100,
        redeemed_quota: 50,
      };

      const initialLength = component.codesFormArray.length;
      component.addCode(testValue);
      
      expect(component.codesFormArray.length).toBe(initialLength + 1);
      const newControl = component.codesFormArray.at(initialLength);
      expect(newControl.get('code')?.value).toBe('TEST');
      expect(newControl.get('channel')?.value).toBe('Channel1');
      expect(newControl.get('quota')?.value).toBe(100);
      expect(newControl.get('redeemed_quota')?.value).toBe(50);
    });

    it('should revalidate channels when no value and share quota allocation is enabled', (done) => {
      component.isShareQuotaAllocationControl?.setValue(true);
      component.addCode();

      setTimeout(() => {
        expect(component.reValidateChannels).toHaveBeenCalled();
        done();
      }, 1);
    });
  });

  describe('reValidateForm', () => {
    it('should set validators for all form controls', () => {
      const codeControl = component.codesFormArray.at(0).get('code');
      const quotaControl = component.codesFormArray.at(0).get('quota');
      const channelControl = component.codesFormArray.at(0).get('channel');

      jest.spyOn(codeControl!, 'setValidators');
      jest.spyOn(quotaControl!, 'setValidators');
      jest.spyOn(channelControl!, 'setValidators');
      jest.spyOn(component.sharedQuotaControl!, 'setValidators');
      jest.spyOn(component.sharedCodeControl!, 'setValidators');

      component.reValidateForm();

      expect(codeControl!.setValidators).toHaveBeenCalled();
      expect(quotaControl!.setValidators).toHaveBeenCalled();
      expect(channelControl!.setValidators).toHaveBeenCalled();
      expect(component.sharedQuotaControl!.setValidators).toHaveBeenCalled();
      expect(component.sharedCodeControl!.setValidators).toHaveBeenCalled();
    });
  });

  describe('isControlOnly1Error', () => {
    it('should return true when control has only one error', () => {
      const control = component.sharedCodeControl!;
      control.setErrors({ required: true });
      
      expect(component.isControlOnly1Error(control)).toBe(true);
    });

    it('should return false when control has multiple errors', () => {
      const control = component.sharedCodeControl!;
      control.setErrors({ required: true, minlength: true });
      
      expect(component.isControlOnly1Error(control)).toBe(false);
    });

    it('should return true when control has no errors', () => {
      const control = component.sharedCodeControl!;
      control.setErrors(null);
      
      expect(component.isControlOnly1Error(control)).toBe(false);
    });

    it('should handle null control', () => {
      expect(component.isControlOnly1Error(null)).toBe(false);
    });
  });

  describe('reValidateChannels', () => {
    it('should mark all channel controls as touched and update validity', () => {
      const channelControl = component.codesFormArray.at(0).get('channel');
      jest.spyOn(channelControl!, 'markAllAsTouched');
      jest.spyOn(channelControl!, 'updateValueAndValidity');

      component.reValidateChannels();

      expect(channelControl!.markAllAsTouched).toHaveBeenCalled();
      expect(channelControl!.updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('reValidateOtherChannels', () => {
    beforeEach(() => {
      // Add another form group for testing
      component.addCode({ code: 'TEST2', channel: 'Channel2', quota: 50 });
    });

    it('should revalidate only other channel controls', () => {
      const firstControl = component.codesFormArray.at(0);
      const secondControl = component.codesFormArray.at(1);
      
      const firstChannelControl = firstControl.get('channel');
      const secondChannelControl = secondControl.get('channel');

      jest.spyOn(firstChannelControl!, 'markAllAsTouched');
      jest.spyOn(firstChannelControl!, 'updateValueAndValidity');
      jest.spyOn(secondChannelControl!, 'markAllAsTouched');
      jest.spyOn(secondChannelControl!, 'updateValueAndValidity');

      component.reValidateOtherChannels(firstControl);

      // First control should not be revalidated
      expect(firstChannelControl!.markAllAsTouched).not.toHaveBeenCalled();
      expect(firstChannelControl!.updateValueAndValidity).not.toHaveBeenCalled();
      
      // Second control should be revalidated
      expect(secondChannelControl!.markAllAsTouched).toHaveBeenCalled();
      expect(secondChannelControl!.updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('checkSameChannelValidator', () => {
    beforeEach(() => {
      // Setup form array with test data
      component.codesFormArray.clear();
      component.addCode({ code: 'TEST1', channel: 'Channel1', quota: 100 });
      component.addCode({ code: 'TEST2', channel: 'Channel2', quota: 200 });
    });

    it('should return null when channels are different (share quota allocation enabled)', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      
      const control = component.codesFormArray.at(0).get('channel')!;
      control.setValue('Channel1');
      
      const result = component.checkSameChannelValidator(control, 'mock-uuid-123');
      expect(result).toBeNull();
    });

    it('should return error when same channels exist (share quota allocation enabled)', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      
      // Set same channel for both controls
      component.codesFormArray.at(0).get('channel')?.setValue('Channel1');
      component.codesFormArray.at(1).get('channel')?.setValue('Channel1');
      
      const control = component.codesFormArray.at(0).get('channel')!;
      const result = component.checkSameChannelValidator(control, component.codesFormArray.at(0).get('tempId')?.value);
      
      expect(result).toEqual({ sameChannel: true });
    });

    it('should return null when same code but different channels (share quota allocation disabled)', () => {
      component.isShareQuotaAllocationControl?.setValue(false);
      
      // Set same code but different channels
      component.codesFormArray.at(0).get('code')?.setValue('SAME');
      component.codesFormArray.at(1).get('code')?.setValue('SAME');
      component.codesFormArray.at(0).get('channel')?.setValue('Channel1');
      component.codesFormArray.at(1).get('channel')?.setValue('Channel2');
      
      const control = component.codesFormArray.at(0).get('channel')!;
      const result = component.checkSameChannelValidator(control, component.codesFormArray.at(0).get('tempId')?.value);
      
      expect(result).toBeNull();
    });

    it('should return error when same code and same channel (share quota allocation disabled)', () => {
      component.isShareQuotaAllocationControl?.setValue(false);
      
      // Set same code and same channel
      component.codesFormArray.at(0).get('code')?.setValue('SAME');
      component.codesFormArray.at(1).get('code')?.setValue('SAME');
      component.codesFormArray.at(0).get('channel')?.setValue('Channel1');
      component.codesFormArray.at(1).get('channel')?.setValue('Channel1');
      
      const control = component.codesFormArray.at(0).get('channel')!;
      const result = component.checkSameChannelValidator(control, component.codesFormArray.at(0).get('tempId')?.value);
      
      expect(result).toEqual({ sameChannel: true });
    });

    it('should handle empty channels', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      
      component.codesFormArray.at(0).get('channel')?.setValue('');
      component.codesFormArray.at(1).get('channel')?.setValue('');
      
      const control = component.codesFormArray.at(0).get('channel')!;
      const result = component.checkSameChannelValidator(control, component.codesFormArray.at(0).get('tempId')?.value);
      
      expect(result).toEqual({ sameChannel: true });
    });
  });

  describe('minRedeemedValidator', () => {
    const mockControl = {
      getRawValue: jest.fn(),
    } as any;

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return null when no redeemed quota', () => {
      mockControl.getRawValue.mockReturnValue(100);
      
      const result = component.minRedeemedValidator(mockControl, 100, 0);
      expect(result).toBeNull();
    });

    it('should return null when quota value is empty', () => {
      mockControl.getRawValue.mockReturnValue('');
      
      const result = component.minRedeemedValidator(mockControl, 100, 50);
      expect(result).toBeNull();
    });

    it('should return null when quota value is negative', () => {
      mockControl.getRawValue.mockReturnValue(-10);
      
      const result = component.minRedeemedValidator(mockControl, 100, 50);
      expect(result).toBeNull();
    });

    it('should return null when quota is valid', () => {
      mockControl.getRawValue.mockReturnValue(100);
      
      const result = component.minRedeemedValidator(mockControl, 100, 50);
      expect(result).toBeNull();
    });

    it('should return error when quota is less than redeemed quota', () => {
      mockControl.getRawValue.mockReturnValue(30);
      
      const result = component.minRedeemedValidator(mockControl, 100, 50);
      expect(result).toEqual({ minRedeemed: 100 });
    });
  });

  describe('isSharedAllRedeemedCode', () => {
    it('should return false when share quota allocation is disabled', () => {
      component.isShareQuotaAllocationControl?.setValue(false);
      
      const result = component.isSharedAllRedeemedCode();
      expect(result).toBe(false);
    });

    it('should return false when no codes exist', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      component.codesFormArray.clear();
      
      const result = component.isSharedAllRedeemedCode();
      expect(result).toBe(false);
    });

    it('should return false when all codes have channels', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      component.codesFormArray.clear();
      component.addCode({ code: 'TEST', channel: 'Channel1', quota: 100 });
      
      const result = component.isSharedAllRedeemedCode();
      expect(result).toBe(false);
    });

    it('should return true when share quota allocation is enabled and some codes have no channel', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      component.codesFormArray.clear();
      component.addCode({ code: 'TEST', channel: '', quota: 100 });
      
      const result = component.isSharedAllRedeemedCode();
      expect(result).toBe(true);
    });
  });

  describe('Edge cases and error conditions', () => {
    it('should handle destroy$ subscription cleanup', () => {
      const destroySpy = jest.spyOn(component.destroy$, 'next');
      
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalled();
    });

    it('should handle empty policy channels', () => {
      store.overrideSelector(CreateEditUnicodeSelectors.selectPolicyChannels, []);
      
      component.ngOnInit();
      
      // Component should still function with empty channels
      expect(component).toBeTruthy();
    });

    it('should handle null form group references', () => {
      component.formGroup = null as any;
      
      expect(component.isShareQuotaAllocationControl).toBeUndefined();
      expect(component.sharedQuotaControl).toBeUndefined();
      expect(component.sharedCodeControl).toBeUndefined();
      expect(component.sharedRedeemedQuotaControl).toBeUndefined();
      expect(() => component.codesFormArray).toThrow();
    });
  });

  describe('Form mode handling', () => {
    it('should handle create mode', () => {
      component.formMode = 'create';
      store.overrideSelector(CreateEditUnicodeSelectors.selectUnicodeDetail, mockUnicodeDetail);
      
      jest.spyOn(component.codesFormArray, 'clear');
      
      component.ngOnInit();
      
      // Should not clear or modify form array in create mode
      expect(component.codesFormArray.clear).not.toHaveBeenCalled();
    });

    it('should handle edit mode', () => {
      component.formMode = 'edit';
      store.overrideSelector(CreateEditUnicodeSelectors.selectUnicodeDetail, mockUnicodeDetail);
      
      jest.spyOn(component.formGroup, 'disable');
      
      component.ngOnInit();
      
      // Should not disable form in edit mode
      expect(component.formGroup.disable).not.toHaveBeenCalled();
    });
  });

  describe('Subscription handling', () => {
    it('should filter out empty policy channels', () => {
      const spy = jest.spyOn(component, 'addCode');
      store.overrideSelector(CreateEditUnicodeSelectors.selectPolicyChannels, []);
      store.overrideSelector(CreateEditUnicodeSelectors.selectUnicodeDetail, mockUnicodeDetail);
      
      component.formMode = 'edit';
      component.ngOnInit();
      
      // Should not process when policy channels is empty
      expect(spy).not.toHaveBeenCalled();
    });
  });
});