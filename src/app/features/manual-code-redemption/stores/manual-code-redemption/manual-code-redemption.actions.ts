import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { ManualCodeRedemption } from '../../models/manual-code-redemption.model';
import {
  ManualCodeRedemptionQueryParams,
  UpdateStatusQueryParams,
} from '../../models/manual-code-redemption-query-params.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

const prefix = '[manualCodeRedemption]';

export const getManualCodeRedemption = createAction(
  `${prefix} Get Manual Code Redemption  | loadingKey=getManualCodeRedemption`,
  props<{ params: Partial<ManualCodeRedemptionQueryParams> }>()
);

export const getManualCodeRedemptionSuccess = createAction(
  `${prefix} Get Manual Code Redemption Success | loadingKey=getManualCodeRedemption`,
  props<{ pagedData: PagedData<ManualCodeRedemption> }>()
);

export const getManualCodeRedemptionFailure = createAction(
  `${prefix} Get Manual Code Redemption Failure | loadingKey=getManualCodeRedemption`,
  props<{ error: CommonError }>()
);

export const setManualCodeRedemptionFilters = createAction(
  `${prefix} Set Manual Code Redemption Filters`,
  props<{ filters: Partial<ManualCodeRedemptionQueryParams> }>()
);

export const resetManualCodeRedemptionFilters = createAction(
  `${prefix} Reset Filters | loadingKey=getManualCodeRedemption`
);

export const updateManualCodeRedemptionStatus = createAction(
  `${prefix} Update Status | loadingKey=updateManualCodeRedemptionStatus`,
  props<{ params: UpdateStatusQueryParams }>()
);

export const updateManualCodeRedemptionStatusSuccess = createAction(
  `${prefix} Update Status Success | loadingKey=updateManualCodeRedemptionStatus`,
  props<{ id: number }>()
);

export const updateManualCodeRedemptionStatusFailure = createAction(
  `${prefix} Update Status Failure | loadingKey=updateManualCodeRedemptionStatus`,
  props<{ error: CommonError }>()
);

export const exportManualCodeRedemption = createAction(
  `${prefix} Export Manual Code Redemption | loadingKey=exportManualCodeRedemption`,
  props<{ expected_zone_id: string }>()
);

export const exportManualCodeRedemptionPending = createAction(
  `${prefix} Export Manual Code Redemption Pending | loadingKey=exportManualCodeRedemption`
);

export const exportManualCodeRedemptionSuccess = createAction(
  `${prefix} Export Manual Code Redemption Success | loadingKey=exportManualCodeRedemption`,
  props<{ file_name: string; url: string }>()
);

export const exportManualCodeRedemptionFailure = createAction(
  `${prefix} Export Manual Code Redemption Failure | loadingKey=exportManualCodeRedemption`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
