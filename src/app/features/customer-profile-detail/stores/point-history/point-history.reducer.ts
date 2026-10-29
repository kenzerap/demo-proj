import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as PointHistoryActions from './point-history.actions';
import { PointHistory } from '../../models/point-history.model';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { PointExpire } from '../../models/point-expire-history.model';

export const featureKey = 'pointHistory';

export interface State {
  pointHistories: EntityState<PointHistory>;
  pointHistoriesPagination: Pagination;
  pointExpiries: EntityState<PointExpire>;
  pointExpiriesPagination: Pagination;
}

export const pointHistoriesAdapter: EntityAdapter<PointHistory> =
  createEntityAdapter<PointHistory>({
    selectId: (pointHistory: PointHistory) => pointHistory.id + pointHistory.transactionType,
  });

export const pointExpiriesAdapter: EntityAdapter<PointExpire> =
  createEntityAdapter<PointExpire>({
    selectId: (pointExpire: PointExpire) => pointExpire.id + pointExpire.transactionType,
  });

export const initialState: State = {
  pointHistories: pointHistoriesAdapter.getInitialState(),
  pointHistoriesPagination: {
    page: 0,
    size: 10,
    totalItems: 0,
    totalPages: 0,
  },
  pointExpiries: pointHistoriesAdapter.getInitialState(),
  pointExpiriesPagination: {
    page: 0,
    size: 10,
    totalItems: 0,
    totalPages: 0,
  },
};

export const reducer = createReducer(
  initialState,
  on(PointHistoryActions.getPointHistoriesSuccess, (state, { pagedData }) => {
    return {
      ...state,
      pointHistories: pointHistoriesAdapter.setAll(
        pagedData.data,
        state.pointHistories
      ),
      pointHistoriesPagination: {
        ...pagedData.pagination,
      },
    };
  }),
  on(PointHistoryActions.getPointExpiriesSuccess, (state, { pagedData }) => {
    return {
      ...state,
      pointExpiries: pointExpiriesAdapter.setAll(
        pagedData.data,
        state.pointExpiries
      ),
      pointExpiriesPagination: {
        ...pagedData.pagination,
      },
    };
  }),
  on(PointHistoryActions.resetPointHistories, () => {
    return {
      ...initialState,
      pointHistories: pointHistoriesAdapter.getInitialState(),
      pointHistoriesPagination: {
        page: 0,
        size: 10,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }),
  on(PointHistoryActions.resetPointExpiries, () => {
    return {
      ...initialState,
      pointExpiries: pointExpiriesAdapter.getInitialState(),
      pointExpiriesPagination: {
        page: 0,
        size: 10,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }),
  on(PointHistoryActions.reset, () => {
    return {
      ...initialState,
    };
  })
);
