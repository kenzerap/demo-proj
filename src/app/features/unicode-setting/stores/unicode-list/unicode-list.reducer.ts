import { createReducer, on } from '@ngrx/store';
import * as UnicodesActions from './unicode-list.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Unicode } from '../../models/unicode-model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

export const featureKey = 'unicodes';

export interface State {
  unicodes: EntityState<Unicode>;
  pagination: Pagination;
  filters: Partial<CommonListQueryParams>;
}

export const adapter: EntityAdapter<Unicode> = createEntityAdapter<Unicode>({
  selectId: (unicode: Unicode) => unicode.unicode_id,
});

export const initialState: State = {
  unicodes: adapter.getInitialState(),
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
  on(UnicodesActions.getUnicodesSuccess, (state, { pagedData }) => {
    return {
      ...state,
      unicodes: adapter.setAll(pagedData.data, state.unicodes),
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
  on(UnicodesActions.setUnicodeFilters, (state, { filters }) => {
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
  on(UnicodesActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
