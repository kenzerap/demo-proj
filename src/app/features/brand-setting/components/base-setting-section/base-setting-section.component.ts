import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { combineLatest, filter, Observable, take, takeUntil } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { SvgDefaultImageComponent } from '../../../../shared/icons/svg-default-image/svg-default-image.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {
  DragDropUploadDirective,
  FileDragDrop,
} from '@app/shared/directives/drag-drop-upload.directive';
import { getImageSizeOser } from '@app/shared/utils/get-image-size';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { Store } from '@ngrx/store';
import * as CreateEditBrandActions from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.actions';
import * as CreateEditBrandSelectors from '@app/features/brand-setting/stores/create-edit-brand/create-edit-brand.selectors';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { AddPrivilegeTypeDialogComponent } from '../add-privilege-type-dialog/add-privilege-type-dialog.component';
import { BrandCategory } from '../../models/brand-category.model';
import { BrandDetail } from '../../../../shared/models/brand-model';
import { Actions, ofType } from '@ngrx/effects';
import { checkImageMimeType } from '@app/shared/utils/check-image-mime-type';
import { encodeImageUrl } from '@app/shared/utils/encode-image-url';

@Component({
  selector: 'app-base-setting-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    DemoprojInputComponent,
    SvgDefaultImageComponent,
    MatButtonModule,
    MatDividerModule,
    DragDropUploadDirective,
    SvgPlusComponent,
  ],
  providers: [DatePipe],
  templateUrl: './base-setting-section.component.html',
  styleUrl: './base-setting-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseSettingSectionComponent
  extends BaseComponent
  implements OnInit
{
  private dialog = inject(MatDialog);
  private store = inject(Store);
  private actions$ = inject(Actions);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  _brandDetail!: BrandDetail;
  @Input() set brandDetail(value: BrandDetail) {
    this._brandDetail = value;

    if (value) {
      this.selectedBrandCategory.set({
        brand_category_id: this.brandDetail.brand_category_id,
        brand_category_name_english:
          this.brandDetail.brand_category_name_english,
        brand_category_name_thai: this.brandDetail.brand_category_name_thai,
        display_order: 0,
      });
    }
  }
  get brandDetail() {
    return this._brandDetail;
  }

  imageNameUploaded: WritableSignal<string> = signal<string>('Upload file');
  selectedBrandCategory: WritableSignal<BrandCategory | null> = signal(null);
  brandDisplayOrders: WritableSignal<number[]> = signal([]);

  brandDisplayOrders$: Observable<number[]> = this.store.select(
    CreateEditBrandSelectors.selectBrandDisplayOrders
  );

  get isActiveControl() {
    return this.formGroup?.get('is_active');
  }
  get brandNameEnglishControl() {
    return this.formGroup?.get('brand_name_english');
  }
  get brandNameThaiControl() {
    return this.formGroup?.get('brand_name_thai');
  }
  get brandCategoryIdControl() {
    return this.formGroup?.get('brand_category_id');
  }
  get displayOrderControl() {
    return this.formGroup?.get('display_order');
  }
  get imageFileControl() {
    return this.formGroup?.get('imageFile');
  }
  get imageUrlControl() {
    return this.formGroup?.get('imageUrl');
  }
  get imageNameControl() {
    return this.formGroup?.get('imageName');
  }

  ngOnInit(): void {
    this.displayOrderControl?.setValidators([
      Validators.required,
      Validators.min(1),
      (control: AbstractControl) => this.displayOrdersValidatorAsync(control),
    ]);
    this.brandDisplayOrders$
      .pipe(
        filter((displayOrders) => displayOrders.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe((displayOrders) => {
        this.brandDisplayOrders.set(displayOrders);
      });

    this.imageFileControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((file) => !!file?.name)
      )
      .subscribe((file: File) => {
        this.imageNameUploaded.set(file.name || '');
      });

    combineLatest([
      this.imageUrlControl?.valueChanges || [],
      this.imageNameControl?.valueChanges || [],
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(([url, name]) => !!url && !!name)
      )
      .subscribe(([url, name]) => {
        this.imageNameUploaded.set(name || '');
      });

    this.actions$
      .pipe(
        ofType(CreateEditBrandActions.deleteBrandCategorySuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(({ existedBrands, brandCategoryId }) => {
        if (
          existedBrands.length === 0 &&
          this.selectedBrandCategory()?.brand_category_id === brandCategoryId
        ) {
          this.selectedBrandCategory.set(null);
          this.brandCategoryIdControl?.patchValue(null);
        }
      });

    this.store.dispatch(CreateEditBrandActions.getBrandDisplayOrders());
  }

  addPrivilegeType() {
    const ref = this.dialog.open(AddPrivilegeTypeDialogComponent, {
      data: { selectedBrandCategory: this.selectedBrandCategory() },
      autoFocus: false,
      width: '55rem',
    });

    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: BrandCategory) => {
        if (result) {
          this.selectedBrandCategory.set(result);
          this.brandCategoryIdControl?.patchValue(result.brand_category_id);
        }
      });
  }

  onFileDropped(fileDragDrop: FileDragDrop) {
    const isValidImage = checkImageMimeType(fileDragDrop.file);
    const isStandardSize =
      fileDragDrop.size?.height === 1040 && fileDragDrop.size?.width === 1040;
    if (isStandardSize && isValidImage) {
      this.imageFileControl?.patchValue(fileDragDrop.file);
    } else {
      this.openWarningFileSizeDialog();
    }
  }

  /* istanbul ignore next */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const isValidImage = checkImageMimeType(input.files[0]);

      getImageSizeOser(input.files[0])
        .pipe(take(1))
        .subscribe((size: { width: number; height: number } | null) => {
          if (
            size?.height === 1040 &&
            size?.width === 1040 &&
            input.files?.[0] &&
            isValidImage
          ) {
            this.imageFileControl?.patchValue(input.files?.[0]);
          } else {
            input.value = '';
            this.openWarningFileSizeDialog();
          }
        });
    }
  }

  openWarningFileSizeDialog() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'The file you uploaded is not supported.',
        message:
          'Please upload a file in one of the following format SVG, PNG, JPG or GIF (max. 1040 x 1040px)',
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'warning',
      },
    });
  }

  displayOrdersValidatorAsync(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = Number(control.value) || 0;
    if (!value || value === this.brandDetail?.display_order) {
      return null;
    }

    if (this.brandDisplayOrders().includes(value)) {
      return { displayOrderExists: true };
    }

    return null;
  }

  encodeImageUrl(url: string, imageName: string): string {
    return encodeImageUrl(url, imageName);
  }
}
