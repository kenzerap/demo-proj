import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UnicodesActions from './unicode-list.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUnicodeFilters } from './unicode-list.selectors';
import { UnicodeSettingService } from '../../services/unicode-setting.service';

@Injectable()
export class UnicodesListEffects {
  private actions$ = inject(Actions);
  private unicodeSettingService = inject(UnicodeSettingService);
  private store = inject(Store);

  getUnicodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnicodesActions.getUnicodes),
      switchMap(({ queryParams }) => {
        return this.unicodeSettingService.getUnicodes(queryParams).pipe(
          map((pagedData) =>
            UnicodesActions.getUnicodesSuccess({ pagedData })
          ),
          catchError((error) => {
            return of(UnicodesActions.getUnicodesFailure({ error }));
          })
        );
      })
    )
  );

  setUnicodeFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnicodesActions.setUnicodeFilters),
      withLatestFrom(this.store.select(selectUnicodeFilters)),
      switchMap(([_, filters]) => {
        return of(UnicodesActions.getUnicodes({ queryParams: filters }));
      })
    )
  );
}
