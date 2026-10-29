import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CodeSectionComponent } from './code-section.component';
import * as CreateEditPromocodeActions from '../../stores/create-edit-promocode/create-edit-promocode.actions';
import * as CreateEditPromocodeSelectors from '../../stores/create-edit-promocode/create-edit-promocode.selectors';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { PromocodeDetail } from '../../models/promocode-model';

describe('CodeSectionComponent', () => {
  let component: CodeSectionComponent;
  let fixture: ComponentFixture<CodeSectionComponent>;
  let store: MockStore;
  let formBuilder: FormBuilder;
  let mockChangeDetectorRef: jest.Mocked<ChangeDetectorRef>;

  // Fixed PolicyChannel model - based on the component usage, system_id should be number or string
  const mockPolicyChannels: PolicyChannel[] = [
    { name: 'Agent', system_id: 1, channel_code: 'AGT', free_look_period: 15 },
    {
      name: 'Bancassurance',
      system_id: 2,
      channel_code: 'BCA',
      free_look_period: 30,
    },
    { name: 'Digital', system_id: 3, channel_code: 'DIG', free_look_period: 7 },
  ] as any[];

  // Fixed PromocodeDetail model - added missing required fields
  const mockPromocodeDetail: PromocodeDetail = {
    promocode_id: 1,
    name: 'Test Promocode',
    description: 'Test Description',
    is_share_quota_allocation: false,
    start_date: '2024-01-01',
    start_time: '00:00',
    end_date: '2024-12-31',
    end_time: '23:59',
    is_point: true,
    is_privilege: false,
    earning_point: [{ point: 100, expire_date: '2025-01-01' }], // Fixed: should be array
    is_advance_reward: false,
    is_special_condition_fraud_user: false,
    fraud_condition_point: 0,
    fraud_condition_point_expire_date: '',
    privilege: null,
    privilege_details: [], // Added missing field
    customer_tiers: [],
    customer_segments: [],
    redeem_limit: [
      {
        redeem_condition: 'PER_PRIVILEGE',
        redeem_quota: 1,
      },
    ], // Fixed: should be array with proper structure
    is_advance_limit: false,
    codes: [
      {
        code: 'TEST123',
        channel: ['Agent'],
        quota: 100,
        redeemed_quota: 50,
      },
    ],
  } as any;

  beforeEach(async () => {
    mockChangeDetectorRef = {
      detectChanges: jest.fn(),
      markForCheck: jest.fn(),
      detach: jest.fn(),
      reattach: jest.fn(),
      checkNoChanges: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CodeSectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore(),
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);

    // Setup form group with all required controls
    component.formGroup = formBuilder.group({
      is_share_quota_allocation: [false],
      sharedQuota: ['', Validators.min(0)],
      sharedCode: [''],
      sharedRedeemedQuota: [0],
      codes: formBuilder.array([
        formBuilder.group({
          tempId: ['temp-1'],
          code: ['', Validators.required],
          channel: ['', Validators.required],
          quota: ['', [Validators.required, Validators.min(0)]],
          redeemed_quota: [0],
        }),
      ]),
    });

    // Mock selectors
    store.overrideSelector(
      CreateEditPromocodeSelectors.selectPolicyChannels,
      mockPolicyChannels
    );
    store.overrideSelector(
      CreateEditPromocodeSelectors.selectPromocodeDetail,
      null
    );

    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getPolicyChannels on ngOnInit', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      CreateEditPromocodeActions.getPolicyChannels()
    );
  });

  describe('Form Controls Getters', () => {
    it('should get isShareQuotaAllocationControl', () => {
      expect(component.isShareQuotaAllocationControl).toBe(
        component.formGroup.get('is_share_quota_allocation')
      );
    });

    it('should get sharedQuotaControl', () => {
      expect(component.sharedQuotaControl).toBe(
        component.formGroup.get('sharedQuota')
      );
    });

    it('should get sharedCodeControl', () => {
      expect(component.sharedCodeControl).toBe(
        component.formGroup.get('sharedCode')
      );
    });

    it('should get sharedRedeemedQuotaControl', () => {
      expect(component.sharedRedeemedQuotaControl).toBe(
        component.formGroup.get('sharedRedeemedQuota')
      );
    });

    it('should get codesFormArray', () => {
      expect(component.codesFormArray).toBe(
        component.formGroup.get('codes') as FormArray
      );
    });
  });

  describe('channelOptions$ observable', () => {
    it('should map policy channels to ValueCode array', (done) => {
      component.channelOptions$.subscribe((options) => {
        expect(options).toEqual([
          { code: 'Agent', value: 'Agent' },
          { code: 'Bancassurance', value: 'Bancassurance' },
          { code: 'Digital', value: 'Digital' },
        ]);
        done();
      });
    });
  });

  describe('ngOnInit', () => {
    it('should handle edit mode with shared quota allocation', fakeAsync(() => {
      const mockDetailWithSharedQuota: PromocodeDetail = {
        ...mockPromocodeDetail,
        is_share_quota_allocation: true,
        codes: [
          {
            code: 'SHARED123',
            channel: ['Agent', 'Bancassurance'],
            quota: 200,
            redeemed_quota: 100,
          },
        ],
      };

      component.formMode = 'edit';
      store.overrideSelector(
        CreateEditPromocodeSelectors.selectPromocodeDetail,
        mockDetailWithSharedQuota
      );

      component.ngOnInit();
      tick();

      expect(component.codesFormArray.length).toBe(2);
    }));

    it('should handle edit mode with shared quota allocation and empty channel', fakeAsync(() => {
      const mockDetailWithEmptyChannel: PromocodeDetail = {
        ...mockPromocodeDetail,
        is_share_quota_allocation: true,
        codes: [
          {
            code: 'SHARED123',
            channel: [],
            quota: 200,
            redeemed_quota: 100,
          },
        ],
      };

      component.formMode = 'edit';
      store.overrideSelector(
        CreateEditPromocodeSelectors.selectPromocodeDetail,
        mockDetailWithEmptyChannel
      );

      component.ngOnInit();
      tick();

      expect(component.codesFormArray.length).toBe(1);
      const firstCode = component.codesFormArray.at(0).value;
      expect(firstCode.channel).toBe('');
    }));

    it('should handle edit mode without shared quota allocation', fakeAsync(() => {
      component.formMode = 'edit';
      store.overrideSelector(
        CreateEditPromocodeSelectors.selectPromocodeDetail,
        mockPromocodeDetail
      );

      component.ngOnInit();
      tick();

      expect(component.codesFormArray.length).toBe(1);
      const firstCode = component.codesFormArray.at(0).value;
      expect(firstCode.code).toBe('TEST123');
      expect(firstCode.channel).toBe('Agent');
    }));

    it('should handle view mode and disable form', fakeAsync(() => {
      component.formMode = 'view';
      store.overrideSelector(
        CreateEditPromocodeSelectors.selectPromocodeDetail,
        mockPromocodeDetail
      );
      const disableSpy = jest.spyOn(component.formGroup, 'disable');

      component.ngOnInit();
      tick();

      expect(disableSpy).toHaveBeenCalled();
    }));

    it('should handle isShareQuotaAllocationControl value changes', fakeAsync(() => {
      component.formMode = 'edit';
      const resetQuotaSpy = jest.spyOn(
        component.codesFormArray.at(0).get('quota')!,
        'reset'
      );
      const resetCodeSpy = jest.spyOn(
        component.codesFormArray.at(0).get('code')!,
        'reset'
      );
      const reValidateChannelsSpy = jest.spyOn(component, 'reValidateChannels');

      component.ngOnInit();
      component.isShareQuotaAllocationControl?.setValue(true);
      tick();

      expect(resetQuotaSpy).toHaveBeenCalled();
      expect(resetCodeSpy).toHaveBeenCalled();
      expect(reValidateChannelsSpy).toHaveBeenCalled();
    }));

    it('should not handle value changes in view mode', fakeAsync(() => {
      component.formMode = 'view';
      const resetSpy = jest.spyOn(
        component.codesFormArray.at(0).get('quota')!,
        'reset'
      );

      component.ngOnInit();
      component.isShareQuotaAllocationControl?.setValue(true);
      tick();

      expect(resetSpy).not.toHaveBeenCalled();
    }));

    it('should not update form in create mode', fakeAsync(() => {
      component.formMode = 'create';
      const clearSpy = jest.spyOn(component.codesFormArray, 'clear');

      component.ngOnInit();
      tick();

      expect(clearSpy).not.toHaveBeenCalled();
    }));
  });

  describe('addCode', () => {
    it('should add a new code with provided value', () => {
      const testValue = {
        code: 'TEST456',
        channel: 'Digital',
        quota: 50,
        redeemed_quota: 10,
      };

      component.addCode(testValue);

      expect(component.codesFormArray.length).toBe(2);
      const newCode = component.codesFormArray.at(1).value;
      expect(newCode.code).toBe('TEST456');
      expect(newCode.channel).toBe('Digital');
      expect(newCode.quota).toBe(50);
      expect(newCode.redeemed_quota).toBe(10);
      expect(newCode.tempId).toBeDefined();
    });

    it('should add a new code with default values when no value provided', () => {
      component.addCode();

      expect(component.codesFormArray.length).toBe(2);
      const newCode = component.codesFormArray.at(1).value;
      expect(newCode.code).toBe('');
      expect(newCode.channel).toBeNull();
      expect(newCode.quota).toBe('');
      expect(newCode.redeemed_quota).toBe(0);
    });

    it('should call reValidateChannels when adding code with shared quota allocation', fakeAsync(() => {
      component.isShareQuotaAllocationControl?.setValue(true);
      const reValidateChannelsSpy = jest.spyOn(component, 'reValidateChannels');

      component.addCode();
      tick();

      expect(reValidateChannelsSpy).toHaveBeenCalled();
    }));

    it('should not call reValidateChannels when adding code with value', fakeAsync(() => {
      component.isShareQuotaAllocationControl?.setValue(true);
      const reValidateChannelsSpy = jest.spyOn(component, 'reValidateChannels');

      component.addCode({ code: 'TEST', channel: 'Agent', quota: 10 });
      tick();

      expect(reValidateChannelsSpy).not.toHaveBeenCalled();
    }));
  });

  describe('removePackage', () => {
    it('should remove code at specified index', () => {
      component.addCode({ code: 'TEST', channel: 'Agent', quota: 10 });
      const reValidateChannelsSpy = jest.spyOn(component, 'reValidateChannels');

      component.removePackage(1);

      expect(component.codesFormArray.length).toBe(1);
      expect(reValidateChannelsSpy).toHaveBeenCalled();
    });
  });

  describe('getCodeFormGroup', () => {
    it('should return FormGroup at specified index', () => {
      const formGroup = component.getCodeFormGroup(0);
      expect(formGroup).toBeInstanceOf(FormGroup);
      expect(formGroup).toBe(component.codesFormArray.at(0) as any);
    });
  });

  describe('reValidateForm', () => {
    it('should set validators for all form controls', () => {
      component.reValidateForm();

      const codeControl = component.codesFormArray.at(0).get('code');
      const quotaControl = component.codesFormArray.at(0).get('quota');
      const channelControl = component.codesFormArray.at(0).get('channel');

      expect(codeControl?.validator).toBeDefined();
      expect(quotaControl?.validator).toBeDefined();
      expect(channelControl?.validator).toBeDefined();
      expect(component.sharedQuotaControl?.validator).toBeDefined();
      expect(component.sharedCodeControl?.validator).toBeDefined();
    });
  });

  describe('reValidateChannels', () => {
    it('should mark all channel controls as touched and update validity', () => {
      const channelControl = component.codesFormArray.at(0).get('channel');
      const markAllAsTouchedSpy = jest.spyOn(
        channelControl!,
        'markAllAsTouched'
      );
      const updateValueAndValiditySpy = jest.spyOn(
        channelControl!,
        'updateValueAndValidity'
      );

      component.reValidateChannels();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    });
  });

  describe('reValidateOtherChannels', () => {
    it('should validate other channels except the current row', () => {
      component.addCode({ code: 'TEST', channel: 'Agent', quota: 10 });
      const rowControl = component.codesFormArray.at(0);
      const otherChannelControl = component.codesFormArray.at(1).get('channel');
      const markAllAsTouchedSpy = jest.spyOn(
        otherChannelControl!,
        'markAllAsTouched'
      );

      component.reValidateOtherChannels(rowControl);

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('should not validate the same channel control', () => {
      component.addCode({ code: 'TEST', channel: 'Agent', quota: 10 });
      const rowControl = component.codesFormArray.at(0);
      const sameChannelControl = component.codesFormArray.at(0).get('channel');
      const markAllAsTouchedSpy = jest.spyOn(
        sameChannelControl!,
        'markAllAsTouched'
      );

      component.reValidateOtherChannels(rowControl);

      expect(markAllAsTouchedSpy).not.toHaveBeenCalled();
    });
  });

  describe('checkSameChannelValidator', () => {
    beforeEach(() => {
      // Clear existing codes and add test data
      component.codesFormArray.clear();
      component.addCode({
        code: 'CODE1',
        channel: 'Agent',
        quota: 10,
        redeemed_quota: 0,
      });
      component.addCode({
        code: 'CODE2',
        channel: 'Bancassurance',
        quota: 20,
        redeemed_quota: 0,
      });
    });

    it('should return sameChannel error for shared quota allocation with duplicate channels', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      const control = component.codesFormArray.at(0).get('channel')!;
      control.setValue('Agent');
      component.codesFormArray.at(1).get('channel')!.setValue('Agent');

      const result = component.checkSameChannelValidator(
        control,
        component.codesFormArray.at(0).get('tempId')!.value
      );

      expect(result).toEqual({ sameChannel: true });
    });

    it('should return null for shared quota allocation with different channels', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      const control = component.codesFormArray.at(0).get('channel')!;
      control.setValue('Agent');

      const result = component.checkSameChannelValidator(
        control,
        component.codesFormArray.at(0).get('tempId')!.value
      );

      expect(result).toBeNull();
    });

    it('should return sameChannel error for non-shared quota with same code and channel', () => {
      component.isShareQuotaAllocationControl?.setValue(false);
      const control = component.codesFormArray.at(0).get('channel')!;
      control.setValue('Agent');
      component.codesFormArray.at(0).get('code')!.setValue('SAME_CODE');
      component.codesFormArray.at(1).get('code')!.setValue('SAME_CODE');
      component.codesFormArray.at(1).get('channel')!.setValue('Agent');

      const result = component.checkSameChannelValidator(
        control,
        component.codesFormArray.at(0).get('tempId')!.value
      );

      expect(result).toEqual({ sameChannel: true });
    });

    it('should return null for non-shared quota with different codes', () => {
      component.isShareQuotaAllocationControl?.setValue(false);
      const control = component.codesFormArray.at(0).get('channel')!;
      control.setValue('Agent');

      const result = component.checkSameChannelValidator(
        control,
        component.codesFormArray.at(0).get('tempId')!.value
      );

      expect(result).toBeNull();
    });

    it('should handle empty channel values in shared quota allocation', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      const control = component.codesFormArray.at(0).get('channel')!;
      control.setValue('');
      component.codesFormArray.at(1).get('channel')!.setValue('');

      const result = component.checkSameChannelValidator(
        control,
        component.codesFormArray.at(0).get('tempId')!.value
      );

      expect(result).toEqual({ sameChannel: true });
    });

    it('should handle null channel values in shared quota allocation', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      const control = component.codesFormArray.at(0).get('channel')!;
      control.setValue(null);
      component.codesFormArray.at(1).get('channel')!.setValue(null);

      const result = component.checkSameChannelValidator(
        control,
        component.codesFormArray.at(0).get('tempId')!.value
      );

      expect(result).toEqual({ sameChannel: true });
    });

    it('should handle whitespace-only channel values', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      const control = component.codesFormArray.at(0).get('channel')!;
      control.setValue('   ');
      component.codesFormArray.at(1).get('channel')!.setValue('   ');

      const result = component.checkSameChannelValidator(
        control,
        component.codesFormArray.at(0).get('tempId')!.value
      );

      expect(result).toEqual({ sameChannel: true });
    });
  });

  describe('minRedeemedValidator', () => {
    it('should return null when redeemed_quota is empty', () => {
      const control = { getRawValue: () => '100' } as any;
      const result = component.minRedeemedValidator(control, 50, '');

      expect(result).toBeNull();
    });

    it('should return null when redeemed_quota is null', () => {
      const control = { getRawValue: () => '100' } as any;
      const result = component.minRedeemedValidator(control, 50, null as any);

      expect(result).toBeNull();
    });

    it('should return null when redeemed_quota is undefined', () => {
      const control = { getRawValue: () => '100' } as any;
      const result = component.minRedeemedValidator(
        control,
        50,
        undefined as any
      );

      expect(result).toBeNull();
    });

    it('should return null when quota value is empty', () => {
      const control = { getRawValue: () => '' } as any;
      const result = component.minRedeemedValidator(control, 50, 25);

      expect(result).toBeNull();
    });

    it('should return null when quota value is null', () => {
      const control = { getRawValue: () => null } as any;
      const result = component.minRedeemedValidator(control, 50, 25);

      expect(result).toBeNull();
    });

    it('should return null when quota value is negative', () => {
      const control = { getRawValue: () => '-10' } as any;
      const result = component.minRedeemedValidator(control, 50, 25);

      expect(result).toBeNull();
    });

    it('should return minRedeemed error when quota is less than max quota with redeemed quota', () => {
      const control = { getRawValue: () => '30' } as any;
      const result = component.minRedeemedValidator(control, 50, 25);

      expect(result).toEqual({ minRedeemed: 50 });
    });

    it('should return null when quota is greater than or equal to max quota', () => {
      const control = { getRawValue: () => '60' } as any;
      const result = component.minRedeemedValidator(control, 50, 25);

      expect(result).toBeNull();
    });

    it('should return null when quota equals max quota', () => {
      const control = { getRawValue: () => '50' } as any;
      const result = component.minRedeemedValidator(control, 50, 25);

      expect(result).toBeNull();
    });

    it('should handle string numbers', () => {
      const control = { getRawValue: () => '30' } as any;
      const result = component.minRedeemedValidator(control, '50', '25');

      expect(result).toEqual({ minRedeemed: '50' });
    });

    it('should handle zero quota value', () => {
      const control = { getRawValue: () => '0' } as any;
      const result = component.minRedeemedValidator(control, 50, 25);

      expect(result).toEqual({ minRedeemed: 50 });
    });

    it('should handle zero redeemed quota', () => {
      const control = { getRawValue: () => '30' } as any;
      const result = component.minRedeemedValidator(control, 50, 0);

      expect(result).toBeNull();
    });
  });

  describe('isSharedAllRedeemedCode', () => {
    it('should return true when shared quota allocation is enabled and has codes without channels', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      component.codesFormArray.clear();
      component.addCode({
        code: 'TEST',
        channel: '',
        quota: 10,
        redeemed_quota: 0,
      });

      const result = component.isSharedAllRedeemedCode();

      expect(result).toBe(true);
    });

    it('should return true when shared quota allocation is enabled and has codes with null channels', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      component.codesFormArray.clear();
      component.addCode({
        code: 'TEST',
        channel: null,
        quota: 10,
        redeemed_quota: 0,
      });

      const result = component.isSharedAllRedeemedCode();

      expect(result).toBe(true);
    });

    it('should return false when shared quota allocation is disabled', () => {
      component.isShareQuotaAllocationControl?.setValue(false);
      component.codesFormArray.clear();
      component.addCode({
        code: 'TEST',
        channel: '',
        quota: 10,
        redeemed_quota: 0,
      });

      const result = component.isSharedAllRedeemedCode();

      expect(result).toBe(false);
    });

    it('should return false when shared quota allocation is null', () => {
      component.isShareQuotaAllocationControl?.setValue(null);
      component.codesFormArray.clear();
      component.addCode({
        code: 'TEST',
        channel: '',
        quota: 10,
        redeemed_quota: 0,
      });

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
      component.addCode({
        code: 'TEST',
        channel: 'Agent',
        quota: 10,
        redeemed_quota: 0,
      });

      const result = component.isSharedAllRedeemedCode();

      expect(result).toBe(false);
    });

    it('should return true when some codes have no channels', () => {
      component.isShareQuotaAllocationControl?.setValue(true);
      component.codesFormArray.clear();
      component.addCode({
        code: 'TEST1',
        channel: 'Agent',
        quota: 10,
        redeemed_quota: 0,
      });
      component.addCode({
        code: 'TEST2',
        channel: '',
        quota: 10,
        redeemed_quota: 0,
      });

      const result = component.isSharedAllRedeemedCode();

      expect(result).toBe(true);
    });
  });

  describe('Form validation integration', () => {
    it('should validate code requirement based on shared quota allocation', () => {
      component.reValidateForm();
      const codeControl = component.codesFormArray.at(0).get('code')!;

      // When not shared quota allocation, code should be required
      component.isShareQuotaAllocationControl?.setValue(false);
      codeControl.setValue('');
      codeControl.updateValueAndValidity();

      expect(codeControl.errors).toBeTruthy();
    });

    it('should not require code when shared quota allocation is enabled', () => {
      component.reValidateForm();
      const codeControl = component.codesFormArray.at(0).get('code')!;

      // When shared quota allocation is enabled, code should not be required
      component.isShareQuotaAllocationControl?.setValue(true);
      codeControl.setValue('');
      codeControl.updateValueAndValidity();

      expect(codeControl.errors).toBeFalsy();
    });

    it('should validate quota requirement based on shared quota allocation', () => {
      component.reValidateForm();
      const quotaControl = component.codesFormArray.at(0).get('quota')!;

      // When not shared quota allocation, quota should be required
      component.isShareQuotaAllocationControl?.setValue(false);
      quotaControl.setValue('');
      quotaControl.updateValueAndValidity();

      expect(quotaControl.errors).toBeTruthy();
    });

    it('should not require quota when shared quota allocation is enabled', () => {
      component.reValidateForm();
      const quotaControl = component.codesFormArray.at(0).get('quota')!;

      // When shared quota allocation is enabled, quota should not be required
      component.isShareQuotaAllocationControl?.setValue(true);
      quotaControl.setValue('');
      quotaControl.updateValueAndValidity();

      expect(quotaControl.errors).toBeFalsy();
    });

    it('should validate shared quota when shared quota allocation is enabled', () => {
      component.reValidateForm();

      // When shared quota allocation is enabled, shared quota should be required
      component.isShareQuotaAllocationControl?.setValue(true);
      component.sharedQuotaControl?.setValue('');
      component.sharedQuotaControl?.updateValueAndValidity();

      expect(component.sharedQuotaControl?.errors).toBeTruthy();
    });

    it('should validate shared code when shared quota allocation is enabled', () => {
      component.reValidateForm();

      // When shared quota allocation is enabled, shared code should be required
      component.isShareQuotaAllocationControl?.setValue(true);
      component.sharedCodeControl?.setValue('');
      component.sharedCodeControl?.updateValueAndValidity();

      expect(component.sharedCodeControl?.errors).toBeTruthy();
    });
  });

  describe('Additional edge cases', () => {
    it('should handle form without isShareQuotaAllocationControl', () => {
      const formWithoutControl = formBuilder.group({
        codes: formBuilder.array([]),
      });
      component.formGroup = formWithoutControl;

      expect(() => component.isSharedAllRedeemedCode()).not.toThrow();
    });

    it('should handle addCode with partial value object', () => {
      const partialValue = {
        code: 'PARTIAL',
        // Missing other properties
      };

      component.addCode(partialValue);
      const newCode = component.codesFormArray.at(1).value;

      expect(newCode.code).toBe('PARTIAL');
      expect(newCode.channel).toBeNull();
      expect(newCode.quota).toBeNull();
      expect(newCode.redeemed_quota).toBeNull();
    });

    it('should handle reValidateOtherChannels with invalid tempId', () => {
      const mockControl = {
        get: jest.fn().mockReturnValue({ value: 'non-existent-id' }),
      };

      expect(() =>
        component.reValidateOtherChannels(mockControl as any)
      ).not.toThrow();
    });
  });
});
