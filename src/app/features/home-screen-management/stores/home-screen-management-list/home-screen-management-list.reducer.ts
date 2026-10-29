import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Pagination } from '@app/shared/models/paged-data.model';
import * as HomeScreenManagementActions from './home-screen-management-list.actions';
import { HomeScreenManagement } from '../../models/home-screen-management.model';
import { HomeScreenManagementQueryParams } from '../../models/home-screen-management-query-params.model';

export const featureKey = 'homeScreenManagement' as const;
export interface State {
  homeScreenManagements: EntityState<HomeScreenManagement>;
  pagination: Pagination;
  filters: Partial<HomeScreenManagementQueryParams>;
}

export const adapter: EntityAdapter<HomeScreenManagement> =
  createEntityAdapter<HomeScreenManagement>({
    selectId: (data) => `${data.id}`,
  });
export const initialState: State = {
  homeScreenManagements: adapter.getInitialState(),
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
};

export const reducer = createReducer(
  initialState,
  on(
    HomeScreenManagementActions.getHomeScreenManagementSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        homeScreenManagements: adapter.setAll(
          pagedData.data,
          state.homeScreenManagements
        ),
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
  on(
    HomeScreenManagementActions.setHomeScreenManagementFilters,
    (state, { filters }) => {
      return {
        ...state,
        filters: {
          page: filters.page !== undefined ? filters.page : state.filters.page,
          size: filters.size !== undefined ? filters.size : state.filters.size,
        },
      };
    }
  ),
  on(HomeScreenManagementActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
