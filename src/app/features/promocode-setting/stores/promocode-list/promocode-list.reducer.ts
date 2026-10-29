import { createReducer, on } from '@ngrx/store';
import * as PromoCodesActions from './promocode-list.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PromoCode } from '../../models/promocode-model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

export const featureKey = 'promoCodes';

export interface State {
  promoCodes: EntityState<PromoCode>;
  pagination: Pagination;
  filters: Partial<CommonListQueryParams>;
}

export const adapter: EntityAdapter<PromoCode> = createEntityAdapter<PromoCode>(
  {
    selectId: (promoCode: PromoCode) => promoCode.promocode_id,
  }
);

export const initialState: State = {
  promoCodes: adapter.getInitialState(),
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
  on(PromoCodesActions.getPromoCodesSuccess, (state, { pagedData }) => {
    return {
      ...state,
      promoCodes: adapter.setAll(pagedData.data, state.promoCodes),
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
  on(PromoCodesActions.setPromoCodeFilters, (state, { filters }) => {
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
  on(PromoCodesActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
