import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map, of, switchMap, withLatestFrom } from 'rxjs';
import * as HomeScreenManagementOrderActions from './reorder-list.actions';
import * as HomeScreenManagementOrderSelectors from './reorder-list.selectors';
import * as HomeScreenManagementActions from '../home-screen-management-list/home-screen-management-list.actions';
import * as HomeScreenManagementSelectors from '../home-screen-management-list/home-screen-management-list.selector';
import { HomeScreenManagementService } from '../../services/home-screen-management.services';
import { HomeScreenManagementQueryParams } from '../../models/home-screen-management-query-params.model';
import { HomeScreenManagement } from '../../models/home-screen-management.model';
import { AuthService } from '@app/core/services/auth-service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';

@Injectable()
export class HomeScreenManagementOrderEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private homeScreenManagementService = inject(HomeScreenManagementService);
  private authService = inject(AuthService);

  getHomeScreenManagementsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomeScreenManagementActions.getHomeScreenManagementSuccess),
      switchMap(({ pagedData, canEditOrder }) => {
        if (!canEditOrder) {
          return EMPTY;
        }

        return of(
          HomeScreenManagementOrderActions.getMissingHomeScreenManagements({
            pagedData,
          })
        );
      })
    )
  );

  getMissingHomeScreenManagements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomeScreenManagementOrderActions.getMissingHomeScreenManagements),
      withLatestFrom(
        this.store.select(
          HomeScreenManagementOrderSelectors.selectVirtualLastDisplayOrder
        ),
        this.store.select(
          HomeScreenManagementOrderSelectors.selectVirtualPublishedItems
        ),
        this.store.select(
          HomeScreenManagementOrderSelectors.selectVirtualUnPublishedItems
        ),
        this.store.select(
          HomeScreenManagementSelectors.selectHomeScreenManagementFilters
        )
      ),
      switchMap(
        ([
          { pagedData },
          virtualLastDisplayOrder,
          virtualPublishedItems,
          virtualUnPublishedItems,
          filterParams,
        ]) => {
          let params: Partial<HomeScreenManagementQueryParams> = {
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
              HomeScreenManagementOrderActions.getMissingHomeScreenManagementsSuccess(
                {
                  data: newData,
                }
              )
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

          return this.homeScreenManagementService
            .getHomeScreenManagement({ ...params, size: params.size || 1 })
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

                let repositionData: HomeScreenManagement[] = [];
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

                return HomeScreenManagementOrderActions.getMissingHomeScreenManagementsSuccess(
                  {
                    data: newData,
                    virtualPublishedItems: newPublishedItems,
                  }
                );
              }),
              catchError((error) => {
                return of(
                  HomeScreenManagementOrderActions.getMissingHomeScreenManagementsFailure(
                    {
                      error,
                    }
                  )
                );
              })
            );
        }
      )
    )
  );

  reOrderHomeScreenManagements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomeScreenManagementOrderActions.reOrderHomeScreenManagements),
      withLatestFrom(
        this.authService.getCurrentUser$(),
        this.store.select(
          HomeScreenManagementSelectors.selectHomeScreenManagementFilters
        ),
        this.store.select(
          HomeScreenManagementOrderSelectors.selectVirtualPublishedItems
        ),
        this.store.select(
          HomeScreenManagementOrderSelectors.selectVirtualUnPublishedItems
        )
      ),
      switchMap(
        ([_, currentUser, filter, publishedItems, unPublishedItems]) => {
          const params = {
            on_items: publishedItems.map((item) => item.id),
            off_items: unPublishedItems.map((item) => item.id),
            updated_by: currentUser?.username || '',
          };

          return this.homeScreenManagementService
            .reOrderHomeScreenManagements(params)
            .pipe(
              map(() =>
                HomeScreenManagementOrderActions.reOrderHomeScreenManagementsSuccess()
              ),
              catchError((error) => {
                const messageData: ToastMessageData = {
                  title: 'Home Screen',
                  message: `Failed to edit order Home Screen (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                  type: ToastMessageType.ERROR,
                };

                return of(
                  HomeScreenManagementOrderActions.reOrderHomeScreenManagementsFailure(
                    {
                      messageData,
                    }
                  )
                );
              })
            );
        }
      )
    )
  );
}
