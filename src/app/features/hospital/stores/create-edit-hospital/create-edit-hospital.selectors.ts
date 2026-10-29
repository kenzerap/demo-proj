import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreateHospital from './create-edit-hospital.reducer';

export const selectFeature = createFeatureSelector<fromCreateHospital.State>(
  fromCreateHospital.featureKey
);

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreateHospital.State) => state.isFormDirty
);

const { selectAll } = fromCreateHospital.provincesAdapter.getSelectors();

export const selectProvinces = createSelector(
  selectFeature,
  (state: fromCreateHospital.State) => selectAll(state.provinces)
);

const { selectAll: selectAllDistricts } =
  fromCreateHospital.districtsAdapter.getSelectors();

export const selectDistricts = createSelector(
  selectFeature,
  (state: fromCreateHospital.State) => selectAllDistricts(state.districts)
);

const { selectAll: selectAllHealthcarePackages } =
  fromCreateHospital.healthcarePackagesAdapter.getSelectors();

export const selectHealthcarePackages = createSelector(
  selectFeature,
  (state: fromCreateHospital.State) =>
    selectAllHealthcarePackages(state.healthcarePackages)
);

export const selectHospitalDetail = createSelector(
  selectFeature,
  (state: fromCreateHospital.State) => state.hospitalDetail
);
