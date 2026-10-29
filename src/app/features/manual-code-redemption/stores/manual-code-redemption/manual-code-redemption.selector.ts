import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromManualCodeRedemption from './manual-code-redemption.reducer';

export const selectFeature =
  createFeatureSelector<fromManualCodeRedemption.State>(
    fromManualCodeRedemption.featureKey
  );

const { selectAll } = fromManualCodeRedemption.adapter.getSelectors();

export const selectfromManualCodeRedemption = createSelector(
  selectFeature,
  (state: fromManualCodeRedemption.State) =>
    selectAll(state.manualCodeRedemption)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromManualCodeRedemption.State) => state.pagination
);

export const selectManualCodeRedemptionFilters = createSelector(
  selectFeature,
  (state: fromManualCodeRedemption.State) => state.filters
);
