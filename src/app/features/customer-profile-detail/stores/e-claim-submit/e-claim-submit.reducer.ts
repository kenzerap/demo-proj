import { createReducer, on } from '@ngrx/store';
import * as EClaimSubmitActions from './e-claim-submit.actions';
import { EClaim } from '../../models/e-claim.model';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { EClaimImageUrls } from '../../models/e-claim-image-urls.model';

export const featureKey = 'eClaimSubmit';

export interface State {
  eClaimSubmits: { [policyId: string]: PagedData<EClaim> };
  eClaimImageUrls: { [policyId: string]: EClaimImageUrls };
}

export const initialState: State = {
  eClaimSubmits: {},
  eClaimImageUrls: {},
};

export const reducer = createReducer(
  initialState,
  on(
    EClaimSubmitActions.getEClaimSubmitsSuccess,
    (state, { policyId, pagedData }) => {
      return {
        ...state,
        eClaimSubmits: {
          ...state.eClaimSubmits,
          [policyId]: pagedData,
        },
      };
    }
  ),
  on(
    EClaimSubmitActions.getEClaimImageUrlsSuccess,
    (state, { policyId, data }) => {
      return {
        ...state,
        eClaimImageUrls: {
          ...state.eClaimImageUrls,
          [policyId]: data,
        },
      };
    }
  ),
  on(EClaimSubmitActions.resetEClaimImageUrls, (state) => {
    return {
      ...state,
      eClaimImageUrls: {},
    };
  }),
  on(EClaimSubmitActions.reset, () => {
    return {
      ...initialState,
    };
  })
);
