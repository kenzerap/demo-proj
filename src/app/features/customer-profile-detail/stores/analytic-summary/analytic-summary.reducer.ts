import { createReducer, on } from '@ngrx/store';
import * as AnalyticSummaryActions from './analytic-summary.actions';
import { CustomerPolicy } from '../../models/customer-policy.model';
import { CustomerPoint } from '../../models/customer-point.model';
import { CustomerTier } from '../../models/cutomer-tier.model';
import { CustomerClient } from '../../models/customer-client.model';

export const featureKey = 'analyticSummary';

export interface State {
  customerPolicy: CustomerPolicy | null;
  customerPoint: CustomerPoint | null;
  customerTier: CustomerTier | null;
  clientsInfoSvoc: CustomerClient[];
}

export const initialState: State = {
  customerPolicy: null,
  customerPoint: null,
  customerTier: null,
  clientsInfoSvoc: [],
};

export const reducer = createReducer(
  initialState,
  on(
    AnalyticSummaryActions.getCustomerPolicySuccess,
    (state, { customerPolicy }) => ({
      ...state,
      customerPolicy,
    })
  ),
  on(
    AnalyticSummaryActions.getCustomerPointSuccess,
    (state, { customerPoint }) => ({
      ...state,
      customerPoint,
    })
  ),
  on(
    AnalyticSummaryActions.getCustomerTierSuccess,
    (state, { customerTier }) => ({
      ...state,
      customerTier,
    })
  ),
  on(
    AnalyticSummaryActions.getClientsInfoSvocSuccess,
    (state, { clientsInfoSvoc }) => ({
      ...state,
      clientsInfoSvoc,
    })
  ),
  on(AnalyticSummaryActions.reset, () => ({
    ...initialState,
  }))
);
