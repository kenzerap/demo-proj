import { createAction, props } from '@ngrx/store';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { HomeScreenManagementQueryParams } from '../../models/home-screen-management-query-params.model';
import { PagedHomeScreen } from '../../models/home-screen-management.model';

const prefix = '[Home Screen Management]';

export const getHomeScreenManagement = createAction(
  `${prefix} Get Home Screen Management  | loadingKey=getHomeScreenManagement`,
  props<{ params: Partial<HomeScreenManagementQueryParams> }>()
);

export const getHomeScreenManagementSuccess = createAction(
  `${prefix} Get Home Screen Management Success | loadingKey=getHomeScreenManagement`,
  props<{ pagedData: PagedHomeScreen; canEditOrder: boolean }>()
);

export const getHomeScreenManagementFailure = createAction(
  `${prefix} Get Home Screen Management Failure | loadingKey=getHomeScreenManagement`,
  props<{ error: CommonError }>()
);

export const setHomeScreenManagementFilters = createAction(
  `${prefix} Set Home Screen Management Filter`,
  props<{ filters: Partial<HomeScreenManagementQueryParams> }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
