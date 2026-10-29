import { createAction, props } from '@ngrx/store';

import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import {
  CheckupPackage,
  PagedCheckupPackage,
} from '../../models/checkup-package.model';

const prefix = '[Checkup Package Order]';

export const setIsEditOrderMode = createAction(
  `${prefix} Set Is Edit Order Mode`,
  props<{ isEditOrder: boolean }>()
);

export const setOrderDirty = createAction(
  `${prefix} Set Order Dirty`,
  props<{ isDirty: boolean }>()
);

export const updatePublishedStatus = createAction(
  `${prefix} update Published Status`,
  props<{ id: number; is_published: boolean }>()
);

export const updateCheckupPackagesOrder = createAction(
  `${prefix} update Checkup Packages Order`,
  props<{ newList: CheckupPackage[] }>()
);

export const getMissingCheckupPackages = createAction(
  `${prefix} Get Missing Checkup Packages | loadingKey=getMissingCheckupPackages`,
  props<{ pagedData: PagedCheckupPackage }>()
);

export const getMissingCheckupPackagesSuccess = createAction(
  `${prefix} Get Missing Checkup Packages Success | loadingKey=getMissingCheckupPackages`,
  props<{
    data: CheckupPackage[];
    virtualPublishedItems?: CheckupPackage[];
  }>()
);

export const getMissingCheckupPackagesFailure = createAction(
  `${prefix} Get Missing Checkup Packages Failure | loadingKey=getMissingCheckupPackages`,
  props<{ error: CommonError }>()
);

export const reOrderCheckupPackages = createAction(
  `${prefix} reorder Checkup Packages | loadingKey=reOrderCheckupPackages`
);

export const reOrderCheckupPackagesSuccess = createAction(
  `${prefix} reOrder Checkup Packages Success | loadingKey=reOrderCheckupPackages`
);

export const reOrderCheckupPackagesFailure = createAction(
  `${prefix} reOrder Checkup Packages Failure | loadingKey=reOrderCheckupPackages`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(`${prefix} Reset Checkup Package Order`);
