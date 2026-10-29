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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { Store } from '@ngrx/store';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { SvgCloudUploadComponent } from '../../../../shared/icons/svg-cloud-upload/svg-cloud-upload.component';
import {
  DragDropUploadDirective,
  FileDragDrop,
} from '@app/shared/directives/drag-drop-upload.directive';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from '@app/shared/components/base/base.component';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import { CreateEditInventoryQueryParams } from '../../models/create-edit-inventory-query-params.model';
import { ValidateUploadCodeResponse } from '../../models/validate-upload-code-response.model';
import { Actions, ofType } from '@ngrx/effects';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { SvgExclamationMarkComponent } from '../../../../shared/icons/svg-exclamation-mark/svg-exclamation-mark.component';
import { SvgRefreshComponent } from '../../../../shared/icons/svg-refresh/svg-refresh.component';
import { LoadingDirective } from '@app/shared/directives/loading.directive';
import { noSpacesValidator } from '@app/shared/utils/no-spaces-validator';

@Component({
  selector: 'app-upload-code-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    DemoprojInputComponent,
    SvgCloudUploadComponent,
    DragDropUploadDirective,
    SvgExclamationMarkComponent,
    SvgRefreshComponent,
    LoadingDirective,
  ],
  templateUrl: './upload-code-dialog.component.html',
  styleUrl: './upload-code-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCodeDialogComponent extends BaseComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<UploadCodeDialogComponent>);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);

  data: { inventoryData: Partial<CreateEditInventoryQueryParams> } =
    inject(MAT_DIALOG_DATA);
  imageNameUploaded: WritableSignal<string> = signal<string>('Click to upload');
  validateUploadCode: WritableSignal<ValidateUploadCodeResponse | null> =
    signal(null);

  loading$ = this.store.select(selectIsLoading(`createInventory`));
  loadingValidate$ = this.store.select(selectIsLoading(`validateUploadCode`));
  loadingCreateInventory$ = this.store.select(
    selectIsLoading(`createInventoryAndUpdateData`)
  );
  loadingUploadCode$ = this.store.select(selectIsLoading(`uploadCode`));

  uploadCodeForm: FormGroup = this.fb.group({
    code_name: ['', [Validators.required, noSpacesValidator]],
    description: [''],
    imageFile: ['', Validators.required],
  });

  get codeNameControl() {
    return this.uploadCodeForm.get('code_name');
  }
  get descriptionControl() {
    return this.uploadCodeForm.get('description');
  }
  get imageFileControl() {
    return this.uploadCodeForm.get('imageFile');
  }

  ngOnInit(): void {
    this.imageFileControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((file) => !!file?.name)
      )
      .subscribe((file: File) => {
        this.imageNameUploaded.set(file.name || '');
      });

    this.actions$
      .pipe(
        ofType(CreateEditInventoryActions.validateUploadCodeSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(({ response }) => {
        this.validateUploadCode.set(response);

        if (response.valid) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Upload Codes?',
              message: `If you confirm, the system will immediately create inventory stocks and add all these codes to the database.`,
              btnConfirmText: 'Confirm',
              btnCloseText: 'Cancel',
              type: 'warning',
            },
            width: '25rem',
          });

          dialogRef.afterClosed().subscribe((isConfirm) => {
            if (isConfirm) {
              this.store.dispatch(
                CreateEditInventoryActions.createInventoryAndUpdateData({
                  file: this.imageFileControl?.value,
                  inventoryData: this.data.inventoryData,
                  dataUpdated: {
                    code_name: this.codeNameControl?.value,
                    description: this.descriptionControl?.value,
                  },
                })
              );
            }
          });
        }

        if (!response.valid) {
          this.imageFileControl?.reset();
        }
      });

    this.actions$
      .pipe(
        ofType(CreateEditInventoryActions.uploadCodeSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  onSubmit() {
    this.store.dispatch(
      CreateEditInventoryActions.validateUploadCode({
        brand_id: this.data.inventoryData.brand_id || 0,
        file: this.imageFileControl?.value,
      })
    );
  }

  onFileDropped(fileDragDrop: FileDragDrop) {
    this.imageFileControl?.patchValue(fileDragDrop.file);
    this.validateUploadCode.set(null);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFileControl?.patchValue(input.files?.[0]);
      this.validateUploadCode.set(null);
    }
  }

  countTotalError() {
    let totalError = 0;
    if (this.validateUploadCode()?.gap_rows?.length) {
      totalError++;
    }

    if (this.validateUploadCode()?.duplicated_rows?.length) {
      totalError++;
    }

    return totalError;
  }

  isInvalidUploadCode() {
    return !!this.validateUploadCode() && !this.validateUploadCode()?.valid;
  }
}
