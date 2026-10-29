import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { PagedPopupAnnouncements } from '../../models/popup-announcement-model';
import { PopupAnnouncementsQueryParams } from '../../models/popup-announcements-query-params.model';
import { PopupAnnouncementTab } from '../../models/popup-announcement-tabs.model';
import { PreviewImage } from '../../models/preview-image.model';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { PagedData } from '@app/shared/models/paged-data.model';

const prefix = '[Popup Announcement]';

export const getPopupAnnouncements = createAction(
  `${prefix} Get Popup Announcements | loadingKey=getPopupAnnouncements`,
  props<{ queryParams: Partial<PopupAnnouncementsQueryParams> }>()
);

export const getPopupAnnouncementsSuccess = createAction(
  `${prefix} Get Popup Announcements Success | loadingKey=getPopupAnnouncements`,
  props<{ pagedData: PagedPopupAnnouncements; canEditOrder: boolean }>()
);

export const getPopupAnnouncementsFailure = createAction(
  `${prefix} Get Popup Announcements Failure | loadingKey=getPopupAnnouncements`,
  props<{ error: CommonError }>()
);

export const getPopupAnnouncementTabs = createAction(
  `${prefix} Get Popup Announcement Tabs | loadingKey=getPopupAnnouncementTabs`,
  props<{ isDropdownOptions: boolean }>()
);

export const getPopupAnnouncementTabsSuccess = createAction(
  `${prefix} Get Popup Announcement Tabs Success | loadingKey=getPopupAnnouncementTabs`,
  props<{ data: PopupAnnouncementTab[]; isDropdownOptions: boolean }>()
);

export const getPopupAnnouncementTabsFailure = createAction(
  `${prefix} Get Popup Announcement Tabs Failure | loadingKey=getPopupAnnouncementTabs`,
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

export const setPopupAnnouncementsFilter = createAction(
  `${prefix} Set Popup Announcements Filter`,
  props<{ filters: Partial<PopupAnnouncementsQueryParams> }>()
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

export const resetPopupAnnouncements = createAction(
  `${prefix} Reset Popup Announcement list`
);

export const resetAll = createAction(`${prefix} Reset Popup Announcement`);
