import { createReducer, on } from '@ngrx/store';
import * as OtpHistoryActions from './otp-history.actions';
import { OtpHistory } from '../../models/otp-history.model';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { v4 as uuidv4 } from 'uuid';

export const featureKey = 'otpHistory';

export interface State extends EntityState<OtpHistory> {
  pagination: Pagination;
}

export const adapter: EntityAdapter<OtpHistory> =
  createEntityAdapter<OtpHistory>({ selectId: () => uuidv4() });

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
  on(OtpHistoryActions.getOtpHistoriesSuccess, (state, { pagedData }) => {
    return adapter.setAll(pagedData.data, {
      ...state,
      pagination: {
        ...pagedData.pagination,
      },
    });
  }),
  on(OtpHistoryActions.resetOtpHistories, () => {
    return {
      ...initialState,
    };
  })
);
