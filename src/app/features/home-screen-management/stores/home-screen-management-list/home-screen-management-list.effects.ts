import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as HomeScreenManagementActions from './home-screen-management-list.actions';
import { selectHomeScreenManagementFilters } from './home-screen-management-list.selector';
import { HomeScreenManagementService } from '../../services/home-screen-management.services';

@Injectable()
export class HomeScreenManagementEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private homeScreenManagementService = inject(HomeScreenManagementService);

  getHomeScreenManagements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomeScreenManagementActions.getHomeScreenManagement),
      switchMap(({ params }) => {
        return this.homeScreenManagementService
          .getHomeScreenManagement(params)
          .pipe(
            map((pagedData) =>
              HomeScreenManagementActions.getHomeScreenManagementSuccess({
                pagedData,
                canEditOrder: true,
              })
            ),
            catchError((error) => {
              return of(
                HomeScreenManagementActions.getHomeScreenManagementFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  setHomeScreenManagementFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomeScreenManagementActions.setHomeScreenManagementFilters),
      withLatestFrom(this.store.select(selectHomeScreenManagementFilters)),
      switchMap(([_, filters]) => {
        return of(
          HomeScreenManagementActions.getHomeScreenManagement({
            params: filters,
          })
        );
      })
    )
  );
}
