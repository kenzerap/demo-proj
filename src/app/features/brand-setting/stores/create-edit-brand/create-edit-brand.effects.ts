import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BrandService } from '../../services/brand.service';
import * as CreateEditBrandActions from './create-edit-brand.actions';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { CreateEditBrandQueryParams } from '../../models/create-edit-brand-query-params.model';
import { CreateEditBrandCategoryQueryParams } from '../../models/create-edit-brand-category-query-params.model';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';

@Injectable()
export class CreateEditBrandEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private brandService = inject(BrandService);
  private authService = inject(AuthService);

  createBrand$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBrandActions.createBrand),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data, file }, currentUser]) => {
        const dataBody: Partial<CreateEditBrandQueryParams> = {
          ...data,
          action_done_by: currentUser?.username,
        };

        return this.brandService.createBrand(dataBody, file).pipe(
          map(() => CreateEditBrandActions.createBrandSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Brand',
              message: `Failed to create Brand (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditBrandActions.createBrandFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  updateBrand$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBrandActions.updateBrand),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ id, data, file }, currentUser]) => {
        const dataBody: Partial<CreateEditBrandQueryParams> = {
          ...data,
          action_done_by: currentUser?.username,
        };

        return this.brandService.editBrand(id, dataBody, file).pipe(
          map(() => CreateEditBrandActions.updateBrandSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Brand',
              message: `Failed to update Brand (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditBrandActions.updateBrandFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  getBrandDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBrandActions.getBrandDetail),
      switchMap(({ id }) => {
        return this.brandService.getBrandDetail(id).pipe(
          map((brand) =>
            CreateEditBrandActions.getBrandDetailSuccess({
              brand,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditBrandActions.getBrandDetailFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getBrandDisplayOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBrandActions.getBrandDisplayOrders),
      switchMap(() => {
        return this.brandService.getBrandDisplayOrders().pipe(
          map((data) =>
            CreateEditBrandActions.getBrandDisplayOrdersSuccess({
              data,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditBrandActions.getBrandDisplayOrdersFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getBrandCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CreateEditBrandActions.getBrandCategories,
        CreateEditBrandActions.createBrandCategorySuccess,
        CreateEditBrandActions.editBrandCategorySuccess
      ),
      switchMap(() => {
        return this.brandService.getBrandCategories().pipe(
          map((brandCategories) =>
            CreateEditBrandActions.getBrandCategoriesSuccess({
              brandCategories,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditBrandActions.getBrandCategoriesFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  createBrandCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBrandActions.createBrandCategory),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ params }, currentUser]) => {
        const dataBody: Partial<CreateEditBrandCategoryQueryParams> = {
          ...params,
          action_done_by: currentUser?.username,
        };

        return this.brandService.createBrandCategory(dataBody).pipe(
          map(() => CreateEditBrandActions.createBrandCategorySuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Brand category',
              message: `Failed to create Brand category (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditBrandActions.createBrandCategoryFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  editBrandCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBrandActions.editBrandCategory),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ brandCategoryId, params }, currentUser]) => {
        const dataBody: Partial<CreateEditBrandCategoryQueryParams> = {
          ...params,
          action_done_by: currentUser?.username,
        };

        return this.brandService
          .editBrandCategory(brandCategoryId, dataBody)
          .pipe(
            map(() => CreateEditBrandActions.editBrandCategorySuccess()),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Brand category',
                message: `Failed to create Brand category (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditBrandActions.editBrandCategoryFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  deleteBrandCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBrandActions.deleteBrandCategory),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ brandCategoryId }, currentUser]) => {
        return this.brandService
          .deleteBrandCategory(brandCategoryId, currentUser?.username || '')
          .pipe(
            map((existedBrands) =>
              CreateEditBrandActions.deleteBrandCategorySuccess({
                existedBrands,
                brandCategoryId,
              })
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Brand category',
                message: `Failed to delete Brand category (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditBrandActions.deleteBrandCategoryFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  createBrandCategorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBrandActions.createBrandCategorySuccess),
      mergeMap(() => {
        const messageData: ToastMessageData = {
          title: 'Create brand category',
          message: `Brand category added successfully.`,
          type: ToastMessageType.SUCCESS,
        };

        return of(pushMessage({ messageData, duration: 3000 }));
      })
    )
  );

  editBrandCategorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditBrandActions.editBrandCategorySuccess),
      mergeMap(() => {
        const messageData: ToastMessageData = {
          title: 'Edit brand category',
          message: `Brand category updated successfully.`,
          type: ToastMessageType.SUCCESS,
        };

        return of(pushMessage({ messageData, duration: 3000 }));
      })
    )
  );
}
