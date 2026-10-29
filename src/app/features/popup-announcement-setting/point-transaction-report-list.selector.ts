import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPointTransactionReports from '../point-transaction-report/stores/point-transaction-report-list/point-transaction-report-list.reducer';

export const selectFeature =
  createFeatureSelector<fromPointTransactionReports.State>(
    fromPointTransactionReports.featureKey
  );

const { selectAll } = fromPointTransactionReports.adapter.getSelectors();

export const selectfromPointTransactionReports = createSelector(
  selectFeature,
  (state: fromPointTransactionReports.State) =>
    selectAll(state.pointTransactionReports)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromPointTransactionReports.State) => state.pagination
);

export const selectPointTransactionFilters = createSelector(
  selectFeature,
  (state: fromPointTransactionReports.State) => state.filters
);

export const selectExportLoading = createSelector(
  selectFeature,
  (state: fromPointTransactionReports.State) => state.exportLoading
);
