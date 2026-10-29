import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromInventories from './inventory-list.reducer';

export const selectFeature = createFeatureSelector<fromInventories.State>(
  fromInventories.featureKey
);

const { selectIds, selectEntities, selectAll } =
  fromInventories.adapter.getSelectors();

export const selectInventoriesIds = createSelector(
  selectFeature,
  (state: fromInventories.State) => selectIds(state.inventories)
);

export const selectInventoriesEntities = createSelector(
  selectFeature,
  (state: fromInventories.State) => selectEntities(state.inventories)
);

export const selectInventories = createSelector(
  selectFeature,
  (state: fromInventories.State) => selectAll(state.inventories)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromInventories.State) => state.pagination
);

export const selectInventoryFilters = createSelector(
  selectFeature,
  (state: fromInventories.State) => state.filters
);
