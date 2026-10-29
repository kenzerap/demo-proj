import { createAction, props } from '@ngrx/store';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { CheckupPackageQueryParams } from '../../models/checkup-package-query-params.model';

import { PagedCheckupPackage } from '../../models/checkup-package.model';

const prefix = '[Checkup Package]';

export const getCheckupPackgage = createAction(
  `${prefix} Get Checkup Packgage  | loadingKey=getCheckupPackgage`,
  props<{ params: Partial<CheckupPackageQueryParams> }>()
);

export const getCheckupPackgageSuccess = createAction(
  `${prefix} Get Checkup Packgage Success | loadingKey=getCheckupPackgage`,
  props<{ pagedData: PagedCheckupPackage; canEditOrder: boolean }>()
);

export const getCheckupPackgageFailure = createAction(
  `${prefix} Get Checkup Packgage Failure | loadingKey=getCheckupPackgage`,
  props<{ error: CommonError }>()
);

export const setCheckupPackgageFilters = createAction(
  `${prefix} Set Checkup Packgage Filter`,
  props<{ filters: Partial<CheckupPackageQueryParams> }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
