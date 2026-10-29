import { createReducer, on } from '@ngrx/store';
import * as RedeemHistoryActions from './redeem-history.actions';
import { RedeemHistory } from '../../models/redeem-history.model';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { v4 as uuidv4 } from 'uuid';

export const featureKey = 'redeemHistory';

export interface State extends EntityState<RedeemHistory> {
  pagination: Pagination;
}

export const adapter: EntityAdapter<RedeemHistory> =
  createEntityAdapter<RedeemHistory>({ selectId: () => uuidv4() });

export const initialState: State = adapter.getInitialState({
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
});

export const reducer = createReducer(
  initialState,
  on(RedeemHistoryActions.getRedeemHistoriesSuccess, (state, { pagedData }) => {
    return adapter.setAll(pagedData.data, {
      ...state,
      pagination: {
        ...pagedData.pagination,
      },
    });
  }),
  on(RedeemHistoryActions.resetRedeemHistories, () => {
    return {
      ...initialState,
    };
  })
);
