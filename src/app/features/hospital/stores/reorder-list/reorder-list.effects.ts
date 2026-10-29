import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map, of, switchMap, withLatestFrom } from 'rxjs';
import * as HospitalOrderActions from './reorder-list.actions';
import * as HospitalOrderSelectors from './reorder-list.selectors';
import * as HospitalActions from '../hospital-list/hospital-list.actions';
import * as HospitalSelectors from '../hospital-list/hospital-list.selector';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { HospitalService } from '../../services/hospital.services';
import { HospitalQueryParams } from '../../models/hospital-query-params.model';
import { Hospital } from '../../models/hospital.model';
import { ReorderHospitalQueryParams } from '../../models/reorder-hospital-query-params.model';

@Injectable()
export class HospitalOrderEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private hospitalService = inject(HospitalService);

  getHospitalsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HospitalActions.getHospitalSuccess),
      switchMap(({ pagedData, canEditOrder }) => {
        if (!canEditOrder) {
          return EMPTY;
        }

        return of(
          HospitalOrderActions.getMissingHospitals({
            pagedData,
          })
        );
      })
    )
  );

  getMissingHospitals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HospitalOrderActions.getMissingHospitals),
      withLatestFrom(
        this.store.select(HospitalOrderSelectors.selectVirtualLastDisplayOrder),
        this.store.select(HospitalOrderSelectors.selectVirtualPublishedItems),
        this.store.select(HospitalOrderSelectors.selectVirtualUnPublishedItems),
        this.store.select(HospitalSelectors.selectHospitalFilters)
      ),
      switchMap(
        ([
          { pagedData },
          virtualLastDisplayOrder,
          virtualPublishedItems,
          virtualUnPublishedItems,
          filterParams,
        ]) => {
          let params: Partial<HospitalQueryParams> = {
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
              HospitalOrderActions.getMissingHospitalsSuccess({
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

          return this.hospitalService
            .getHospitals({ ...params, size: params.size || 1 })
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
                    !virtualUnPublishedItems.some(
                      (x) => x.hospital_id === item.hospital_id
                    ) &&
                    !virtualPublishedItems.some(
                      (x) => x.hospital_id === item.hospital_id
                    )
                );

                const realRemainingUnPublishedItems = pagedItems.filter(
                  (item) =>
                    !item.is_published &&
                    !virtualUnPublishedItems.some(
                      (x) => x.hospital_id === item.hospital_id
                    ) &&
                    !virtualPublishedItems.some(
                      (x) => x.hospital_id === item.hospital_id
                    )
                );
                const maxPage = Math.max(
                  ...pagedItems.map((item) => item.pagePosition || 0),
                  ...virtualPublishedItems.map((item) => item.pagePosition || 0)
                );

                let repositionData: Hospital[] = [];
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

                return HospitalOrderActions.getMissingHospitalsSuccess({
                  data: newData,
                  virtualPublishedItems: newPublishedItems,
                });
              }),
              catchError((error) => {
                return of(
                  HospitalOrderActions.getMissingHospitalsFailure({
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
      ofType(HospitalOrderActions.reOrderHospitals),
      withLatestFrom(
        this.store.select(HospitalOrderSelectors.selectVirtualPublishedItems),
        this.store.select(HospitalOrderSelectors.selectVirtualUnPublishedItems)
      ),
      switchMap(([_, publishedItems, unPublishedItems]) => {
        const params: ReorderHospitalQueryParams = {
          items: [
            ...publishedItems.map((item) => {
              return {
                id: item.hospital_id,
                display_order: item.display_order,
                is_published: item.is_published,
              };
            }),
            ...unPublishedItems.map((item) => {
              return {
                id: item.hospital_id,
                display_order: item.display_order,
                is_published: item.is_published,
              };
            }),
          ],
        };

        return this.hospitalService.reOrderHospitals(params).pipe(
          map(() => HospitalOrderActions.reOrderHospitalsSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Hospital',
              message: `Failed to edit order Hospital (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              HospitalOrderActions.reOrderHospitalsFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );
}
