import { createAction, props } from '@ngrx/store';
import { EClaim } from '../../models/e-claim.model';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { EClaimSubmitQueryParams } from '../../models/e-claim-submit-query-params.model';
import { EClaimImageUrls } from '../../models/e-claim-image-urls.model';
import { CommonError } from 'src/app/shared/models/common-error.model';

const prefix = '[EClaim Submit]';

export const getEClaimSubmits = createAction(
  `${prefix} Get EClaim Submits`,
  props<{
    partyId: string;
    policyId: number;
    queryParams: Partial<EClaimSubmitQueryParams>;
  }>()
);

export const getEClaimSubmitsSuccess = createAction(
  `${prefix} Get EClaim Submits Success`,
  props<{ policyId: number; pagedData: PagedData<EClaim> }>()
);

export const getEClaimSubmitsFailure = createAction(
  `${prefix} Get EClaim Submits Failure`,
  props<{ policyId: number; error: CommonError }>()
);

export const getEClaimImageUrls = createAction(
  `${prefix} Get EClaim Image urls`,
  props<{
    partyId: string;
    policyId: number;
    imageNames: string[];
  }>()
);

export const getEClaimImageUrlsSuccess = createAction(
  `${prefix} Get EClaim Image urls Success`,
  props<{ policyId: number; data: EClaimImageUrls }>()
);

export const getEClaimImageUrlsFailure = createAction(
  `${prefix} Get EClaim Image urls Failure`,
  props<{ policyId: number; error: CommonError }>()
);

export const downloadImagesZip = createAction(
  `${prefix} Download Images Zip`,
  props<{
    eclaimId: number;
    policyId: number;
    imageUrls: string[];
    partyId: string;
  }>()
);

export const downloadImagesZipSuccess = createAction(
  `${prefix} Download Images Zip Success`
);

export const downloadImagesZipFailure = createAction(
  `${prefix} Download Images Zip Failure`,
  props<{ error: CommonError }>()
);

export const resetEClaimImageUrls = createAction(
  `${prefix} Reset EClaim Image Urls`
);

export const reset = createAction(`${prefix} Reset EClaim Submit`);
