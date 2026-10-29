import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHospitalOrder from './reorder-list.reducer';

export const selectFeature = createFeatureSelector<fromHospitalOrder.State>(
  fromHospitalOrder.featureKey
);

export const selectIsOrderDirty = createSelector(
  selectFeature,
  (state: fromHospitalOrder.State) => state.isOrderDirty
);

export const selectIsEditOrderMode = createSelector(
  selectFeature,
  (state: fromHospitalOrder.State) => state.isEditOrderMode
);

export const selectVirtualLastDisplayOrder = createSelector(
  selectFeature,
  (state: fromHospitalOrder.State) => state.virtualLastDisplayOrder
);

const { selectAll } = fromHospitalOrder.hospitalsAdapter.getSelectors();

export const selectVirtualHospitals = createSelector(
  selectFeature,
  (state: fromHospitalOrder.State) => selectAll(state.virtualHospitals)
);

const { selectAll: selectAllOrdered } =
  fromHospitalOrder.orderedHospitalsAdapter.getSelectors();

export const selectVirtualPublishedItems = createSelector(
  selectFeature,
  (state: fromHospitalOrder.State) =>
    selectAllOrdered(state.virtualPublishedItems)
);

export const selectVirtualUnPublishedItems = createSelector(
  selectFeature,
  (state: fromHospitalOrder.State) =>
    selectAllOrdered(state.virtualUnPublishedItems)
);
