import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { EclaimReportQueryParams } from '../../models/e-claim-report-query-params.model';
import { EclaimReport } from '../../models/e-claim-report.model';

const prefix = '[eclaimReports]';

export const getEclaimReports = createAction(
  `${prefix} Get Eclaim Reports  | loadingKey=getEclaimReports`,
  props<{ params: Partial<EclaimReportQueryParams> }>()
);

export const getEclaimReportsSuccess = createAction(
  `${prefix} Get Eclaim Reports Success | loadingKey=getEclaimReports`,
  props<{ pagedData: PagedData<EclaimReport> }>()
);

export const getEclaimReportsFailure = createAction(
  `${prefix} Get Eclaim Reports Failure | loadingKey=getEclaimReports`,
  props<{ error: CommonError }>()
);

export const setEclaimReportsFilters = createAction(
  `${prefix} Set Eclaim Reports Filters`,
  props<{ filters: Partial<EclaimReportQueryParams> }>()
);

export const resetEclaimReportsFilters = createAction(
  `${prefix} Reset Filters | loadingKey=getEclaimReports`
);

export const exportEclaimReports = createAction(
  `${prefix} Export Eclaim Reports | loadingKey=exportEclaimReports`,
  props<{ params: Partial<EclaimReportQueryParams> }>()
);

export const exportEclaimReportsSuccess = createAction(
  `${prefix} Export Eclaim Reports Success | loadingKey=exportEclaimReports`,
  props<{ fileName: string }>()
);

export const exportEclaimReportsFailure = createAction(
  `${prefix} Export Eclaim Reports Failure | loadingKey=exportEclaimReports`,
  props<{ error: CommonError; fileName: string }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
