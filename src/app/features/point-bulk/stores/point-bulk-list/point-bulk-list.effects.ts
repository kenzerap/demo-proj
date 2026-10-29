import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PointBulksActions from './point-bulk-list.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectPointBulkFilters } from './point-bulk-list.selectors';
import { PointBulkService } from '../../services/point-bulk.service';

@Injectable()
export class PointBulksListEffects {
  private actions$ = inject(Actions);
  private pointBulkService = inject(PointBulkService);
  private store = inject(Store);

  getPointBulks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointBulksActions.getPointBulks),
      switchMap(({ queryParams }) => {
        return this.pointBulkService.getPointBulks(queryParams).pipe(
          map((pagedData) =>
            PointBulksActions.getPointBulksSuccess({ pagedData })
          ),
          catchError((error) => {
            return of(PointBulksActions.getPointBulksFailure({ error }));
          })
        );
      })
    )
  );

  setPointBulkFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointBulksActions.setPointBulkFilters),
      withLatestFrom(this.store.select(selectPointBulkFilters)),
      switchMap(([_, filters]) => {
        return of(PointBulksActions.getPointBulks({ queryParams: filters }));
      })
    )
  );

  downloadFileTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointBulksActions.downloadFileTemplate),
      switchMap(() => {
        return this.pointBulkService.downloadFileTemplate().pipe(
          map(({ file_name, data }) => {
            const a = document.createElement('a');
            a.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + data;
            a.download = file_name || 'template.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(data);

            return PointBulksActions.downloadFileTemplateSuccess();
          }),
          catchError((error) => {
            return of(PointBulksActions.downloadFileTemplateFailure({ error }));
          })
        );
      })
    )
  );
}
