import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { HomeBaseSettingSectionComponent } from '../home-base-setting-section/home-base-setting-section.component';
import { HomeDisplaySectionComponent } from '../home-display-section/home-display-section.component';
import { HomeGroupConditionSectionComponent } from '../home-group-condition-section/home-group-condition-section.component';
import { HomeShortcutMenuSectionComponent } from '../home-shortcut-menu-section/home-shortcut-menu-section.component';
import { Store } from '@ngrx/store';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import {
  noSpacesValidator,
  noSpacesValidatorAsync,
} from '@app/shared/utils/no-spaces-validator';
import { HomeHighLightCardSectionComponent } from '../home-highlight-card-section/home-highlight-card-section.component';
import { CategoryCode } from '../../constants/category-options.const';
import {
  AttributeCode,
  ValueOptionsCode,
} from '../../utils/privilege-attribute-code.enum';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { DestinationCode } from '@app/shared/constants/destination-options.const';
import { filter, merge, Observable, takeUntil } from 'rxjs';
import * as CreateEditHomeScreenActions from '../../stores/create-edit-home-screen/create-edit-home-screen.actions';
import * as createEditHomeScreenSelectors from '../../stores/create-edit-home-screen/create-edit-home-screen.selectors';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreateEditHomeScreenQueryParams,
  PrivilegeSection,
  ShortcutHighlight,
} from '../../models/create-edit-home-screen-query-params.model';
import { HomeScreenManagementDetail } from '../../models/home-screen-management.model';
import { urlValidator } from '@app/shared/utils/url-validator';

