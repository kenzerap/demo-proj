import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ValidateUploadPointResponse } from '../../models/validate-upload-point-response.model';
import { UploadPointBulkParams } from '../../models/upload-point-bulk-params.model';

const prefix = '[Create Edit Point Bulk]';

export const validateUploadPointBulk = createAction(
  `${prefix} Validate Upload Point Bulk | loadingKey=validateUploadPointBulk`,
  props<{ file: File }>()
);

export const validateUploadPointBulkSuccess = createAction(
  `${prefix} Validate Upload Point Bulk Success | loadingKey=validateUploadPointBulk`,
  props<{ response: ValidateUploadPointResponse }>()
);

export const validateUploadPointBulkFailure = createAction(
  `${prefix} Validate Upload Point Bulk Failure | loadingKey=validateUploadPointBulk`,
  props<{ messageData: ToastMessageData }>()
);

export const uploadPointBulk = createAction(
  `${prefix} Upload Point Bulk | loadingKey=uploadPointBulk`,
  props<{
    data: Partial<UploadPointBulkParams>;
    file: File;
  }>()
);

export const uploadPointBulkSuccess = createAction(
  `${prefix} Upload Point Bulk Success | loadingKey=uploadPointBulk`
);

export const uploadPointBulkFailure = createAction(
  `${prefix} Upload Point Bulk Failure | loadingKey=uploadPointBulk`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(`${prefix} Reset Create Edit Point Bulk`);
