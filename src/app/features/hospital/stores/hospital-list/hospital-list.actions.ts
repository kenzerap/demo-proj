import { createAction, props } from '@ngrx/store';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { HospitalQueryParams } from '../../models/hospital-query-params.model';
import { PagedHospital } from '../../models/hospital.model';

const prefix = '[Hospital]';

export const getHospital = createAction(
  `${prefix} Get Hospital  | loadingKey=getHospital`,
  props<{ params: Partial<HospitalQueryParams> }>()
);

export const getHospitalSuccess = createAction(
  `${prefix} Get Hospital Success | loadingKey=getHospital`,
  props<{ pagedData: PagedHospital; canEditOrder: boolean }>()
);

export const getHospitalFailure = createAction(
  `${prefix} Get Hospital Failure | loadingKey=getHospital`,
  props<{ error: CommonError }>()
);

export const setHospitalFilters = createAction(
  `${prefix} Set Hospital Filter`,
  props<{ filters: Partial<HospitalQueryParams> }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
