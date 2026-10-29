import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PrivilegeRedemptionReport } from '../../models/privilede-redemption-report.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import * as PrivilegeRedemptionReportsActions from './privilege-redemption-report-list.actions';
import { PrivilegeRedemptionReportQueryParams } from '../../models/privilede-redemption-report-query-params.model';
import { v4 as uuidv4 } from 'uuid';

export const featureKey = 'privilegeRedemptionReport' as const;
export interface State {
  privilegeRedemptionReports: EntityState<PrivilegeRedemptionReport>;
  pagination: Pagination;
  filters: Partial<PrivilegeRedemptionReportQueryParams>;
  exportLoading?: boolean;
  fileName?: string;
}

export const adapter: EntityAdapter<PrivilegeRedemptionReport> =
  createEntityAdapter<PrivilegeRedemptionReport>({
    selectId: () => uuidv4(),
  });
export const initialState: State = {
  privilegeRedemptionReports: adapter.getInitialState(),
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
    privilege_types: [],
    from_date_time: '',
    to_date_time: '',
    expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  exportLoading: false,
  fileName: '',
};

export const reducer = createReducer(
  initialState,
  on(
    PrivilegeRedemptionReportsActions.getPrivilegeRedemptionReportSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        privilegeRedemptionReports: adapter.setAll(
          pagedData.data,
          state.privilegeRedemptionReports
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
    PrivilegeRedemptionReportsActions.setPrivilegeRedemptionReportFilters,
    (state, { filters }) => {
      return {
        ...state,
        filters: {
          page: filters.page !== undefined ? filters.page : state.filters.page,
          size: filters.size !== undefined ? filters.size : state.filters.size,
          keyword:
            filters.keyword !== undefined
              ? filters.keyword
              : state.filters.keyword,
          privilege_types:
            filters.privilege_types !== undefined
              ? filters.privilege_types
              : state.filters.privilege_types,
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
    PrivilegeRedemptionReportsActions.resetPrivilegeRedemptionReportsFilters,
    (state) => ({
      ...state,
      filters: {},
      pagination: initialState.pagination,
      privilegeRedemptionReports: adapter.getInitialState(),
    })
  ),
  on(
    PrivilegeRedemptionReportsActions.exportPrivilegeRedemptionReport,
    (state) => ({
      ...state,
      exportLoading: true,
    })
  ),
  on(
    PrivilegeRedemptionReportsActions.exportPrivilegeRedemptionReportSuccess,
    (state, { fileName }) => ({
      ...state,
      exportLoading: false,
      fileName,
    })
  ),
  on(
    PrivilegeRedemptionReportsActions.exportPrivilegeRedemptionReportFailure,
    (state, { error, fileName }) => ({
      ...state,
      exportLoading: false,
      fileName,
    })
  ),
  on(PrivilegeRedemptionReportsActions.resetAll, (state) => {
    return {
      ...state,
      privilegeRedemptionReports: adapter.getInitialState(),
      pagination: initialState.pagination,
      filters: initialState.filters,
    };
  })
);
