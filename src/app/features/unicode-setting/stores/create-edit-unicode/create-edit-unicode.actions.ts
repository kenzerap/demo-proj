import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';
import { Privilege } from '@app/shared/models/privilege.model';
import { CreateEditUnicodeQueryParams } from '../../models/create-edit-unicode-query-params.model';
import { UnicodeDetail } from '../../models/unicode-model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

const prefix = '[Create Edit Unicode]';

export const createUnicode = createAction(
  `${prefix} Create Unicode | loadingKey=createEditUnicode`,
  props<{
    queryParams: Partial<CreateEditUnicodeQueryParams>;
  }>()
);

export const createUnicodeSuccess = createAction(
  `${prefix} Create Unicode Success | loadingKey=createEditUnicode`
);

export const createUnicodeFailure = createAction(
  `${prefix} Create Unicode Failure | loadingKey=createEditUnicode`,
  props<{ messageData: ToastMessageData }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getUnicodeDetail = createAction(
  `${prefix} Get Unicode Detail | loadingKey=getUnicodeDetail`,
  props<{ unicodeId: number }>()
);

export const getUnicodeDetailSuccess = createAction(
  `${prefix} Get Unicode Detail Success | loadingKey=getUnicodeDetail`,
  props<{ unicode: UnicodeDetail }>()
);

export const getUnicodeDetailFailure = createAction(
  `${prefix} Get Unicode Detail Failure | loadingKey=getUnicodeDetail`,
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

export const updateUnicode = createAction(
  `${prefix} Update Unicode | loadingKey=createEditUnicode`,
  props<{
    data: Partial<CreateEditUnicodeQueryParams>;
  }>()
);

export const updateUnicodeSuccess = createAction(
  `${prefix} Update Unicode Success | loadingKey=createEditUnicode`
);

export const updateUnicodeFailure = createAction(
  `${prefix} Update Unicode Failure | loadingKey=createEditUnicode`,
  props<{ messageData: ToastMessageData }>()
);

export const exportUnicode = createAction(
  `${prefix} Export Unicode | loadingKey=exportUnicode`,
  props<{ unicode_id: number; expected_zone_id: string }>()
);

export const exportUnicodePending = createAction(
  `${prefix} Export Unicode Pending | loadingKey=exportUnicode`
);

export const exportUnicodeSuccess = createAction(
  `${prefix} Export Unicode Success | loadingKey=exportUnicode`,
  props<{ file_name: string; url: string }>()
);

export const exportUnicodeFailure = createAction(
  `${prefix} Export Unicode Failure | loadingKey=exportUnicode`,
  props<{ messageData: ToastMessageData }>()
);

export const setPrivilegeSearchFilter = createAction(
  `${prefix} Set Privilege Search Filter`,
  props<{ filters: Partial<CommonListQueryParams> }>()
);

export const reset = createAction(`${prefix} Reset Create Edit Unicode`);
