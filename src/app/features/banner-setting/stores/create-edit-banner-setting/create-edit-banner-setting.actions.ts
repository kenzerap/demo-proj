import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { Privilege } from '@app/shared/models/privilege.model';
import { CreateEditBannerSettingQueryParams } from '../../models/create-edit-banner-setting-query-params.model';
import { PreviewImage } from '../../models/preview-image.model';
import { TargetGroup } from '@app/shared/models/target-group.model';
import { BannerSettingDetail } from '../../models/banner-setting-model';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TargetGroupsUserSummary } from '@app/shared/models/target-groups-user-summary.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';

const prefix = '[Create Edit Banner Setting]';

export const createBannerSetting = createAction(
  `${prefix} Create Banner Setting | loadingKey=createBannerSetting`,
  props<{ data: Partial<CreateEditBannerSettingQueryParams>; file: File }>()
);

export const createBannerSettingSuccess = createAction(
  `${prefix} Create Banner Setting Success | loadingKey=createBannerSetting`
);

export const createBannerSettingFailure = createAction(
  `${prefix} Create Banner Setting Failure | loadingKey=createBannerSetting`,
  props<{ messageData: ToastMessageData }>()
);

export const updateBannerSetting = createAction(
  `${prefix} update banner setting | loadingKey=updateBannerSetting`,
  props<{ data: Partial<CreateEditBannerSettingQueryParams>; file: File }>()
);

export const updateBannerSettingSuccess = createAction(
  `${prefix} update banner setting Success | loadingKey=updateBannerSetting`
);

export const updateBannerSettingFailure = createAction(
  `${prefix} update banner setting Failure | loadingKey=updateBannerSetting`,
  props<{ messageData: ToastMessageData }>()
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

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const setPreviewImages = createAction(
  `${prefix} Set Preview Images`,
  props<{ images: PreviewImage[] }>()
);

export const getBannerSettingDetail = createAction(
  `${prefix} Get Banner Setting Detail | loadingKey=getBannerSettingDetail`,
  props<{ id: number }>()
);

export const getBannerSettingDetailSuccess = createAction(
  `${prefix} Get Banner Setting Detail Success | loadingKey=getBannerSettingDetail`,
  props<{ bannerSetting: BannerSettingDetail }>()
);

export const getBannerSettingDetailFailure = createAction(
  `${prefix} Get Banner Setting Detail Failure | loadingKey=getBannerSettingDetail`,
  props<{ error: CommonError }>()
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

export const getSegmentGroups = createAction(
  `${prefix} Get Segment Groups | loadingKey=getSegmentGroups`,
  props<{ page: number; size: number }>()
);

export const getSegmentGroupsSuccess = createAction(
  `${prefix} Get Segment Groups Success | loadingKey=getSegmentGroups`,
  props<{ data: PagedData<SegmentGroup> }>()
);

export const getSegmentGroupsFailure = createAction(
  `${prefix} Get Segment Groups Failure | loadingKey=getSegmentGroups`,
  props<{ error: CommonError }>()
);

export const getTargetGroupUserSummary = createAction(
  `${prefix} get Target Group User Summary | loadingKey=getTargetGroupUserSummary`,
  props<{ target_group_id: number }>()
);

export const getTargetGroupUserSummarySuccess = createAction(
  `${prefix} get Target Group User Summary Success | loadingKey=getTargetGroupUserSummary`,
  props<{ data: TargetGroupsUserSummary }>()
);

export const getTargetGroupUserSummaryFailure = createAction(
  `${prefix} get Target Group User Summary Failure | loadingKey=getTargetGroupUserSummary`,
  props<{ error: CommonError }>()
);

export const setIncludeExcludeSegmentTier = createAction(
  `${prefix} set Include Exclude Segment Tier`,
  props<{ items: TierSegmentIncludeExclude[] }>()
);

export const resetAll = createAction(
  `${prefix} Reset Create Edit Banner Setting`
);
