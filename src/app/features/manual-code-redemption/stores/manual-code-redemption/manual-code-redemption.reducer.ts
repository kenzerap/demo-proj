import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Pagination } from '@app/shared/models/paged-data.model';
import * as ManualCodeRedemptionActions from './manual-code-redemption.actions';
import { ManualCodeRedemption } from '../../models/manual-code-redemption.model';
import { ManualCodeRedemptionQueryParams } from '../../models/manual-code-redemption-query-params.model';
import { state } from '@angular/animations';

export const featureKey = 'manualCodeRedemption' as const;
export interface State {
  manualCodeRedemption: EntityState<ManualCodeRedemption>;
  pagination: Pagination;
  filters: Partial<ManualCodeRedemptionQueryParams>;
}

export const adapter: EntityAdapter<ManualCodeRedemption> =
  createEntityAdapter<ManualCodeRedemption>({
    selectId: (manualCodeRedemption) =>
      `${manualCodeRedemption.promo_code_unicode_quota_allocation_detail_id}`,
  });
export const initialState: State = {
  manualCodeRedemption: adapter.getInitialState(),
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
  filters: {
    search_text: '',
  },
};

export const reducer = createReducer(
  initialState,
  on(
    ManualCodeRedemptionActions.getManualCodeRedemptionSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        manualCodeRedemption: adapter.setAll(
          pagedData.data,
          state.manualCodeRedemption
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
    ManualCodeRedemptionActions.setManualCodeRedemptionFilters,
    (state, { filters }) => {
      return {
        ...state,
        filters: {
          page: filters.page !== undefined ? filters.page : state.filters.page,
          size: filters.size !== undefined ? filters.size : state.filters.size,
          search_text:
            filters.search_text !== undefined
              ? filters.search_text
              : state.filters.search_text,
        },
      };
    }
  ),
  on(ManualCodeRedemptionActions.resetManualCodeRedemptionFilters, (state) => ({
    ...state,
    filters: {},
    pagination: initialState.pagination,
    manualCodeRedemption: adapter.getInitialState(),
  })),
  on(ManualCodeRedemptionActions.resetAll, (state) => {
    return {
      ...state,
      manualCodeRedemption: adapter.getInitialState(),
      pagination: initialState.pagination,
      filters: initialState.filters,
    };
  })
);
