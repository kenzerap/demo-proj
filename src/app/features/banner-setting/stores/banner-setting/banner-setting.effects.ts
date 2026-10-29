import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as BannerSettingActions from './banner-setting.actions';
import * as BannerSettingSelectors from './banner-setting.selectors';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { BannerSettingService } from '../../services/banner-setting.service';
import { BannerSettingsQueryParams } from '../../models/banner-settings-query-params.model';
import { CommonContentService } from '@app/shared/services/common-content.service';

@Injectable()
export class BannerSettingEffects {
  private actions$ = inject(Actions);
  private bannerSettingService = inject(BannerSettingService);
  private commonContentService = inject(CommonContentService);
  private store = inject(Store);

  getBannerSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerSettingActions.getBannerSettings),
      switchMap(({ queryParams }) => {
        const params: Partial<BannerSettingsQueryParams> = {
          ...queryParams,
          target_group_ids: queryParams.target_group_ids?.includes(-1)
            ? undefined
            : queryParams.target_group_ids,
        };

        return this.bannerSettingService.getBannerSettings(params).pipe(
          map((pagedData) =>
            BannerSettingActions.getBannerSettingsSuccess({
              pagedData,
              canEditOrder: !!queryParams.target_group_ids?.includes(-1),
            })
          ),
          catchError((error) => {
            return of(BannerSettingActions.getBannerSettingsFailure({ error }));
          })
        );
      })
    )
  );

  setBannerSettingsFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerSettingActions.setBannerSettingsFilter),
      withLatestFrom(
        this.store.select(BannerSettingSelectors.selectBannerSettingFilters)
      ),
      switchMap(([_, filters]) => {
        return of(
          BannerSettingActions.getBannerSettings({
            queryParams: { ...filters, page_id: filters.page_id || 1 },
          })
        );
      })
    )
  );

  getBannerSettingTabs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerSettingActions.getBannerSettingTabs),
      switchMap(({ isDropdownOptions }) => {
        return this.bannerSettingService.getBannerSettingTabs().pipe(
          map((data) =>
            BannerSettingActions.getBannerSettingTabsSuccess({
              data,
              isDropdownOptions,
            })
          ),
          catchError((error) => {
            return of(
              BannerSettingActions.getBannerSettingTabsFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getTargetGroupUserCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerSettingActions.getTargetGroupUserCount),
      withLatestFrom(
        this.store.select(
          BannerSettingSelectors.selectTargetGroupUserCountsPagination
        )
      ),
      switchMap(([{ pageId, page, isGetMore }, pagination]) => {
        const requestPage = isGetMore ? pagination.page + 1 : page || 0;
        return this.commonContentService
          .getTargetGroupUserCount(pageId, 'BANNER', requestPage)
          .pipe(
            map((pagedData) =>
              BannerSettingActions.getTargetGroupUserCountSuccess({
                pagedData,
                isGetMore,
              })
            ),
            catchError((error) => {
              return of(
                BannerSettingActions.getTargetGroupUserCountFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  getPublishedImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerSettingActions.getPublishedImages),
      withLatestFrom(
        this.store.select(BannerSettingSelectors.selectBannerSettingFilters)
      ),
      switchMap(([_, filter]) => {
        const params = {
          pageId: filter.page_id || 0,
          targetGroupIds: filter.target_group_ids?.includes(-1)
            ? undefined
            : filter.target_group_ids,
          bannerType: 'BANNER',
        };

        return this.bannerSettingService.getPublishedImages(params).pipe(
          map((previewImageDataList) =>
            BannerSettingActions.getPublishedImagesSuccess({
              previewImages: previewImageDataList?.data || [],
            })
          ),
          catchError((error) => {
            return of(
              BannerSettingActions.getPublishedImagesFailure({ error })
            );
          })
        );
      })
    )
  );
}
