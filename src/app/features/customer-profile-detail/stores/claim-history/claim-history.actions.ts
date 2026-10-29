import { createAction, props } from '@ngrx/store';
import { Claim } from '../../models/claim.model';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { ClaimHistoriesQueryParams } from '../../models/claim-histories-query-params.model';
import { CommonError } from 'src/app/shared/models/common-error.model';

const prefix = '[Claim History]';

export const getClaimHistories = createAction(
  `${prefix} Get Claim Histories`,
  props<{
    partyId: string;
    policyId: number;
    queryParams: Partial<ClaimHistoriesQueryParams>;
  }>()
);

export const getClaimHistoriesSuccess = createAction(
  `${prefix} Get Claim Histories Success`,
  props<{ policyId: number; pagedData: PagedData<Claim> }>()
);

export const getClaimHistoriesFailure = createAction(
  `${prefix} Get Claim Histories Failure`,
  props<{ policyId: number; error: CommonError }>()
);

export const reset = createAction(`${prefix} Reset Claim History`);
