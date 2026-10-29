import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRedeemHistory from './redeem-history.reducer';

export const selectFeature = createFeatureSelector<fromRedeemHistory.State>(
  fromRedeemHistory.featureKey
);

const { selectIds, selectEntities, selectAll } =
  fromRedeemHistory.adapter.getSelectors();

export const selectRedeemHistoryIds = createSelector(
  selectFeature,
  (state: fromRedeemHistory.State) => selectIds(state)
);

export const selectRedeemHistoryEntities = createSelector(
  selectFeature,
  (state: fromRedeemHistory.State) => selectEntities(state)
);

export const selectRedeemHistories = createSelector(
  selectFeature,
  (state: fromRedeemHistory.State) => selectAll(state)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromRedeemHistory.State) => state.pagination
);