@Component({
  selector: 'app-create-edit-home-screen',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    HomeBaseSettingSectionComponent,
    HomeDisplaySectionComponent,
    HomeGroupConditionSectionComponent,
    HomeShortcutMenuSectionComponent,
    HomeHighLightCardSectionComponent,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-home-screen.component.html',
  styleUrls: ['./create-edit-home-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditHomeScreenComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);

  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  createLoading$ = this.store.select(selectIsLoading(`createEditHomeScreen`));
  homeScreenManagementDetail$: Observable<HomeScreenManagementDetail | null> =
    this.store.select(createEditHomeScreenSelectors.selectHomeScreenDetail);

  homeScreenManagementId: WritableSignal<number> = signal(0);

  categoryCode = CategoryCode;

  baseSettingForm: FormGroup = this.fb.group({
    sectionName: ['', Validators.required, noSpacesValidatorAsync],
    description: ['', Validators.required, noSpacesValidatorAsync],
    category: [CategoryCode.GroupByPrivilege, Validators.required],
    start_date: [''],
    start_time: [''],
    published: [false],
    isSetEndDate: [false],
    end_date: [''],
    end_time: [''],
  });

  displaySettingForm: FormGroup = this.fb.group({
    title_th: ['', Validators.required],
    title_en: ['', Validators.required],
  });

  privilegeForm: FormGroup = this.initPrivilegeForm();

  shortcutMenuForm: FormGroup = this.initShortcutMenuForm();

  highlightCardForm: FormGroup = this.initHighlightCardForm();

  /* istanbul ignore next */
  ngOnInit(): void {
    this.baseSettingForm
      .get('category')
      ?.valueChanges.subscribe((value: CategoryCode) => {
        switch (value) {
          case CategoryCode.GroupByPrivilege:
            this.privilegeForm = this.initPrivilegeForm();
            break;
          case CategoryCode.GroupByShortcutMenu:
            this.shortcutMenuForm = this.initShortcutMenuForm();
            break;
          case CategoryCode.GroupByHightlightCard:
            this.highlightCardForm = this.initHighlightCardForm();
            break;

          default:
            break;
        }
      });

    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['homeScreenId']),
        takeUntil(this.destroy$),
      )
      .subscribe((params) => {
        this.homeScreenManagementId.set(params['homeScreenId']);
        this.setFormMode('view');
        this.disableAllForm();
        this.store.dispatch(
          CreateEditHomeScreenActions.getHomeScreenDetail({
            homeScreenId: this.homeScreenManagementId(),
          }),
        );
      });

    this.homeScreenManagementDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((homeScreenManagementDetail) => !!homeScreenManagementDetail),
      )
      .subscribe((homeScreenManagementDetail: HomeScreenManagementDetail) => {
        this.baseSettingForm.patchValue({
          sectionName: homeScreenManagementDetail?.section_name,
          description: homeScreenManagementDetail?.description,
          category: homeScreenManagementDetail.category_type,
          start_date: homeScreenManagementDetail?.start_date_time,
          start_time: this.datePipe.transform(
            homeScreenManagementDetail?.start_date_time,
            'HH:mm',
          ),
          end_date: homeScreenManagementDetail?.end_date_time,
          end_time: this.datePipe.transform(
            homeScreenManagementDetail?.end_date_time,
            'HH:mm',
          ),
          published: homeScreenManagementDetail.is_published,
          isSetEndDate: !!homeScreenManagementDetail.end_date_time,
        });

        this.displaySettingForm.patchValue({
          title_th: homeScreenManagementDetail.title_thai,
          title_en: homeScreenManagementDetail.title_english,
        });

        this.setValuePrivilegeForm(homeScreenManagementDetail);
        if (
          homeScreenManagementDetail.category_type ===
          CategoryCode.GroupByShortcutMenu
        ) {
          this.setValueShortcutMenuForm(homeScreenManagementDetail);
        }
        if (
          homeScreenManagementDetail.category_type ===
          CategoryCode.GroupByHightlightCard
        ) {
          this.setValueHighlightCardForm(homeScreenManagementDetail);
        }

        this.baseSettingForm.markAsPristine();
        this.displaySettingForm.markAsPristine();
        this.privilegeForm.markAsPristine();
        this.shortcutMenuForm.markAsPristine();
        this.highlightCardForm.markAsPristine();

        setTimeout(() => {
          this.store.dispatch(
            CreateEditHomeScreenActions.setFormDirty({
              isDirty: false,
            }),
          );
        }, 0);
      });

    merge(
      this.baseSettingForm.valueChanges,
      this.displaySettingForm.valueChanges,
      this.privilegeForm.valueChanges,
      this.shortcutMenuForm.valueChanges,
      this.highlightCardForm.valueChanges,
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view'),
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditHomeScreenActions.setFormDirty({ isDirty: true }),
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditHomeScreenActions.createHomeScreenSuccess,
          CreateEditHomeScreenActions.updateHomeScreenSuccess,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditHomeScreenActions.setFormDirty({ isDirty: false }),
        );
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The section order was created`
                : 'The section was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([
            'application-management',
            'home-screen-management',
            'list',
          ]);
        });
      });

    this.store.dispatch(
      CreateEditHomeScreenActions.getTierGroups({
        page: 0,
        size: 999,
      }),
    );
  }

  initPrivilegeForm() {
    return this.fb.group({
      conditions: this.fb.array([
        this.fb.group({
          privilegeConditionsId: [''],
          attribute: [AttributeCode.START_DATE, Validators.required],
          condition: [CompareConditionType.Is, Validators.required],
          value: [ValueOptionsCode.Today, [Validators.required]],
          group_condition: [null],
        }),
      ]),
    });
  }

  initShortcutMenuForm() {
    return this.fb.group({
      shortcutMenus: this.fb.array([
        this.fb.group({
          id: [''],
          shortcut_en: ['', Validators.required, noSpacesValidatorAsync],
          shortcut_th: ['', Validators.required, noSpacesValidatorAsync],
          imageFile: ['', Validators.required],
          imageUrl: [''],
          imageName: [''],
          destination_type: [DestinationCode.PrivilegeList],
          destination_value: [''],
        }),
      ]),
    });
  }

  initHighlightCardForm() {
    return this.fb.group({
      highlightCards: this.fb.array([
        this.fb.group({
          id: [''],
          highlightCard_en: ['', Validators.required, noSpacesValidatorAsync],
          highlightCard_th: ['', Validators.required, noSpacesValidatorAsync],
          imageFile: ['', Validators.required],
          imageUrl: [''],
          imageName: [''],
          destination_type: [DestinationCode.PrivilegeList],
          destination_value: [''],
        }),
      ]),
    });
  }

  setValuePrivilegeForm(
    homeScreenManagementDetail: HomeScreenManagementDetail,
  ) {
    const conditionsFormArray = this.privilegeForm.get(
      'conditions',
    ) as FormArray;
    conditionsFormArray.clear();

    const newConditionsFormArray: FormArray = this.fb.array([]);
    (homeScreenManagementDetail.privilege_section_list || []).forEach(
      (privilege, index) => {
        const conditionGroup = this.fb.group({
          privilegeConditionsId: [privilege.privilegeConditionsId || ''],
          attribute: [privilege.attribute, Validators.required],
          condition: [privilege.operator, Validators.required],
          value: [privilege.value, [Validators.required]],
          group_condition: [
            !!homeScreenManagementDetail.privilege_section_list[index + 1]
              ? CompareConditionType.AND
              : null,
          ],
        });
        newConditionsFormArray.push(conditionGroup);
      },
    );
    this.privilegeForm.setControl('conditions', newConditionsFormArray);
    conditionsFormArray.updateValueAndValidity();
    this.privilegeForm.disable({ emitEvent: false });
  }

  setValueShortcutMenuForm(
    homeScreenManagementDetail: HomeScreenManagementDetail,
  ) {
    const shortcutMenusFormArray = this.shortcutMenuForm.get(
      'shortcutMenus',
    ) as FormArray;
    shortcutMenusFormArray.clear();

    const newShortcutMenusFormArray: FormArray = this.fb.array([]);
    (homeScreenManagementDetail.shortcuts_highlights_list || []).forEach(
      (shortcut) => {
        const shortcutGroup = this.fb.group({
          id: [shortcut.shortcut_id || ''],
          shortcut_en: [
            shortcut.name_english,
            Validators.required,
            noSpacesValidatorAsync,
          ],
          shortcut_th: [
            shortcut.name_thai,
            Validators.required,
            noSpacesValidatorAsync,
          ],
          imageFile: [shortcut.image_data, Validators.required],
          imageUrl: [shortcut.image_data],
          imageName: [shortcut.image],
          destination_type: [shortcut.destination_type],
          destination_value:
            shortcut.destination_type === DestinationCode.URL
              ? [
                  shortcut.destination_value,
                  [Validators.required, noSpacesValidator, urlValidator],
                ]
              : [shortcut.destination_value],
        });
        newShortcutMenusFormArray.push(shortcutGroup);
      },
    );
    this.shortcutMenuForm.setControl(
      'shortcutMenus',
      newShortcutMenusFormArray,
    );
    shortcutMenusFormArray.updateValueAndValidity();
    this.shortcutMenuForm.disable({ emitEvent: false });
  }

  setValueHighlightCardForm(
    homeScreenManagementDetail: HomeScreenManagementDetail,
  ) {
    const highlightCardsFormArray = this.highlightCardForm.get(
      'highlightCards',
    ) as FormArray;
    highlightCardsFormArray.clear();

    const newHighlightCardsFormArray: FormArray = this.fb.array([]);
    (homeScreenManagementDetail.shortcuts_highlights_list || []).forEach(
      (shortcut) => {
        const shortcutGroup = this.fb.group({
          id: [shortcut.shortcut_id || ''],
          highlightCard_en: [
            shortcut.name_english,
            Validators.required,
            noSpacesValidatorAsync,
          ],
          highlightCard_th: [
            shortcut.name_thai,
            Validators.required,
            noSpacesValidatorAsync,
          ],
          imageFile: [shortcut.image_data, Validators.required],
          imageUrl: [shortcut.image_data],
          imageName: [shortcut.image],
          destination_type: [shortcut.destination_type],
          destination_value:
            shortcut.destination_type === DestinationCode.URL
              ? [
                  shortcut.destination_value,
                  [Validators.required, noSpacesValidator, urlValidator],
                ]
              : [shortcut.destination_value],
        });
        newHighlightCardsFormArray.push(shortcutGroup);
      },
    );
    this.highlightCardForm.setControl(
      'highlightCards',
      newHighlightCardsFormArray,
    );
    highlightCardsFormArray.updateValueAndValidity();
    this.highlightCardForm.disable({ emitEvent: false });
  }

  /* istanbul ignore next */
  onSubmit() {
    let secondSectionValid = false;
    this.baseSettingForm.get('start_time')?.updateValueAndValidity();

    if (
      this.baseSettingForm.get('category')?.value ===
      CategoryCode.GroupByPrivilege
    ) {
      const privilegeConditions =
        this.privilegeForm.getRawValue()?.conditions || [];
      const isValidCondition = privilegeConditions.length > 0;

      secondSectionValid =
        this.privilegeForm.valid &&
        this.displaySettingForm.valid &&
        isValidCondition;
    }

    if (
      this.baseSettingForm.get('category')?.value ===
      CategoryCode.GroupByShortcutMenu
    ) {
      const shortcutMenus: any[] =
        this.shortcutMenuForm.getRawValue()?.shortcutMenus || [];
      const isValidCondition = shortcutMenus.length > 0;

      secondSectionValid =
        this.shortcutMenuForm.valid &&
        this.displaySettingForm.valid &&
        isValidCondition;
    }

    if (
      this.baseSettingForm.get('category')?.value ===
      CategoryCode.GroupByHightlightCard
    ) {
      const highlightCards: any[] =
        this.highlightCardForm.getRawValue()?.highlightCards || [];
      const isValidCondition = highlightCards.length > 0;

      secondSectionValid =
        this.highlightCardForm.valid &&
        this.displaySettingForm.valid &&
        isValidCondition;
    }

    // check validate
    const isValidForm = this.baseSettingForm.valid && secondSectionValid;
    if (!isValidForm) {
      this.baseSettingForm.markAllAsTouched();
      this.displaySettingForm.markAllAsTouched();
      this.privilegeForm.markAllAsTouched();
      this.shortcutMenuForm.markAllAsTouched();
      this.highlightCardForm.markAllAsTouched();

      this.shortcutMenuForm.get('shortcutMenus')?.updateValueAndValidity();
      this.highlightCardForm.get('highlightCards')?.updateValueAndValidity();

      return;
    }

    // baseSettingForm
    const { start_date_time, end_date_time } = this.getStartDateTimeEndDateTime(
      this.baseSettingForm,
    );

    const baseSettingFormValue = this.baseSettingForm.getRawValue();
    const displaySettingFormValue = this.displaySettingForm.getRawValue();
    const privilegeFormValue = this.privilegeForm.getRawValue();
    const shortcutMenuFormValue = this.shortcutMenuForm.getRawValue();
    const highlightCardFormValue = this.highlightCardForm.getRawValue();

    const privilege_section_list: PrivilegeSection[] =
      baseSettingFormValue?.category === CategoryCode.GroupByPrivilege
        ? privilegeFormValue.conditions.map((condition: any) => {
            return {
              attribute: condition.attribute,
              operator: condition.condition,
              value: condition.value,
            };
          })
        : [];

    const shortcutList: ShortcutHighlight[] =
      baseSettingFormValue?.category === CategoryCode.GroupByShortcutMenu
        ? shortcutMenuFormValue.shortcutMenus.map(
            (shortcutMenu: any, index: number) => {
              return {
                id: shortcutMenu.id,
                order_number: index + 1,
                name_english: shortcutMenu.shortcut_en,
                name_thai: shortcutMenu.shortcut_th,
                destination_type: shortcutMenu.destination_type,
                destination_value: shortcutMenu.destination_value || null,
              };
            },
          )
        : [];
    const shortcutImageFiles: File[] = (
      shortcutMenuFormValue.shortcutMenus || []
    ).map((shortcutMenu: any) => {
      return shortcutMenu.imageFile?.name ? shortcutMenu.imageFile : null;
    });

    const highlightList: ShortcutHighlight[] =
      baseSettingFormValue?.category === CategoryCode.GroupByHightlightCard
        ? highlightCardFormValue.highlightCards.map(
            (highlightCard: any, index: number) => {
              return {
                id: highlightCard.id,
                order_number: index + 1,
                name_english: highlightCard.highlightCard_en,
                name_thai: highlightCard.highlightCard_th,
                destination_type: highlightCard.destination_type,
                destination_value: highlightCard.destination_value || null,
              };
            },
          )
        : [];
    const highlightImageFiles: File[] = (
      highlightCardFormValue.highlightCards || []
    ).map((highlightCard: any) => {
      return highlightCard.imageFile?.name ? highlightCard.imageFile : null;
    });

    const bodyQueryParams: Partial<CreateEditHomeScreenQueryParams> = {
      section_name: baseSettingFormValue?.sectionName,
      description: baseSettingFormValue?.description,
      category_type: baseSettingFormValue?.category,
      is_published: baseSettingFormValue?.published,
      start_date_time: baseSettingFormValue?.start_date
        ? start_date_time.toISOString()
        : '',
      end_date_time:
        baseSettingFormValue?.isSetEndDate && baseSettingFormValue?.end_date
          ? end_date_time?.toISOString()
          : '',
      title_thai: displaySettingFormValue?.title_th,
      title_english: displaySettingFormValue?.title_en,
      privilege_section_list,
      shortcuts_highlights_list:
        baseSettingFormValue?.category === CategoryCode.GroupByShortcutMenu
          ? shortcutList
          : highlightList,
    };

    if (this.formMode() === 'edit') {
      this.store.dispatch(
        CreateEditHomeScreenActions.updateHomeScreen({
          data: { ...bodyQueryParams, id: this.homeScreenManagementId() },
          files:
            baseSettingFormValue?.category === CategoryCode.GroupByShortcutMenu
              ? shortcutImageFiles
              : highlightImageFiles,
        }),
      );
    } else {
      this.store.dispatch(
        CreateEditHomeScreenActions.createHomeScreen({
          queryParams: bodyQueryParams,
          files:
            baseSettingFormValue?.category === CategoryCode.GroupByShortcutMenu
              ? shortcutImageFiles
              : highlightImageFiles,
        }),
      );
    }
  }

  setFormMode(mode: 'create' | 'edit' | 'view') {
    this.formMode.set(mode);
    if (mode === 'edit') {
      this.enableAllForm();
    }
    setTimeout(() => {
      this.store.dispatch(
        CreateEditHomeScreenActions.setFormDirty({ isDirty: false }),
      );
    }, 0);
  }

  disableAllForm() {
    this.baseSettingForm.disable({ emitEvent: false });
    this.displaySettingForm.disable({ emitEvent: false });
    this.privilegeForm.disable({ emitEvent: false });
    this.shortcutMenuForm.disable({ emitEvent: false });
    this.highlightCardForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.baseSettingForm.enable({ emitEvent: false });
    this.displaySettingForm.enable({ emitEvent: false });
    this.privilegeForm.enable({ emitEvent: false });
    this.shortcutMenuForm.enable({ emitEvent: false });
    this.highlightCardForm.enable({ emitEvent: false });

    const baseSettingFormValue = this.baseSettingForm.getRawValue();
    if (baseSettingFormValue?.category === CategoryCode.GroupByPrivilege) {
      (
        (this.privilegeForm.get('conditions') as FormArray)?.controls || []
      ).forEach((control) => {
        if (
          control.get('attribute')?.getRawValue() ===
          AttributeCode.USER_REMAINING_POINT
        ) {
          control.get('value')?.disable({ emitEvent: false });
        }
      });
    }
  }

  getStartDateTimeEndDateTime(formGroup: FormGroup): {
    start_date_time: Date;
    end_date_time: Date | null;
  } {
    const rawValue = formGroup.getRawValue();

    const startTime = rawValue.start_time;
    const endTime = rawValue.end_time;
    const startDate = rawValue.start_date;
    const endDate = rawValue.end_date;
    const [startHours, startMinutes] = (startTime || '00:00')
      .split(':')
      .map(Number);
    const start_date_time = new Date(startDate);
    start_date_time.setHours(startHours, startMinutes, 0, 0);
    const [endHours, endMinutes] = (endTime || '00:00').split(':').map(Number);
    const end_date_time = endDate ? new Date(endDate) : null;
    end_date_time?.setHours(endHours, endMinutes, 0, 0);

    return {
      start_date_time,
      end_date_time,
    };
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditHomeScreenActions.reset());
  }
}
