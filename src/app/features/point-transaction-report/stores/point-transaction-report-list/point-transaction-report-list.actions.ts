import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { PointTransactionReportQueryParams } from '../../models/point-transaction-report-query-params.model';
import { PointTransactionReport } from '../../models/point-transaction-report.model';

const prefix = '[pointTransactionReports]';

export const getPointTransactionReports = createAction(
  `${prefix} Get Point Transaction Reports  | loadingKey=getPointTransactionReports`,
  props<{ params: Partial<PointTransactionReportQueryParams> }>()
);

export const getPointTransactionReportsSuccess = createAction(
  `${prefix} Get Point Transaction Reports Success | loadingKey=getPointTransactionReports`,
  props<{ pagedData: PagedData<PointTransactionReport> }>()
);

export const getPointTransactionReportsFailure = createAction(
  `${prefix} Get Point Transaction Reports Failure | loadingKey=getPointTransactionReports`,
  props<{ error: CommonError }>()
);

export const setPointTransactionReportsFilters = createAction(
  `${prefix} Set Point Transaction Reports Filters`,
  props<{ filters: Partial<PointTransactionReportQueryParams> }>()
);

export const resetPointTransactionReportsFilters = createAction(
  `${prefix} Reset Filters | loadingKey=getPointTransactionReports`
);

export const exportPointTransactionReports = createAction(
  `${prefix} Export Point Transaction Reports | loadingKey=exportPointTransactionReports`,
  props<{ params: Partial<PointTransactionReportQueryParams> }>()
);

export const exportPointTransactionReportsSuccess = createAction(
  `${prefix} Export Point Transaction Reports Success | loadingKey=exportPointTransactionReports`,
  props<{ fileName: string }>()
);

export const exportPointTransactionReportsFailure = createAction(
  `${prefix} Export Point Transaction Reports Failure | loadingKey=exportPointTransactionReports`,
  props<{ error: CommonError; fileName: string }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
