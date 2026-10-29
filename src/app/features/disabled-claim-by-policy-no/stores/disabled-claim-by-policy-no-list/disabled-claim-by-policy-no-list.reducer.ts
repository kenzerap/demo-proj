import { createReducer, on } from '@ngrx/store';
import * as DisabledClaimByPolicyNoActions from './disabled-claim-by-policy-no-list.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { DisabledClaimPolicy } from '../../models/disabled-claim-policy.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

export const featureKey = 'disabledClaimPolicies';

export interface State {
  disabledClaimPolicies: EntityState<DisabledClaimPolicy>;
  pagination: Pagination;
  filters: Partial<CommonListQueryParams>;
}

export const adapter: EntityAdapter<DisabledClaimPolicy> =
  createEntityAdapter<DisabledClaimPolicy>({
    selectId: (disabledClaimPolicy: DisabledClaimPolicy) =>
      disabledClaimPolicy.disabled_claim_policy_id,
  });

export const initialState: State = {
  disabledClaimPolicies: adapter.getInitialState(),
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
    DisabledClaimByPolicyNoActions.getDisabledClaimPoliciesSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        disabledClaimPolicies: adapter.setAll(
          pagedData.data,
          state.disabledClaimPolicies
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
    DisabledClaimByPolicyNoActions.setDisabledClaimPolicyFilters,
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
  on(DisabledClaimByPolicyNoActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
