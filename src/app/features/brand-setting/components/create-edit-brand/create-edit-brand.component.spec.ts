import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditBrandComponent } from './create-edit-brand.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { of, ReplaySubject } from 'rxjs';
import * as CreateEditBrandActions from '../../stores/create-edit-brand/create-edit-brand.actions';
import * as CreateEditBrandSelectors from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { BrandDetail } from '@app/shared/models/brand-model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateEditBrandComponent', () => {
  let component: CreateEditBrandComponent;
  let fixture: ComponentFixture<CreateEditBrandComponent>;
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
      params: of({ brandId: 123 }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditBrandComponent,
        ReactiveFormsModule,
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

    fixture = TestBed.createComponent(CreateEditBrandComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and fetch brand details on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditBrandActions.getBrandDetail({ id: 123 })
    );
  });

  it('should patch forms with brand details', () => {
    const brandDetail: BrandDetail = {
      brand_id: 123,
      is_active: true,
      brand_name_english: 'Test Brand EN',
      brand_name_thai: 'Test Brand TH',
      brand_category_id: 1,
      brand_category_name_english: 'Category EN',
      brand_category_name_thai: 'Category TH',
      display_order: 1,
      preview_brand_logo_url: 'http://example.com/logo.png',
      brand_logo: 'logo.png',
      send_email_when_redeemed: true,
      to_email: 'test@example.com',
      cc_email: 'cc@example.com',
      email_subject_english: 'Subject EN',
      email_subject_thai: 'Subject TH',
      email_body_english: 'Body EN',
      email_body_thai: 'Body TH',
      created_by: 'Admin',
      updated_by: 'Admin',
      created_date: '2023-01-01',
      updated_date: '2023-01-02',
    } as any;
    store.overrideSelector(
      CreateEditBrandSelectors.selectBrandDetail,
      brandDetail
    );

    component.ngOnInit();

    expect(component.baseSettingForm.value).toEqual({
      is_active: true,
      brand_name_english: 'Test Brand EN',
      brand_name_thai: 'Test Brand TH',
      brand_category_id: 1,
      display_order: 1,
      imageFile: 'http://example.com/logo.png',
      imageUrl: 'http://example.com/logo.png',
      imageName: 'logo.png',
    });

    expect(component.emailDetailForm.value).toEqual({
      send_email_when_redeemed: true,
      to_email: 'test@example.com',
      cc_email: 'cc@example.com',
      email_subject_english: 'Subject EN',
      email_subject_thai: 'Subject TH',
      email_body_english: 'Body EN',
      email_body_english_html_text: 'Body EN',
      email_body_thai: 'Body TH',
      email_body_thai_html_text: 'Body TH',
      existing_form_name_english: undefined,
      existing_form_name_thai: undefined,
    });
  });

  it('should mark forms as dirty on value changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.baseSettingForm.patchValue({
      brand_name_english: 'Updated Name',
    });

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditBrandActions.setFormDirty({ isDirty: true })
      );
    }, 0);
  });

  it('should handle successful creation of a brand', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    actions$.next(CreateEditBrandActions.createBrandSuccess());

    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditBrandActions.setFormDirty({ isDirty: false })
    );
    setTimeout(() => {
      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          message: 'The brand was created',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'success',
        },
        width: '25rem',
      });
    }, 0);
  });

  it('should handle form submission for creating a brand', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.formMode.set('create');
    component.baseSettingForm.patchValue({
      is_active: true,
      brand_name_english: 'Test Brand EN',
      brand_name_thai: 'Test Brand TH',
      brand_category_id: 1,
      display_order: 1,
      imageFile: new File([''], 'test.png'),
    });

    component.emailDetailForm.patchValue({
      send_email_when_redeemed: true,
      to_email: 'test@example.com',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditBrandActions.createBrand({
          data: {
            is_active: true,
            brand_name_english: 'Test Brand EN',
            brand_name_thai: 'Test Brand TH',
            brand_category_id: 1,
            display_order: 1,
            send_email_when_redeemed: true,
            to_email: 'test@example.com',
            cc_email: '',
            email_subject_english: '',
            email_subject_thai: '',
            email_body_english: '',
            email_body_thai: '',
          },
          file: new File([''], 'test.png'),
        })
      );
    }, 0);
  });

  it('should handle form submission for updating a brand', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.formMode.set('edit');
    component.brandId.set(123);
    component.baseSettingForm.patchValue({
      is_active: true,
      brand_name_english: 'Updated Brand EN',
      brand_name_thai: 'Updated Brand TH',
      brand_category_id: 2,
      display_order: 2,
      imageFile: new File([''], 'updated.png'),
    });

    component.onSubmit();

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditBrandActions.updateBrand({
          id: 123,
          data: {
            is_active: true,
            brand_name_english: 'Updated Brand EN',
            brand_name_thai: 'Updated Brand TH',
            brand_category_id: 2,
            display_order: 2,
            send_email_when_redeemed: false,
            to_email: '',
            cc_email: '',
            email_subject_english: '',
            email_subject_thai: '',
            email_body_english: '',
            email_body_thai: '',
          },
          file: new File([''], 'updated.png'),
        })
      );
    }, 0);
  });

  it('should disable all forms', () => {
    component.disableAllForm();
    expect(component.baseSettingForm.disabled).toBe(true);
    expect(component.emailDetailForm.disabled).toBe(true);
  });

  it('should enable all forms', () => {
    component.enableAllForm();
    expect(component.baseSettingForm.enabled).toBe(true);
    expect(component.emailDetailForm.enabled).toBe(true);
  });

  it('should reset all on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(CreateEditBrandActions.resetAll());
  });
});
