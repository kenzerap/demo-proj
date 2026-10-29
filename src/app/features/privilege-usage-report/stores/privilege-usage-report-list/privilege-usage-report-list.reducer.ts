import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Pagination } from '@app/shared/models/paged-data.model';
import { PrivilegeUsageReport } from '../../models/privilege-usage-report.model';
import * as PrivilegeUsageReportActions from './privilege-usage-report-list.actions';
import { PrivilegeUsageReportQueryParams } from '../../models/privilege-usage-report-query-params.model';

export const featureKey = 'privilegeUsageReports' as const;
export interface State {
  privilegeUsageReports: EntityState<PrivilegeUsageReport>;
  pagination: Pagination;
  filters: Partial<PrivilegeUsageReportQueryParams>;
  exportLoading?: boolean;
  fileName?: string;
}

export const adapter: EntityAdapter<PrivilegeUsageReport> =
  createEntityAdapter<PrivilegeUsageReport>({
    selectId: (report) => report.id,
  });
export const initialState: State = {
  privilegeUsageReports: adapter.getInitialState(),
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
  filters: {
    page: 0,
    size: 20,
    start_date_time_from: '',
    start_date_time_to: '',
    end_date_time_from: '',
    end_date_time_to: '',
    is_published: undefined,
    expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  exportLoading: false,
  fileName: '',
};

export const reducer = createReducer(
  initialState,
  on(
    PrivilegeUsageReportActions.getPrivilegeUsageReportsSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        privilegeUsageReports: adapter.setAll(
          pagedData.data,
          state.privilegeUsageReports
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
    PrivilegeUsageReportActions.setPrivilegeUsageReportsFilters,
    (state, { filters }) => {
      return {
        ...state,
        filters: {
          page: filters.page !== undefined ? filters.page : state.filters.page,
          size: filters.size !== undefined ? filters.size : state.filters.size,
          is_published:
            filters.is_published !== undefined
              ? filters.is_published
              : state.filters.is_published,
          start_date_time_from:
            filters.start_date_time_from !== undefined
              ? filters.start_date_time_from
              : state.filters.start_date_time_from,
          start_date_time_to:
            filters.start_date_time_to !== undefined
              ? filters.start_date_time_to
              : state.filters.start_date_time_to,
          end_date_time_from:
            filters.end_date_time_from !== undefined
              ? filters.end_date_time_from
              : state.filters.end_date_time_from,
          end_date_time_to:
            filters.end_date_time_to !== undefined
              ? filters.end_date_time_to
              : state.filters.end_date_time_to,
          expected_zone_id:
            filters.expected_zone_id !== undefined
              ? filters.expected_zone_id
              : state.filters.expected_zone_id,
        },
      };
    }
  ),
  on(
    PrivilegeUsageReportActions.resetPrivilegeUsageReportsFilters,
    (state) => ({
      ...state,
      filters: {},
      pagination: initialState.pagination,
      privilegeUsageReports: adapter.getInitialState(),
    })
  ),
  on(PrivilegeUsageReportActions.exportPrivilegeUsageReports, (state) => ({
    ...state,
    exportLoading: true,
  })),
  on(
    PrivilegeUsageReportActions.exportPrivilegeUsageReportsSuccess,
    (state, { fileName }) => ({
      ...state,
      exportLoading: false,
      fileName,
    })
  ),
  on(
    PrivilegeUsageReportActions.exportPrivilegeUsageReportsFailure,
    (state, { error, fileName }) => ({
      ...state,
      exportLoading: false,
      fileName,
    })
  ),
  on(PrivilegeUsageReportActions.resetAll, () => {
    return {
      ...initialState,
      privilegeUsageReports: adapter.getInitialState(),
      pagination: initialState.pagination,
      filters: initialState.filters,
    };
  })
);
