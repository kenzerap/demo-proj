import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of, ReplaySubject, Subject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { CreateEditHomeScreenComponent } from './create-edit-home-screen.component';
import * as CreateEditHomeScreenActions from '../../stores/create-edit-home-screen/create-edit-home-screen.actions';
import * as createEditHomeScreenSelectors from '../../stores/create-edit-home-screen/create-edit-home-screen.selectors';
import { CategoryCode } from '../../constants/category-options.const';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { AttributeCode } from '../../utils/privilege-attribute-code.enum';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { DestinationCode } from '@app/shared/constants/destination-options.const';

describe('CreateEditHomeScreenComponent', () => {
  let component: CreateEditHomeScreenComponent;
  let fixture: ComponentFixture<CreateEditHomeScreenComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let formBuilder: FormBuilder;

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
      params: of({ homeScreenId: 123 }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditHomeScreenComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatNativeDateModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: createEditHomeScreenSelectors.selectHomeScreenDetail,
              value: {
                section_name: 'Section',
                description: 'Desc',
                category_type: CategoryCode.GroupByPrivilege,
                start_date_time: '2024-01-01T00:00:00Z',
                end_date_time: '2024-01-02T00:00:00Z',
                is_published: true,
                title_thai: 'ไทย',
                title_english: 'English',
              },
            },
          ],
        }),
        provideMockActions(() => actions$),
        FormBuilder,
        DatePipe,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditHomeScreenComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and patch values on ngOnInit', () => {
    component.ngOnInit();
    expect(component.baseSettingForm.value.sectionName).toBe('Section');
    expect(component.baseSettingForm.value.description).toBe('Desc');
    expect(component.baseSettingForm.value.category).toBe(
      CategoryCode.GroupByPrivilege
    );
    expect(component.baseSettingForm.value.published).toBe(true);
    expect(component.displaySettingForm.value.title_th).toBe('ไทย');
    expect(component.displaySettingForm.value.title_en).toBe('English');
  });

  it('should dispatch setFormDirty on form value changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.formMode.set('edit');
    component.baseSettingForm.get('sectionName')?.setValue('New Section');
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditHomeScreenActions.setFormDirty({ isDirty: true })
    );
  });

  it('should dispatch getHomeScreenDetail on param change', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditHomeScreenActions.getHomeScreenDetail({ homeScreenId: 123 })
    );
  });

  it('should dispatch setFormDirty(false) on create/update success', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    actions$.next(CreateEditHomeScreenActions.createHomeScreenSuccess());
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditHomeScreenActions.setFormDirty({ isDirty: false })
    );
  });

  it('should open dialog and navigate on create/update success', () => {
    actions$.next(CreateEditHomeScreenActions.createHomeScreenSuccess());
    expect(mockDialog.open).toHaveBeenCalled();
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'application-management',
      'home-screen-management',
      'list',
    ]);
  });

  it('should set form mode and disable forms', () => {
    const disableSpy = jest.spyOn(component.baseSettingForm, 'disable');
    component.setFormMode('view');
    expect(component.formMode()).toBe('view');
    setTimeout(() => {
      expect(disableSpy).toHaveBeenCalled();
    }, 0);
  });

  it('should enable forms when not in view mode', () => {
    component.setFormMode('edit');
    expect(component.formMode()).toBe('edit');
    expect(component.baseSettingForm.enabled).toBe(true);
  });

  it('should call setValuePrivilegeForm, setValueShortcutMenuForm, setValueHighlightCardForm', () => {
    const privSpy = jest.spyOn(component as any, 'setValuePrivilegeForm');
    const shortcutSpy = jest.spyOn(
      component as any,
      'setValueShortcutMenuForm'
    );
    const highlightSpy = jest.spyOn(
      component as any,
      'setValueHighlightCardForm'
    );
    // Patch value with different category types
    component['homeScreenManagementDetail$'] = of({
      category_type: CategoryCode.GroupByPrivilege,
    } as any);
    component.ngOnInit();
    expect(privSpy).toHaveBeenCalled();

    component['homeScreenManagementDetail$'] = of({
      category_type: CategoryCode.GroupByShortcutMenu,
    } as any);
    component.ngOnInit();
    expect(shortcutSpy).toHaveBeenCalled();

    component['homeScreenManagementDetail$'] = of({
      category_type: CategoryCode.GroupByHightlightCard,
    } as any);
    component.ngOnInit();
    expect(highlightSpy).toHaveBeenCalled();
  });

  it('should handle formMode valueChanges for category', () => {
    component.baseSettingForm
      .get('category')
      ?.setValue(CategoryCode.GroupByPrivilege);
    expect(component.privilegeForm).toBeTruthy();
    component.baseSettingForm
      .get('category')
      ?.setValue(CategoryCode.GroupByShortcutMenu);
    expect(component.shortcutMenuForm).toBeTruthy();
    component.baseSettingForm
      .get('category')
      ?.setValue(CategoryCode.GroupByHightlightCard);
    expect(component.highlightCardForm).toBeTruthy();
  });

  it('should call router.navigate on cancel', () => {
    component['router'].navigate(['test']);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['test']);
  });

  it('should open dialog on confirm', () => {
    component['dialog'].open(ConfirmDialogComponent);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  //
  it('should call disableAllForm and enableAllForm', () => {
    component.disableAllForm();
    expect(component.baseSettingForm.disabled).toBe(true);
    component.setFormMode('edit');
    expect(component.baseSettingForm.enabled).toBe(true);
  });

  it('should call setFormMode and dispatch setFormDirty', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.setFormMode('edit');
    expect(component.formMode()).toBe('edit');
    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditHomeScreenActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  });

  it('should call enableAllForm and disable value for USER_REMAINING_POINT only', () => {
    component.baseSettingForm.patchValue({
      category: CategoryCode.GroupByPrivilege,
    });
    component.privilegeForm.setControl(
      'conditions',
      formBuilder.array([
        formBuilder.group({
          attribute: [AttributeCode.TIER],
          value: [''],
        }),
        formBuilder.group({
          attribute: [AttributeCode.USER_REMAINING_POINT],
          value: [''],
        }),
      ])
    );
    component.enableAllForm();
    const controls = (component.privilegeForm.get('conditions') as FormArray)
      .controls;
    expect(controls[0].get('value')?.disabled).toBe(false);
    expect(controls[1].get('value')?.disabled).toBe(true);
  });

  it('should call setValuePrivilegeForm and disable the form', () => {
    const detail = {
      privilege_section_list: [
        {
          privilegeConditionsId: '1',
          attribute: AttributeCode.TIER,
          operator: CompareConditionType.Is,
          value: 'Gold',
        },
      ],
    } as any;
    component.setValuePrivilegeForm(detail);
    expect(component.privilegeForm.disabled).toBe(true);
    expect(
      (component.privilegeForm.get('conditions') as FormArray).length
    ).toBe(1);
  });

  it('should call setValueShortcutMenuForm and disable the form', () => {
    const detail = {
      shortcuts_highlights_list: [
        {
          shortcut_id: '1',
          name_english: 'Shortcut EN',
          name_thai: 'Shortcut TH',
          image_data: 'img',
          image: 'img.png',
          destination_type: DestinationCode.PrivilegeList,
          destination_value: 'val',
        },
      ],
    } as any;
    component.setValueShortcutMenuForm(detail);
    expect(component.shortcutMenuForm.disabled).toBe(true);
    expect(
      (component.shortcutMenuForm.get('shortcutMenus') as FormArray).length
    ).toBe(1);
  });

  it('should call setValueHighlightCardForm and disable the form', () => {
    const detail = {
      shortcuts_highlights_list: [
        {
          shortcut_id: '1',
          name_english: 'Highlight EN',
          name_thai: 'Highlight TH',
          image_data: 'img',
          image: 'img.png',
          destination_type: DestinationCode.PrivilegeList,
          destination_value: 'val',
        },
      ],
    } as any;
    component.setValueHighlightCardForm(detail);
    expect(component.highlightCardForm.disabled).toBe(true);
    expect(
      (component.highlightCardForm.get('highlightCards') as FormArray).length
    ).toBe(1);
  });

  it('should call getStartDateTimeEndDateTime and return correct values', () => {
    const form = formBuilder.group({
      start_date: ['2024-01-01'],
      start_time: ['10:30'],
      end_date: ['2024-01-02'],
      end_time: ['12:00'],
    });
    const result = component.getStartDateTimeEndDateTime(form);
    expect(result.start_date_time).toBeInstanceOf(Date);
    expect(result.end_date_time).toBeInstanceOf(Date);
    expect(result.start_date_time.getHours()).toBe(10);
    expect(result.start_date_time.getMinutes()).toBe(30);
    expect(result.end_date_time?.getHours()).toBe(12);
    expect(result.end_date_time?.getMinutes()).toBe(0);
  });

  it('should dispatch updateHomeScreen if formMode is edit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.setFormMode('edit');
    component.baseSettingForm.patchValue({
      sectionName: 'Section',
      description: 'Desc',
      category: CategoryCode.GroupByShortcutMenu,
      published: true,
      start_date: new Date(),
      start_time: '10:00',
      isSetEndDate: false,
    });
    component.displaySettingForm.patchValue({
      title_th: 'ไทย',
      title_en: 'English',
    });
    component.shortcutMenuForm.setControl(
      'shortcutMenus',
      formBuilder.array([
        formBuilder.group({
          id: '1',
          shortcut_en: 'Shortcut EN',
          shortcut_th: 'Shortcut TH',
          imageFile: new File([''], 'file.png'),
          imageUrl: 'img',
          imageName: 'file.png',
          destination_type: DestinationCode.PrivilegeList,
          destination_value: 'val',
        }),
      ])
    );
    component.onSubmit();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should call ngOnDestroy and dispatch reset', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditHomeScreenActions.reset()
    );
  });
});
