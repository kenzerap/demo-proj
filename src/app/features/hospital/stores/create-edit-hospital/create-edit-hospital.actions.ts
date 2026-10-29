import { createAction, props } from '@ngrx/store';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { CreateEditHospitalQueryParams } from '../../models/create-edit-hospital-query-params.model';
import { CommonError } from '@app/shared/models/common-error.model';
import { Province } from '../../models/province.model';
import { District } from '../../models/district.model';
import { HealthcarePackageQueryParams } from '../../models/healthcare-package-query-params.model';
import { PagedHealthcarePackage } from '../../models/healthcare-package.model';
import { Hospital } from '../../models/hospital.model';

const prefix = '[Create Edit Hospital]';

export const createHospital = createAction(
  `${prefix} Create Hospital | loadingKey=createEditHospital`,
  props<{
    queryParams: Partial<CreateEditHospitalQueryParams>;
  }>()
);

export const createHospitalSuccess = createAction(
  `${prefix} Create Hospital Success | loadingKey=createEditHospital`
);

export const createHospitalFailure = createAction(
  `${prefix} Create Hospital Failure | loadingKey=createEditHospital`,
  props<{ messageData: ToastMessageData }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getProvinces = createAction(
  `${prefix} Get provinces | loadingKey=getProvinces`
);

export const getProvincesSuccess = createAction(
  `${prefix} Get provinces Success | loadingKey=getProvinces`,
  props<{ provinces: Province[] }>()
);

export const getProvincesFailure = createAction(
  `${prefix} Get provinces Failure | loadingKey=getProvinces`,
  props<{ error: CommonError }>()
);

export const getDistricts = createAction(
  `${prefix} Get districts | loadingKey=getDistricts`,
  props<{ provinceId: number }>()
);

export const getDistrictsSuccess = createAction(
  `${prefix} Get districts Success | loadingKey=getDistricts`,
  props<{ districts: District[] }>()
);

export const getDistrictsFailure = createAction(
  `${prefix} Get districts Failure | loadingKey=getDistricts`,
  props<{ error: CommonError }>()
);

export const getHealthcarePackage = createAction(
  `${prefix} Get Healthcare Package  | loadingKey=getHealthcarePackage`,
  props<{ params: Partial<HealthcarePackageQueryParams> }>()
);

export const getHealthcarePackageSuccess = createAction(
  `${prefix} Get Healthcare Package Success | loadingKey=getHealthcarePackage`,
  props<{ pagedData: PagedHealthcarePackage }>()
);

export const getHealthcarePackageFailure = createAction(
  `${prefix} Get Healthcare Package Failure | loadingKey=getHealthcarePackage`,
  props<{ error: CommonError }>()
);

export const getHospitalDetail = createAction(
  `${prefix} Get Hospital Detail | loadingKey=getHospitalDetail`,
  props<{ hospitalId: number }>()
);

export const getHospitalDetailSuccess = createAction(
  `${prefix} Get Hospital Detail Success | loadingKey=getHospitalDetail`,
  props<{ hospital: Hospital }>()
);

export const getHospitalDetailFailure = createAction(
  `${prefix} Get Hospital Detail Failure | loadingKey=getHospitalDetail`,
  props<{ error: CommonError }>()
);

export const updateHospital = createAction(
  `${prefix} Update Hospital | loadingKey=createEditHospital`,
  props<{
    data: Partial<CreateEditHospitalQueryParams>;
  }>()
);

export const updateHospitalSuccess = createAction(
  `${prefix} Update Hospital Success | loadingKey=createEditHospital`
);

export const updateHospitalFailure = createAction(
  `${prefix} Update Hospital Failure | loadingKey=createEditHospital`,
  props<{ messageData: ToastMessageData }>()
);

export const reset = createAction(`${prefix} Reset Create Edit Hospital`);
