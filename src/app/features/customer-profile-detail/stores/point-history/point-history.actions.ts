import { createAction, props } from '@ngrx/store';
import { PointHistory } from '../../models/point-history.model';
import {
  AddDeletePointQueryParams,
  PointHistoriesQueryParams,
} from '../../models/point-histories-query-params.model';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { PointExpiriesQueryParams } from '../../models/point-expires-query-params.model';
import { PointExpire } from '../../models/point-expire-history.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { ToastMessageData } from 'src/app/shared/models/toast-message-data.model';

const prefix = '[Point History]';

export const addPoint = createAction(
  `${prefix} Add Point | loadingKey=addPoint`,
  props<{ partyId: string; queryParams: Partial<AddDeletePointQueryParams> }>()
);

export const addPointSuccess = createAction(
  `${prefix} Add Point Success | loadingKey=addPoint`,
  props<{ partyId: string; data: PointHistory }>()
);

export const addPointFailure = createAction(
  `${prefix} Add Point Failure | loadingKey=addPoint`,
  props<{ messageData: ToastMessageData }>()
);

export const deletePoint = createAction(
  `${prefix} Delete Point | loadingKey=deletePoint`,
  props<{ partyId: string; queryParams: Partial<AddDeletePointQueryParams> }>()
);

export const deletePointSuccess = createAction(
  `${prefix} Delete Point Success | loadingKey=deletePoint`,
  props<{ partyId: string; data: PointHistory }>()
);

export const deletePointFailure = createAction(
  `${prefix} Delete Point Failure | loadingKey=deletePoint`,
  props<{ messageData: ToastMessageData }>()
);

// point history list
export const getPointHistories = createAction(
  `${prefix} Get Point Histories | loadingKey=getPointHistories`,
  props<{ partyId: string; queryParams: Partial<PointHistoriesQueryParams> }>()
);

export const getPointHistoriesSuccess = createAction(
  `${prefix} Get Point Histories Success | loadingKey=getPointHistories`,
  props<{ pagedData: PagedData<PointHistory> }>()
);

export const getPointHistoriesFailure = createAction(
  `${prefix} Get Point Histories Failure | loadingKey=getPointHistories`,
  props<{ error: CommonError }>()
);

export const resetPointHistories = createAction(
  `${prefix} Reset Point History List`
);

// point expire list
export const getPointExpiries = createAction(
  `${prefix} Get Point Expires | loadingKey=getPointExpiries`,
  props<{ partyId: string; queryParams: Partial<PointExpiriesQueryParams> }>()
);

export const getPointExpiriesSuccess = createAction(
  `${prefix} Get Point Expires Success | loadingKey=getPointExpiries`,
  props<{ pagedData: PagedData<PointExpire> }>()
);

export const getPointExpiriesFailure = createAction(
  `${prefix} Get Point Expires Failure | loadingKey=getPointExpiries`,
  props<{ error: CommonError }>()
);

// export to excel
export const exportPointToExcel = createAction(
  `${prefix} Export point to excel | loadingKey=exportPointToExcel`,
  props<{ file_name: string; partyId: string; exportType: string; }>()
);

export const exportPointToExcelPending = createAction(
  `${prefix} Export point to excel Pending | loadingKey=exportPointToExcel`
);

export const exportPointToExcelSuccess = createAction(
  `${prefix} Export point to excel Success | loadingKey=exportPointToExcel`,
  props<{ file_name: string; url: string }>()
);

export const exportPointToExcelFailure = createAction(
  `${prefix} Export point to excel Failure | loadingKey=exportPointToExcel`,
  props<{ messageData: ToastMessageData }>()
);

export const resetPointExpiries = createAction(
  `${prefix} Reset Point Expire List`
);

export const reset = createAction(`${prefix} Reset Point History`);
