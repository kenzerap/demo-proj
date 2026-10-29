import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as OtpHistoryActions from './otp-history.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerProfileDetailService } from '../../services/customer-profile-detail.service';

@Injectable()
export class OtpHistoryEffects {
  private actions$ = inject(Actions);
  private customerProfileDetailService = inject(CustomerProfileDetailService);

  getOtpHistories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OtpHistoryActions.getOtpHistories),
      switchMap(({ queryParams }) => {
        return this.customerProfileDetailService
          .getOtpHistories(queryParams)
          .pipe(
            map((pagedData) =>
              OtpHistoryActions.getOtpHistoriesSuccess({ pagedData })
            ),
            catchError((error) => {
              return of(OtpHistoryActions.getOtpHistoriesFailure({ error }));
            })
          );
      })
    )
  );
}
