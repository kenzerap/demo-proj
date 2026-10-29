import { createAction, props } from '@ngrx/store';
import {
  BannerSetting,
  PagedBannerSettings,
} from '../../models/banner-setting-model';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

const prefix = '[Banner Setting Order]';

export const setIsEditOrderMode = createAction(
  `${prefix} Set Is Edit Order Mode`,
  props<{ isEditOrder: boolean }>()
);

export const setOrderDirty = createAction(
  `${prefix} Set Order Dirty`,
  props<{ isDirty: boolean }>()
);

export const updatePublishedStatus = createAction(
  `${prefix} update Published Status`,
  props<{ id: number; is_published: boolean }>()
);

export const updateBannerSettingsOrder = createAction(
  `${prefix} update Banner Settings Order`,
  props<{ newList: BannerSetting[] }>()
);

export const getMissingBannerSettings = createAction(
  `${prefix} Get Missing Banner Settings | loadingKey=getMissingBannerSettings`,
  props<{ pagedData: PagedBannerSettings }>()
);

export const getMissingBannerSettingsSuccess = createAction(
  `${prefix} Get Missing Banner Settings Success | loadingKey=getMissingBannerSettings`,
  props<{
    data: BannerSetting[];
    virtualPublishedItems?: BannerSetting[];
  }>()
);

export const getMissingBannerSettingsFailure = createAction(
  `${prefix} Get Missing Banner Settings Failure | loadingKey=getMissingBannerSettings`,
  props<{ error: CommonError }>()
);

export const reOrderBannerSettings = createAction(
  `${prefix} reorder Banner Settings | loadingKey=reOrderBannerSettings`
);

export const reOrderBannerSettingsSuccess = createAction(
  `${prefix} reOrder Banner Settings Success | loadingKey=reOrderBannerSettings`
);

export const reOrderBannerSettingsFailure = createAction(
  `${prefix} reOrder Banner Settings Failure | loadingKey=reOrderBannerSettings`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(`${prefix} Reset Banner Setting Order`);
