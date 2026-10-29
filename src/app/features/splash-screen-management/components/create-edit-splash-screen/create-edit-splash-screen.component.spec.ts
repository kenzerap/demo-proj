import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditSplashScreenComponent } from './create-edit-splash-screen.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { of, ReplaySubject } from 'rxjs';
import * as CreateEditSplashScreenActions from '../../stores/create-edit-splash-screen/create-edit-splash-screen.actions';
import * as CreateEditSplashScreenSelectors from '@app/features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { SplashScreenDetail } from '../../models/splash-screen-management.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';

describe('CreateEditSplashScreenComponent', () => {
  let component: CreateEditSplashScreenComponent;
  let fixture: ComponentFixture<CreateEditSplashScreenComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

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
      params: of({ splashScreenId: 123 }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditSplashScreenComponent,
        ReactiveFormsModule,
        MatNativeDateModule,
        NoopAnimationsModule,
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

    fixture = TestBed.createComponent(CreateEditSplashScreenComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and fetch splash screen details on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditSplashScreenActions.getSplashScreenDetail({ id: 123 })
    );
  });

  it('should patch base setting form with splash screen details', () => {
    const splashScreenDetail: SplashScreenDetail = {
      splash_screen_id: 123,
      name_en: 'Test Splash Screen',
      name_th: 'ทดสอบ Splash Screen',
      description_en: 'Test description',
      description_th: 'คำอธิบายทดสอบ',
      image: 'image.png',
      image_data: 'http://example.com/image.png',
      status: 'ACTIVE',
      display_order: 1,
      publish_type: TimePeriodType.SPECIFIC_TIME,
      start_date_time: '2024-01-01T00:00:00Z',
      end_date_time: '2024-01-02T00:00:00Z',
      created_by: 'Admin',
      updated_by: 'Admin',
      created_date: '2024-01-01',
      updated_date: '2024-01-02',
    };
    store.overrideSelector(
      CreateEditSplashScreenSelectors.selectSplashScreenDetail,
      splashScreenDetail
    );

    component.ngOnInit();

    expect(component.baseSettingForm.value.name_en).toBe('Test Splash Screen');
    expect(component.baseSettingForm.value.name_th).toBe(
      'ทดสอบ Splash Screen'
    );
    expect(component.baseSettingForm.value.description_en).toBe(
      'Test description'
    );
    expect(component.baseSettingForm.value.description_th).toBe(
      'คำอธิบายทดสอบ'
    );
    expect(component.baseSettingForm.value.is_active).toBe(true);
    expect(component.baseSettingForm.value.display_order).toBe(1);
    expect(component.baseSettingForm.value.send_time_type).toBe(
      TimePeriodType.SPECIFIC_TIME
    );
    expect(component.baseSettingForm.value.isSetEndDate).toBe(true);
  });

  it('should mark form as dirty on value changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.baseSettingForm.patchValue({ name_en: 'Updated Name' });

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditSplashScreenActions.setFormDirty({ isDirty: true })
      );
    }, 0);
  });

  it('should handle successful creation', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    actions$.next(CreateEditSplashScreenActions.createSplashScreenSuccess());

    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditSplashScreenActions.setFormDirty({ isDirty: false })
    );
  });

  it('should dispatch createSplashScreen on submit in create mode', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.formMode.set('create');
    component.enableAllForm();
    component.baseSettingForm.patchValue({
      name_en: 'Test Splash Screen',
      name_th: 'ทดสอบ Splash Screen',
      description_en: 'Test description',
      description_th: 'คำอธิบายทดสอบ',
      is_active: true,
      display_order: 1,
      send_time_type: TimePeriodType.IMMEDIATELY,
      imageFile: new File([''], 'test.png'),
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditSplashScreenActions.createSplashScreen({
        data: expect.objectContaining({
          name_en: 'Test Splash Screen',
          name_th: 'ทดสอบ Splash Screen',
          description_en: 'Test description',
          description_th: 'คำอธิบายทดสอบ',
          status: 'ACTIVE',
          display_order: 1,
          publish_type: TimePeriodType.IMMEDIATELY,
        }),
        file: expect.any(File),
      })
    );
  });

  it('should dispatch updateSplashScreen on submit in edit mode', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.formMode.set('edit');
    component.splashScreenId.set(123);
    component.enableAllForm();
    component.baseSettingForm.patchValue({
      name_en: 'Updated Splash Screen',
      name_th: 'อัปเดต Splash Screen',
      description_en: 'Updated description',
      description_th: 'อัปเดตคำอธิบาย',
      is_active: true,
      display_order: 2,
      send_time_type: TimePeriodType.IMMEDIATELY,
      imageFile: new File([''], 'updated.png'),
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditSplashScreenActions.updateSplashScreen({
        id: 123,
        data: expect.objectContaining({
          name_en: 'Updated Splash Screen',
          name_th: 'อัปเดต Splash Screen',
          display_order: 2,
        }),
        file: expect.any(File),
      })
    );
  });

  it('should only include end_date_time when isSetEndDate is checked in specific time mode', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.formMode.set('create');
    component.enableAllForm();
    component.baseSettingForm.patchValue({
      name_en: 'Test Splash Screen',
      name_th: 'ทดสอบ Splash Screen',
      description_en: 'Test description',
      description_th: 'คำอธิบายทดสอบ',
      is_active: true,
      display_order: 1,
      send_time_type: TimePeriodType.SPECIFIC_TIME,
      start_date: '2024-01-01',
      start_time: '10:00',
      isSetEndDate: false,
      imageFile: new File([''], 'test.png'),
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditSplashScreenActions.createSplashScreen({
        data: expect.objectContaining({ end_date_time: '' }),
        file: expect.any(File),
      })
    );
  });

  it('should disable all forms', () => {
    component.disableAllForm();
    expect(component.baseSettingForm.disabled).toBe(true);
  });

  it('should enable all forms', () => {
    component.enableAllForm();
    expect(component.baseSettingForm.enabled).toBe(true);
  });

  it('should dispatch resetAll on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditSplashScreenActions.resetAll()
    );
  });
});
