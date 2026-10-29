import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHospitalLists from './hospital-list.reducer';

export const selectFeature = createFeatureSelector<fromHospitalLists.State>(
  fromHospitalLists.featureKey
);

const { selectAll } = fromHospitalLists.adapter.getSelectors();

export const selectHospitalLists = createSelector(
  selectFeature,
  (state: fromHospitalLists.State) => selectAll(state.hospitals)
);

export const selectPagination = createSelector(
  selectFeature,
  (state: fromHospitalLists.State) => state.pagination
);

export const selectHospitalFilters = createSelector(
  selectFeature,
  (state: fromHospitalLists.State) => state.filters
);
