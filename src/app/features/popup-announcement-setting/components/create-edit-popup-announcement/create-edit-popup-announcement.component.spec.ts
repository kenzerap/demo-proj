import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditPopupAnnouncementComponent } from './create-edit-popup-announcement.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of, ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as CreateEditPopupAnnouncementActions from '../../stores/create-edit-popup-announcement/create-edit-popup-announcement.actions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateEditPopupAnnouncementComponent', () => {
  let component: CreateEditPopupAnnouncementComponent;
  let fixture: ComponentFixture<CreateEditPopupAnnouncementComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;
    mockRouter = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;
    mockActivatedRoute = { params: of({ popupAnnouncementId: 123 }) };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditPopupAnnouncementComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatNativeDateModule,
      ],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditPopupAnnouncementComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and fetch popup announcement details on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPopupAnnouncementActions.getPopupAnnouncementDetail({
        id: 123,
      })
    );
  });

  it('should mark all forms as touched if validation fails on submit', () => {
    component.baseSettingForm.patchValue({ bannerName: '' });
    component.onSubmit();
    expect(component.baseSettingForm.get('bannerName')?.touched).toBe(true);
  });

  it('should dispatch createPopupAnnouncement action when formMode is "create"', () => {
    jest.spyOn(store, 'dispatch');
    component.formMode.set('create');
    component.baseSettingForm.patchValue({
      bannerName: 'Test Banner',
      imageFile: new File([], 'test.png'),
    });
    component.targetGroupForm.patchValue({ target_group_type: 'ALL' });
    component.settingDisplayOnPageForm.patchValue({ pageId: '1' });
    component.settingFrequencyForm.patchValue({ frequencyCap: 1 });
    component.settingDestinationForm.patchValue({
      destination_type: 'Privilege',
      destination_value: 'Test Value',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditPopupAnnouncementActions.createPopupAnnouncement({
          data: {},
          file: component.baseSettingForm.get('imageFile')?.value,
        })
      );
    }, 0);
  });

  it('should dispatch updatePopupAnnouncement action when formMode is "edit"', () => {
    jest.spyOn(store, 'dispatch');
    component.formMode.set('edit');
    component.popupAnnouncementId.set(123);
    component.baseSettingForm.patchValue({
      bannerName: 'Test Banner',
      imageFile: new File([], 'test.png'),
    });
    component.targetGroupForm.patchValue({ target_group_type: 'ALL' });
    component.settingDisplayOnPageForm.patchValue({ pageId: '1' });
    component.settingFrequencyForm.patchValue({ frequencyCap: 1 });
    component.settingDestinationForm.patchValue({
      destination_type: 'Privilege',
      destination_value: 'Test Value',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditPopupAnnouncementActions.updatePopupAnnouncement({
          data: {},
          file: component.baseSettingForm.get('imageFile')?.value,
        })
      );
    }, 0);
  });

  it('should dispatch setFormDirty when forms change', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.baseSettingForm.patchValue({ bannerName: 'Updated Banner' });

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditPopupAnnouncementActions.setFormDirty({ isDirty: true })
      );
    }, 0);
  });

  it('should reset all on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPopupAnnouncementActions.resetAll()
    );
  });

  it('should handle segmentTierListChange correctly', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const items = [{ id: 1, isInclude: true, type: 'tier', name: 'Tier 1' }];
    component.segmentTierListChange(items);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPopupAnnouncementActions.setIncludeExcludeSegmentTier({
        items,
      })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPopupAnnouncementActions.getTargetGroupUserSummary({
        target_group_id: component.targetGroupForm.value.target_group_type,
      })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPopupAnnouncementActions.setFormDirty({ isDirty: true })
    );
  });

  it('should disable all forms', () => {
    component.disableAllForm();
    expect(component.baseSettingForm.disabled).toBeTruthy();
    expect(component.targetGroupForm.disabled).toBeTruthy();
    expect(component.settingDisplayOnPageForm.disabled).toBeTruthy();
    expect(component.settingFrequencyForm.disabled).toBeTruthy();
    expect(component.settingDestinationForm.disabled).toBeTruthy();
  });

  it('should enable all forms', () => {
    component.enableAllForm();
    expect(component.baseSettingForm.enabled).toBeTruthy();
    expect(component.targetGroupForm.enabled).toBeTruthy();
    expect(component.settingDisplayOnPageForm.enabled).toBeTruthy();
    expect(component.settingFrequencyForm.enabled).toBeTruthy();
    expect(component.settingDestinationForm.enabled).toBeTruthy();
  });
});
