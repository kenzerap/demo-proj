import { createReducer, on } from '@ngrx/store';
import * as FundTypesActions from './fund-type-list.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { FundType } from '../../models/fund-type.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

export const featureKey = 'fundTypes';

export interface State {
  fundTypes: EntityState<FundType>;
  pagination: Pagination;
  filters: Partial<CommonListQueryParams>;
}

export const adapter: EntityAdapter<FundType> = createEntityAdapter<FundType>({
  selectId: (fundType: FundType) => fundType.fund_id,
});

export const initialState: State = {
  fundTypes: adapter.getInitialState(),
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
  on(FundTypesActions.getFundTypesSuccess, (state, { pagedData }) => {
    return {
      ...state,
      fundTypes: adapter.setAll(pagedData.data, state.fundTypes),
      pagination: {
        ...pagedData.pagination,
      },
      filters: {
        ...state.filters,
        page: pagedData.pagination.page,
        size: pagedData.pagination.size,
      },
    };
  }),
  on(FundTypesActions.setFundTypeFilters, (state, { filters }) => {
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
  }),
  on(FundTypesActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
