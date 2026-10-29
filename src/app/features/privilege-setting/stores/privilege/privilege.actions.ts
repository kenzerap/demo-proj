import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import {
  PrivilegeSetting,
  PagedPrivilegeSettings,
} from '../../models/privilege-setting-model';
import { PrivilegeSettingsQueryParams } from '../../models/privilege-settings-query-params.model';
import { PrivilegeTypeEnum } from '../../../../shared/utils/enums/privilege-type.enums';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { PagedData } from '@app/shared/models/paged-data.model';

const prefix = '[Privilege Setting]';

export const getPrivilegeSettings = createAction(
  `${prefix} Get Privilege Settings | loadingKey=getPrivilegeSettings`,
  props<{ queryParams: Partial<PrivilegeSettingsQueryParams> }>()
);

export const getPrivilegeSettingsSuccess = createAction(
  `${prefix} Get Privilege Settings Success | loadingKey=getPrivilegeSettings`,
  props<{ pagedData: PagedPrivilegeSettings }>()
);

export const getPrivilegeSettingsFailure = createAction(
  `${prefix} Get Privilege Settings Failure | loadingKey=getPrivilegeSettings`,
  props<{ error: CommonError }>()
);

export const getTargetGroupUserCount = createAction(
  `${prefix} get Target Group User Count Summary | loadingKey=getTargetGroupUserCount`,
  props<{ privilegeType: PrivilegeTypeEnum; page?: number; isGetMore?: boolean }>()
);

export const getTargetGroupUserCountSuccess = createAction(
  `${prefix} get Target Group User Count Summary Success | loadingKey=getTargetGroupUserCount`,
  props<{ pagedData: PagedData<TargetGroupUserCount>; isGetMore?: boolean }>()
);

export const getTargetGroupUserCountFailure = createAction(
  `${prefix} get Target Group User Count Summary Failure | loadingKey=getTargetGroupUserCount`,
  props<{ error: CommonError }>()
);

export const setPrivilegeSettingsFilter = createAction(
  `${prefix} Set Privilege Settings Filter`,
  props<{ filters: Partial<PrivilegeSettingsQueryParams> }>()
);

export const setIsEditOrderMode = createAction(
  `${prefix} Set Is Edit Order Mode`,
  props<{ isEditOrder: boolean }>()
);

export const setOrderDirty = createAction(
  `${prefix} Set Order Dirty`,
  props<{ isDirty: boolean }>()
);

export const updatePrivilegeSettingsOrder = createAction(
  `${prefix} update Popup Announcements Order`,
  props<{ newList: PrivilegeSetting[] }>()
);

export const updatePublishedStatus = createAction(
  `${prefix} update Published Status`,
  props<{ bannerId: number; is_published: boolean }>()
);

export const reOrderPrivilegeSettings = createAction(
  `${prefix} reorder Popup Announcements | loadingKey=reOrderPrivilegeSettings`
);

export const reOrderPrivilegeSettingsSuccess = createAction(
  `${prefix} reOrder Popup Announcements Success | loadingKey=reOrderPrivilegeSettings`
);

export const reOrderPrivilegeSettingsFailure = createAction(
  `${prefix} reOrder Popup Announcements Failure | loadingKey=reOrderPrivilegeSettings`,
  props<{ error: CommonError }>()
);

export const resetVirtualItems = createAction(
  `${prefix} Reset Virtual Items list`
);

export const resetPreviewImages = createAction(
  `${prefix} Reset Preview Image list`
);

export const resetPrivilegeSettings = createAction(
  `${prefix} Reset Privilege Setting list`
);

export const resetAll = createAction(`${prefix} Reset Privilege Setting`);
