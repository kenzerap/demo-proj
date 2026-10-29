import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as BrandsActions from './brand-list.actions';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { BrandService } from '../../services/brand.service';
import { Store } from '@ngrx/store';
import { selectBrandFilters } from './brand-list.selectors';
import { BrandUpdateStatusRequest } from '../../models/brand-update-status-request.model';
import { AuthService } from '@app/core/services/auth-service';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';

@Injectable()
export class BrandsListEffects {
  private actions$ = inject(Actions);
  private brandService = inject(BrandService);
  private authService = inject(AuthService);
  private store = inject(Store);

  getBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandsActions.getBrands),
      switchMap(({ queryParams }) => {
        return this.brandService.getBrands(queryParams).pipe(
          map((pagedData) => BrandsActions.getBrandsSuccess({ pagedData })),
          catchError((error) => {
            return of(BrandsActions.getBrandsFailure({ error }));
          })
        );
      })
    )
  );

  setBrandFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandsActions.setBrandFilters),
      withLatestFrom(this.store.select(selectBrandFilters)),
      switchMap(([_, filters]) => {
        return of(BrandsActions.getBrands({ queryParams: filters }));
      })
    )
  );

  updateStatusBrand$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandsActions.updateStatusBrand),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ id, is_active }, currentUser]) => {
        const data: BrandUpdateStatusRequest = {
          is_active,
          action_done_by: currentUser?.username || '',
        };
        return this.brandService.updateStatusBrand(id, data).pipe(
          map(() => BrandsActions.updateStatusBrandSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Update Brand',
              message: `Failed to update Brand (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              BrandsActions.updateStatusBrandFailure({
                id,
                messageData,
              })
            );
          })
        );
      })
    )
  );

  updateStatusBrandSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandsActions.updateStatusBrandSuccess),
      mergeMap(() => {
        const messageData: ToastMessageData = {
          title: 'Update Brand',
          message: `Brand updated successfully.`,
          type: ToastMessageType.SUCCESS,
        };

        return of(pushMessage({ messageData, duration: 3000 }));
      })
    )
  );
}
