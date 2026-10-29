import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { PrivilegeUsageReportQueryParams } from '../../models/privilege-usage-report-query-params.model';
import { PrivilegeUsageReport } from '../../models/privilege-usage-report.model';

const prefix = '[privilegeUsageReports]';

export const getPrivilegeUsageReports = createAction(
  `${prefix} Get Privilege Usage Reports  | loadingKey=getPrivilegeUsageReports`,
  props<{ params: Partial<PrivilegeUsageReportQueryParams> }>()
);

export const getPrivilegeUsageReportsSuccess = createAction(
  `${prefix} Get Privilege Usage Reports Success | loadingKey=getPrivilegeUsageReports`,
  props<{ pagedData: PagedData<PrivilegeUsageReport> }>()
);

export const getPrivilegeUsageReportsFailure = createAction(
  `${prefix} Get Privilege Usage Reports Failure | loadingKey=getPrivilegeUsageReports`,
  props<{ error: CommonError }>()
);

export const setPrivilegeUsageReportsFilters = createAction(
  `${prefix} Set Privilege Usage Reports Filters`,
  props<{ filters: Partial<PrivilegeUsageReportQueryParams> }>()
);

export const resetPrivilegeUsageReportsFilters = createAction(
  `${prefix} Reset Filters | loadingKey=getPrivilegeUsageReports`
);

export const exportPrivilegeUsageReports = createAction(
  `${prefix} Export Privilege Usage Reports | loadingKey=exportPrivilegeUsageReports`,
  props<{ params: Partial<PrivilegeUsageReportQueryParams> }>()
);

export const exportPrivilegeUsageReportsSuccess = createAction(
  `${prefix} Export Privilege Usage Reports Success | loadingKey=exportPrivilegeUsageReports`,
  props<{ fileName: string }>()
);

export const exportPrivilegeUsageReportsFailure = createAction(
  `${prefix} Export Privilege Usage Reports Failure | loadingKey=exportPrivilegeUsageReports`,
  props<{ error: CommonError; fileName: string }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
