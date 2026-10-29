import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PopupAnnouncementActions from './popup-announcement.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as popupAnnouncementSelectors from './popup-announcement.selectors';
import { PopupAnnouncementService } from '../../services/popup-announcement.service';
import { PopupAnnouncementsQueryParams } from '../../models/popup-announcements-query-params.model';
import { CommonContentService } from '@app/shared/services/common-content.service';

@Injectable()
export class PopupAnnouncementEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private popupAnnouncementService = inject(PopupAnnouncementService);
  private commonContentService = inject(CommonContentService);

  getPopupAnnouncements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PopupAnnouncementActions.getPopupAnnouncements),
      switchMap(({ queryParams }) => {
        const params: Partial<PopupAnnouncementsQueryParams> = {
          ...queryParams,
          targetGroupIds: queryParams.targetGroupIds?.includes(-1)
            ? undefined
            : queryParams.targetGroupIds,
        };

        return this.popupAnnouncementService.getPopupAnnouncements(params).pipe(
          map((pagedData) => {
            return PopupAnnouncementActions.getPopupAnnouncementsSuccess({
              pagedData,
              canEditOrder: !!queryParams.targetGroupIds?.includes(-1),
            });
          }),
          catchError((error) => {
            return of(
              PopupAnnouncementActions.getPopupAnnouncementsFailure({ error })
            );
          })
        );
      })
    )
  );

  setPopupAnnouncementsFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PopupAnnouncementActions.setPopupAnnouncementsFilter),
      withLatestFrom(
        this.store.select(
          popupAnnouncementSelectors.selectPopupAnnouncementFilters
        )
      ),
      switchMap(([_, filters]) => {
        return of(
          PopupAnnouncementActions.getPopupAnnouncements({
            queryParams: { ...filters, pageId: filters.pageId || 1 },
          })
        );
      })
    )
  );

  getPopupAnnouncementTabs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PopupAnnouncementActions.getPopupAnnouncementTabs),
      switchMap(({ isDropdownOptions }) => {
        return this.popupAnnouncementService.getPopupAnnouncementTabs().pipe(
          map((data) =>
            PopupAnnouncementActions.getPopupAnnouncementTabsSuccess({
              data,
              isDropdownOptions,
            })
          ),
          catchError((error) => {
            return of(
              PopupAnnouncementActions.getPopupAnnouncementTabsFailure({
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
      ofType(PopupAnnouncementActions.getTargetGroupUserCount),
      withLatestFrom(
        this.store.select(
          popupAnnouncementSelectors.selectTargetGroupUserCountsPagination
        )
      ),
      switchMap(([{ pageId, page, isGetMore }, pagination]) => {
        const requestPage = isGetMore ? pagination.page + 1 : page || 0;
        return this.commonContentService
          .getTargetGroupUserCount(pageId, 'POPUP_BANNER', requestPage)
          .pipe(
            map((pagedData) =>
              PopupAnnouncementActions.getTargetGroupUserCountSuccess({
                pagedData,
                isGetMore,
              })
            ),
            catchError((error) => {
              return of(
                PopupAnnouncementActions.getTargetGroupUserCountFailure({
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
      ofType(PopupAnnouncementActions.getPublishedImages),
      withLatestFrom(
        this.store.select(
          popupAnnouncementSelectors.selectPopupAnnouncementFilters
        )
      ),
      switchMap(([_, filter]) => {
        const params = {
          pageId: filter.pageId || 0,
          targetGroupIds: filter.targetGroupIds?.includes(-1)
            ? undefined
            : filter.targetGroupIds,
          bannerType: 'POPUP_BANNER',
        };

        return this.popupAnnouncementService.getPublishedImages(params).pipe(
          map((previewImageDataList) =>
            PopupAnnouncementActions.getPublishedImagesSuccess({
              previewImages: previewImageDataList?.data || [],
            })
          ),
          catchError((error) => {
            return of(
              PopupAnnouncementActions.getPublishedImagesFailure({ error })
            );
          })
        );
      })
    )
  );
}
