import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Pagination } from '@app/shared/models/paged-data.model';
import { CheckupPackage } from '../../models/checkup-package.model';
import { CheckupPackageQueryParams } from '../../models/checkup-package-query-params.model';
import * as CheckupPackageActions from './checkup-package-list.actions';

export const featureKey = 'checkupPackgage' as const;
export interface State {
  checkupPackages: EntityState<CheckupPackage>;
  pagination: Pagination;
  filters: Partial<CheckupPackageQueryParams>;
}

export const adapter: EntityAdapter<CheckupPackage> =
  createEntityAdapter<CheckupPackage>({
    selectId: (data) => `${data.id}`,
  });
export const initialState: State = {
  checkupPackages: adapter.getInitialState(),
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
    CheckupPackageActions.getCheckupPackgageSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        checkupPackages: adapter.setAll(pagedData.data, state.checkupPackages),
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
  on(CheckupPackageActions.setCheckupPackgageFilters, (state, { filters }) => {
    return {
      ...state,
      filters: {
        page: filters.page !== undefined ? filters.page : state.filters.page,
        size: filters.size !== undefined ? filters.size : state.filters.size,
      },
    };
  }),
  on(CheckupPackageActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
