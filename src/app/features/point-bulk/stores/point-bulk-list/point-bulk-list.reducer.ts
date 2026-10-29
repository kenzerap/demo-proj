import { createReducer, on } from '@ngrx/store';
import * as PointBulksActions from './point-bulk-list.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PointBulk } from '../../models/point-bulk.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

export const featureKey = 'pointBulks';

export interface State {
  pointBulks: EntityState<PointBulk>;
  pagination: Pagination;
  filters: Partial<CommonListQueryParams>;
}

export const adapter: EntityAdapter<PointBulk> = createEntityAdapter<PointBulk>(
  {
    selectId: (pointBulk: PointBulk) => pointBulk.upload_id,
  }
);

export const initialState: State = {
  pointBulks: adapter.getInitialState(),
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
  on(PointBulksActions.getPointBulksSuccess, (state, { pagedData }) => {
    return {
      ...state,
      pointBulks: adapter.setAll(pagedData.data, state.pointBulks),
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
  on(PointBulksActions.setPointBulkFilters, (state, { filters }) => {
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
  on(PointBulksActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
