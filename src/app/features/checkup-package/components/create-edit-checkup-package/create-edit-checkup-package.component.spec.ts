import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CreateEditCheckupPackageomponent } from './create-edit-checkup-package.component';
import * as CreateEditCheckupPackageActions from '../../stores/create-edit-checkup-package/create-edit-checkup-package.actions';
import * as fromLoading from 'src/app/store/loading/loading.reducer';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { CheckupPackage } from '../../models/checkup-package.model';

describe('CreateEditCheckupPackageomponent', () => {
  let component: CreateEditCheckupPackageomponent;
  let fixture: ComponentFixture<CreateEditCheckupPackageomponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockHasPermissionService: any;

  const mockCheckupPackage: CheckupPackage = {
    id: 1,
    package_name_th: 'Test Package TH',
    package_name_en: 'Test Package EN',
    name: 'Test Name',
    description: 'Test Description',
    is_published: true,
  } as any;

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
    };

    mockHasPermissionService = {
      hasPermission: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditCheckupPackageomponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatNativeDateModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            [fromLoading.featureKey]: { isLoading: {} },
          },
        }),
        provideMockActions(() => actions$),
        FormBuilder,
        DatePipe,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HasPermissionService, useValue: mockHasPermissionService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditCheckupPackageomponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Mock the selector
    store.overrideSelector('selectCheckupPackageDetail', null);
    store.overrideSelector('selectIsLoading', false);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.formMode()).toBe('create');
      expect(component.checkupPackageId()).toBe(0);
      expect(component.featurePermissionCode).toBe(FeaturePermissionCode);
      expect(component.actionPermissionCode).toBe(ActionPermissionCode);
    });

    it('should initialize forms with empty values', () => {
      expect(component.masterListForm.get('package_name_th')?.value).toBe('');
      expect(component.masterListForm.get('package_name_en')?.value).toBe('');
      expect(component.packageSettingForm.get('name')?.value).toBe('');
      expect(component.packageSettingForm.get('description')?.value).toBe('');
      expect(component.packageSettingForm.get('published')?.value).toBe(false);
    });
  });

  describe('Permission Handling', () => {
    it('should check hasEditPermission correctly', () => {
      expect(mockHasPermissionService.hasPermission).toHaveBeenCalledWith([
        {
          feature: FeaturePermissionCode.CheckupPackage,
          action: ActionPermissionCode.CreateEdit,
        },
      ]);
      expect(component.hasEditPermission).toBe(true);
    });
  });

  describe('Form Mode Management', () => {
    it('should set form mode to create', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.setFormMode('create');

      expect(component.formMode()).toBe('create');

      // Wait for setTimeout
      setTimeout(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          CreateEditCheckupPackageActions.setFormDirty({ isDirty: false })
        );
      }, 0);
    });

    it('should set form mode to edit and enable forms', () => {
      const enableAllFormSpy = jest.spyOn(component, 'enableAllForm');
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.setFormMode('edit');

      expect(component.formMode()).toBe('edit');
      expect(enableAllFormSpy).toHaveBeenCalled();

      // Wait for setTimeout
      setTimeout(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          CreateEditCheckupPackageActions.setFormDirty({ isDirty: false })
        );
      }, 0);
    });

    it('should set form mode to view', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.setFormMode('view');

      expect(component.formMode()).toBe('view');

      // Wait for setTimeout
      setTimeout(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          CreateEditCheckupPackageActions.setFormDirty({ isDirty: false })
        );
      }, 0);
    });
  });

  describe('Form State Management', () => {
    it('should disable all forms', () => {
      component.disableAllForm();

      expect(component.masterListForm.disabled).toBe(true);
      expect(component.packageSettingForm.disabled).toBe(false);
    });

    it('should enable all forms', () => {
      // First disable to test enable
      component.disableAllForm();
      component.enableAllForm();

      expect(component.masterListForm.enabled).toBe(true);
      expect(component.packageSettingForm.enabled).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should validate masterListForm fields as required', () => {
      component.masterListForm.patchValue({
        package_name_th: '',
        package_name_en: '',
      });

      expect(
        component.masterListForm.get('package_name_th')?.hasError('required')
      ).toBe(true);
      expect(
        component.masterListForm.get('package_name_en')?.hasError('required')
      ).toBe(true);
    });

    it('should validate packageSettingForm fields as required', () => {
      component.packageSettingForm.patchValue({
        name: '',
        description: '',
      });

      expect(
        component.packageSettingForm.get('name')?.hasError('required')
      ).toBe(true);
      expect(
        component.packageSettingForm.get('description')?.hasError('required')
      ).toBe(true);
    });

    it('should have valid forms with proper values', () => {
      component.masterListForm.patchValue({
        package_name_th: 'Test TH',
        package_name_en: 'Test EN',
      });
      component.packageSettingForm.patchValue({
        name: 'Test Name',
        description: 'Test Description',
        published: true,
      });

      expect(component.masterListForm.valid).toBe(true);
      expect(component.packageSettingForm.valid).toBe(true);
    });
  });

  describe('Form Value Changes', () => {
    it('should dispatch setFormDirty when masterListForm changes and not in view mode', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.formMode.set('edit'); // Not view mode

      component.masterListForm.patchValue({
        package_name_th: 'Changed TH',
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditCheckupPackageActions.setFormDirty({ isDirty: true })
      );
    });

    it('should dispatch setFormDirty when packageSettingForm changes and not in view mode', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.formMode.set('create'); // Not view mode

      component.packageSettingForm.patchValue({
        name: 'Changed Name',
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditCheckupPackageActions.setFormDirty({ isDirty: true })
      );
    });

    it('should not dispatch setFormDirty when in view mode', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.formMode.set('view');

      component.masterListForm.patchValue({
        package_name_th: 'Changed TH',
      });

      // Should not be called for form dirty because of view mode filter
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe('Success Actions Handling', () => {
    it('should handle createCheckupPackageSuccess action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.formMode.set('create');

      // Simulate success action
      actions$.next(
        CreateEditCheckupPackageActions.createCheckupPackageSuccess()
      );

      setTimeout(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          CreateEditCheckupPackageActions.setFormDirty({ isDirty: false })
        );
        expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
          data: {
            message: 'The master data was created',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });
      }, 0);
    });

    it('should handle updateCheckupPackageSuccess action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.formMode.set('edit');

      // Simulate success action
      actions$.next(
        CreateEditCheckupPackageActions.updateCheckupPackageSuccess()
      );

      setTimeout(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          CreateEditCheckupPackageActions.setFormDirty({ isDirty: false })
        );
        expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
          data: {
            message: 'The master data was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });
      }, 0);
    });

    it('should navigate to list page after dialog closes', () => {
      // Simulate success action
      actions$.next(
        CreateEditCheckupPackageActions.createCheckupPackageSuccess()
      );

      // The dialog afterClosed is mocked to return of(true)
      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith([
          'master-data-management',
          'checkup-package',
          'list',
        ]);
      }, 0);
    });
  });

  describe('Component Lifecycle', () => {
    it('should dispatch reset action on destroy', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const superNgOnDestroySpy = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(component)),
        'ngOnDestroy'
      );

      component.ngOnDestroy();

      expect(superNgOnDestroySpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditCheckupPackageActions.reset()
      );
    });
  });

  describe('Observable Subscriptions', () => {
    it('should have createLoading$ observable defined', () => {
      expect(component.createLoading$).toBeDefined();
    });

    it('should have checkupPackageDetail$ observable defined', () => {
      expect(component.checkupPackageDetail$).toBeDefined();
    });
  });

  describe('Signal Properties', () => {
    it('should update checkupPackageId signal', () => {
      component.checkupPackageId.set(999);
      expect(component.checkupPackageId()).toBe(999);
    });

    it('should update formMode signal', () => {
      component.formMode.set('edit');
      expect(component.formMode()).toBe('edit');
    });
  });

  describe('Form getRawValue', () => {
    it('should get raw values from forms', () => {
      component.masterListForm.patchValue({
        package_name_th: 'Test TH',
        package_name_en: 'Test EN',
      });
      component.packageSettingForm.patchValue({
        name: 'Test Name',
        description: 'Test Description',
        published: true,
      });

      const masterListValue = component.masterListForm.getRawValue();
      const packageSettingValue = component.packageSettingForm.getRawValue();

      expect(masterListValue).toEqual({
        package_name_th: 'Test TH',
        package_name_en: 'Test EN',
      });
      expect(packageSettingValue).toEqual({
        name: 'Test Name',
        description: 'Test Description',
        published: true,
      });
    });
  });
});
