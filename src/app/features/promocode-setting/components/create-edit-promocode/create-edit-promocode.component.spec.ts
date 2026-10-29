import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditPromocodeComponent } from './create-edit-promocode.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { of, ReplaySubject } from 'rxjs';
import * as CreateEditPromocodeActions from '../../stores/create-edit-promocode/create-edit-promocode.actions';
import * as createEditPromocodeSelectors from '../../stores/create-edit-promocode/create-edit-promocode.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { PromocodeDetail } from '../../models/promocode-model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { checkIsRedeemedCode } from '@shared/constants/check-is-redeemed-code.const';

// Mock the checkIsRedeemedCode function
jest.mock('@shared/constants/check-is-redeemed-code.const', () => ({
  checkIsRedeemedCode: jest.fn(),
}));

const mockCheckIsRedeemedCode = checkIsRedeemedCode as jest.MockedFunction<
  typeof checkIsRedeemedCode
>;

describe('CreateEditPromocodeComponent', () => {
  let component: CreateEditPromocodeComponent;
  let fixture: ComponentFixture<CreateEditPromocodeComponent>;
  let store: MockStore;
  let datePipe: DatePipe;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  const initialState = {
    createEditPromocode: {
      promocodeDetail: null,
      loading: false,
      error: null,
    },
    loading: {
      loadingStates: {},
    },
  };

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      params: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditPromocodeComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatNativeDateModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        FormBuilder,
        DatePipe,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditPromocodeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    datePipe = TestBed.inject(DatePipe);

    // Reset mocks
    mockCheckIsRedeemedCode.mockReset();

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setFormMode', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should set form mode to create', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.setFormMode('create');

      expect(component.formMode()).toBe('create');

      jest.runAllTimers();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPromocodeActions.setFormDirty({ isDirty: false })
      );
    });

    it('should set form mode to view', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.setFormMode('view');

      expect(component.formMode()).toBe('view');

      jest.runAllTimers();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPromocodeActions.setFormDirty({ isDirty: false })
      );
    });

    it('should set form mode to edit and enable all forms', () => {
      const enableAllFormSpy = jest.spyOn(component, 'enableAllForm');
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.setFormMode('edit');

      expect(component.formMode()).toBe('edit');
      expect(enableAllFormSpy).toHaveBeenCalled();

      jest.runAllTimers();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPromocodeActions.setFormDirty({ isDirty: false })
      );
    });
  });

  describe('disableAllForm', () => {
    it('should disable all forms', () => {
      const baseSettingFormDisableSpy = jest.spyOn(
        component.baseSettingForm,
        'disable'
      );
      const codeFormDisableSpy = jest.spyOn(component.codeForm, 'disable');
      const rewardsFormDisableSpy = jest.spyOn(
        component.rewardsForm,
        'disable'
      );
      const redeemLimitFormDisableSpy = jest.spyOn(
        component.redeemLimitForm,
        'disable'
      );

      component.disableAllForm();

      expect(baseSettingFormDisableSpy).toHaveBeenCalledWith({
        emitEvent: false,
      });
      expect(codeFormDisableSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(rewardsFormDisableSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(redeemLimitFormDisableSpy).toHaveBeenCalledWith({
        emitEvent: false,
      });
    });
  });

  describe('enableAllForm', () => {
    beforeEach(() => {
      // Setup form arrays and controls
      const codesArray = component.codeForm.get('codes') as FormArray;
      codesArray.clear();
      codesArray.push(
        component['fb'].group({
          tempId: ['123'],
          code: ['TEST_CODE'],
          channel: ['TEST_CHANNEL'],
          quota: [10],
          redeemed_quota: [0],
        })
      );
    });

    it('should enable all forms and disable advance options', () => {
      mockCheckIsRedeemedCode.mockReturnValue(false);
      component.codeForm.patchValue({
        is_share_quota_allocation: false,
        sharedRedeemedQuota: 0,
      });

      const baseSettingFormEnableSpy = jest.spyOn(
        component.baseSettingForm,
        'enable'
      );
      const codeFormEnableSpy = jest.spyOn(component.codeForm, 'enable');
      const rewardsFormEnableSpy = jest.spyOn(component.rewardsForm, 'enable');
      const redeemLimitFormEnableSpy = jest.spyOn(
        component.redeemLimitForm,
        'enable'
      );

      component.enableAllForm();

      expect(baseSettingFormEnableSpy).toHaveBeenCalledWith({
        emitEvent: false,
      });
      expect(codeFormEnableSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(rewardsFormEnableSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(redeemLimitFormEnableSpy).toHaveBeenCalledWith({
        emitEvent: false,
      });

      // Check that advance options are disabled
      expect(component.rewardsForm.get('is_advance_reward')?.disabled).toBe(
        true
      );
      expect(component.redeemLimitForm.get('is_advance_limit')?.disabled).toBe(
        true
      );
    });

    it('should disable share quota allocation when code is redeemed', () => {
      mockCheckIsRedeemedCode.mockReturnValue(true);

      component.enableAllForm();

      expect(
        component.codeForm.get('is_share_quota_allocation')?.disabled
      ).toBe(true);
    });

    it('should disable shared code and codes when share quota allocation is enabled with redeemed quota', () => {
      mockCheckIsRedeemedCode.mockReturnValue(false);
      component.codeForm.patchValue({
        is_share_quota_allocation: true,
        sharedRedeemedQuota: 5,
      });

      component.enableAllForm();

      expect(component.codeForm.get('sharedCode')?.disabled).toBe(true);
      expect(component.codeForm.get('codes')?.disabled).toBe(true);
    });

    it('should disable individual code fields when they have redeemed quota', () => {
      mockCheckIsRedeemedCode.mockReturnValue(false);
      component.codeForm.patchValue({
        is_share_quota_allocation: false,
        sharedRedeemedQuota: 0,
      });

      const codesArray = component.codeForm.get('codes') as FormArray;
      codesArray.clear();
      codesArray.push(
        component['fb'].group({
          tempId: ['123'],
          code: ['TEST_CODE'],
          channel: ['TEST_CHANNEL'],
          quota: [10],
          redeemed_quota: [5], // Has redeemed quota
        })
      );

      component.enableAllForm();

      const codeControl = codesArray.at(0);
      expect(codeControl.get('code')?.disabled).toBe(true);
      expect(codeControl.get('channel')?.disabled).toBe(true);
    });

    it('should not disable individual code fields when they have no redeemed quota', () => {
      mockCheckIsRedeemedCode.mockReturnValue(false);
      component.codeForm.patchValue({
        is_share_quota_allocation: false,
        sharedRedeemedQuota: 0,
      });

      const codesArray = component.codeForm.get('codes') as FormArray;
      codesArray.clear();
      codesArray.push(
        component['fb'].group({
          tempId: ['123'],
          code: ['TEST_CODE'],
          channel: ['TEST_CHANNEL'],
          quota: [10],
          redeemed_quota: [0], // No redeemed quota
        })
      );

      component.enableAllForm();

      const codeControl = codesArray.at(0);
      expect(codeControl.get('code')?.disabled).toBe(false);
      expect(codeControl.get('channel')?.disabled).toBe(false);
    });
  });

  describe('getStartDateTimeEndDateTime', () => {
    it('should return correct start and end date objects', () => {
      const fb = TestBed.inject(FormBuilder);
      const formGroup: FormGroup = fb.group({
        start_date: ['2023-10-01'],
        start_time: ['10:30'],
        end_date: ['2023-10-02'],
        end_time: ['12:00'],
      });

      const result = component.getStartDateTimeEndDateTime(formGroup);

      expect(result.start_date_time).toBeInstanceOf(Date);
      expect(result.end_date_time).toBeInstanceOf(Date);
      expect(result.start_date_time.getFullYear()).toBe(2023);
      expect(result.start_date_time.getMonth()).toBe(9); // October is 9 (0-based)
      expect(result.start_date_time.getDate()).toBe(1);
      expect(result.start_date_time.getHours()).toBe(10);
      expect(result.start_date_time.getMinutes()).toBe(30);

      expect(result.end_date_time?.getFullYear()).toBe(2023);
      expect(result.end_date_time?.getMonth()).toBe(9);
      expect(result.end_date_time?.getDate()).toBe(2);
      expect(result.end_date_time?.getHours()).toBe(12);
      expect(result.end_date_time?.getMinutes()).toBe(0);
    });

    it('should handle missing end date gracefully', () => {
      const fb = TestBed.inject(FormBuilder);
      const formGroup: FormGroup = fb.group({
        start_date: ['2023-10-01'],
        start_time: ['10:30'],
        end_date: [''],
        end_time: [''],
      });

      const result = component.getStartDateTimeEndDateTime(formGroup);

      expect(result.start_date_time).toBeInstanceOf(Date);
      expect(result.end_date_time).toBeNull();
    });

    it('should handle missing time values with default 00:00', () => {
      const fb = TestBed.inject(FormBuilder);
      const formGroup: FormGroup = fb.group({
        start_date: ['2023-10-01'],
        start_time: [''],
        end_date: ['2023-10-02'],
        end_time: [''],
      });

      const result = component.getStartDateTimeEndDateTime(formGroup);

      expect(result.start_date_time.getHours()).toBe(0);
      expect(result.start_date_time.getMinutes()).toBe(0);
      expect(result.end_date_time?.getHours()).toBe(0);
      expect(result.end_date_time?.getMinutes()).toBe(0);
    });

    it('should handle null time values with default 00:00', () => {
      const fb = TestBed.inject(FormBuilder);
      const formGroup: FormGroup = fb.group({
        start_date: ['2023-10-01'],
        start_time: [null],
        end_date: ['2023-10-02'],
        end_time: [null],
      });

      const result = component.getStartDateTimeEndDateTime(formGroup);

      expect(result.start_date_time.getHours()).toBe(0);
      expect(result.start_date_time.getMinutes()).toBe(0);
      expect(result.end_date_time?.getHours()).toBe(0);
      expect(result.end_date_time?.getMinutes()).toBe(0);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call super.ngOnDestroy and dispatch reset action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const superNgOnDestroySpy = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(component)),
        'ngOnDestroy'
      );

      component.ngOnDestroy();

      expect(superNgOnDestroySpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPromocodeActions.reset()
      );
    });
  });

  describe('Component initialization', () => {
    it('should initialize with default form values', () => {
      expect(component.formMode()).toBe('create');
      expect(component.promocodeId()).toBe(0);
      expect(component.baseSettingForm).toBeDefined();
      expect(component.codeForm).toBeDefined();
      expect(component.rewardsForm).toBeDefined();
      expect(component.redeemLimitForm).toBeDefined();
    });

    it('should initialize forms with correct validators', () => {
      // Test baseSettingForm validators
      const nameControl = component.baseSettingForm.get('name');
      expect(nameControl?.hasError('required')).toBe(true);

      nameControl?.setValue('Test');
      expect(nameControl?.hasError('required')).toBe(false);

      // Test codeForm validators
      const codesArray = component.codeForm.get('codes') as FormArray;
      const firstCodeGroup = codesArray.at(0);
      const codeControl = firstCodeGroup.get('code');
      const quotaControl = firstCodeGroup.get('quota');

      expect(codeControl?.hasError('required')).toBe(true);
      expect(quotaControl?.hasError('required')).toBe(true);

      codeControl?.setValue('TEST_CODE');
      quotaControl?.setValue(10);

      expect(codeControl?.hasError('required')).toBe(false);
      expect(quotaControl?.hasError('required')).toBe(false);

      // Test min/max validators
      quotaControl?.setValue(-1);
      expect(quotaControl?.hasError('min')).toBe(true);

      quotaControl?.setValue(25000);
      expect(quotaControl?.hasError('max')).toBe(true);

      quotaControl?.setValue(100);
      expect(quotaControl?.hasError('min')).toBe(false);
      expect(quotaControl?.hasError('max')).toBe(false);
    });

    it('should initialize observables', () => {
      expect(component.loading$).toBeDefined();
      expect(component.promocodeDetail$).toBeDefined();
    });
  });

  describe('Form state management', () => {
    it('should mark all forms as pristine initially', () => {
      expect(component.baseSettingForm.pristine).toBe(true);
      expect(component.codeForm.pristine).toBe(true);
      expect(component.rewardsForm.pristine).toBe(true);
      expect(component.redeemLimitForm.pristine).toBe(true);
    });

    it('should have advance options disabled by default', () => {
      expect(component.rewardsForm.get('is_advance_reward')?.disabled).toBe(
        true
      );
      expect(component.redeemLimitForm.get('is_advance_limit')?.disabled).toBe(
        true
      );
    });
  });
});
