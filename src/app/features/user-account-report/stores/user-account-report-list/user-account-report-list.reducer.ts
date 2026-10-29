import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Pagination } from '@app/shared/models/paged-data.model';
import {
  UserAccountReportLists,
  UserAccountReportTotals,
} from '../../models/user-account-report-report.model';
import * as UserAccountReportActions from './user-account-report-list.actions';
import { UserAccountReportQueryParams } from '../../models/user-account-report-query-params.model';

export const featureKey = 'userAccountReports' as const;
export interface State {
  userAccountReportTotals: UserAccountReportTotals | null;
  userAccountReports: EntityState<UserAccountReportLists>;
  pagination: Pagination;
  filters: Partial<UserAccountReportQueryParams>;
  exportLoading?: boolean;
  fileName?: string;
}

export const adapter: EntityAdapter<UserAccountReportLists> =
  createEntityAdapter<UserAccountReportLists>({
    selectId: (item) => item.party_id,
  });

export const initialState: State = {
  userAccountReportTotals: null,
  userAccountReports: adapter.getInitialState(),
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
    user_types: [],
    expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  exportLoading: false,
  fileName: '',
};

export const reducer = createReducer(
  initialState,
  on(
    UserAccountReportActions.getUserAccountReportTotalsSuccess,
    (state, { totals }) => {
      return {
        ...state,
        userAccountReportTotals: totals,
      };
    }
  ),
  on(
    UserAccountReportActions.getUserAccountReportsSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        userAccountReports: adapter.setAll(
          pagedData.data,
          state.userAccountReports
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
    UserAccountReportActions.setUserAccountReportsFilters,
    (state, { filters }) => {
      return {
        ...state,
        filters: {
          page: filters.page !== undefined ? filters.page : state.filters.page,
          size: filters.size !== undefined ? filters.size : state.filters.size,
          user_types:
            filters.user_types !== undefined
              ? filters.user_types
              : state.filters.user_types,
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
  on(UserAccountReportActions.resetUserAccountReportsFilters, (state) => ({
    ...state,
    filters: {},
    pagination: initialState.pagination,
    userAccountReportTotals: null,
    userAccountReports: adapter.getInitialState(),
  })),
  on(UserAccountReportActions.exportUserAccountReports, (state) => ({
    ...state,
    exportLoading: true,
  })),
  on(
    UserAccountReportActions.exportUserAccountReportsSuccess,
    (state, { fileName }) => ({
      ...state,
      exportLoading: false,
      fileName,
    })
  ),
  on(
    UserAccountReportActions.exportUserAccountReportsFailure,
    (state, { error, fileName }) => ({
      ...state,
      exportLoading: false,
      fileName,
    })
  ),
  on(UserAccountReportActions.resetAll, () => {
    return {
      ...initialState,
      userAccountReportTotals: null,
      userAccountReports: adapter.getInitialState(),
      pagination: initialState.pagination,
      filters: initialState.filters,
    };
  })
);
