import { createAction, props } from '@ngrx/store';
import { PolicyDetail } from '../../models/policy.model';
import { CommonError } from 'src/app/shared/models/common-error.model';

const prefix = '[Policy Detail]';

export const getPolicyDetail = createAction(
  `${prefix} Get Policy Detail`,
  props<{ partyId: string; policyId: number }>()
);

export const getPolicyDetailSuccess = createAction(
  `${prefix} Get Policy Detail Success`,
  props<{ policyId: number; policyDetail: PolicyDetail }>()
);

export const getPolicyDetailFailure = createAction(
  `${prefix} Get Policy Detail Failure`,
  props<{ policyId: number; error: CommonError }>()
);

export const reset = createAction(`${prefix} Reset Policy Detail`);
