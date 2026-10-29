import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { CreateEditPromocodesQueryParams } from '../../models/create-edit-promocode-query-params.model';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';
import { Privilege } from '@app/shared/models/privilege.model';
import { CreateEditPromocodesResponse } from '../../models/create-edit-promocode-response.model';
import { PromocodeDetail } from '../../models/promocode-model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

const prefix = '[Create Edit Promocode]';

export const createPromocode = createAction(
  `${prefix} Create Promocode | loadingKey=createEditPromocode`,
  props<{
    queryParams: Partial<CreateEditPromocodesQueryParams>;
  }>()
);

export const createPromocodeSuccess = createAction(
  `${prefix} Create Promocode Success | loadingKey=createEditPromocode`,
  props<{ response: CreateEditPromocodesResponse }>()
);

export const createPromocodeFailure = createAction(
  `${prefix} Create Promocode Failure | loadingKey=createEditPromocode`,
  props<{ messageData: ToastMessageData }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getPromocodeDetail = createAction(
  `${prefix} Get Promocode Detail | loadingKey=getPromocodeDetail`,
  props<{ promocodeId: number }>()
);

export const getPromocodeDetailSuccess = createAction(
  `${prefix} Get Promocode Detail Success | loadingKey=getPromocodeDetail`,
  props<{ promocode: PromocodeDetail }>()
);

export const getPromocodeDetailFailure = createAction(
  `${prefix} Get Promocode Detail Failure | loadingKey=getPromocodeDetail`,
  props<{ error: CommonError }>()
);

export const getPolicyChannels = createAction(
  `${prefix} Get Policy Channels | loadingKey=getPolicyChannels`
);

export const getPolicyChannelsSuccess = createAction(
  `${prefix} Get Policy Channels Success | loadingKey=getPolicyChannels`,
  props<{ data: PolicyChannel[] }>()
);

export const getPolicyChannelsFailure = createAction(
  `${prefix} Get Policy Channels Failure | loadingKey=getPolicyChannels`,
  props<{ error: CommonError }>()
);

export const getPrivileges = createAction(
  `${prefix} Get Privileges | loadingKey=getPrivileges`
);

export const getPrivilegesSuccess = createAction(
  `${prefix} Get Privileges Success | loadingKey=getPrivileges`,
  props<{ data: Privilege[] }>()
);

export const getPrivilegesFailure = createAction(
  `${prefix} Get Privileges Failure | loadingKey=getPrivileges`,
  props<{ error: CommonError }>()
);

export const updatePromocode = createAction(
  `${prefix} Update Promocode | loadingKey=createEditPromocode`,
  props<{
    data: Partial<CreateEditPromocodesQueryParams>;
  }>()
);

export const updatePromocodeSuccess = createAction(
  `${prefix} Update Promocode Success | loadingKey=createEditPromocode`
);

export const updatePromocodeFailure = createAction(
  `${prefix} Update Promocode Failure | loadingKey=createEditPromocode`,
  props<{ duplicated: boolean; promocode_id: number | null; promocode_name: string }>()
);

export const setPrivilegeSearchFilter = createAction(
  `${prefix} Set Privilege Search Filter`,
  props<{ filters: Partial<CommonListQueryParams> }>()
);

export const reset = createAction(`${prefix} Reset Create Edit Promocode`);
