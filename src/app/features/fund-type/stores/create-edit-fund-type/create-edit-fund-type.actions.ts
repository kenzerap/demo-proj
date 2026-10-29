import { createAction, props } from '@ngrx/store';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { CommonError } from '@app/shared/models/common-error.model';
import { CreateEditFundTypeQueryParams } from '../../models/create-edit-fund-type-query-params.model';
import { FundType } from '../../models/fund-type.model';
import { FundTypeOptions } from '../../models/fund-type-options.model';

const prefix = '[Create Edit Fund Type]';

export const createFundType = createAction(
  `${prefix} Create Fund Type | loadingKey=createEditFundType`,
  props<{ queryParams: Partial<CreateEditFundTypeQueryParams> }>(),
);

export const createFundTypeSuccess = createAction(
  `${prefix} Create Fund Type Success | loadingKey=createEditFundType`,
);

export const createFundTypeFailure = createAction(
  `${prefix} Create Fund Type Failure | loadingKey=createEditFundType`,
  props<{ messageData: ToastMessageData }>(),
);

export const updateFundType = createAction(
  `${prefix} Update Fund Type | loadingKey=createEditFundType`,
  props<{ data: Partial<CreateEditFundTypeQueryParams> }>(),
);

export const updateFundTypeSuccess = createAction(
  `${prefix} Update Fund Type Success | loadingKey=createEditFundType`,
);

export const updateFundTypeFailure = createAction(
  `${prefix} Update Fund Type Failure | loadingKey=createEditFundType`,
  props<{ messageData: ToastMessageData }>(),
);

export const getFundTypeDetail = createAction(
  `${prefix} Get Fund Type Detail | loadingKey=getFundTypeDetail`,
  props<{ fundId: number }>(),
);

export const getFundTypeDetailSuccess = createAction(
  `${prefix} Get Fund Type Detail Success | loadingKey=getFundTypeDetail`,
  props<{ fundType: FundType }>(),
);

export const getFundTypeDetailFailure = createAction(
  `${prefix} Get Fund Type Detail Failure | loadingKey=getFundTypeDetail`,
  props<{ error: CommonError }>(),
);

export const getFundTypeOptions = createAction(
  `${prefix} Get Fund Type Options | loadingKey=getFundTypeOptions`,
);

export const getFundTypeOptionsSuccess = createAction(
  `${prefix} Get Fund Type Options Success | loadingKey=getFundTypeOptions`,
  props<{ fundTypeOptions: FundTypeOptions }>(),
);

export const getFundTypeOptionsFailure = createAction(
  `${prefix} Get Fund Type Options Failure | loadingKey=getFundTypeOptions`,
  props<{ error: CommonError }>(),
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>(),
);

export const reset = createAction(`${prefix} Reset Create Edit Fund Type`);
