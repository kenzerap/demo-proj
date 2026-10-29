import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map, of, switchMap, withLatestFrom } from 'rxjs';
import * as BannerSettingOrderActions from './reorder-list.actions';
import * as BannerSettingOrderSelectors from './reorder-list.selectors';
import * as BannerSettingActions from '../banner-setting/banner-setting.actions';
import * as BannerSettingSelectors from '../banner-setting/banner-setting.selectors';
import { BannerSettingService } from '../../services/banner-setting.service';
import { BannerSettingsQueryParams } from '../../models/banner-settings-query-params.model';
import { BannerSetting } from '../../models/banner-setting-model';
import { AuthService } from '@app/core/services/auth-service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { PreviewImage } from '../../models/preview-image.model';
import { checkValidPreviewImage } from '@app/shared/constants/check-valid-preview-image.const';

@Injectable()
export class BannerSettingOrderEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private bannerSettingService = inject(BannerSettingService);
  private authService = inject(AuthService);

  getBannerSettingsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerSettingActions.getBannerSettingsSuccess),
      switchMap(({ pagedData, canEditOrder }) => {
        if (!canEditOrder) {
          return EMPTY;
        }

        return of(
          BannerSettingOrderActions.getMissingBannerSettings({ pagedData })
        );
      })
    )
  );

  getMissingBannerSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerSettingOrderActions.getMissingBannerSettings),
      withLatestFrom(
        this.store.select(
          BannerSettingOrderSelectors.selectVirtualLastDisplayOrder
        ),
        this.store.select(
          BannerSettingOrderSelectors.selectVirtualPublishedItems
        ),
        this.store.select(
          BannerSettingOrderSelectors.selectVirtualUnPublishedItems
        ),
        this.store.select(BannerSettingSelectors.selectBannerSettingFilters)
      ),
      switchMap(
        ([
          { pagedData },
          virtualLastDisplayOrder,
          virtualPublishedItems,
          virtualUnPublishedItems,
          filterParams,
        ]) => {
          let params: Partial<BannerSettingsQueryParams> = {
            ...filterParams,
            page: 0,
            size: 1,
            target_group_ids: undefined,
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
              BannerSettingOrderActions.getMissingBannerSettingsSuccess({
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

          return this.bannerSettingService
            .getBannerSettings({ ...params, size: params.size || 1 })
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
                      (x) => x.banner_id === item.banner_id
                    ) &&
                    !virtualPublishedItems.some(
                      (x) => x.banner_id === item.banner_id
                    )
                );

                const realRemainingUnPublishedItems = pagedItems.filter(
                  (item) =>
                    !item.is_published &&
                    !virtualUnPublishedItems.some(
                      (x) => x.banner_id === item.banner_id
                    ) &&
                    !virtualPublishedItems.some(
                      (x) => x.banner_id === item.banner_id
                    )
                );
                const maxPage = Math.max(
                  ...pagedItems.map((item) => item.pagePosition || 0),
                  ...virtualPublishedItems.map((item) => item.pagePosition || 0)
                );

                let repositionData: BannerSetting[] = [];
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

                return BannerSettingOrderActions.getMissingBannerSettingsSuccess(
                  {
                    data: newData,
                    virtualPublishedItems: newPublishedItems,
                  }
                );
              }),
              catchError((error) => {
                return of(
                  BannerSettingOrderActions.getMissingBannerSettingsFailure({
                    error,
                  })
                );
              })
            );
        }
      )
    )
  );

  reOrderBannerSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerSettingOrderActions.reOrderBannerSettings),
      withLatestFrom(
        this.authService.getCurrentUser$(),
        this.store.select(BannerSettingSelectors.selectBannerSettingFilters),
        this.store.select(
          BannerSettingOrderSelectors.selectVirtualPublishedItems
        ),
        this.store.select(
          BannerSettingOrderSelectors.selectVirtualUnPublishedItems
        )
      ),
      switchMap(
        ([_, currentUser, filter, publishedItems, unPublishedItems]) => {
          const params = {
            on_items: publishedItems.map((item) => item.banner_id),
            off_items: unPublishedItems.map((item) => item.banner_id),
            updated_by: currentUser?.username || '',
            page_id: filter.page_id || 0,
          };

          return this.bannerSettingService.reOrderBannerSettings(params).pipe(
            map(() => BannerSettingOrderActions.reOrderBannerSettingsSuccess()),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Banner setting',
                message: `Failed to edit order Banner setting (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                BannerSettingOrderActions.reOrderBannerSettingsFailure({
                  messageData,
                })
              );
            })
          );
        }
      )
    )
  );

  updatePublishedStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        BannerSettingOrderActions.updatePublishedStatus,
        BannerSettingOrderActions.updateBannerSettingsOrder
      ),
      withLatestFrom(
        this.store.select(
          BannerSettingOrderSelectors.selectVirtualPublishedItems
        )
      ),
      switchMap(([_, virtualPublishedItems]) => {
        const previewImages: PreviewImage[] = [];
        virtualPublishedItems.forEach((item) => {
          if (
            checkValidPreviewImage(item.start_date_time, item.end_date_time)
          ) {
            previewImages.push({
              image: item.image,
              bannerId: item.banner_id,
              imageData: item.image_data,
            });
          }
        });

        return of(
          BannerSettingActions.updatePublishedImages({ previewImages })
        );
      })
    )
  );
}
