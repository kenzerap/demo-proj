import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PointRulesActions from './point-rule-list.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectPointRuleFilters } from './point-rule-list.selectors';
import { PointRuleSettingService } from '../../services/point-rule-setting.service';

@Injectable()
export class PointRulesListEffects {
  private actions$ = inject(Actions);
  private pointRuleSettingService = inject(PointRuleSettingService);
  private store = inject(Store);

  getPointRules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointRulesActions.getPointRules),
      switchMap(({ queryParams }) => {
        return this.pointRuleSettingService.getPointRules(queryParams).pipe(
          map((pagedData) =>
            PointRulesActions.getPointRulesSuccess({ pagedData })
          ),
          catchError((error) => {
            return of(PointRulesActions.getPointRulesFailure({ error }));
          })
        );
      })
    )
  );

  setPointRuleFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointRulesActions.setPointRuleFilters),
      withLatestFrom(this.store.select(selectPointRuleFilters)),
      switchMap(([_, filters]) => {
        return of(PointRulesActions.getPointRules({ queryParams: filters }));
      })
    )
  );
}
