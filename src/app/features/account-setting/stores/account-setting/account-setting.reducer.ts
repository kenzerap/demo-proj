import { createReducer, on } from '@ngrx/store';
import * as AccountSettingsActions from './account-setting.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { GetUsersQueryParams } from '../../models/get-users-query-params.model';
import { UserAccount } from '../../models/user-account.model';
import { UserGroup } from '../../models/user-group.model';

export const featureKey = 'accountSettings';

export interface State {
  accountSettings: EntityState<UserAccount>;
  pagination: Pagination;
  filters: Partial<GetUsersQueryParams>;
  userGroups: EntityState<UserGroup>;
}

export const adapter: EntityAdapter<UserAccount> =
  createEntityAdapter<UserAccount>({
    selectId: (userAccount: UserAccount) => userAccount.demoproj_user_id,
  });

export const userGroupAdapter: EntityAdapter<UserGroup> =
  createEntityAdapter<UserGroup>({
    selectId: (userGroup: UserGroup) => userGroup.groupId,
  });

export const initialState: State = {
  accountSettings: adapter.getInitialState(),
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
  filters: {
    page: 0,
    size: 20,
  },
  userGroups: userGroupAdapter.getInitialState(),
};

export const reducer = createReducer(
  initialState,
  on(
    AccountSettingsActions.getAccountSettingsSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        accountSettings: adapter.setAll(pagedData.data, state.accountSettings),
        pagination: {
          ...pagedData.pagination,
        },
        filters: {
          ...state.filters,
          page: pagedData.pagination.page,
          size: pagedData.pagination.size,
        },
      };
    }
  ),
  on(AccountSettingsActions.setAccountSettingFilters, (state, { filters }) => {
    return {
      ...state,
      filters: {
        page: filters.page !== undefined ? filters.page : state.filters.page,
        size: filters.size !== undefined ? filters.size : state.filters.size,
      },
    };
  }),
  on(AccountSettingsActions.getGroupsSuccess, (state, { data }) => {
    return {
      ...state,
      userGroups: userGroupAdapter.setAll(data, state.userGroups),
    };
  }),
  on(AccountSettingsActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
