import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Pagination } from '@app/shared/models/paged-data.model';
import * as EclaimReportActions from './e-claim-report-list.actions';
import { EclaimReport } from '../../models/e-claim-report.model';
import { EclaimReportQueryParams } from '../../models/e-claim-report-query-params.model';

export const featureKey = 'eclaimReports' as const;
export interface State {
  eclaimReports: EntityState<EclaimReport>;
  pagination: Pagination;
  filters: Partial<EclaimReportQueryParams>;
  exportLoading?: boolean;
  fileName?: string;
}

export const adapter: EntityAdapter<EclaimReport> =
  createEntityAdapter<EclaimReport>({
    selectId: (report) => report.eclaim_id,
  });
export const initialState: State = {
  eclaimReports: adapter.getInitialState(),
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
    expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  exportLoading: false,
  fileName: '',
};

export const reducer = createReducer(
  initialState,
  on(EclaimReportActions.getEclaimReportsSuccess, (state, { pagedData }) => {
    return {
      ...state,
      eclaimReports: adapter.setAll(pagedData.data, state.eclaimReports),
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
  on(EclaimReportActions.setEclaimReportsFilters, (state, { filters }) => {
    return {
      ...state,
      filters: {
        page: filters.page !== undefined ? filters.page : state.filters.page,
        size: filters.size !== undefined ? filters.size : state.filters.size,
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
  }),
  on(EclaimReportActions.resetEclaimReportsFilters, (state) => ({
    ...state,
    filters: {},
    pagination: initialState.pagination,
    eclaimReports: adapter.getInitialState(),
  })),
  on(EclaimReportActions.exportEclaimReports, (state) => ({
    ...state,
    exportLoading: true,
  })),
  on(EclaimReportActions.exportEclaimReportsSuccess, (state, { fileName }) => ({
    ...state,
    exportLoading: false,
    fileName,
  })),
  on(
    EclaimReportActions.exportEclaimReportsFailure,
    (state, { error, fileName }) => ({
      ...state,
      exportLoading: false,
      fileName,
    })
  ),
  on(EclaimReportActions.resetAll, () => {
    return {
      ...initialState,
      eclaimReports: adapter.getInitialState(),
      pagination: initialState.pagination,
      filters: initialState.filters,
    };
  })
);
