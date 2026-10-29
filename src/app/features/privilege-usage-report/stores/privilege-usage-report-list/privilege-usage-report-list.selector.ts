import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPrivilegeUsageReports from './privilege-usage-report-list.reducer';

export const selectFeature =
  createFeatureSelector<fromPrivilegeUsageReports.State>(
    fromPrivilegeUsageReports.featureKey
  );

const { selectAll } = fromPrivilegeUsageReports.adapter.getSelectors();

export const selectfromPrivilegeUsageReports = createSelector(
  selectFeature,
  (state: fromPrivilegeUsageReports.State) =>
    selectAll(state.privilegeUsageReports)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromPrivilegeUsageReports.State) => state.pagination
);

export const selectPrivilegeUsageFilters = createSelector(
  selectFeature,
  (state: fromPrivilegeUsageReports.State) => state.filters
);

export const selectExportLoading = createSelector(
  selectFeature,
  (state: fromPrivilegeUsageReports.State) => state.exportLoading
);
