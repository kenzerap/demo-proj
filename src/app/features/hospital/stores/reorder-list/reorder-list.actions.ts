import { createAction, props } from '@ngrx/store';

import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { Hospital, PagedHospital } from '../../models/hospital.model';

const prefix = '[Hospital Order]';

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

export const updateHospitalsOrder = createAction(
  `${prefix} update Hospitals Order`,
  props<{ newList: Hospital[] }>()
);

export const getMissingHospitals = createAction(
  `${prefix} Get Missing Hospitals | loadingKey=getMissingHospitals`,
  props<{ pagedData: PagedHospital }>()
);

export const getMissingHospitalsSuccess = createAction(
  `${prefix} Get Missing Hospitals Success | loadingKey=getMissingHospitals`,
  props<{
    data: Hospital[];
    virtualPublishedItems?: Hospital[];
  }>()
);

export const getMissingHospitalsFailure = createAction(
  `${prefix} Get Missing Hospitals Failure | loadingKey=getMissingHospitals`,
  props<{ error: CommonError }>()
);

export const reOrderHospitals = createAction(
  `${prefix} reorder Hospitals | loadingKey=reOrderHospitals`
);

export const reOrderHospitalsSuccess = createAction(
  `${prefix} reOrder Hospitals Success | loadingKey=reOrderHospitals`
);

export const reOrderHospitalsFailure = createAction(
  `${prefix} reOrder Hospitals Failure | loadingKey=reOrderHospitals`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(`${prefix} Reset Hospital Order`);
