import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBrands from './brand-list.reducer';

export const selectFeature = createFeatureSelector<fromBrands.State>(
  fromBrands.featureKey
);

const { selectIds, selectEntities, selectAll } =
  fromBrands.adapter.getSelectors();

export const selectBrandsIds = createSelector(
  selectFeature,
  (state: fromBrands.State) => selectIds(state.brands)
);

export const selectBrandsEntities = createSelector(
  selectFeature,
  (state: fromBrands.State) => selectEntities(state.brands)
);

export const selectBrands = createSelector(
  selectFeature,
  (state: fromBrands.State) => selectAll(state.brands)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromBrands.State) => state.pagination
);

export const selectBrandFilters = createSelector(
  selectFeature,
  (state: fromBrands.State) => state.filters
);
