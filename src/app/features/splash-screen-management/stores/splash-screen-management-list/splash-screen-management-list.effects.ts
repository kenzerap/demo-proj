import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as SplashScreenManagementActions from './splash-screen-management-list.actions';
import { selectSplashScreenManagementFilters } from './splash-screen-management-list.selectors';
import { SplashScreenManagementService } from '../../services/splash-screen-management.service';

@Injectable()
export class SplashScreenManagementListEffects {
  private actions$ = inject(Actions);
  private splashScreenManagementService = inject(SplashScreenManagementService);
  private store = inject(Store);

  getSplashScreenManagements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SplashScreenManagementActions.getSplashScreenManagements),
      switchMap(({ queryParams }) => {
        return this.splashScreenManagementService
          .getSplashScreenManagements(queryParams)
          .pipe(
            map((pagedData) =>
              SplashScreenManagementActions.getSplashScreenManagementsSuccess({
                pagedData,
              })
            ),
            catchError((error) => {
              return of(
                SplashScreenManagementActions.getSplashScreenManagementsFailure(
                  { error }
                )
              );
            })
          );
      })
    )
  );

  setSplashScreenManagementFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SplashScreenManagementActions.setSplashScreenManagementFilters),
      withLatestFrom(this.store.select(selectSplashScreenManagementFilters)),
      switchMap(([_, filters]) => {
        return of(
          SplashScreenManagementActions.getSplashScreenManagements({
            queryParams: filters,
          })
        );
      })
    )
  );
}
