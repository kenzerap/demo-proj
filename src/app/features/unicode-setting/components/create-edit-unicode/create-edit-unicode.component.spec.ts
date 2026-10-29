import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditUnicodeComponent } from './create-edit-unicode.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { of, ReplaySubject, Subject, throwError } from 'rxjs';
import * as CreateEditUnicodeActions from '../../stores/create-edit-unicode/create-edit-unicode.actions';
import * as createEditUnicodeSelectors from '../../stores/create-edit-unicode/create-edit-unicode.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { UnicodeDetail } from '../../models/unicode-model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RedeemLimitCondition } from '@app/shared/utils/enums/redeem-limit-condition.enums';
import { selectIsLoading } from '@app/store/loading/loading.selectors';

// Mock the external dependencies
jest.mock('@shared/constants/check-is-redeemed-code.const', () => ({
  checkIsRedeemedCode: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('CreateEditUnicodeComponent', () => {
  let component: CreateEditUnicodeComponent;
  let fixture: ComponentFixture<CreateEditUnicodeComponent>;
  let store: MockStore;
  let datePipe: DatePipe;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  const initialState = {
    loading: { createEditUnicode: false, exportUnicode: false },
    createEditUnicode: { unicodeDetail: null },
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
      params: new Subject(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditUnicodeComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCheckboxModule,
        MatFormFieldModule,
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

    fixture = TestBed.createComponent(CreateEditUnicodeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    datePipe = TestBed.inject(DatePipe);

    // Setup selector mocks
    store.overrideSelector(selectIsLoading('createEditUnicode'), false);
    store.overrideSelector(selectIsLoading('exportUnicode'), false);
    store.overrideSelector(
      createEditUnicodeSelectors.selectUnicodeDetail,
      null
    );

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component without unicode_id param', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      mockActivatedRoute.params = of({});

      component.ngOnInit();

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        CreateEditUnicodeActions.getUnicodeDetail({
          unicodeId: expect.any(Number),
        })
      );
    });

    it('should fetch unicode details when unicode_id param exists', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      mockActivatedRoute.params = of({ unicode_id: 123 });

      component.ngOnInit();

      expect(component.unicodeId()).toBe(123);
      expect(component.formMode()).toBe('view');
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditUnicodeActions.getUnicodeDetail({ unicodeId: 123 })
      );
    });

    it('should patch forms with unicode details - shared quota allocation true with no channel', () => {
      const unicodeDetail: UnicodeDetail = {
        name: 'Test Unicode',
        description: 'Test Description',
        status: true,
        start_date_time: '2023-10-01T10:00:00Z',
        end_date_time: '2023-10-01T12:00:00Z',
        is_share_quota_allocation: true,
        codes: [
          {
            code: 'SHARED123',
            channel: [],
            quota: 100,
            redeemed_quota: 5,
          },
        ],
        is_point: true,
        is_privilege: false,
        point_data: [{ point: 100, point_expire_date: '2023-12-31' }],
        privilege_details: null,
        is_advance_reward: false,
        is_special_condition_fraud_user: true,
        fraud_condition_point: 50,
        fraud_condition_point_expire_date: '2023-11-30',
        redeem_limit: [
          {
            redeem_condition: RedeemLimitCondition.PER_PRIVILEGE,
            redeem_quota: 5,
          },
        ],
        is_advance_limit: true,
      } as any;

      store.overrideSelector(
        createEditUnicodeSelectors.selectUnicodeDetail,
        unicodeDetail
      );

      component.ngOnInit();

      expect(component.codeForm.get('codes')?.value).toEqual([
        {
          code: '',
          channel: '',
          quota: '',
          redeemed_quota: 5,
          tempId: 'mocked-uuid',
        },
      ]);

      expect(
        component.rewardsForm.get('is_special_condition_fraud_user')?.value
      ).toBe(true);
      expect(component.rewardsForm.get('fraud_condition_point')?.value).toBe(
        50
      );
      expect(component.redeemLimitForm.get('is_advance_limit')?.value).toBe(
        true
      );
    });

    it('should handle form changes and dispatch setFormDirty action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.formMode.set('edit');

      component.ngOnInit();

      // Trigger form change
      component.baseSettingForm.get('name')?.setValue('Changed Name');

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditUnicodeActions.setFormDirty({ isDirty: true })
      );
    });

    it('should not dispatch setFormDirty when in view mode', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.formMode.set('view');

      component.ngOnInit();

      // Trigger form change
      component.baseSettingForm.get('name')?.setValue('Changed Name');

      // Should not dispatch setFormDirty for view mode
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        CreateEditUnicodeActions.setFormDirty({ isDirty: true })
      );
    });

    it('should handle success actions and show success dialog', () => {
      const dialogRefMock = {
        afterClosed: jest.fn().mockReturnValue(of(true)),
      };
      mockDialog.open.mockReturnValue(dialogRefMock as any);

      component.formMode.set('create');
      component.ngOnInit();

      // Emit success action
      actions$.next(CreateEditUnicodeActions.createUnicodeSuccess());

      expect(mockDialog.open).toHaveBeenCalledWith(expect.any(Function), {
        data: {
          message: 'The Code was created',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'success',
        },
        width: '25rem',
      });

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        'privilege-management',
        'unicode-setting',
      ]);
    });

    it('should handle update success action and show success dialog', () => {
      const dialogRefMock = {
        afterClosed: jest.fn().mockReturnValue(of(true)),
      };
      mockDialog.open.mockReturnValue(dialogRefMock as any);

      component.formMode.set('edit');
      component.ngOnInit();

      // Emit success action
      actions$.next(CreateEditUnicodeActions.updateUnicodeSuccess());

      expect(mockDialog.open).toHaveBeenCalledWith(expect.any(Function), {
        data: {
          message: 'The Code was updated',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'success',
        },
        width: '25rem',
      });
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

    it('should use default time when time is not provided', () => {
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

  describe('setFormMode', () => {
    it('should set form mode to edit and enable all forms', () => {
      const enableFormSpy = jest.spyOn(component, 'enableAllForm');
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.setFormMode('edit');

      expect(component.formMode()).toBe('edit');
      expect(enableFormSpy).toHaveBeenCalled();

      setTimeout(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          CreateEditUnicodeActions.setFormDirty({ isDirty: false })
        );
      }, 0);
    });

    it('should set form mode to view without enabling forms', () => {
      const enableFormSpy = jest.spyOn(component, 'enableAllForm');

      component.setFormMode('view');

      expect(component.formMode()).toBe('view');
      expect(enableFormSpy).not.toHaveBeenCalled();
    });

    it('should set form mode to create without enabling forms', () => {
      const enableFormSpy = jest.spyOn(component, 'enableAllForm');

      component.setFormMode('create');

      expect(component.formMode()).toBe('create');
      expect(enableFormSpy).not.toHaveBeenCalled();
    });
  });

  describe('disableAllForm', () => {
    it('should disable all forms without emitting events', () => {
      const baseFormSpy = jest.spyOn(component.baseSettingForm, 'disable');
      const codeFormSpy = jest.spyOn(component.codeForm, 'disable');
      const rewardsFormSpy = jest.spyOn(component.rewardsForm, 'disable');
      const redeemLimitFormSpy = jest.spyOn(
        component.redeemLimitForm,
        'disable'
      );

      component.disableAllForm();

      expect(baseFormSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(codeFormSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(rewardsFormSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(redeemLimitFormSpy).toHaveBeenCalledWith({ emitEvent: false });
    });
  });

  describe('enableAllForm', () => {
    it('should enable all forms and disable advance controls', () => {
      const baseFormSpy = jest.spyOn(component.baseSettingForm, 'enable');
      const codeFormSpy = jest.spyOn(component.codeForm, 'enable');
      const rewardsFormSpy = jest.spyOn(component.rewardsForm, 'enable');
      const redeemLimitFormSpy = jest.spyOn(
        component.redeemLimitForm,
        'enable'
      );
      const isAdvanceRewardSpy = jest.spyOn(
        component.rewardsForm.get('is_advance_reward')!,
        'disable'
      );
      const isAdvanceLimitSpy = jest.spyOn(
        component.redeemLimitForm.get('is_advance_limit')!,
        'disable'
      );

      component.enableAllForm();

      expect(baseFormSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(codeFormSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(rewardsFormSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(redeemLimitFormSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(isAdvanceRewardSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(isAdvanceLimitSpy).toHaveBeenCalledWith({ emitEvent: false });
    });

    it('should disable is_share_quota_allocation when checkIsRedeemedCode returns true', () => {
      const checkIsRedeemedCodeMock =
        require('@shared/constants/check-is-redeemed-code.const').checkIsRedeemedCode;
      checkIsRedeemedCodeMock.mockReturnValue(true);

      const disableSpy = jest.spyOn(
        component.codeForm.get('is_share_quota_allocation')!,
        'disable'
      );

      component.enableAllForm();

      expect(disableSpy).toHaveBeenCalledWith({ emitEvent: false });
    });

    it('should disable sharedCode and codes when is_share_quota_allocation and sharedRedeemedQuota are set', () => {
      component.codeForm.get('is_share_quota_allocation')?.setValue(true);
      component.codeForm.get('sharedRedeemedQuota')?.setValue(5);

      const sharedCodeSpy = jest.spyOn(
        component.codeForm.get('sharedCode')!,
        'disable'
      );
      const codesSpy = jest.spyOn(component.codeForm.get('codes')!, 'disable');

      component.enableAllForm();

      expect(sharedCodeSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(codesSpy).toHaveBeenCalledWith({ emitEvent: false });
    });

    it('should disable code and channel controls for codes with redeemed_quota', () => {
      const codesArray = component.codeForm.get('codes') as FormArray;
      const fb = TestBed.inject(FormBuilder);

      codesArray.clear();
      codesArray.push(
        fb.group({
          tempId: ['1'],
          code: ['CODE1'],
          channel: ['CHANNEL1'],
          quota: [10],
          redeemed_quota: [5],
        })
      );

      const codeSpy = jest.spyOn(codesArray.at(0).get('code')!, 'disable');
      const channelSpy = jest.spyOn(
        codesArray.at(0).get('channel')!,
        'disable'
      );

      component.enableAllForm();

      expect(codeSpy).toHaveBeenCalledWith({ emitEvent: false });
      expect(channelSpy).toHaveBeenCalledWith({ emitEvent: false });
    });

    it('should not disable code and channel controls when redeemed_quota is 0', () => {
      const codesArray = component.codeForm.get('codes') as FormArray;
      const fb = TestBed.inject(FormBuilder);

      codesArray.clear();
      codesArray.push(
        fb.group({
          tempId: ['1'],
          code: ['CODE1'],
          channel: ['CHANNEL1'],
          quota: [10],
          redeemed_quota: [0],
        })
      );

      const codeSpy = jest.spyOn(codesArray.at(0).get('code')!, 'disable');
      const channelSpy = jest.spyOn(
        codesArray.at(0).get('channel')!,
        'disable'
      );

      component.enableAllForm();

      expect(codeSpy).not.toHaveBeenCalled();
      expect(channelSpy).not.toHaveBeenCalled();
    });
  });

  describe('exportToExcel', () => {
    it('should dispatch exportUnicode action with correct params', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.unicodeId.set(123);

      // Mock Intl.DateTimeFormat
      const mockResolvedOptions = jest
        .fn()
        .mockReturnValue({ timeZone: 'Asia/Bangkok' });
      const mockDateTimeFormat = jest.fn().mockImplementation(() => ({
        resolvedOptions: mockResolvedOptions,
      }));
      (global as any).Intl = { DateTimeFormat: mockDateTimeFormat };

      component.exportToExcel();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditUnicodeActions.exportUnicode({
          unicode_id: 123,
          expected_zone_id: 'Asia/Bangkok',
        })
      );
    });
  });
});
