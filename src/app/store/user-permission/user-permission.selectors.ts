import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUserPermissions from './user-permission.reducer';
import { UserPermission } from '@app/shared/models/user-permission.model';

export const selectFeature = createFeatureSelector<fromUserPermissions.State>(
  fromUserPermissions.featureKey
);

export const selectUserPermissions = createSelector(
  selectFeature,
  (state: fromUserPermissions.State) => state.userPermissions
);

export const selectPermissions = createSelector(
  selectUserPermissions,
  (userPermissions) => {
    if ((userPermissions as UserPermission).data?.permissions) {
      return (userPermissions as UserPermission).data.permissions;
    }
    return {};
  }
);
