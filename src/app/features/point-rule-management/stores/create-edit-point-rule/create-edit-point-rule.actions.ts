import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { CreateEditPointRulesQueryParams } from '../../models/create-edit-point-rule-query-params.model';
import { PointRuleDetail } from '../../models/point-rule-model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';
import { ProductName } from '@app/shared/models/product-name.model';

const prefix = '[Create Edit Point Rule]';

export const createPointRule = createAction(
  `${prefix} Create PointRule | loadingKey=createEditPointRule`,
  props<{
    queryParams: Partial<CreateEditPointRulesQueryParams>;
  }>()
);

export const createPointRuleSuccess = createAction(
  `${prefix} Create PointRule Success | loadingKey=createEditPointRule`
);

export const createPointRuleFailure = createAction(
  `${prefix} Create PointRule Failure | loadingKey=createEditPointRule`,
  props<{ duplicated: boolean; messageData: ToastMessageData }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getPointRuleDetail = createAction(
  `${prefix} Get PointRule Detail | loadingKey=getPointRuleDetail`,
  props<{ pointRuleId: number }>()
);

export const getPointRuleDetailSuccess = createAction(
  `${prefix} Get PointRule Detail Success | loadingKey=getPointRuleDetail`,
  props<{ pointRule: PointRuleDetail }>()
);

export const getPointRuleDetailFailure = createAction(
  `${prefix} Get PointRule Detail Failure | loadingKey=getPointRuleDetail`,
  props<{ error: CommonError }>()
);

export const updatePointRule = createAction(
  `${prefix} Update PointRule | loadingKey=createEditPointRule`,
  props<{
    data: Partial<CreateEditPointRulesQueryParams>;
  }>()
);

export const updatePointRuleSuccess = createAction(
  `${prefix} Update PointRule Success | loadingKey=createEditPointRule`
);

export const updatePointRuleFailure = createAction(
  `${prefix} Update PointRule Failure | loadingKey=createEditPointRule`,
  props<{ duplicated: boolean; messageData: ToastMessageData }>()
);

export const getTierGroups = createAction(
  `${prefix} Get Tier Groups | loadingKey=getTierGroups`,
  props<{ page: number; size: number }>()
);

export const getTierGroupsSuccess = createAction(
  `${prefix} Get Tier Groups Success | loadingKey=getTierGroups`,
  props<{ data: PagedData<TierGroup> }>()
);

export const getTierGroupsFailure = createAction(
  `${prefix} Get Tier Groups Failure | loadingKey=getTierGroups`,
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

export const getProductNames = createAction(
  `${prefix} Get Product Names | loadingKey=getProductNames`
);

export const getProductNamesSuccess = createAction(
  `${prefix} Get Product Names Success | loadingKey=getProductNames`,
  props<{ data: ProductName[] }>()
);

export const getProductNamesFailure = createAction(
  `${prefix} Get Product Names Failure | loadingKey=getProductNames`,
  props<{ error: CommonError }>()
);

export const reset = createAction(`${prefix} Reset Create Edit PointRule`);
