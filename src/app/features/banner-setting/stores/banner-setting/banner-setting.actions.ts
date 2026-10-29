import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { PagedBannerSettings } from '../../models/banner-setting-model';
import { BannerSettingsQueryParams } from '../../models/banner-settings-query-params.model';
import { BannerSettingTab } from '../../models/banner-setting-tabs.model';
import { PreviewImage } from '../../models/preview-image.model';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { PagedData } from '@app/shared/models/paged-data.model';

const prefix = '[Banner Setting]';

export const getBannerSettings = createAction(
  `${prefix} Get Banner Settings | loadingKey=getBannerSettings`,
  props<{ queryParams: Partial<BannerSettingsQueryParams> }>()
);

export const getBannerSettingsSuccess = createAction(
  `${prefix} Get Banner Settings Success | loadingKey=getBannerSettings`,
  props<{ pagedData: PagedBannerSettings; canEditOrder: boolean }>()
);

export const getBannerSettingsFailure = createAction(
  `${prefix} Get Banner Settings Failure | loadingKey=getBannerSettings`,
  props<{ error: CommonError }>()
);

export const getBannerSettingTabs = createAction(
  `${prefix} Get Banner Setting Tabs | loadingKey=getBannerSettingTabs`,
  props<{ isDropdownOptions: boolean }>()
);

export const getBannerSettingTabsSuccess = createAction(
  `${prefix} Get Banner Setting Tabs Success | loadingKey=getBannerSettingTabs`,
  props<{ data: BannerSettingTab[]; isDropdownOptions: boolean }>()
);

export const getBannerSettingTabsFailure = createAction(
  `${prefix} Get Banner Setting Tabs Failure | loadingKey=getBannerSettingTabs`,
  props<{ error: CommonError }>()
);

export const getTargetGroupUserCount = createAction(
  `${prefix} get Target Group User Count | loadingKey=getTargetGroupUserCount`,
  props<{ pageId: number; page?: number; isGetMore?: boolean }>()
);

export const getTargetGroupUserCountSuccess = createAction(
  `${prefix} get Target Group User Count Success | loadingKey=getTargetGroupUserCount`,
  props<{ pagedData: PagedData<TargetGroupUserCount>; isGetMore?: boolean }>()
);

export const getTargetGroupUserCountFailure = createAction(
  `${prefix} get Target Group User Count Failure | loadingKey=getTargetGroupUserCount`,
  props<{ error: CommonError }>()
);

export const setBannerSettingsFilter = createAction(
  `${prefix} Set Banner Settings Filter`,
  props<{ filters: Partial<BannerSettingsQueryParams> }>()
);

export const getPublishedImages = createAction(
  `${prefix} Get Published Images | loadingKey=getPublishedImages`
);

export const getPublishedImagesSuccess = createAction(
  `${prefix} Get Published Images Success | loadingKey=getPublishedImages`,
  props<{ previewImages: PreviewImage[] }>()
);

export const getPublishedImagesFailure = createAction(
  `${prefix} Get Published Images Failure | loadingKey=getPublishedImages`,
  props<{ error: CommonError }>()
);

export const updatePublishedImages = createAction(
  `${prefix} Update Published Images`,
  props<{
    previewImages: PreviewImage[];
  }>()
);

export const resetPreviewImages = createAction(
  `${prefix} Reset Preview Image list`
);

export const resetBannerSettings = createAction(
  `${prefix} Reset Banner Setting list`
);

export const resetAll = createAction(`${prefix} Reset Banner Setting`);
