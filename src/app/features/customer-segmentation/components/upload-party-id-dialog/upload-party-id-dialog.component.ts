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
import { SvgCloudUploadComponent } from '../../../../shared/icons/svg-cloud-upload/svg-cloud-upload.component';
import {
  DragDropUploadDirective,
  FileDragDrop,
} from '@app/shared/directives/drag-drop-upload.directive';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from '@app/shared/components/base/base.component';
import * as CreateEditCustomerSegmentationActions from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.actions';
import { ValidateUploadPartyIdResponse } from '../../models/validate-upload-party-id-response.model';
import { Actions, ofType } from '@ngrx/effects';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { SvgExclamationMarkComponent } from '../../../../shared/icons/svg-exclamation-mark/svg-exclamation-mark.component';
import { SvgRefreshComponent } from '../../../../shared/icons/svg-refresh/svg-refresh.component';
import { LoadingDirective } from '@app/shared/directives/loading.directive';

@Component({
  selector: 'app-upload-party-id-dialog',
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
    SvgCloudUploadComponent,
    DragDropUploadDirective,
    SvgExclamationMarkComponent,
    SvgRefreshComponent,
    LoadingDirective,
  ],
  templateUrl: './upload-party-id-dialog.component.html',
  styleUrl: './upload-party-id-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadPartyIdDialogComponent
  extends BaseComponent
  implements OnInit
{
  private dialogRef = inject(MatDialogRef<UploadPartyIdDialogComponent>);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);

  imageNameUploaded: WritableSignal<string> = signal<string>('Click to upload');
  validateUploadPartyId: WritableSignal<ValidateUploadPartyIdResponse | null> =
    signal(null);

  loadingValidate$ = this.store.select(
    selectIsLoading(`validateUploadPartyId`),
  );
  loadingUploadPartyId$ = this.store.select(selectIsLoading(`uploadPartyId`));

  uploadPartyIdForm: FormGroup = this.fb.group({
    imageFile: ['', Validators.required],
  });

  get imageFileControl() {
    return this.uploadPartyIdForm.get('imageFile');
  }

  ngOnInit(): void {
    this.imageFileControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((file) => !!file?.name),
      )
      .subscribe((file: File) => {
        this.imageNameUploaded.set(file.name || '');
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditCustomerSegmentationActions.validateUploadPartyIdSuccess,
          CreateEditCustomerSegmentationActions.validateUploadPartyIdFailure
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(({ response }) => {
        this.validateUploadPartyId.set(response);

        if (response.success) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Upload Party ID?',
              message: `Are you sure you want to upload the Party ID file?`,
              btnConfirmText: 'Confirm',
              btnCloseText: 'Cancel',
              type: 'warning',
            },
            width: '25rem',
          });

          dialogRef.afterClosed().subscribe((isConfirm) => {
            if (isConfirm) {
              this.store.dispatch(
                CreateEditCustomerSegmentationActions.uploadPartyId({
                  file: this.imageFileControl?.value,
                }),
              );
            }
          });
        }

        if (!response.success) {
          this.imageFileControl?.reset();
        }
      });

    this.actions$
      .pipe(
        ofType(CreateEditCustomerSegmentationActions.uploadPartyIdSuccess),
        takeUntil(this.destroy$),
      )
      .subscribe(({ partyIdFileInfo }) => {
        this.dialogRef.close(partyIdFileInfo);
      });
  }

  onSubmit() {
    this.store.dispatch(
      CreateEditCustomerSegmentationActions.validateUploadPartyId({
        file: this.imageFileControl?.value,
      }),
    );
  }

  onFileDropped(fileDragDrop: FileDragDrop) {
    this.imageFileControl?.patchValue(fileDragDrop.file);
    this.validateUploadPartyId.set(null);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFileControl?.patchValue(input.files?.[0]);
      this.validateUploadPartyId.set(null);
    }
  }

  isInvalidUploadPartyId() {
    return (
      !!this.validateUploadPartyId() && !this.validateUploadPartyId()?.success
    );
  }

  getValidateError(errorCode: string) {
    if ((this.validateUploadPartyId()?.errors.length || 0) > 0) {
      return this.validateUploadPartyId()?.errors?.find(
        (error) => error.type === errorCode,
      );
    }

    return null;
  }
}
