import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreateBrand from './create-edit-brand.reducer';

export const selectFeature = createFeatureSelector<fromCreateBrand.State>(
  fromCreateBrand.featureKey
);

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreateBrand.State) => state.isFormDirty
);
export const selectBrandDetail = createSelector(
  selectFeature,
  (state: fromCreateBrand.State) => state.brandDetail
);

export const selectBrandDisplayOrders = createSelector(
  selectFeature,
  (state: fromCreateBrand.State) => state.brandDisplayOrders
);

// brand category
const { selectIds, selectEntities, selectAll } =
  fromCreateBrand.brandCategoryAdapter.getSelectors();

export const selectBrandCategoriesIds = createSelector(
  selectFeature,
  (state: fromCreateBrand.State) => selectIds(state.brandCategories)
);

export const selectBrandCategoriesEntities = createSelector(
  selectFeature,
  (state: fromCreateBrand.State) => selectEntities(state.brandCategories)
);

export const selectBrandCategories = createSelector(
  selectFeature,
  (state: fromCreateBrand.State) => selectAll(state.brandCategories)
);

export const selectBrandCategoryDisplayOrders = createSelector(
  selectFeature,
  (state: fromCreateBrand.State) => state.brandCategoryDisplayOrders
);
