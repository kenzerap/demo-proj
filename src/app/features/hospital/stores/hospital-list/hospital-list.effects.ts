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
import * as HospitalActions from './hospital-list.actions';
import { selectHospitalFilters } from './hospital-list.selector';
import { HospitalService } from '../../services/hospital.services';

@Injectable()
export class HospitalEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private hospitalService = inject(HospitalService);

  getHospitals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HospitalActions.getHospital),
      switchMap(({ params }) => {
        return this.hospitalService.getHospitals(params).pipe(
          map((pagedData) =>
            HospitalActions.getHospitalSuccess({
              pagedData,
              canEditOrder:
                !params.keyword && !params.sort_by && !params.sort_direction,
            })
          ),
          catchError((error) => {
            return of(
              HospitalActions.getHospitalFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  setHospitalFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HospitalActions.setHospitalFilters),
      withLatestFrom(this.store.select(selectHospitalFilters)),
      switchMap(([_, filters]) => {
        return of(
          HospitalActions.getHospital({
            params: filters,
          })
        );
      })
    )
  );
}
