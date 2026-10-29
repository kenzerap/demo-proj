import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromClaimReports from './e-claim-report-list.reducer';

export const selectFeature = createFeatureSelector<fromClaimReports.State>(
  fromClaimReports.featureKey
);

const { selectAll } = fromClaimReports.adapter.getSelectors();

export const selectfromClaimReports = createSelector(
  selectFeature,
  (state: fromClaimReports.State) => selectAll(state.eclaimReports)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromClaimReports.State) => state.pagination
);

export const selectClaimFilters = createSelector(
  selectFeature,
  (state: fromClaimReports.State) => state.filters
);

export const selectExportLoading = createSelector(
  selectFeature,
  (state: fromClaimReports.State) => state.exportLoading
);
