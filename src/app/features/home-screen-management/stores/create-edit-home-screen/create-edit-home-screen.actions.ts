import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { CreateEditHomeScreenQueryParams } from '../../models/create-edit-home-screen-query-params.model';
import { HomeScreenManagementDetail } from '../../models/home-screen-management.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { TierGroup } from '@app/shared/models/tier-group.model';

const prefix = '[Create Edit Home Screen]';

export const createHomeScreen = createAction(
  `${prefix} Create Home Screen | loadingKey=createEditHomeScreen`,
  props<{
    queryParams: Partial<CreateEditHomeScreenQueryParams>;
    files: File[];
  }>()
);

export const createHomeScreenSuccess = createAction(
  `${prefix} Create Home Screen Success | loadingKey=createEditHomeScreen`
);

export const createHomeScreenFailure = createAction(
  `${prefix} Create Home Screen Failure | loadingKey=createEditHomeScreen`,
  props<{ messageData: ToastMessageData }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getHomeScreenDetail = createAction(
  `${prefix} Get Home Screen Detail | loadingKey=getHomeScreenDetail`,
  props<{ homeScreenId: number }>()
);

export const getHomeScreenDetailSuccess = createAction(
  `${prefix} Get Home Screen Detail Success | loadingKey=getHomeScreenDetail`,
  props<{ homeScreen: HomeScreenManagementDetail }>()
);

export const getHomeScreenDetailFailure = createAction(
  `${prefix} Get Home Screen Detail Failure | loadingKey=getHomeScreenDetail`,
  props<{ error: CommonError }>()
);

export const updateHomeScreen = createAction(
  `${prefix} Update Home Screen | loadingKey=createEditHomeScreen`,
  props<{
    data: Partial<CreateEditHomeScreenQueryParams>;
    files: File[];
  }>()
);

export const updateHomeScreenSuccess = createAction(
  `${prefix} Update Home Screen Success | loadingKey=createEditHomeScreen`
);

export const updateHomeScreenFailure = createAction(
  `${prefix} Update Home Screen Failure | loadingKey=createEditHomeScreen`,
  props<{ messageData: ToastMessageData }>()
);

export const getTierGroups = createAction(
  `${prefix} Get Tier Groups | loadingKey=getTierGroups`,
  props<{ page: number; size: number }>()
);

export const getTierGroupsSuccess = createAction(
  `${prefix} Get Tier Groups Success | loadingKey=getTierGroups`,
  props<{ data: PagedData<TierGroup> }>()
);

export const getTierGroupsFailure = createAction(
  `${prefix} Get Tier Groups Failure | loadingKey=getTierGroups`,
  props<{ error: CommonError }>()
);

export const reset = createAction(`${prefix} Reset Create Edit Home Screen`);
