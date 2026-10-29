import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { DisabledClaimPolicy } from '../../models/disabled-claim-policy.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

const prefix = '[Disabled Claim By Policy No]';

export const getDisabledClaimPolicies = createAction(
  `${prefix} Get Disabled Claim Policies | loadingKey=getDisabledClaimPolicies`,
  props<{ queryParams: Partial<CommonListQueryParams> }>(),
);

export const getDisabledClaimPoliciesSuccess = createAction(
  `${prefix} Get Disabled Claim Policies Success | loadingKey=getDisabledClaimPolicies`,
  props<{ pagedData: PagedData<DisabledClaimPolicy> }>(),
);

export const getDisabledClaimPoliciesFailure = createAction(
  `${prefix} Get Disabled Claim Policies Failure | loadingKey=getDisabledClaimPolicies`,
  props<{ error: CommonError }>(),
);

export const setDisabledClaimPolicyFilters = createAction(
  `${prefix} Set Disabled Claim Policy Filters`,
  props<{ filters: Partial<CommonListQueryParams> }>(),
);

export const addPolicyToDisabledClaim = createAction(
  `${prefix} Add Policy To Disabled Claim | loadingKey=addPolicyToDisabledClaim`,
  props<{ policy_no: string }>(),
);

export const addPolicyToDisabledClaimSuccess = createAction(
  `${prefix} Add Policy To Disabled Claim Success | loadingKey=addPolicyToDisabledClaim`,
  props<{ disabledClaimPolicy: DisabledClaimPolicy }>(),
);

export const addPolicyToDisabledClaimFailure = createAction(
  `${prefix} Add Policy To Disabled Claim Failure | loadingKey=addPolicyToDisabledClaim`,
  props<{ messageData: ToastMessageData }>(),
);

export const deleteDisabledClaimPolicy = createAction(
  `${prefix} Delete Disabled Claim Policy | loadingKey=deleteDisabledClaimPolicy`,
  props<{ disabled_claim_policy_id: number }>(),
);

export const deleteDisabledClaimPolicySuccess = createAction(
  `${prefix} Delete Disabled Claim Policy Success | loadingKey=deleteDisabledClaimPolicy`,
);

export const deleteDisabledClaimPolicyFailure = createAction(
  `${prefix} Delete Disabled Claim Policy Failure | loadingKey=deleteDisabledClaimPolicy`,
  props<{ messageData: ToastMessageData }>(),
);

export const resetAll = createAction(`${prefix} Reset All`);
