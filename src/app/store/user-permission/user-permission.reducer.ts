import { createReducer, on } from '@ngrx/store';
import * as UserPermissionsActions from './user-permission.actions';
import { UserPermission } from '@app/shared/models/user-permission.model';
import { CommonError } from '@app/shared/models/common-error.model';

export const featureKey = 'userPermissions';

export interface State {
  userPermissions: UserPermission | null | CommonError;
}

export const initialState: State = {
  userPermissions: null,
};

export const reducer = createReducer(
  initialState,
  on(
    UserPermissionsActions.getUserPermissionsSuccess,
    UserPermissionsActions.getUserPermissionsFailure,
    (state, { data }) => {
      return {
        ...state,
        userPermissions: data,
      };
    }
  ),
  on(UserPermissionsActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
