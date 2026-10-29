import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { PrivilegeRedemptionReportQueryParams } from '../../models/privilede-redemption-report-query-params.model';
import { PrivilegeRedemptionReport } from '../../models/privilede-redemption-report.model';

const prefix = '[privilegeRedemptionReports]';

export const getPrivilegeRedemptionReport = createAction(
  `${prefix} Get Privilege Redemption Reports  | loadingKey=getPrivilegeRedemptionReports`,
  props<{ params: Partial<PrivilegeRedemptionReportQueryParams> }>()
);

export const getPrivilegeRedemptionReportSuccess = createAction(
  `${prefix} Get Privilege Redemption Reports Success | loadingKey=getPrivilegeRedemptionReports`,
  props<{ pagedData: PagedData<PrivilegeRedemptionReport> }>()
);

export const getPrivilegeRedemptionReportFailure = createAction(
  `${prefix} Get Privilege Redemption Reports Failure | loadingKey=getPrivilegeRedemptionReports`,
  props<{ error: CommonError }>()
);

export const setPrivilegeRedemptionReportFilters = createAction(
  `${prefix} Set PromoCode Filters`,
  props<{ filters: Partial<PrivilegeRedemptionReportQueryParams> }>()
);

export const resetPrivilegeRedemptionReportsFilters = createAction(
  `${prefix} Reset Filters | loadingKey=getPrivilegeRedemptionReports`
);

export const exportPrivilegeRedemptionReport = createAction(
  `${prefix} Export Privilege Redemption Reports | loadingKey=exportPrivilegeRedemptionReports`,
  props<{ params: Partial<PrivilegeRedemptionReportQueryParams> }>()
);

export const exportPrivilegeRedemptionReportSuccess = createAction(
  `${prefix} Export Privilege Redemption Reports Success | loadingKey=exportPrivilegeRedemptionReports`,
  props<{ fileName: string }>()
);

export const exportPrivilegeRedemptionReportFailure = createAction(
  `${prefix} Export Privilege Redemption Reports Failure | loadingKey=exportPrivilegeRedemptionReports`,
  props<{ error: CommonError; fileName: string }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
