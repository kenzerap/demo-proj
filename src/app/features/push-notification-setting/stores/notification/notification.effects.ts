import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as NotificationsActions from './notification.actions';
import * as NotificationsSelectors from './notification.selectors';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Store } from '@ngrx/store';
import { CommonNotificationService } from '@app/shared/services/common-notification.service';

@Injectable()
export class NotificationsEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);
  private segmentSummaryService = inject(CommonNotificationService);
  private store = inject(Store);

  getNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.getNotifications),
      switchMap(({ queryParams }) => {
        return this.notificationService.getNotifications(queryParams).pipe(
          map((pagedData) =>
            NotificationsActions.getNotificationsSuccess({ pagedData })
          ),
          catchError((error) => {
            return of(NotificationsActions.getNotificationsFailure({ error }));
          })
        );
      })
    )
  );

  setNotificationFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.setNotificationFilters),
      withLatestFrom(
        this.store.select(NotificationsSelectors.selectNotificationFilters)
      ),
      switchMap(([_, filters]) => {
        return of(
          NotificationsActions.getNotifications({ queryParams: filters })
        );
      })
    )
  );

  getTargetGroupUserCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.getTargetGroupUserCount),
      withLatestFrom(
        this.store.select(
          NotificationsSelectors.selectTargetGroupUserCountsPagination
        )
      ),
      switchMap(([{ sendTimeType, page, isGetMore }, pagination]) => {
        const requestPage = isGetMore ? pagination.page + 1 : page || 0;
        return this.segmentSummaryService
          .getTargetGroupUserCount(sendTimeType, requestPage)
          .pipe(
            map((pagedData) =>
              NotificationsActions.getTargetGroupUserCountSuccess({
                pagedData,
                isGetMore,
              })
            ),
            catchError((error) => {
              return of(
                NotificationsActions.getTargetGroupUserCountFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );
}
