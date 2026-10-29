import { createReducer, on } from '@ngrx/store';
import * as CreateEditHospitalActions from './create-edit-hospital.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Province } from '../../models/province.model';
import { District } from '../../models/district.model';
import { HealthcarePackage } from '../../models/healthcare-package.model';
import { Hospital } from '../../models/hospital.model';

export const featureKey = 'createEditHospital';

export interface State {
  isFormDirty: boolean;
  provinces: EntityState<Province>;
  districts: EntityState<District>;
  healthcarePackages: EntityState<HealthcarePackage>;
  hospitalDetail: Hospital | null;
}

export const provincesAdapter: EntityAdapter<Province> =
  createEntityAdapter<Province>({
    selectId: (province: Province) => province.province_id,
  });

export const districtsAdapter: EntityAdapter<District> =
  createEntityAdapter<District>({
    selectId: (district: District) => district.amphur_id,
  });

export const healthcarePackagesAdapter: EntityAdapter<HealthcarePackage> =
  createEntityAdapter<HealthcarePackage>({
    selectId: (data) => `${data.id}`,
  });

export const initialState: State = {
  isFormDirty: false,
  provinces: provincesAdapter.getInitialState(),
  districts: districtsAdapter.getInitialState(),
  healthcarePackages: healthcarePackagesAdapter.getInitialState(),
  hospitalDetail: null,
};

export const reducer = createReducer(
  initialState,
  on(CreateEditHospitalActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(CreateEditHospitalActions.getProvincesSuccess, (state, { provinces }) => ({
    ...state,
    provinces: provincesAdapter.setAll(provinces, state.provinces),
  })),
  on(CreateEditHospitalActions.getDistrictsSuccess, (state, { districts }) => ({
    ...state,
    districts: districtsAdapter.setAll(districts, state.districts),
  })),
  on(
    CreateEditHospitalActions.getHealthcarePackageSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        healthcarePackages: healthcarePackagesAdapter.setAll(
          pagedData.data,
          state.healthcarePackages
        ),
      };
    }
  ),
  on(
    CreateEditHospitalActions.getHospitalDetailSuccess,
    (state, { hospital }) => ({
      ...state,
      hospitalDetail: hospital,
    })
  ),
  on(CreateEditHospitalActions.reset, () => {
    return { ...initialState };
  })
);
