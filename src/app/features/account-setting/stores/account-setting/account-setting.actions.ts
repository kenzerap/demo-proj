import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { GetUsersQueryParams } from '../../models/get-users-query-params.model';
import { UserAccount } from '../../models/user-account.model';
import { CreateUserQueryParams } from '../../models/create-user-query-params.model';
import { UserGroup } from '../../models/user-group.model';

const prefix = '[accountSettings]';

export const getAccountSettings = createAction(
  `${prefix} Get Account Settings | loadingKey=getAccountSettings`,
  props<{ queryParams: Partial<GetUsersQueryParams> }>()
);

export const getAccountSettingsSuccess = createAction(
  `${prefix} Get Account Settings Success | loadingKey=getAccountSettings`,
  props<{ pagedData: PagedData<UserAccount> }>()
);

export const getAccountSettingsFailure = createAction(
  `${prefix} Get Account Settings Failure | loadingKey=getAccountSettings`,
  props<{ error: CommonError }>()
);

export const setAccountSettingFilters = createAction(
  `${prefix} Set Account Setting Filters`,
  props<{ filters: Partial<GetUsersQueryParams> }>()
);

export const getGroups = createAction(
  `${prefix} Get Groups | loadingKey=getGroups`
);

export const getGroupsSuccess = createAction(
  `${prefix} Get Groups Success | loadingKey=getGroups`,
  props<{ data: UserGroup[] }>()
);

export const getGroupsFailure = createAction(
  `${prefix} Get Groups Failure | loadingKey=getGroups`,
  props<{ error: CommonError }>()
);

export const createUserAccount = createAction(
  `${prefix} Create User Account | loadingKey=createUserAccount`,
  props<{ queryParams: Partial<CreateUserQueryParams> }>()
);

export const createUserAccountSuccess = createAction(
  `${prefix} Create User Account Success | loadingKey=createUserAccount`
);

export const createUserAccountFailure = createAction(
  `${prefix} Create User Account Failure | loadingKey=createUserAccount`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
