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
import * as CreateEditPointBulkActions from '@app/features/point-bulk/stores/create-edit-point-bulk/create-edit-point-bulk.actions';
import { Actions, ofType } from '@ngrx/effects';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { SvgExclamationMarkComponent } from '../../../../shared/icons/svg-exclamation-mark/svg-exclamation-mark.component';
import { SvgRefreshComponent } from '../../../../shared/icons/svg-refresh/svg-refresh.component';
import { LoadingDirective } from '@app/shared/directives/loading.directive';
import { noSpacesValidator } from '@app/shared/utils/no-spaces-validator';
import { ValidateUploadPointResponse } from '../../models/validate-upload-point-response.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';

@Component({
  selector: 'app-upload-point-dialog',
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
    MatDatepickerModule,
    SvgCalendarComponent,
  ],
  templateUrl: './upload-point-dialog.component.html',
  styleUrl: './upload-point-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadPointDialogComponent
  extends BaseComponent
  implements OnInit
{
  private dialogRef = inject(MatDialogRef<UploadPointDialogComponent>);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);

  data: {} = inject(MAT_DIALOG_DATA);
  imageNameUploaded: WritableSignal<string> = signal<string>('Click to upload');
  validateUploadPoint: WritableSignal<ValidateUploadPointResponse | null> =
    signal(null);
  currentDate = new Date();

  loadingValidate$ = this.store.select(
    selectIsLoading(`validateUploadPointBulk`),
  );
  loadingUploadPoint$ = this.store.select(selectIsLoading(`uploadPointBulk`));

  uploadPointForm: FormGroup = this.fb.group({
    subject: ['', [Validators.required, noSpacesValidator]],
    note: ['', [Validators.required, noSpacesValidator]],
    point_expiry_date: ['', Validators.required],
    excelFile: ['', Validators.required],
  });

  get subjectControl() {
    return this.uploadPointForm.get('subject');
  }
  get noteControl() {
    return this.uploadPointForm.get('note');
  }
  get pointExpiryDateControl() {
    return this.uploadPointForm.get('point_expiry_date');
  }
  get excelFileControl() {
    return this.uploadPointForm.get('excelFile');
  }

  ngOnInit(): void {
    this.excelFileControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((file) => !!file?.name),
      )
      .subscribe((file: File) => {
        this.imageNameUploaded.set(file.name || '');
      });

    this.actions$
      .pipe(
        ofType(CreateEditPointBulkActions.validateUploadPointBulkSuccess),
        takeUntil(this.destroy$),
      )
      .subscribe(({ response }) => {
        this.validateUploadPoint.set(response);

        if (response.valid) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Bulk add point?',
              message: `If you click to confirmed the DEMOPROJ365 Users will earning point by party ID`,
              btnConfirmText: 'Confirm',
              btnCloseText: 'Cancel',
              type: 'warning',
            },
            width: '25rem',
          });

          dialogRef.afterClosed().subscribe((isConfirm) => {
            if (isConfirm) {
              const uploadPointFormValue = this.uploadPointForm.getRawValue();
              const point_expiry_date = new Date(
                uploadPointFormValue?.point_expiry_date,
              );
              point_expiry_date.setHours(23, 59, 59, 999);

              this.store.dispatch(
                CreateEditPointBulkActions.uploadPointBulk({
                  file: this.excelFileControl?.value,
                  data: {
                    subject: uploadPointFormValue?.subject,
                    note: uploadPointFormValue?.note,
                    point_expiry_date: point_expiry_date.toISOString(),
                  },
                }),
              );
            }
          });
        }

        if (!response.valid) {
          this.excelFileControl?.reset();
        }
      });

    this.actions$
      .pipe(
        ofType(CreateEditPointBulkActions.uploadPointBulkSuccess),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  onSubmit() {
    this.store.dispatch(
      CreateEditPointBulkActions.validateUploadPointBulk({
        file: this.excelFileControl?.value,
      }),
    );
  }

  onFileDropped(fileDragDrop: FileDragDrop) {
    this.excelFileControl?.patchValue(fileDragDrop.file);
    this.validateUploadPoint.set(null);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.excelFileControl?.patchValue(input.files?.[0]);
      this.validateUploadPoint.set(null);
    }
  }

  countTotalError() {
    let totalError = 0;
    if (this.validateUploadPoint()?.gap_rows?.length) {
      totalError++;
    }

    if (this.validateUploadPoint()?.blank_rows?.length) {
      totalError++;
    }

    if (this.validateUploadPoint()?.invalid_rows?.length) {
      totalError++;
    }

    if (this.validateUploadPoint()?.not_found_rows?.length) {
      totalError++;
    }

    return totalError;
  }

  isInvalidUploadPoint() {
    return !!this.validateUploadPoint() && !this.validateUploadPoint()?.valid;
  }
}
