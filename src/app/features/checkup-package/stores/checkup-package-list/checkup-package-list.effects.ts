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
import * as CheckupPackageActions from './checkup-package-list.actions';
import { CheckupPackageService } from '../../services/checkup-package.services';
import { selectCheckupPackageFilters } from './checkup-package-list.selector';

@Injectable()
export class CheckupPackageEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private checkupPackageService = inject(CheckupPackageService);

  getCheckupPackgages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckupPackageActions.getCheckupPackgage),
      switchMap(({ params }) => {
        return this.checkupPackageService.getCheckupPackages(params).pipe(
          map((pagedData) =>
            CheckupPackageActions.getCheckupPackgageSuccess({
              pagedData,
              canEditOrder: true,
            })
          ),
          catchError((error) => {
            return of(
              CheckupPackageActions.getCheckupPackgageFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  setCheckupPackageFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckupPackageActions.setCheckupPackgageFilters),
      withLatestFrom(this.store.select(selectCheckupPackageFilters)),
      switchMap(([_, filters]) => {
        return of(
          CheckupPackageActions.getCheckupPackgage({
            params: filters,
          })
        );
      })
    )
  );
}
