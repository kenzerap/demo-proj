import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPrivilegeRedemptionReports from './privilege-redemption-report-list.reducer';

export const selectFeature =
  createFeatureSelector<fromPrivilegeRedemptionReports.State>(
    fromPrivilegeRedemptionReports.featureKey
  );

const { selectAll } = fromPrivilegeRedemptionReports.adapter.getSelectors();

export const selectfromPrivilegeRedemptionReports = createSelector(
  selectFeature,
  (state: fromPrivilegeRedemptionReports.State) =>
    selectAll(state.privilegeRedemptionReports)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromPrivilegeRedemptionReports.State) => state.pagination
);

export const selectPrivilegeRedemptionReportFilters = createSelector(
  selectFeature,
  (state: fromPrivilegeRedemptionReports.State) => state.filters
);

export const selectExportLoading = createSelector(
  selectFeature,
  (state: fromPrivilegeRedemptionReports.State) => state.exportLoading
);
