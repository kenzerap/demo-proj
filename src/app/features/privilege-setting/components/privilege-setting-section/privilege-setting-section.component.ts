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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { combineLatest, filter, map, Observable, take, takeUntil } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FileDragDrop } from '@app/shared/directives/drag-drop-upload.directive';
import { getImageSizeOser } from '@app/shared/utils/get-image-size';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { Store } from '@ngrx/store';
import * as CreateEditPrivilegeActions from '@app/features/privilege-setting/stores/create-edit-privilege/create-edit-privilege.actions';
import * as CreateEditPrivilegeSelectors from '@app/features/privilege-setting/stores/create-edit-privilege/create-edit-privilege.selectors';
import { UploadFileComponent } from '../../../../shared/components/upload-file/upload-file.component';
import { privilegeTypes } from '../../constants/privilege-type-options.const';
import { CampaignTypes } from '../../constants/campaign-type-options.const';
import { PrivilegeTypeEnum } from '../../../../shared/utils/enums/privilege-type.enums';
import { urlValidator } from '@app/shared/utils/url-validator';
import { checkImageMimeType } from '@app/shared/utils/check-image-mime-type';

@Component({
  selector: 'app-privilege-setting-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    DemoprojInputComponent,
    MatButtonModule,
    MatDividerModule,
    UploadFileComponent,
  ],
  templateUrl: './privilege-setting-section.component.html',
  styleUrl: './privilege-setting-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivilegeSettingSectionComponent
  extends BaseComponent
  implements OnInit
{
  private dialog = inject(MatDialog);
  private store = inject(Store);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';
  @Input() privilegeId: number | null = null;

  privilegeTypeOptions: ValueCode[] = privilegeTypes;
  campaignTypeOptions: ValueCode[] = CampaignTypes;
  privilegeType = PrivilegeTypeEnum;
  privilegeImageNameUploaded: WritableSignal<string> = signal<string>('');
  thumnailImageNameUploaded: WritableSignal<string> = signal<string>('');

  brandOptions$: Observable<ValueCode<number>[]> = this.store
    .select(CreateEditPrivilegeSelectors.selectBrands)
    .pipe(
      map((brands) => {
        return brands.map((brand) => ({
          code: brand.brand_id,
          value: brand.brand_name_thai,
        }));
      })
    );

  get nameThControl() {
    return this.formGroup?.get('name_th');
  }
  get nameEnControl() {
    return this.formGroup?.get('name_en');
  }
  get thumnailImageFileControl() {
    return this.formGroup?.get('thumnailImageFile');
  }
  get thumnailImageUrlControl() {
    return this.formGroup?.get('thumnailImageUrl');
  }
  get thumnailImageNameControl() {
    return this.formGroup?.get('thumnailImageName');
  }
  get privilegeImageFileControl() {
    return this.formGroup?.get('privilegeImageFile');
  }
  get privilegeImageUrlControl() {
    return this.formGroup?.get('privilegeImageUrl');
  }
  get privilegeImageNameControl() {
    return this.formGroup?.get('privilegeImageName');
  }
  get privilegeTypeControl() {
    return this.formGroup?.get('privilege_type');
  }
  get campaignTypeControl() {
    return this.formGroup?.get('campaign_type');
  }
  get brandIdControl() {
    return this.formGroup?.get('brand_id');
  }
  get telephoneControl() {
    return this.formGroup?.get('telephone');
  }
  get websiteControl() {
    return this.formGroup?.get('website');
  }
  get bookingUrlControl() {
    return this.formGroup?.get('booking_url');
  }

  currentDate = new Date();

  ngOnInit(): void {
    this.reValidateForm();

    this.store.dispatch(CreateEditPrivilegeActions.getBrandOptions());
    this.brandOptions$
      .pipe(
        filter(
          (brands) =>
            brands.length > 0 && this.formMode === 'create' && !this.privilegeId
        ),
        take(1)
      )
      .subscribe((brands) => {
        this.brandIdControl?.patchValue(brands[0].code, {
          emitEvent: false,
        });
      });

    this.thumnailImageFileControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((file) => !!file?.name)
      )
      .subscribe((file: File) => {
        this.thumnailImageNameUploaded.set(file.name || '');
      });
    combineLatest([
      this.thumnailImageUrlControl?.valueChanges || [],
      this.thumnailImageNameControl?.valueChanges || [],
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(([url, name]) => !!url && !!name)
      )
      .subscribe(([_url, name]) => {
        this.thumnailImageNameUploaded.set(name || '');
      });

    this.privilegeImageFileControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((file) => !!file?.name)
      )
      .subscribe((file: File) => {
        this.privilegeImageNameUploaded.set(file.name || '');
      });
    combineLatest([
      this.privilegeImageUrlControl?.valueChanges || [],
      this.privilegeImageNameControl?.valueChanges || [],
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(([url, name]) => !!url && !!name)
      )
      .subscribe(([_url, name]) => {
        this.privilegeImageNameUploaded.set(name || '');
      });

    this.privilegeTypeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        if (type === PrivilegeTypeEnum.BOOKING) {
          this.bookingUrlControl?.setValidators([
            Validators.required,
            urlValidator,
          ]);
        } else {
          this.bookingUrlControl?.setValidators([]);
          this.bookingUrlControl?.reset('', {
            emitEvent: false,
          });
        }

        this.bookingUrlControl?.markAsPristine();
      });
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode<string | number>[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  onFileDropped(fileDragDrop: FileDragDrop, type: 'thumnail' | 'privilege') {
    const standardWidth = 640;
    const standardHeight = type === 'thumnail' ? 360 : 426;
    const isValidImage = checkImageMimeType(fileDragDrop.file);

    const isStandardSize =
      fileDragDrop.size?.height === standardHeight &&
      fileDragDrop.size?.width === standardWidth;

    if (isStandardSize && isValidImage) {
      const imageFileControl =
        type === 'thumnail'
          ? this.thumnailImageFileControl
          : this.privilegeImageFileControl;

      imageFileControl?.patchValue(fileDragDrop.file);
    } else {
      const message = `Please upload a file in one of the following format SVG, PNG, JPG or GIF (${standardWidth} x ${standardHeight} px)`;
      this.openWarningFileSizeDialog(message);
    }
  }

  onFileSelected(event: Event, type: 'thumnail' | 'privilege') {
    const input = event.target as HTMLInputElement;
    const standardWidth = 640;
    const standardHeight = type === 'thumnail' ? 360 : 426;

    if (input.files && input.files.length > 0) {
      const isValidImage = checkImageMimeType(input.files[0]);

      getImageSizeOser(input.files[0])
        .pipe(take(1))
        .subscribe((size: { width: number; height: number } | null) => {
          if (
            size?.height === standardHeight &&
            size?.width === standardWidth &&
            input.files?.[0] &&
            isValidImage
          ) {
            const imageFileControl =
              type === 'thumnail'
                ? this.thumnailImageFileControl
                : this.privilegeImageFileControl;

            imageFileControl?.patchValue(input.files?.[0]);
          } else {
            input.value = '';
            const message = `Please upload a file in one of the following format SVG, PNG, JPG or GIF (${standardWidth} x ${standardHeight} px)`;
            this.openWarningFileSizeDialog(message);
          }
        });
    }
  }

  openWarningFileSizeDialog(message: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'The file you uploaded is not supported.',
        message,
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'warning',
      },
    });
  }

  reValidateForm() {
    if (this.privilegeTypeControl?.value === PrivilegeTypeEnum.BOOKING) {
      this.bookingUrlControl?.setValidators([
        Validators.required,
        urlValidator,
      ]);
    } else {
      this.bookingUrlControl?.setValidators([]);
    }
  }
}
