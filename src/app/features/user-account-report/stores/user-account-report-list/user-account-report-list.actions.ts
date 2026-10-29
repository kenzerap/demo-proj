import { createAction, props } from '@ngrx/store';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { UserAccountReportQueryParams } from '../../models/user-account-report-query-params.model';
import {
  UserAccountReportLists,
  UserAccountReportTotals,
} from '../../models/user-account-report-report.model';
import { PagedData } from '@app/shared/models/paged-data.model';

const prefix = '[userAccountReports]';

export const getUserAccountReportTotals = createAction(
  `${prefix} Get User Account Report Totals  | loadingKey=getUserAccountReportTotals`,
  props<{ params: Partial<UserAccountReportQueryParams> }>()
);

export const getUserAccountReportTotalsSuccess = createAction(
  `${prefix} Get User Account Report Totals Success | loadingKey=getUserAccountReportTotals`,
  props<{
    totals: UserAccountReportTotals;
  }>()
);

export const getUserAccountReportTotalsFailure = createAction(
  `${prefix} Get User Account Report Totals Failure | loadingKey=getUserAccountReportTotals`,
  props<{ error: CommonError }>()
);

export const getUserAccountReports = createAction(
  `${prefix} Get User Account Reports  | loadingKey=getUserAccountReports`,
  props<{ params: Partial<UserAccountReportQueryParams> }>()
);

export const getUserAccountReportsSuccess = createAction(
  `${prefix} Get User Account Reports Success | loadingKey=getUserAccountReports`,
  props<{ pagedData: PagedData<UserAccountReportLists> }>()
);

export const getUserAccountReportsFailure = createAction(
  `${prefix} Get User Account Reports Failure | loadingKey=getUserAccountReports`,
  props<{ error: CommonError }>()
);

export const setUserAccountReportsFilters = createAction(
  `${prefix} Set User Account Reports Filters`,
  props<{ filters: Partial<UserAccountReportQueryParams> }>()
);

export const resetUserAccountReportsFilters = createAction(
  `${prefix} Reset Filters | loadingKey=getUserAccountReports`
);

export const exportUserAccountReports = createAction(
  `${prefix} Export User Account Reports | loadingKey=exportUserAccountReports`,
  props<{ params: Partial<UserAccountReportQueryParams> }>()
);

export const exportUserAccountReportsSuccess = createAction(
  `${prefix} Export User Account Reports Success | loadingKey=exportUserAccountReports`,
  props<{ fileName: string }>()
);

export const exportUserAccountReportsFailure = createAction(
  `${prefix} Export User Account Reports Failure | loadingKey=exportUserAccountReports`,
  props<{ error: CommonError; fileName: string }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
