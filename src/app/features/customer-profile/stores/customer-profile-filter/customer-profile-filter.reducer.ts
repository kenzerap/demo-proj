import { createReducer, on } from '@ngrx/store';
import * as CustomerProfileFilterActions from './customer-profile-filter.actions';

export const featureKey = 'customerProfileFilter';

export interface State {
  commonSearch: string;
  policyNumber: string;
  certificateNumber: string;
}

export const initialState: State = {
  commonSearch: '',
  policyNumber: '',
  certificateNumber: '',
};

export const reducer = createReducer(
  initialState,
  on(
    CustomerProfileFilterActions.searchCustomerProfiles,
    (state, { commonSearch, policyNumber, certificateNumber }) => ({
      ...state,
      commonSearch,
      policyNumber,
      certificateNumber,
    })
  ),
  on(CustomerProfileFilterActions.reset, () => ({
    ...initialState,
  }))
);
