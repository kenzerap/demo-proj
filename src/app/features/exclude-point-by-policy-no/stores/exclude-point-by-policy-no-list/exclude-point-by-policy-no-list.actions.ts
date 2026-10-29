import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { ExcludePointPolicy } from '../../models/exclude-point-policy.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

const prefix = '[Exclude Point By Policy No]';

export const getExcludePointPolicies = createAction(
  `${prefix} Get Exclude Point Policies | loadingKey=getExcludePointPolicies`,
  props<{ queryParams: Partial<CommonListQueryParams> }>(),
);

export const getExcludePointPoliciesSuccess = createAction(
  `${prefix} Get Exclude Point Policies Success | loadingKey=getExcludePointPolicies`,
  props<{ pagedData: PagedData<ExcludePointPolicy> }>(),
);

export const getExcludePointPoliciesFailure = createAction(
  `${prefix} Get Exclude Point Policies Failure | loadingKey=getExcludePointPolicies`,
  props<{ error: CommonError }>(),
);

export const setExcludePointPolicyFilters = createAction(
  `${prefix} Set Exclude Point Policy Filters`,
  props<{ filters: Partial<CommonListQueryParams> }>(),
);

export const addPolicyToExcludePoint = createAction(
  `${prefix} Add Policy To Exclude Point | loadingKey=addPolicyToExcludePoint`,
  props<{ policy_no: string }>(),
);

export const addPolicyToExcludePointSuccess = createAction(
  `${prefix} Add Policy To Exclude Point Success | loadingKey=addPolicyToExcludePoint`,
  props<{ excludePointPolicy: ExcludePointPolicy }>(),
);

export const addPolicyToExcludePointFailure = createAction(
  `${prefix} Add Policy To Exclude Point Failure | loadingKey=addPolicyToExcludePoint`,
  props<{ messageData: ToastMessageData }>(),
);

export const deleteExcludePointPolicy = createAction(
  `${prefix} Delete Exclude Point Policy | loadingKey=deleteExcludePointPolicy`,
  props<{ excluded_policy_id: number }>(),
);

export const deleteExcludePointPolicySuccess = createAction(
  `${prefix} Delete Exclude Point Policy Success | loadingKey=deleteExcludePointPolicy`,
);

export const deleteExcludePointPolicyFailure = createAction(
  `${prefix} Delete Exclude Point Policy Failure | loadingKey=deleteExcludePointPolicy`,
  props<{ messageData: ToastMessageData }>(),
);

export const resetAll = createAction(`${prefix} Reset All`);
