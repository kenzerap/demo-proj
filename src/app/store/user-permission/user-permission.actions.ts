import { createAction, props } from '@ngrx/store';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { UserPermission } from '@app/shared/models/user-permission.model';

const prefix = '[userPermissions]';

export const getUserPermissions = createAction(
  `${prefix} Get User Permissions | loadingKey=getUserPermissions`
);

export const getUserPermissionsSuccess = createAction(
  `${prefix} Get User Permissions Success | loadingKey=getUserPermissions`,
  props<{ data: UserPermission }>()
);

export const getUserPermissionsFailure = createAction(
  `${prefix} Get User Permissions Failure | loadingKey=getUserPermissions`,
  props<{ data: CommonError }>()
);

export const getUserPermissionsAPIFailure = createAction(
  `${prefix} Get User Permissions API Failure | loadingKey=getUserPermissions`,
  props<{ error: CommonError }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
