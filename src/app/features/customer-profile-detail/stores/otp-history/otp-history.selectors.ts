import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromOtpHistory from './otp-history.reducer';

export const selectFeature = createFeatureSelector<fromOtpHistory.State>(
  fromOtpHistory.featureKey
);

const { selectAll } = fromOtpHistory.adapter.getSelectors();

export const selectOtpHistories = createSelector(
  selectFeature,
  (state: fromOtpHistory.State) => selectAll(state)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromOtpHistory.State) => state.pagination
);
