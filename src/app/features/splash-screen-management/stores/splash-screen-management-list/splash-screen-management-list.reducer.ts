import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Pagination } from '@app/shared/models/paged-data.model';
import * as SplashScreenManagementActions from './splash-screen-management-list.actions';
import { SplashScreenManagement } from '../../models/splash-screen-management.model';
import { SplashScreenManagementQueryParams } from '../../models/splash-screen-management-query-params.model';

export const featureKey = 'splashScreenManagements';

export interface State {
  splashScreenManagements: EntityState<SplashScreenManagement>;
  pagination: Pagination;
  filters: Partial<SplashScreenManagementQueryParams>;
}

export const adapter: EntityAdapter<SplashScreenManagement> =
  createEntityAdapter<SplashScreenManagement>({
    selectId: (splashScreenManagement: SplashScreenManagement) =>
      splashScreenManagement.splash_screen_id,
  });

export const initialState: State = {
  splashScreenManagements: adapter.getInitialState(),
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
    SplashScreenManagementActions.getSplashScreenManagementsSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        splashScreenManagements: adapter.setAll(
          pagedData.data,
          state.splashScreenManagements
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
    SplashScreenManagementActions.setSplashScreenManagementFilters,
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
  on(SplashScreenManagementActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
