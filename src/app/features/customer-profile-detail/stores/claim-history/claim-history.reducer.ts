import { createReducer, on } from '@ngrx/store';
import * as ClaimHistoryActions from './claim-history.actions';
import { Claim } from '../../models/claim.model';
import { PagedData } from 'src/app/shared/models/paged-data.model';

export const featureKey = 'claimHistory';

export interface State {
  claimHistories: { [policyId: string]: PagedData<Claim> };
}

export const initialState: State = {
  claimHistories: {},
};

export const reducer = createReducer(
  initialState,
  on(
    ClaimHistoryActions.getClaimHistoriesSuccess,
    (state, { policyId, pagedData }) => {
      return {
        ...state,
        claimHistories: {
          ...state.claimHistories,
          [policyId]: pagedData,
        },
      };
    }
  ),
  on(ClaimHistoryActions.reset, () => {
    return {
      ...initialState,
    };
  })
);
