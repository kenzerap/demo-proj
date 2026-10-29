import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Pagination } from '@app/shared/models/paged-data.model';
import * as HospitalActions from './hospital-list.actions';
import { Hospital } from '../../models/hospital.model';
import { HospitalQueryParams } from '../../models/hospital-query-params.model';

export const featureKey = 'hospital' as const;
export interface State {
  hospitals: EntityState<Hospital>;
  pagination: Pagination;
  filters: Partial<HospitalQueryParams>;
}

export const adapter: EntityAdapter<Hospital> = createEntityAdapter<Hospital>({
  selectId: (data) => `${data.hospital_id}`,
});
export const initialState: State = {
  hospitals: adapter.getInitialState(),
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
  on(HospitalActions.getHospitalSuccess, (state, { pagedData }) => {
    return {
      ...state,
      hospitals: adapter.setAll(pagedData.data, state.hospitals),
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
  on(HospitalActions.setHospitalFilters, (state, { filters }) => {
    return {
      ...state,
      filters: {
        page: filters.page !== undefined ? filters.page : state.filters.page,
        size: filters.size !== undefined ? filters.size : state.filters.size,
        keyword:
          filters.keyword !== undefined
            ? filters.keyword
            : state.filters.keyword,
        sort_by:
          filters.sort_by !== undefined
            ? filters.sort_by
            : state.filters.sort_by,
        sort_direction:
          filters.sort_direction !== undefined
            ? filters.sort_direction
            : state.filters.sort_direction,
      },
    };
  }),
  on(HospitalActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
