import { createAction, props } from '@ngrx/store';
import { OtpHistory } from '../../models/otp-history.model';
import { OtpHistoriesQueryParams } from '../../models/otp-histories-query-params.model';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';

const prefix = '[Otp History]';

export const getOtpHistories = createAction(
  `${prefix} Get Otp Histories | loadingKey=getOtpHistories`,
  props<{ queryParams: Partial<OtpHistoriesQueryParams> }>()
);

export const getOtpHistoriesSuccess = createAction(
  `${prefix} Get Otp Histories Success | loadingKey=getOtpHistories`,
  props<{ pagedData: PagedData<OtpHistory> }>()
);

export const getOtpHistoriesFailure = createAction(
  `${prefix} Get Otp Histories Failure | loadingKey=getOtpHistories`,
  props<{ error: CommonError }>()
);

export const resetOtpHistories = createAction(`${prefix} Reset Otp History List`);