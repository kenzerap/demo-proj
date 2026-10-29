import { createAction, props } from '@ngrx/store';
import { RedeemHistory } from '../../models/redeem-history.model';
import { RedeemHistoriesQueryParams } from '../../models/redeem-histories-query-params.model';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

const prefix = '[Redeem History]';

export const getRedeemHistories = createAction(
  `${prefix} Get Redeem Histories | loadingKey=getRedeemHistories`,
  props<{ partyId: string; queryParams: Partial<RedeemHistoriesQueryParams> }>()
);

export const getRedeemHistoriesSuccess = createAction(
  `${prefix} Get Redeem Histories Success | loadingKey=getRedeemHistories`,
  props<{ pagedData: PagedData<RedeemHistory> }>()
);

export const getRedeemHistoriesFailure = createAction(
  `${prefix} Get Redeem Histories Failure | loadingKey=getRedeemHistories`,
  props<{ error: CommonError }>()
);

// export to excel
export const exportRedeemToExcel = createAction(
  `${prefix} Export redeem to excel | loadingKey=exportRedeemToExcel`,
  props<{ file_name: string; partyId: string }>()
);

export const exportRedeemToExcelPending = createAction(
  `${prefix} Export redeem to excel Pending | loadingKey=exportRedeemToExcel`
);

export const exportRedeemToExcelSuccess = createAction(
  `${prefix} Export redeem to excel Success | loadingKey=exportRedeemToExcel`,
  props<{ file_name: string; url: string }>()
);

export const exportRedeemToExcelFailure = createAction(
  `${prefix} Export redeem to excel Failure | loadingKey=exportRedeemToExcel`,
  props<{ messageData: ToastMessageData }>()
);

export const resetRedeemHistories = createAction(
  `${prefix} Reset Redeem History List`
);
