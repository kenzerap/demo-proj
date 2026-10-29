import { createReducer, on } from '@ngrx/store';
import * as PointRulesActions from './point-rule-list.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PointRule } from '../../models/point-rule-model';
import { v4 as uuidv4 } from 'uuid';
import { PointRuleListQueryParams } from '../../models/point-rule-list-query-params.model';
import { CategoryCode } from '../../constants/category-options.const';

export const featureKey = 'pointRules';

export interface State {
  pointRules: EntityState<PointRule>;
  pagination: Pagination;
  filters: Partial<PointRuleListQueryParams>;
}

export const adapter: EntityAdapter<PointRule> = createEntityAdapter<PointRule>(
  { selectId: () => uuidv4() }
);

export const initialState: State = {
  pointRules: adapter.getInitialState(),
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
    category: CategoryCode.WelcomeRule,
  },
};

export const reducer = createReducer(
  initialState,
  on(PointRulesActions.getPointRulesSuccess, (state, { pagedData }) => {
    return {
      ...state,
      pointRules: adapter.setAll(pagedData.data, state.pointRules),
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
  on(PointRulesActions.setPointRuleFilters, (state, { filters }) => {
    return {
      ...state,
      filters: {
        page: filters.page !== undefined ? filters.page : state.filters.page,
        size: filters.size !== undefined ? filters.size : state.filters.size,
        keyword:
          filters.keyword !== undefined
            ? filters.keyword
            : state.filters.keyword,
        category:
          filters.category !== undefined
            ? filters.category
            : state.filters.category,
      },
    };
  }),
  on(PointRulesActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
