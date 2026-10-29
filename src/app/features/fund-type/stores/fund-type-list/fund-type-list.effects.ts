import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as FundTypesActions from './fund-type-list.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectFundTypeFilters } from './fund-type-list.selectors';
import { FundTypeService } from '../../services/fund-type.service';

@Injectable()
export class FundTypesListEffects {
  private actions$ = inject(Actions);
  private fundTypeService = inject(FundTypeService);
  private store = inject(Store);

  getFundTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FundTypesActions.getFundTypes),
      switchMap(({ queryParams }) => {
        return this.fundTypeService.getFundTypes(queryParams).pipe(
          map((pagedData) =>
            FundTypesActions.getFundTypesSuccess({ pagedData })
          ),
          catchError((error) => {
            return of(FundTypesActions.getFundTypesFailure({ error }));
          })
        );
      })
    )
  );

  setFundTypeFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FundTypesActions.setFundTypeFilters),
      withLatestFrom(this.store.select(selectFundTypeFilters)),
      switchMap(([_, filters]) => {
        return of(FundTypesActions.getFundTypes({ queryParams: filters }));
      })
    )
  );
}
