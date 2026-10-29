import { createAction, props } from '@ngrx/store';
import {
  HomeScreenManagement,
  PagedHomeScreen,
} from '../../models/home-screen-management.model';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

const prefix = '[Home Screen Management Order]';

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

export const updateHomeScreenManagementsOrder = createAction(
  `${prefix} update Home Screen Managements Order`,
  props<{ newList: HomeScreenManagement[] }>()
);

export const getMissingHomeScreenManagements = createAction(
  `${prefix} Get Missing Home Screen Managements | loadingKey=getMissingHomeScreenManagements`,
  props<{ pagedData: PagedHomeScreen }>()
);

export const getMissingHomeScreenManagementsSuccess = createAction(
  `${prefix} Get Missing Home Screen Managements Success | loadingKey=getMissingHomeScreenManagements`,
  props<{
    data: HomeScreenManagement[];
    virtualPublishedItems?: HomeScreenManagement[];
  }>()
);

export const getMissingHomeScreenManagementsFailure = createAction(
  `${prefix} Get Missing Home Screen Managements Failure | loadingKey=getMissingHomeScreenManagements`,
  props<{ error: CommonError }>()
);

export const reOrderHomeScreenManagements = createAction(
  `${prefix} reorder Home Screen Managements | loadingKey=reOrderHomeScreenManagements`
);

export const reOrderHomeScreenManagementsSuccess = createAction(
  `${prefix} reOrder Home Screen Managements Success | loadingKey=reOrderHomeScreenManagements`
);

export const reOrderHomeScreenManagementsFailure = createAction(
  `${prefix} reOrder Home Screen Managements Failure | loadingKey=reOrderHomeScreenManagements`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(
  `${prefix} Reset Home Screen Management Order`
);
