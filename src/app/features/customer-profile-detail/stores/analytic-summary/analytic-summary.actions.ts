import { createAction, props } from '@ngrx/store';
import { CustomerPolicy } from '../../models/customer-policy.model';
import { CustomerPoint } from '../../models/customer-point.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { CustomerTier } from '../../models/cutomer-tier.model';
import { CustomerClient } from '../../models/customer-client.model';

const prefix = '[Analytic Summary]';

export const getAnalyticSummary = createAction(
  `${prefix} Get Analytic Summary | loadingKey=getAnalyticSummary`,
  props<{ partyId: string }>()
);

export const getCustomerPolicy = createAction(
  `${prefix} Get Customer Policy`,
  props<{ partyId: string }>()
);

export const getCustomerPolicySuccess = createAction(
  `${prefix} Get Customer Policy Success | loadingKey=getAnalyticSummary`,
  props<{ customerPolicy: CustomerPolicy }>()
);

export const getCustomerPolicyFailure = createAction(
  `${prefix} Get Customer Policy Failure | loadingKey=getAnalyticSummary`,
  props<{ error: CommonError }>()
);

export const getCustomerPoint = createAction(
  `${prefix} Get Customer Point`,
  props<{ partyId: string }>()
);

export const getCustomerPointSuccess = createAction(
  `${prefix} Get Customer Point Success | loadingKey=getAnalyticSummary`,
  props<{ customerPoint: CustomerPoint }>()
);

export const getCustomerPointFailure = createAction(
  `${prefix} Get Customer Point Failure | loadingKey=getAnalyticSummary`,
  props<{ error: CommonError }>()
);

export const getCustomerTier = createAction(
  `${prefix} Get Customer Tier`,
  props<{ partyId: string }>()
);

export const getCustomerTierSuccess = createAction(
  `${prefix} Get Customer Tier Success | loadingKey=getAnalyticSummary`,
  props<{ customerTier: CustomerTier }>()
);

export const getCustomerTierFailure = createAction(
  `${prefix} Get Customer Tier Failure | loadingKey=getAnalyticSummary`,
  props<{ error: CommonError }>()
);

export const getClientsInfoSvoc = createAction(
  `${prefix} Get Clients Info SVOC`,
  props<{ partyId: string }>()
);

export const getClientsInfoSvocSuccess = createAction(
  `${prefix} Get Clients Info SVOC Success | loadingKey=getAnalyticSummary`,
  props<{ clientsInfoSvoc: CustomerClient[] }>()
);

export const getClientsInfoSvocFailure = createAction(
  `${prefix} Get Clients Info SVOC Failure | loadingKey=getAnalyticSummary`,
  props<{ error: CommonError }>()
);

export const reset = createAction(`${prefix} Reset Customer Policy`);
