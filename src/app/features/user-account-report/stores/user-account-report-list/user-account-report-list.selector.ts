import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUserAccountReports from './user-account-report-list.reducer';

export const selectFeature =
  createFeatureSelector<fromUserAccountReports.State>(
    fromUserAccountReports.featureKey
  );

const { selectAll } = fromUserAccountReports.adapter.getSelectors();

export const selectfromUserAccountReports = createSelector(
  selectFeature,
  (state: fromUserAccountReports.State) => selectAll(state.userAccountReports)
);

export const selectUserAccountReportsTotals = createSelector(
  selectFeature,
  (state: fromUserAccountReports.State) => state.userAccountReportTotals
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromUserAccountReports.State) => state.pagination
);

export const selectUserAccountFilters = createSelector(
  selectFeature,
  (state: fromUserAccountReports.State) => state.filters
);

export const selectExportLoading = createSelector(
  selectFeature,
  (state: fromUserAccountReports.State) => state.exportLoading
);

export function getUserAccountReportTotals(): any {
  throw new Error('Function not implemented.');
}
