import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Pagination } from '@app/shared/models/paged-data.model';
import { PointTransactionReport } from '../../models/point-transaction-report.model';
import * as PointTransactionReportsActions from './point-transaction-report-list.actions';
import { PointTransactionReportQueryParams } from '../../models/point-transaction-report-query-params.model';
import { v4 as uuidv4 } from 'uuid';

export const featureKey = 'pointTransactionReport' as const;
export interface State {
  pointTransactionReports: EntityState<PointTransactionReport>;
  pagination: Pagination;
  filters: Partial<PointTransactionReportQueryParams>;
  exportLoading?: boolean;
  fileName?: string;
}

export const adapter: EntityAdapter<PointTransactionReport> =
  createEntityAdapter<PointTransactionReport>({
    selectId: () => uuidv4(),
  });
export const initialState: State = {
  pointTransactionReports: adapter.getInitialState(),
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
  filters: {
    page: 0,
    size: 20,
    from_date_time: '',
    to_date_time: '',
    transaction_type: null,
    expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  exportLoading: false,
  fileName: '',
};

export const reducer = createReducer(
  initialState,
  on(
    PointTransactionReportsActions.getPointTransactionReportsSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        pointTransactionReports: adapter.setAll(
          pagedData.data,
          state.pointTransactionReports
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
    PointTransactionReportsActions.setPointTransactionReportsFilters,
    (state, { filters }) => {
      return {
        ...state,
        filters: {
          page: filters.page !== undefined ? filters.page : state.filters.page,
          size: filters.size !== undefined ? filters.size : state.filters.size,
          transaction_type:
            filters.transaction_type !== undefined
              ? filters.transaction_type
              : state.filters.transaction_type,
          from_date_time:
            filters.from_date_time !== undefined
              ? filters.from_date_time
              : state.filters.from_date_time,
          to_date_time:
            filters.to_date_time !== undefined
              ? filters.to_date_time
              : state.filters.to_date_time,
          expected_zone_id:
            filters.expected_zone_id !== undefined
              ? filters.expected_zone_id
              : state.filters.expected_zone_id,
        },
      };
    }
  ),
  on(
    PointTransactionReportsActions.resetPointTransactionReportsFilters,
    (state) => ({
      ...state,
      filters: {},
      pagination: initialState.pagination,
      pointTransactionReports: adapter.getInitialState(),
    })
  ),
  on(PointTransactionReportsActions.exportPointTransactionReports, (state) => ({
    ...state,
    exportLoading: true,
  })),
  on(
    PointTransactionReportsActions.exportPointTransactionReportsSuccess,
    (state, { fileName }) => ({
      ...state,
      exportLoading: false,
      fileName,
    })
  ),
  on(
    PointTransactionReportsActions.exportPointTransactionReportsFailure,
    (state, { error, fileName }) => ({
      ...state,
      exportLoading: false,
      fileName,
    })
  ),
  on(PointTransactionReportsActions.resetAll, (state) => {
    return {
      ...state,
      pointTransactionReports: adapter.getInitialState(),
      pagination: initialState.pagination,
      filters: initialState.filters,
    };
  })
);
