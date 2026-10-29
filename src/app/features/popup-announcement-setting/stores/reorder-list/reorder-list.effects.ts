import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map, of, switchMap, withLatestFrom } from 'rxjs';
import * as PopupAnnouncementOrderActions from './reorder-list.actions';
import * as PopupAnnouncementOrderSelectors from './reorder-list.selectors';
import * as PopupAnnouncementActions from '../popup-announcement/popup-announcement.actions';
import * as PopupAnnouncementSelectors from '../popup-announcement/popup-announcement.selectors';
import { PopupAnnouncementService } from '../../services/popup-announcement.service';
import { PopupAnnouncementsQueryParams } from '../../models/popup-announcements-query-params.model';
import { PopupAnnouncement } from '../../models/popup-announcement-model';
import { AuthService } from '@app/core/services/auth-service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { PreviewImage } from '../../models/preview-image.model';
import { checkValidPreviewImage } from '@app/shared/constants/check-valid-preview-image.const';

@Injectable()
export class PopupAnnouncementOrderEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private popupAnnouncementService = inject(PopupAnnouncementService);
  private authService = inject(AuthService);

  getPopupAnnouncementsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PopupAnnouncementActions.getPopupAnnouncementsSuccess),
      switchMap(({ pagedData, canEditOrder }) => {
        if (!canEditOrder) {
          return EMPTY;
        }

        return of(
          PopupAnnouncementOrderActions.getMissingPopupAnnouncements({
            pagedData,
          })
        );
      })
    )
  );

  getMissingPopupAnnouncements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PopupAnnouncementOrderActions.getMissingPopupAnnouncements),
      withLatestFrom(
        this.store.select(
          PopupAnnouncementOrderSelectors.selectVirtualLastDisplayOrder
        ),
        this.store.select(
          PopupAnnouncementOrderSelectors.selectVirtualPublishedItems
        ),
        this.store.select(
          PopupAnnouncementOrderSelectors.selectVirtualUnPublishedItems
        ),
        this.store.select(
          PopupAnnouncementSelectors.selectPopupAnnouncementFilters
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
          let params: Partial<PopupAnnouncementsQueryParams> = {
            ...filterParams,
            page: 0,
            size: 1,
            targetGroupIds: undefined,
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
              PopupAnnouncementOrderActions.getMissingPopupAnnouncementsSuccess(
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

          return this.popupAnnouncementService
            .getPopupAnnouncements({ ...params, size: params.size || 1 })
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
                  (item) => item.isPublished
                );

                const realRemainingPublishedItems = realPublishedItems.filter(
                  (item) =>
                    !virtualUnPublishedItems.some(
                      (x) => x.bannerId === item.bannerId
                    ) &&
                    !virtualPublishedItems.some(
                      (x) => x.bannerId === item.bannerId
                    )
                );

                const realRemainingUnPublishedItems = pagedItems.filter(
                  (item) =>
                    !item.isPublished &&
                    !virtualUnPublishedItems.some(
                      (x) => x.bannerId === item.bannerId
                    ) &&
                    !virtualPublishedItems.some(
                      (x) => x.bannerId === item.bannerId
                    )
                );
                const maxPage = Math.max(
                  ...pagedItems.map((item) => item.pagePosition || 0),
                  ...virtualPublishedItems.map((item) => item.pagePosition || 0)
                );

                let repositionData: PopupAnnouncement[] = [];
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
                  (item) => item.isPublished
                );

                newData = repositionData.slice(startPage, endPage);

                return PopupAnnouncementOrderActions.getMissingPopupAnnouncementsSuccess(
                  {
                    data: newData,
                    virtualPublishedItems: newPublishedItems,
                  }
                );
              }),
              catchError((error) => {
                return of(
                  PopupAnnouncementOrderActions.getMissingPopupAnnouncementsFailure(
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

  reOrderPopupAnnouncements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PopupAnnouncementOrderActions.reOrderPopupAnnouncements),
      withLatestFrom(
        this.authService.getCurrentUser$(),
        this.store.select(
          PopupAnnouncementSelectors.selectPopupAnnouncementFilters
        ),
        this.store.select(
          PopupAnnouncementOrderSelectors.selectVirtualPublishedItems
        ),
        this.store.select(
          PopupAnnouncementOrderSelectors.selectVirtualUnPublishedItems
        )
      ),
      switchMap(
        ([_, currentUser, filter, publishedItems, unPublishedItems]) => {
          const params = {
            onItems: publishedItems.map((item) => item.bannerId),
            offItems: unPublishedItems.map((item) => item.bannerId),
            updatedBy: currentUser?.username || '',
            pageId: filter.pageId || 0,
          };

          return this.popupAnnouncementService
            .reOrderPopupAnnouncements(params)
            .pipe(
              map(() =>
                PopupAnnouncementOrderActions.reOrderPopupAnnouncementsSuccess()
              ),
              catchError((error) => {
                const messageData: ToastMessageData = {
                  title: 'Popup announcement',
                  message: `Failed to edit order Popup announcement (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                  type: ToastMessageType.ERROR,
                };

                return of(
                  PopupAnnouncementOrderActions.reOrderPopupAnnouncementsFailure(
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

  updatePublishedStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PopupAnnouncementOrderActions.updatePublishedStatus,
        PopupAnnouncementOrderActions.updatePopupAnnouncementsOrder
      ),
      withLatestFrom(
        this.store.select(
          PopupAnnouncementOrderSelectors.selectVirtualPublishedItems
        )
      ),
      switchMap(([_, virtualPublishedItems]) => {
        const previewImages: PreviewImage[] = [];
        virtualPublishedItems.forEach((item) => {
          if (checkValidPreviewImage(item.startDateTime, item.endDateTime)) {
            previewImages.push({
              image: item.image,
              bannerId: item.bannerId,
              imageData: item.imageData,
            });
          }
        });

        return of(
          PopupAnnouncementActions.updatePublishedImages({ previewImages })
        );
      })
    )
  );
}
