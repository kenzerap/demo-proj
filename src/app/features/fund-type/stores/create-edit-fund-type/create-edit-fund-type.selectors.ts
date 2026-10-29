import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreateEditFundType from './create-edit-fund-type.reducer';

export const selectFeature = createFeatureSelector<fromCreateEditFundType.State>(
  fromCreateEditFundType.featureKey,
);

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreateEditFundType.State) => state.isFormDirty,
);

export const selectFundTypeDetail = createSelector(
  selectFeature,
  (state: fromCreateEditFundType.State) => state.fundTypeDetail,
);

export const selectFundTypeOptions = createSelector(
  selectFeature,
  (state: fromCreateEditFundType.State) => state.fundTypeOptions,
);

export const selectChannelOptions = createSelector(
  selectFundTypeOptions,
  (fundTypeOptions) => fundTypeOptions?.channels ?? [],
);

export const selectProductCodeOptions = createSelector(
  selectFundTypeOptions,
  (fundTypeOptions) => fundTypeOptions?.product_codes ?? [],
);

export const selectNationalityOptions = createSelector(
  selectFundTypeOptions,
  (fundTypeOptions) => fundTypeOptions?.nationalities ?? [],
);
