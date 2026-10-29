import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PromoCodesActions from './promocode-list.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectPromoCodeFilters } from './promocode-list.selectors';
import { PromocodeSettingService } from '../../services/promocode-setting.service';

@Injectable()
export class PromoCodesListEffects {
  private actions$ = inject(Actions);
  private promocodeSettingService = inject(PromocodeSettingService);
  private store = inject(Store);

  getPromoCodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromoCodesActions.getPromoCodes),
      switchMap(({ queryParams }) => {
        return this.promocodeSettingService.getPromoCodes(queryParams).pipe(
          map((pagedData) =>
            PromoCodesActions.getPromoCodesSuccess({ pagedData })
          ),
          catchError((error) => {
            return of(PromoCodesActions.getPromoCodesFailure({ error }));
          })
        );
      })
    )
  );

  setPromoCodeFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromoCodesActions.setPromoCodeFilters),
      withLatestFrom(this.store.select(selectPromoCodeFilters)),
      switchMap(([_, filters]) => {
        return of(PromoCodesActions.getPromoCodes({ queryParams: filters }));
      })
    )
  );
}
