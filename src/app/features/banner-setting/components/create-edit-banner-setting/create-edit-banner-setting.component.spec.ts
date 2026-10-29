import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditBannerSettingComponent } from './create-edit-banner-setting.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { of, ReplaySubject } from 'rxjs';
import * as CreateEditBannerSettingActions from '../../stores/create-edit-banner-setting/create-edit-banner-setting.actions';
import * as CreateEditBannerSettingSelectors from '@app/features/banner-setting/stores/create-edit-banner-setting/create-edit-banner-setting.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateEditBannerSettingComponent', () => {
  let component: CreateEditBannerSettingComponent;
  let fixture: ComponentFixture<CreateEditBannerSettingComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;
    mockRouter = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;
    mockActivatedRoute = { params: of({ bannerSettingId: 123 }) };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditBannerSettingComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
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

    fixture = TestBed.createComponent(CreateEditBannerSettingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and fetch banner details on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditBannerSettingActions.getBannerSettingDetail({ id: 123 })
    );
  });

  it('should patch forms with banner details', () => {
    const bannerSettingDetail = {
      publish_type: 'SPECIFIC_TIME',
      start_date_time: '2023-10-01T10:00:00Z',
      end_date_time: '2023-10-01T12:00:00Z',
      is_published: true,
      banner_name: 'Test Banner',
      image_data: 'imageData',
      image: 'imageName',
      target_group_id: 4,
      page_id: 1,
      destination_type: 'Privilege',
      destination_value: '123',
      segment_list: [],
      tier_list: [],
    } as any;
    store.overrideSelector(
      CreateEditBannerSettingSelectors.selectBannerSettingDetail,
      bannerSettingDetail
    );

    component.ngOnInit();
    expect(component.baseSettingForm.value.bannerName).toEqual(
      bannerSettingDetail.banner_name
    );
  });

  it('should validate forms on submit', () => {
    component.baseSettingForm.patchValue({
      bannerName: '',
    });
    component.onSubmit();
    expect(component.baseSettingForm.get('bannerName')?.touched).toBe(true);
  });

  it('should dispatch createBannerSetting action when formMode is "create"', () => {
    jest.spyOn(store, 'dispatch');
    component.formMode.set('create');
    component.baseSettingForm.patchValue({
      bannerName: 'Test Banner',
      imageFile: 'testFile',
    });
    component.onSubmit();
    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditBannerSettingActions.createBannerSetting({
          data: {},
          file: new File([], 'testFile'),
        })
      );
    }, 0);
  });

  it('should dispatch updateBannerSetting action when formMode is "edit"', () => {
    jest.spyOn(store, 'dispatch');
    component.formMode.set('edit');
    component.bannerSettingId.set(123);
    component.bannerSettingDetail = { display_order: 1 } as any;
    component.baseSettingForm.patchValue({
      bannerName: 'Test Banner',
      imageFile: 'testFile',
    });
    component.onSubmit();
    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditBannerSettingActions.updateBannerSetting({
          data: {},
          file: new File([], 'testFile'),
        })
      );
    }, 0);
  });

  it('should disable all forms when disableAllForm is called', () => {
    component.disableAllForm();
    expect(component.baseSettingForm.disabled).toBe(true);
    expect(component.targetGroupForm.disabled).toBe(true);
    expect(component.settingDisplayOnPageForm.disabled).toBe(true);
    expect(component.settingDestinationForm.disabled).toBe(true);
  });

  it('should enable all forms when enableAllForm is called', () => {
    component.enableAllForm();
    expect(component.baseSettingForm.enabled).toBe(true);
    expect(component.targetGroupForm.enabled).toBe(true);
    expect(component.settingDisplayOnPageForm.enabled).toBe(true);
    expect(component.settingDestinationForm.enabled).toBe(true);
  });

  it('should handle segmentTierListChange correctly', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const items = [{ id: 1, isInclude: true, type: 'tier', name: 'Tier 1' }];
    component.segmentTierListChange(items);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditBannerSettingActions.setIncludeExcludeSegmentTier({ items })
    );
  });

  it('should reset all state on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditBannerSettingActions.resetAll()
    );
  });
});
