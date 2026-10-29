import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { SvgDefaultImageComponent } from '@app/shared/icons/svg-default-image/svg-default-image.component';
import { getImageSizeOser } from '@app/shared/utils/get-image-size';
import { take, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  DragDropUploadDirective,
  FileDragDrop,
} from '@app/shared/directives/drag-drop-upload.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { DestinationCode } from '@app/shared/constants/destination-options.const';

import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { homeDestinationOptions } from '../../constants/home-destination-options.const';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import {
  noSpacesValidator,
  noSpacesValidatorAsync,
} from '@app/shared/utils/no-spaces-validator';
import { urlValidator } from '@app/shared/utils/url-validator';
import { SvgDeleteComponent } from '../../../../shared/icons/svg-delete/svg-delete.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { checkImageMimeType } from '@app/shared/utils/check-image-mime-type';

@Component({
  selector: 'app-home-shortcut-menu-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    SvgDefaultImageComponent,
    MatDividerModule,
    MatButtonModule,
    MatSelectModule,
    SvgPlusComponent,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    DemoprojInputComponent,
    SvgDeleteComponent,
    DragDropUploadDirective,
    MatTooltipModule,
  ],
  providers: [DatePipe],
  templateUrl: './home-shortcut-menu-section.component.html',
  styleUrl: './home-shortcut-menu-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeShortcutMenuSectionComponent
  extends BaseComponent
  implements OnInit
{
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private changeDetector = inject(ChangeDetectorRef);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  selectDestinationOptions: ValueCode[] = homeDestinationOptions;
  destinationCode = DestinationCode;

  get shortcutMenusFormArray(): FormArray {
    return this.formGroup.get('shortcutMenus') as FormArray;
  }

  getShortcutEnControl(i: number) {
    return this.shortcutMenusFormArray.at(i)?.get('shortcut_en');
  }
  getShortcutThControl(i: number) {
    return this.shortcutMenusFormArray.at(i)?.get('shortcut_th');
  }
  getDestinationTypeControl(i: number) {
    return this.shortcutMenusFormArray.at(i)?.get('destination_type');
  }
  getDestinationValueControl(i: number) {
    return this.shortcutMenusFormArray.at(i)?.get('destination_value');
  }
  getImageFileControl(i: number) {
    return this.shortcutMenusFormArray.at(i)?.get('imageFile');
  }
  getImageUrlControl(i: number) {
    return this.shortcutMenusFormArray.at(i)?.get('imageUrl');
  }
  getImageNameControl(i: number) {
    return this.shortcutMenusFormArray.at(i)?.get('imageName');
  }

  ngOnInit(): void {
    this.shortcutMenusFormArray.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.changeDetector.detectChanges();
      });
  }

  openWarningFileSizeDialog() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'The file you uploaded is not supported.',
        message:
          'Please upload a file in one of the following format SVG, PNG, JPG or GIF (144 x 144 px)',
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'warning',
      },
    });
  }

  onFileDropped(fileDragDrop: FileDragDrop, i: number) {
    const isValidImage = checkImageMimeType(fileDragDrop.file);
    const isStandardSize =
      fileDragDrop.size?.height === 144 && fileDragDrop.size?.width === 144;
    if (isStandardSize && isValidImage) {
      this.getImageFileControl(i)?.patchValue(fileDragDrop.file);
      this.getImageNameControl(i)?.patchValue(fileDragDrop.file.name || '');
      this.changeDetector.detectChanges();
    } else {
      this.openWarningFileSizeDialog();
    }
  }

  onFileSelected(event: Event, i: number) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const isValidImage = checkImageMimeType(input.files[0]);

      getImageSizeOser(input.files[0])
        .pipe(take(1))
        .subscribe((size: { width: number; height: number } | null) => {
          if (
            size?.height === 144 &&
            size?.width === 144 &&
            input.files?.[0] &&
            isValidImage
          ) {
            this.getImageFileControl(i)?.patchValue(input.files?.[0]);
            this.getImageNameControl(i)?.patchValue(input.files[0].name || '');
            this.changeDetector.detectChanges();
          } else {
            input.value = '';
            this.openWarningFileSizeDialog();
          }
        });
    }
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.shortcutMenusFormArray.controls,
      event.previousIndex,
      event.currentIndex
    );
    this.shortcutMenusFormArray.updateValueAndValidity();
  }

  destinationTypeChange(
    event: MatSelectChange,
    shortcutMenusFormGroup: AbstractControl
  ) {
    switch (event.value) {
      case DestinationCode.URL:
        shortcutMenusFormGroup
          .get('destination_value')
          ?.setValidators([
            Validators.required,
            noSpacesValidator,
            urlValidator,
          ]);
        break;

      default:
        shortcutMenusFormGroup.get('destination_value')?.setValidators([]);
        break;
    }

    shortcutMenusFormGroup.get('destination_value')?.reset('');
  }

  addShortcut() {
    this.shortcutMenusFormArray.push(
      this.fb.group({
        id: [''],
        shortcut_en: ['', Validators.required, noSpacesValidatorAsync],
        shortcut_th: ['', Validators.required, noSpacesValidatorAsync],
        imageFile: ['', Validators.required],
        imageUrl: [''],
        imageName: [''],
        destination_type: [DestinationCode.PrivilegeList],
        destination_value: [''],
      })
    );
  }

  deleteShortcutMenu(index: number) {
    this.shortcutMenusFormArray.removeAt(index);
  }
}
