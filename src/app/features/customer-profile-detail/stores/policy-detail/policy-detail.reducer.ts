import { createReducer, on } from '@ngrx/store';
import * as PolicyDetailActions from './policy-detail.actions';
import { PolicyDetail } from '../../models/policy.model';

export const featureKey = 'policyDetail';

export interface State {
  policyDetails: { [policy_id: string]: PolicyDetail };
}

export const initialState: State = {
  policyDetails: {},
};

export const reducer = createReducer(
  initialState,
  on(
    PolicyDetailActions.getPolicyDetailSuccess,
    (state, { policyId, policyDetail }) => ({
      ...state,
      policyDetails: { [policyId]: { ...policyDetail, policy_id: policyId } },
    })
  ),
  on(PolicyDetailActions.reset, () => ({
    ...initialState,
  }))
);
