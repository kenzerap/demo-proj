import { createAction, props } from '@ngrx/store';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { CreateEditCheckupPackageQueryParams } from '../../models/create-edit-checkup-package-query-params.model';
import { CheckupPackage } from '../../models/checkup-package.model';
import { CommonError } from '@app/shared/models/common-error.model';

const prefix = '[Create Edit Checkup Package]';

export const createCheckupPackage = createAction(
  `${prefix} Create Checkup Package | loadingKey=createEditCheckupPackage`,
  props<{
    queryParams: Partial<CreateEditCheckupPackageQueryParams>;
  }>()
);

export const createCheckupPackageSuccess = createAction(
  `${prefix} Create Checkup Package Success | loadingKey=createEditCheckupPackage`
);

export const createCheckupPackageFailure = createAction(
  `${prefix} Create Checkup Package Failure | loadingKey=createEditCheckupPackage`,
  props<{ messageData: ToastMessageData }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getCheckupPackageDetail = createAction(
  `${prefix} Get Checkup Package Detail | loadingKey=getCheckupPackageDetail`,
  props<{ checkupPackageId: number }>()
);

export const getCheckupPackageDetailSuccess = createAction(
  `${prefix} Get Checkup Package Detail Success | loadingKey=getCheckupPackageDetail`,
  props<{ checkupPackage: CheckupPackage }>()
);

export const getCheckupPackageDetailFailure = createAction(
  `${prefix} Get Checkup Package Detail Failure | loadingKey=getCheckupPackageDetail`,
  props<{ error: CommonError }>()
);

export const updateCheckupPackage = createAction(
  `${prefix} Update Checkup Package | loadingKey=createEditCheckupPackage`,
  props<{
    data: Partial<CreateEditCheckupPackageQueryParams>;
  }>()
);

export const updateCheckupPackageSuccess = createAction(
  `${prefix} Update Checkup Package Success | loadingKey=createEditCheckupPackage`
);

export const updateCheckupPackageFailure = createAction(
  `${prefix} Update Checkup Package Failure | loadingKey=createEditCheckupPackage`,
  props<{ messageData: ToastMessageData }>()
);

export const reset = createAction(
  `${prefix} Reset Create Edit Checkup Package`
);
