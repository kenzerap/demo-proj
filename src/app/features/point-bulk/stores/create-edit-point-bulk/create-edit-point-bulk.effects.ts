import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PointBulkService } from '../../services/point-bulk.service';
import * as CreateEditPointBulkActions from './create-edit-point-bulk.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { UploadPointBulkParams } from '../../models/upload-point-bulk-params.model';

@Injectable()
export class CreateEditPointBulkEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private pointBulkService = inject(PointBulkService);
  private authService = inject(AuthService);

  validateUploadPointBulk$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPointBulkActions.validateUploadPointBulk),
      switchMap(({ file }) => {
        return this.pointBulkService.validatePointBulkUploadPoint(file).pipe(
          map((response) =>
            CreateEditPointBulkActions.validateUploadPointBulkSuccess({
              response,
            })
          ),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Point Bulk',
              message: `Failed to validate Point Bulk (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditPointBulkActions.validateUploadPointBulkFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  uploadPointBulk$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPointBulkActions.uploadPointBulk),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data, file }, currentUser]) => {
        const dataBody: Partial<UploadPointBulkParams> = {
          ...data,
          created_by: currentUser?.username,
        };

        return this.pointBulkService.uploadPointBulk(dataBody, file).pipe(
          map(() => CreateEditPointBulkActions.uploadPointBulkSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Point Bulk',
              message: `Failed to upload point bulk (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditPointBulkActions.uploadPointBulkFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );
}
