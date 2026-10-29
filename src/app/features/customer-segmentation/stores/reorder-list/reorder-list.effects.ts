import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map, of, switchMap, withLatestFrom } from 'rxjs';
import * as CustomerSegmentationOrderActions from './reorder-list.actions';
import * as CustomerSegmentationOrderSelectors from './reorder-list.selectors';
import * as CustomerSegmentationActions from '../customer-segmentation/customer-segmentation.actions';
import * as CustomerSegmentationSelectors from '../customer-segmentation/customer-segmentation.selectors';
import { CustomerSegmentationService } from '../../services/customer-segmentation.service';
import { CustomerSegmentationsQueryParams } from '../../models/customer-segmentations-query-params.model';
import { CustomerSegmentation } from '../../models/customer-segmentation.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ReorderCustomerSegmentationsQueryParams } from '../../models/reorder-customer-segmentations-query-params.model';
import { StatusCode } from '@app/shared/utils/enums/status-code.enum';

@Injectable()
export class CustomerSegmentationOrderEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private customerSegmentationService = inject(CustomerSegmentationService);

  getCustomerSegmentationsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerSegmentationActions.getCustomerSegmentationsSuccess),
      switchMap(({ pagedData, canEditOrder }) => {
        if (!canEditOrder) {
          return EMPTY;
        }

        return of(
          CustomerSegmentationOrderActions.getMissingCustomerSegmentations({
            pagedData,
          })
        );
      })
    )
  );

  getMissingCustomerSegmentations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerSegmentationOrderActions.getMissingCustomerSegmentations),
      withLatestFrom(
        this.store.select(
          CustomerSegmentationOrderSelectors.selectVirtualLastDisplayOrder
        ),
        this.store.select(
          CustomerSegmentationOrderSelectors.selectVirtualPublishedItems
        ),
        this.store.select(
          CustomerSegmentationOrderSelectors.selectVirtualUnPublishedItems
        ),
        this.store.select(
          CustomerSegmentationSelectors.selectCustomerSegmentationFilters
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
          let params: Partial<CustomerSegmentationsQueryParams> = {
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
              CustomerSegmentationOrderActions.getMissingCustomerSegmentationsSuccess(
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

          return this.customerSegmentationService
            .getCustomerSegmentations({ ...params, size: params.size || 1 })
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

                let repositionData: CustomerSegmentation[] = [];
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

                return CustomerSegmentationOrderActions.getMissingCustomerSegmentationsSuccess(
                  {
                    data: newData,
                    virtualPublishedItems: newPublishedItems,
                  }
                );
              }),
              catchError((error) => {
                return of(
                  CustomerSegmentationOrderActions.getMissingCustomerSegmentationsFailure(
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

  reOrderCustomerSegmentations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerSegmentationOrderActions.reOrderCustomerSegmentations),
      withLatestFrom(
        this.store.select(
          CustomerSegmentationOrderSelectors.selectVirtualPublishedItems
        ),
        this.store.select(
          CustomerSegmentationOrderSelectors.selectVirtualUnPublishedItems
        )
      ),
      switchMap(([_, publishedItems, unPublishedItems]) => {
        const params: ReorderCustomerSegmentationsQueryParams = {
          segments: [
            ...publishedItems.map((item) => {
              return {
                segment_id: item.id,
                priority: item.display_order,
                status: item.is_published
                  ? StatusCode.ACTIVE
                  : StatusCode.INACTIVE,
              };
            }),
            ...unPublishedItems.map((item) => {
              return {
                segment_id: item.id,
                priority: item.display_order,
                status: item.is_published
                  ? StatusCode.ACTIVE
                  : StatusCode.INACTIVE,
              };
            }),
          ],
        };

        return this.customerSegmentationService
          .reOrderCustomerSegmentations(params)
          .pipe(
            map(() =>
              CustomerSegmentationOrderActions.reOrderCustomerSegmentationsSuccess()
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Customer segmentation',
                message: `Failed to edit order Customer segmentation (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CustomerSegmentationOrderActions.reOrderCustomerSegmentationsFailure(
                  {
                    messageData,
                  }
                )
              );
            })
          );
      })
    )
  );
}
