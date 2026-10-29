import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CustomerSegmentationActions from './customer-segmentation.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as customerSegmentationSelectors from './customer-segmentation.selectors';
import { CustomerSegmentationService } from '../../services/customer-segmentation.service';
import { CustomerSegmentationsQueryParams } from '../../models/customer-segmentations-query-params.model';

@Injectable()
export class CustomerSegmentationEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private customerSegmentationService = inject(CustomerSegmentationService);

  getCustomerSegmentations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerSegmentationActions.getCustomerSegmentations),
      switchMap(({ queryParams }) => {
        const params: Partial<CustomerSegmentationsQueryParams> = {
          ...queryParams,
        };

        return this.customerSegmentationService
          .getCustomerSegmentations(params)
          .pipe(
            map((pagedData) => {
              return CustomerSegmentationActions.getCustomerSegmentationsSuccess(
                {
                  pagedData,
                  canEditOrder: true,
                }
              );
            }),
            catchError((error) => {
              return of(
                CustomerSegmentationActions.getCustomerSegmentationsFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  setCustomerSegmentationsFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerSegmentationActions.setCustomerSegmentationsFilter),
      withLatestFrom(
        this.store.select(
          customerSegmentationSelectors.selectCustomerSegmentationFilters
        )
      ),
      switchMap(([_, filters]) => {
        return of(
          CustomerSegmentationActions.getCustomerSegmentations({
            queryParams: { ...filters },
          })
        );
      })
    )
  );
}
