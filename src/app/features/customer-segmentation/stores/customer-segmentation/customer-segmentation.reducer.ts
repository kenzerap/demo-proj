import { createReducer, on } from '@ngrx/store';
import * as CustomerSegmentationActions from './customer-segmentation.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CustomerSegmentation } from '../../models/customer-segmentation.model';
import { CustomerSegmentationsQueryParams } from '../../models/customer-segmentations-query-params.model';
import { Pagination } from '@app/shared/models/paged-data.model';

export const featureKey = 'customerSegmentations';

export interface State {
  customerSegmentations: EntityState<CustomerSegmentation>;
  pagination: Pagination;
  filters: Partial<CustomerSegmentationsQueryParams>;
}

export const customerSegmentationsAdapter: EntityAdapter<CustomerSegmentation> =
  createEntityAdapter<CustomerSegmentation>({
    selectId: (customerSegmentation: CustomerSegmentation) =>
      customerSegmentation.id,
  });

export const initialState: State = {
  customerSegmentations: customerSegmentationsAdapter.getInitialState(),
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
  on(
    CustomerSegmentationActions.getCustomerSegmentationsSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        customerSegmentations: customerSegmentationsAdapter.setAll(
          pagedData.data,
          state.customerSegmentations
        ),
        pagination: {
          ...pagedData.pagination,
        },
      };
    }
  ),
  on(
    CustomerSegmentationActions.setCustomerSegmentationsFilter,
    (state, { filters }) => {
      return {
        ...state,
        filters: {
          page: filters.page !== undefined ? filters.page : state.filters.page,
          size: filters.size !== undefined ? filters.size : state.filters.size,
        },
      };
    }
  ),
  on(CustomerSegmentationActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
