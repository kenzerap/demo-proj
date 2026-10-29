import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditFundTypeComponent } from './create-edit-fund-type.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';
import * as CreateEditFundTypeActions from '../../stores/create-edit-fund-type/create-edit-fund-type.actions';
import * as CreateEditFundTypeSelectors from '../../stores/create-edit-fund-type/create-edit-fund-type.selectors';

describe('CreateEditFundTypeComponent', () => {
  let component: CreateEditFundTypeComponent;
  let fixture: ComponentFixture<CreateEditFundTypeComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockActivatedRoute = {
      params: of({}),
      snapshot: { params: {} },
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditFundTypeComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: CreateEditFundTypeSelectors.selectChannelOptions, value: [] },
            {
              selector: CreateEditFundTypeSelectors.selectProductCodeOptions,
              value: [],
            },
            {
              selector: CreateEditFundTypeSelectors.selectNationalityOptions,
              value: [],
            },
          ],
        }),
        provideMockActions(() => actions$),
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditFundTypeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to create mode', () => {
    expect(component.formMode()).toBe('create');
    expect(component.fundId()).toBe(0);
  });

  it('should get the underlying form arrays', () => {
    expect(component.productCodesFormArray).toBe(
      component.productCodeForm.get('product_codes')
    );
    expect(component.channelsFormArray).toBe(
      component.channelForm.get('channels')
    );
    expect(component.nationalitiesFormArray).toBe(
      component.nationalityForm.get('nationalities')
    );
  });

  it('should set form dirty on value change (not view mode)', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.formMode.set('edit');
    component.baseSettingForm.get('amcs')?.setValue('AMCS1');
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditFundTypeActions.setFormDirty({ isDirty: true })
    );
  });

  it('should not set form dirty on value change while in view mode', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.formMode.set('view');
    component.baseSettingForm.get('amcs')?.setValue('AMCS1');
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      CreateEditFundTypeActions.setFormDirty({ isDirty: true })
    );
  });

  it('should dispatch setFormDirty(false) and open dialog on createFundTypeSuccess', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    actions$.next({
      type: CreateEditFundTypeActions.createFundTypeSuccess.type,
    });
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditFundTypeActions.setFormDirty({ isDirty: false })
    );
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should navigate to the list after the success dialog closes', () => {
    actions$.next({
      type: CreateEditFundTypeActions.createFundTypeSuccess.type,
    });
    mockDialog
      .open()
      .afterClosed()
      .subscribe(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith([
          'master-data-management',
          'fund-type',
          'list',
        ]);
      });
  });

  it('should mark all forms as touched and not dispatch when invalid on submit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onSubmit();

    expect(component.baseSettingForm.touched).toBeTruthy();
    expect(component.productCodeForm.touched).toBeTruthy();
    expect(component.channelForm.touched).toBeTruthy();
    expect(component.nationalityForm.touched).toBeTruthy();
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: CreateEditFundTypeActions.createFundType.type })
    );
  });

  it('should dispatch createFundType when all forms are valid and mode is create', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.baseSettingForm.patchValue({
      amcs: 'AMCS1',
      fund_code_amcs: 'FC1',
      fund_code_as400: 'FC2',
      fund_th: 'กองทุน',
      fund_en: 'Fund',
      fund_type: 'EQUITY_FUND',
      risk_level: 5,
    });
    component.productCodesFormArray.at(0).patchValue({ product_code: 'PC001' });
    component.channelsFormArray.at(0).patchValue({ channel: 'ONLINE' });
    component.nationalitiesFormArray
      .at(0)
      .patchValue({ nationality: 'THAI' });

    component.formMode.set('create');
    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: CreateEditFundTypeActions.createFundType.type,
      })
    );
  });

  it('should dispatch updateFundType with the fundId when mode is edit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.baseSettingForm.patchValue({
      amcs: 'AMCS1',
      fund_code_amcs: 'FC1',
      fund_code_as400: 'FC2',
      fund_th: 'กองทุน',
      fund_en: 'Fund',
      fund_type: 'EQUITY_FUND',
      risk_level: 5,
    });
    component.productCodesFormArray.at(0).patchValue({ product_code: 'PC001' });
    component.channelsFormArray.at(0).patchValue({ channel: 'ONLINE' });
    component.nationalitiesFormArray
      .at(0)
      .patchValue({ nationality: 'THAI' });

    component.fundId.set(99);
    component.formMode.set('edit');
    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: CreateEditFundTypeActions.updateFundType.type,
        data: expect.objectContaining({ fund_id: 99 }),
      })
    );
  });

  it('should set form mode and enable forms on setFormMode(edit)', () => {
    const enableSpy = jest.spyOn(component, 'enableAllForm');
    component.setFormMode('edit');
    expect(component.formMode()).toBe('edit');
    expect(enableSpy).toHaveBeenCalled();
  });

  it('should disable and enable all forms', () => {
    component.disableAllForm();
    expect(component.baseSettingForm.disabled).toBeTruthy();
    expect(component.productCodeForm.disabled).toBeTruthy();
    expect(component.channelForm.disabled).toBeTruthy();
    expect(component.nationalityForm.disabled).toBeTruthy();

    component.enableAllForm();
    expect(component.baseSettingForm.enabled).toBeTruthy();
    expect(component.productCodeForm.enabled).toBeTruthy();
    expect(component.channelForm.enabled).toBeTruthy();
    expect(component.nationalityForm.enabled).toBeTruthy();
  });

  it('should dispatch reset on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(CreateEditFundTypeActions.reset());
  });
});
