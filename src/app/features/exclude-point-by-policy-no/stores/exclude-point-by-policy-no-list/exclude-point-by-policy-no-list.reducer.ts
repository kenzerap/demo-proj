import { createReducer, on } from '@ngrx/store';
import * as ExcludePointByPolicyNoActions from './exclude-point-by-policy-no-list.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ExcludePointPolicy } from '../../models/exclude-point-policy.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

export const featureKey = 'excludePointPolicies';

export interface State {
  excludePointPolicies: EntityState<ExcludePointPolicy>;
  pagination: Pagination;
  filters: Partial<CommonListQueryParams>;
}

export const adapter: EntityAdapter<ExcludePointPolicy> =
  createEntityAdapter<ExcludePointPolicy>({
    selectId: (excludePointPolicy: ExcludePointPolicy) =>
      excludePointPolicy.excluded_policy_id,
  });

export const initialState: State = {
  excludePointPolicies: adapter.getInitialState(),
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
  filters: {
    page: 0,
    size: 20,
    keyword: '',
  },
};

export const reducer = createReducer(
  initialState,
  on(
    ExcludePointByPolicyNoActions.getExcludePointPoliciesSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        excludePointPolicies: adapter.setAll(
          pagedData.data,
          state.excludePointPolicies
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
    ExcludePointByPolicyNoActions.setExcludePointPolicyFilters,
    (state, { filters }) => {
      return {
        ...state,
        filters: {
          page: filters.page !== undefined ? filters.page : state.filters.page,
          size: filters.size !== undefined ? filters.size : state.filters.size,
          keyword:
            filters.keyword !== undefined
              ? filters.keyword
              : state.filters.keyword,
        },
      };
    }
  ),
  on(ExcludePointByPolicyNoActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
