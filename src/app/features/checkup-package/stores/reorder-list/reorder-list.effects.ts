import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map, of, switchMap, withLatestFrom } from 'rxjs';
import * as CheckupPackageOrderActions from './reorder-list.actions';
import * as CheckupPackageOrderSelectors from './reorder-list.selectors';
import * as CheckupPackageActions from '../checkup-package-list/checkup-package-list.actions';
import * as CheckupPackageSelectors from '../checkup-package-list/checkup-package-list.selector';
import { AuthService } from '@app/core/services/auth-service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { CheckupPackageService } from '../../services/checkup-package.services';
import { CheckupPackageQueryParams } from '../../models/checkup-package-query-params.model';
import { CheckupPackage } from '../../models/checkup-package.model';
import { ReorderCheckupPackageQueryParams } from '../../models/reorder-checkup-package-query-params.model';
import { StatusCode } from '@app/shared/utils/enums/status-code.enum';

@Injectable()
export class CheckupPackageOrderEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private checkupPackageService = inject(CheckupPackageService);
  private authService = inject(AuthService);

  getCheckupPackagesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckupPackageActions.getCheckupPackgageSuccess),
      switchMap(({ pagedData, canEditOrder }) => {
        if (!canEditOrder) {
          return EMPTY;
        }

        return of(
          CheckupPackageOrderActions.getMissingCheckupPackages({
            pagedData,
          })
        );
      })
    )
  );

  getMissingCheckupPackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckupPackageOrderActions.getMissingCheckupPackages),
      withLatestFrom(
        this.store.select(
          CheckupPackageOrderSelectors.selectVirtualLastDisplayOrder
        ),
        this.store.select(
          CheckupPackageOrderSelectors.selectVirtualPublishedItems
        ),
        this.store.select(
          CheckupPackageOrderSelectors.selectVirtualUnPublishedItems
        ),
        this.store.select(CheckupPackageSelectors.selectCheckupPackageFilters)
      ),
      switchMap(
        ([
          { pagedData },
          virtualLastDisplayOrder,
          virtualPublishedItems,
          virtualUnPublishedItems,
          filterParams,
        ]) => {
          let params: Partial<CheckupPackageQueryParams> = {
            ...filterParams,
            page: 0,
            size: 1,
          };

          let newData = pagedData.data;
          const totalItems =
            pagedData.pagination.page * pagedData.pagination.size +
            pagedData.pagination.size;

          const previousPagePublishedItems = virtualPublishedItems.filter(
            (item) => (item.pagePosition || 0) <= pagedData.pagination.page
          );

          const startPage =
            pagedData.pagination.page * pagedData.pagination.size;
          const endPage =
            pagedData.pagination.page * pagedData.pagination.size +
            pagedData.pagination.size;

          if (
            totalItems <= virtualLastDisplayOrder &&
            previousPagePublishedItems.length >= totalItems
          ) {
            newData = virtualPublishedItems.slice(startPage, endPage);

            return of(
              CheckupPackageOrderActions.getMissingCheckupPackagesSuccess({
                data: newData,
              })
            );
          }

          params = {
            ...params,
            size:
              totalItems + virtualUnPublishedItems.length >
              pagedData.pagination.totalItems
                ? pagedData.pagination.totalItems
                : totalItems + virtualUnPublishedItems.length,
          };

          return this.checkupPackageService
            .getCheckupPackages({ ...params, size: params.size || 1 })
            .pipe(
              map((pagedExtraData) => {
                const pagedItems = pagedExtraData.data.map((item, index) => {
                  const pagePosition = Math.floor(
                    index / pagedData.pagination.size
                  );

                  return {
                    ...item,
                    pagePosition,
                  };
                });
                const realPublishedItems = pagedItems.filter(
                  (item) => item.is_published
                );

                const realRemainingPublishedItems = realPublishedItems.filter(
                  (item) =>
                    !virtualUnPublishedItems.some((x) => x.id === item.id) &&
                    !virtualPublishedItems.some((x) => x.id === item.id)
                );

                const realRemainingUnPublishedItems = pagedItems.filter(
                  (item) =>
                    !item.is_published &&
                    !virtualUnPublishedItems.some((x) => x.id === item.id) &&
                    !virtualPublishedItems.some((x) => x.id === item.id)
                );
                const maxPage = Math.max(
                  ...pagedItems.map((item) => item.pagePosition || 0),
                  ...virtualPublishedItems.map((item) => item.pagePosition || 0)
                );

                let repositionData: CheckupPackage[] = [];
                for (let page = 0; page <= maxPage; page++) {
                  const virtualItems = virtualPublishedItems.filter(
                    (item) => item.pagePosition === page
                  );
                  const realItems = realRemainingPublishedItems.filter(
                    (item) => item.pagePosition === page
                  );
                  repositionData = [
                    ...repositionData,
                    ...virtualItems,
                    ...realItems,
                  ];
                }
                repositionData = [
                  ...repositionData,
                  ...[...virtualUnPublishedItems].reverse(),
                  ...realRemainingUnPublishedItems,
                ];
                const newPublishedItems = repositionData.filter(
                  (item) => item.is_published
                );

                newData = repositionData.slice(startPage, endPage);

                return CheckupPackageOrderActions.getMissingCheckupPackagesSuccess(
                  {
                    data: newData,
                    virtualPublishedItems: newPublishedItems,
                  }
                );
              }),
              catchError((error) => {
                return of(
                  CheckupPackageOrderActions.getMissingCheckupPackagesFailure({
                    error,
                  })
                );
              })
            );
        }
      )
    )
  );

  reOrderHomeScreenManagements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckupPackageOrderActions.reOrderCheckupPackages),
      withLatestFrom(
        this.store.select(
          CheckupPackageOrderSelectors.selectVirtualPublishedItems
        ),
        this.store.select(
          CheckupPackageOrderSelectors.selectVirtualUnPublishedItems
        )
      ),
      switchMap(([_, publishedItems, unPublishedItems]) => {
        const params: ReorderCheckupPackageQueryParams = {
          items: [
            ...publishedItems.map((item) => {
              return {
                id: item.id,
                display_order: item.display_order,
                is_published: item.is_published,
              };
            }),
            ...unPublishedItems.map((item) => {
              return {
                id: item.id,
                display_order: item.display_order,
                is_published: item.is_published,
              };
            }),
          ],
        };

        return this.checkupPackageService.reOrderCheckupPackages(params).pipe(
          map(() => CheckupPackageOrderActions.reOrderCheckupPackagesSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Checkup Package',
              message: `Failed to edit order Checkup Package (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CheckupPackageOrderActions.reOrderCheckupPackagesFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );
}
