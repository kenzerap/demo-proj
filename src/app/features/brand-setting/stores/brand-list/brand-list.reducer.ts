import { createReducer, on } from '@ngrx/store';
import * as BrandsActions from './brand-list.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Brand } from '../../../../shared/models/brand-model';
import { BrandsQueryParams } from '../../../../shared/models/brands-query-params.model';

export const featureKey = 'brands';

export interface State {
  brands: EntityState<Brand>;
  pagination: Pagination;
  filters: Partial<BrandsQueryParams>;
}

export const adapter: EntityAdapter<Brand> = createEntityAdapter<Brand>({
  selectId: (brand: Brand) => brand.brand_id,
});

export const initialState: State = {
  brands: adapter.getInitialState(),
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
  on(BrandsActions.getBrandsSuccess, (state, { pagedData }) => {
    return {
      ...state,
      brands: adapter.setAll(pagedData.data, state.brands),
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
  on(BrandsActions.setBrandFilters, (state, { filters }) => {
    return {
      ...state,
      filters: {
        page: filters.page !== undefined ? filters.page : state.filters.page,
        size: filters.size !== undefined ? filters.size : state.filters.size,
      },
    };
  }),
  on(BrandsActions.updateStatusBrandFailure, (state, { id }) => {
    return {
      ...state,
      brands: adapter.updateOne(
        {
          id,
          changes: {
            is_active: state.brands.entities[id]?.is_active,
          },
        },
        state.brands
      ),
    };
  }),
  on(BrandsActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
