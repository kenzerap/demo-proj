import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { filter, Observable, of, takeUntil } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { privilegeTypeListColumns } from '../../constants/privilege-type-list-columns.const';
import * as CreateEditBrandActions from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.actions';
import * as CreateEditBrandSelectors from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.selectors';
import { Store } from '@ngrx/store';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { BrandCategory } from '../../models/brand-category.model';
import { SvgDeleteComponent } from '../../../../shared/icons/svg-delete/svg-delete.component';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { noSpacesValidatorAsync } from '@app/shared/utils/no-spaces-validator';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { Actions, ofType } from '@ngrx/effects';
import { SvgSaveFileComponent } from '../../../../shared/icons/svg-save-file/svg-save-file.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CreateEditBrandCategoryQueryParams } from '../../models/create-edit-brand-category-query-params.model';
import { DeleteBrandWarningDialogComponent } from '../delete-brand-warning-dialog/delete-brand-warning-dialog.component';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';

@Component({
  selector: 'app-add-privilege-type-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    DemoprojTableComponent,
    MatButtonToggleModule,
    SvgDeleteComponent,
    SvgPlusComponent,
    DemoprojInputComponent,
    SvgSaveFileComponent,
    MatFormFieldModule,
  ],
  templateUrl: './add-privilege-type-dialog.component.html',
  styleUrl: './add-privilege-type-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPrivilegeTypeDialogComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<AddPrivilegeTypeDialogComponent>);
  data: { selectedBrandCategory: BrandCategory } = inject(MAT_DIALOG_DATA);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private actions$ = inject(Actions);

  privilegeTypeTableColumns: WritableSignal<TableColumn[]> = signal(
    privilegeTypeListColumns
  );
  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('view');
  brandCategoryDisplayOrders: WritableSignal<number[]> = signal([]);
  selectedItem: WritableSignal<BrandCategory | null> = signal(null);

  loading$ = this.store.select(selectIsLoading(`getBrandCategories`));
  createLoading$ = this.store.select(selectIsLoading(`createBrandCategory`));
  editLoading$ = this.store.select(selectIsLoading(`editBrandCategory`));
  brandCategories$: Observable<BrandCategory[]> = this.store.select(
    CreateEditBrandSelectors.selectBrandCategories
  );

  brandCategoryDisplayOrders$: Observable<number[]> = this.store.select(
    CreateEditBrandSelectors.selectBrandCategoryDisplayOrders
  );

  createPrivilegeTypeForm: FormGroup = this.fb.group({
    brand_category_id: [''],
    brand_category_name_thai: ['', Validators.required, noSpacesValidatorAsync],
    brand_category_name_english: [
      '',
      Validators.required,
      noSpacesValidatorAsync,
    ],
    display_order: [
      '',
      [
        Validators.required,
        Validators.min(1),
        (control: AbstractControl) => this.displayOrdersValidatorAsync(control),
      ],
    ],
  });

  get brandCategoryIdControl() {
    return this.createPrivilegeTypeForm?.get('brand_category_id');
  }
  get brandCategoryNameThaiControl() {
    return this.createPrivilegeTypeForm?.get('brand_category_name_thai');
  }
  get brandCategoryNameEnglishControl() {
    return this.createPrivilegeTypeForm?.get('brand_category_name_english');
  }
  get displayOrderControl() {
    return this.createPrivilegeTypeForm?.get('display_order');
  }

  ngOnInit(): void {
    this.store.dispatch(CreateEditBrandActions.getBrandCategories());
    this.brandCategoryDisplayOrders$
      .pipe(
        filter((displayOrders) => displayOrders.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe((displayOrders) => {
        this.brandCategoryDisplayOrders.set(displayOrders);
      });

    this.actions$
      .pipe(
        ofType(CreateEditBrandActions.deleteBrandCategorySuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(({ existedBrands }) => {
        if (existedBrands.length > 0) {
          const ref = this.dialog.open(DeleteBrandWarningDialogComponent, {
            data: {
              brands: existedBrands,
            },
            autoFocus: false,
            width: '30rem',
          });

          ref.afterClosed().subscribe((result) => {
            if (result === 'navigateExit') {
              this.dialogRef.close();
            }
          });
        } else {
          const messageData: ToastMessageData = {
            title: 'Delete brand category',
            message: `Brand category deleted successfully.`,
            type: ToastMessageType.SUCCESS,
          };

          this.store.dispatch(pushMessage({ messageData, duration: 3000 }));
          this.store.dispatch(CreateEditBrandActions.getBrandCategories());
        }
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditBrandActions.createBrandCategorySuccess,
          CreateEditBrandActions.editBrandCategorySuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.createPrivilegeTypeForm.reset();
        this.selectedItem.set(null);
        this.setFormMode('view');
      });

    this.brandCategories$
      .pipe(takeUntil(this.destroy$))
      .subscribe((brandCategories) => {
        if (this.data.selectedBrandCategory) {
          const category = brandCategories.find(
            (brandCategory) =>
              brandCategory.brand_category_id ===
              this.data.selectedBrandCategory.brand_category_id
          );
          this.selectedItem.set(category || null);
        }
      });
  }

  onSubmit() {
    this.dialogRef.close(this.selectedItem());
  }

  setFormMode(mode: 'create' | 'edit' | 'view') {
    this.createPrivilegeTypeForm.reset();
    this.formMode.set(mode);
  }

  setEditMode(rowData: BrandCategory) {
    this.formMode.set('edit');
    this.createPrivilegeTypeForm.patchValue(rowData);
  }

  createPrivilegeType() {
    const params: Partial<CreateEditBrandCategoryQueryParams> = {
      brand_category_name_english:
        this.createPrivilegeTypeForm.value.brand_category_name_english,
      brand_category_name_thai:
        this.createPrivilegeTypeForm.value.brand_category_name_thai,
      display_order: this.createPrivilegeTypeForm.value.display_order,
    };

    this.store.dispatch(
      CreateEditBrandActions.createBrandCategory({
        params,
      })
    );
  }

  editPrivilegeType(rowData: BrandCategory) {
    const params: Partial<CreateEditBrandCategoryQueryParams> = {
      brand_category_name_english:
        this.createPrivilegeTypeForm.value.brand_category_name_english,
      brand_category_name_thai:
        this.createPrivilegeTypeForm.value.brand_category_name_thai,
      display_order: this.createPrivilegeTypeForm.value.display_order,
    };

    this.store.dispatch(
      CreateEditBrandActions.editBrandCategory({
        brandCategoryId: rowData.brand_category_id,
        params: params,
      })
    );
  }

  deletePrivilegeType(rowData: BrandCategory) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Privilege Type?',
        message: `After you click proceed the privilege type will be deleted.`,
        btnCloseText: 'Cancel',
        btnConfirmText: 'Proceed',
        type: 'warning',
      },
      width: '25rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          CreateEditBrandActions.deleteBrandCategory({
            brandCategoryId: rowData.brand_category_id,
          })
        );
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  displayOrdersValidatorAsync(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = Number(control.value) || 0;
    if (
      !value ||
      (this.formMode() === 'edit' &&
        value === this.selectedItem()?.display_order)
    ) {
      return null;
    }

    if (this.brandCategoryDisplayOrders().includes(value)) {
      return { displayOrderExists: true };
    }

    return null;
  }

  onSelectedItemsChange(event: {
    items: (BrandCategory | null)[];
    toggleItem: BrandCategory | null;
  }) {
    if (
      this.formMode() === 'edit' &&
      this.brandCategoryIdControl?.value !== event.toggleItem?.brand_category_id
    ) {
      this.setFormMode('view');
    }

    this.selectedItem.set(event.toggleItem);
  }
}
