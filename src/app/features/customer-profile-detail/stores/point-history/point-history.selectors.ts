import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPointHistory from './point-history.reducer';

export const selectFeature = createFeatureSelector<fromPointHistory.State>(
  fromPointHistory.featureKey
);

// point history list
const { selectIds, selectEntities, selectAll } =
  fromPointHistory.pointHistoriesAdapter.getSelectors();

export const selectPointHistoryIds = createSelector(
  selectFeature,
  (state: fromPointHistory.State) => selectIds(state.pointHistories)
);

export const selectPointHistoryEntities = createSelector(
  selectFeature,
  (state: fromPointHistory.State) => selectEntities(state.pointHistories)
);

export const selectPointHistories = createSelector(
  selectFeature,
  (state: fromPointHistory.State) => selectAll(state.pointHistories)
);

export const selectPointHistoriesPagination = createSelector(
  selectFeature,
  (state: fromPointHistory.State) => state.pointHistoriesPagination
);

// point expire list
const {
  selectIds: selectIdsPointExpiries,
  selectEntities: selectEntitiesPointExpiries,
  selectAll: selectAllPointExpiries,
} = fromPointHistory.pointExpiriesAdapter.getSelectors();

export const selectPointExpireIds = createSelector(
  selectFeature,
  (state: fromPointHistory.State) => selectIdsPointExpiries(state.pointExpiries)
);

export const selectPointExpireEntities = createSelector(
  selectFeature,
  (state: fromPointHistory.State) =>
    selectEntitiesPointExpiries(state.pointExpiries)
);

export const selectPointExpiries = createSelector(
  selectFeature,
  (state: fromPointHistory.State) => selectAllPointExpiries(state.pointExpiries)
);

export const selectPointExpiriesPagination = createSelector(
  selectFeature,
  (state: fromPointHistory.State) => state.pointExpiriesPagination
);
