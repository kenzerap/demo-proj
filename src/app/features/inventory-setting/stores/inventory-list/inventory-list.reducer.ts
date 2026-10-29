import { createReducer, on } from '@ngrx/store';
import * as InventoriesActions from './inventory-list.actions';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Inventory } from '../../../../shared/models/inventory-model';
import { InventoriesQueryParams } from '../../../../shared/models/inventories-query-params.model';
import { InventoryType } from '../../../../shared/utils/enums/inventory-type.enum';

export const featureKey = 'inventories';

export interface State {
  inventories: EntityState<Inventory>;
  pagination: Pagination;
  filters: Partial<InventoriesQueryParams>;
}

export const adapter: EntityAdapter<Inventory> = createEntityAdapter<Inventory>(
  {
    selectId: (inventory: Inventory) => inventory.inventory_id,
  }
);

export const initialState: State = {
  inventories: adapter.getInitialState(),
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
  filters: {
    page: 0,
    size: 20,
    inventory_type: InventoryType.UPLOAD_CODE,
  },
};

export const reducer = createReducer(
  initialState,
  on(InventoriesActions.getInventoriesSuccess, (state, { pagedData }) => {
    return {
      ...state,
      inventories: adapter.setAll(pagedData.data, state.inventories),
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
  on(InventoriesActions.setInventoryFilters, (state, { filters }) => {
    return {
      ...state,
      filters: {
        page: filters.page !== undefined ? filters.page : state.filters.page,
        size: filters.size !== undefined ? filters.size : state.filters.size,
        inventory_type:
          filters.inventory_type !== undefined
            ? filters.inventory_type
            : state.filters.inventory_type,
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
  on(InventoriesActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
