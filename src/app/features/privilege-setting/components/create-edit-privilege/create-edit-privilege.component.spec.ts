import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditPrivilegeComponent } from './create-edit-privilege.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { of, ReplaySubject } from 'rxjs';
import * as CreateEditPrivilegeActions from '../../stores/create-edit-privilege/create-edit-privilege.actions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { PrivilegeDetail } from '../../models/privilege-setting-model';
import { PrivilegeTypeEnum } from '../../../../shared/utils/enums/privilege-type.enums';
import { CampaignType } from '../../../../shared/utils/enums/campaign-type.enums';
import * as createEditPrivilegeSelectors from '../../stores/create-edit-privilege/create-edit-privilege.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';

describe('CreateEditPrivilegeComponent', () => {
  let component: CreateEditPrivilegeComponent;
  let fixture: ComponentFixture<CreateEditPrivilegeComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  const privilegeDetail: PrivilegeDetail = {
    active_start_date_time: '2023-10-01T10:00:00Z',
    active_end_date_time: '2023-10-01T12:00:00Z',
    is_published: true,
    name_th: 'Test Privilege',
    name_en: 'Test Privilege EN',
    privilege_type: PrivilegeTypeEnum.E_VOUCHER,
    campaign_type: CampaignType.NORMAL,
    brand_id: 1,
    telephone: '123456789',
    website: 'https://example.com',
    booking_url: 'https://example.com/booking',
    thumbnail_image: 'thumbnail.jpg',
    privilege_detail_image: 'detail.jpg',
    segment_list: [],
    tier_list: [],
    id: 123,
    code_is_out: false,
    target_group_id: 1,
  } as any;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;
    mockRouter = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;
    mockActivatedRoute = {
      queryParams: of({ privilege_id: 123 }),
      params: of({ privilege_id: 123 }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditPrivilegeComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatNativeDateModule,
      ],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        FormBuilder,
        DatePipe,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditPrivilegeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and fetch privilege details on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPrivilegeActions.getPrivilegeDetail({ privilegeId: 123 })
    );
  });

  it('should mark forms as pristine after patching privilege details', () => {
    store.overrideSelector(
      createEditPrivilegeSelectors.selectPrivilegeDetail,
      privilegeDetail
    );
    component.ngOnInit();

    expect(component.activePeriodForm.pristine).toBe(true);
    expect(component.privilegeSettingForm.pristine).toBe(true);
  });

  it('should validate forms on submit', () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.activePeriodForm,
      'markAllAsTouched'
    );
    component.onSubmit(false);
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should dispatch createPrivilege action on valid form submission', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.activePeriodForm.patchValue({
      start_date: '2023-10-01',
      start_time: '10:00',
      is_published: true,
    });
    component.privilegeSettingForm.patchValue({
      name_th: 'Test Privilege',
      name_en: 'Test Privilege EN',
      privilege_type: 'E_VOUCHER',
    });
    component.onSubmit(false);

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPrivilegeActions.createPrivilege({
          queryParams: {},
          detailFile: null,
          thumbnailFile: null,
        })
      );
    }, 0);
  });

  it('should disable all forms when disableAllForm is called', () => {
    component.disableAllForm();
    expect(component.activePeriodForm.disabled).toBe(true);
    expect(component.privilegeSettingForm.disabled).toBe(true);
  });

  it('should enable all forms when enableAllForm is called', () => {
    component.enableAllForm();
    expect(component.activePeriodForm.enabled).toBe(true);
    expect(component.privilegeSettingForm.enabled).toBe(true);
  });

  it('should dispatch setFormDirty when form values change', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.activePeriodForm.patchValue({ start_date: '2023-10-01' });

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPrivilegeActions.setFormDirty({ isDirty: true })
      );
    }, 0);
  });

  it('should navigate to privilege management on successful creation', () => {
    actions$.next(
      CreateEditPrivilegeActions.createPrivilegeSuccess({ isPublished: true })
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'privilege-setting',
    ]);
  });

  it('should open confirmation dialog on clonePrivilege', () => {
    component.clonePrivilege();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should dispatch reset action on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPrivilegeActions.reset()
    );
  });

  it('should dispatch updatePublishedPrivilege action on unpublishPrivilege', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.privilegeId.set(123);
    component.unpublishPrivilege();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPrivilegeActions.updatePublishedPrivilege({
        privilege_id: 123,
        is_published: false,
      })
    );
  });

  it('should open dialog and not change mode if trying to edit a published privilege', () => {
    component.activePeriodForm.get('is_published')?.setValue(true);
    const dialogSpy = jest.spyOn(mockDialog, 'open');
    component.setFormMode('edit');
    expect(dialogSpy).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: `The Privilege can't update`,
        message: `This privilege is currently published. To proceed with update, please unpublished the privilege first.`,
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'warning',
      },
      width: '25rem',
    });
    expect(component.formMode()).not.toBe('edit');
  });

  it('should set formMode and enable forms when mode is edit and not published', () => {
    component.activePeriodForm.get('is_published')?.setValue(false);
    const enableAllFormSpy = jest.spyOn(component, 'enableAllForm');
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.setFormMode('edit');
    expect(component.formMode()).toBe('edit');
    expect(enableAllFormSpy).toHaveBeenCalled();

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPrivilegeActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  });

  it('should set formMode and not enable forms when mode is view', () => {
    const enableAllFormSpy = jest.spyOn(component, 'enableAllForm');
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.setFormMode('view');
    expect(component.formMode()).toBe('view');
    expect(enableAllFormSpy).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPrivilegeActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  });

  it('should set formMode to create and not enable forms', () => {
    const enableAllFormSpy = jest.spyOn(component, 'enableAllForm');
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.setFormMode('create');
    expect(component.formMode()).toBe('create');
    expect(enableAllFormSpy).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPrivilegeActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  });

  describe('segmentTierListChange', () => {
    it('should update tierSegmentIncludeExclude and dispatch actions', () => {
      const items = [
        { id: 1, type: 'tier', isInclude: true, name: 'Tier 1' },
        { id: 2, type: 'segmentation', isInclude: false, name: 'Seg 1' },
      ];
      const setSpy = jest.spyOn(component.tierSegmentIncludeExclude, 'set');
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.segmentTierListChange(items);

      expect(setSpy).toHaveBeenCalledWith(items);
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPrivilegeActions.setIncludeExcludeSegmentTier({ items })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPrivilegeActions.setFormDirty({ isDirty: true })
      );
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
  });
});
