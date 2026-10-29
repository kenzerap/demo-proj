import { createAction, props } from '@ngrx/store';
import {
  PopupAnnouncement,
  PagedPopupAnnouncements,
} from '../../models/popup-announcement-model';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

const prefix = '[Popup Announcement Order]';

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

export const updatePopupAnnouncementsOrder = createAction(
  `${prefix} update Popup Announcements Order`,
  props<{ newList: PopupAnnouncement[] }>()
);

export const getMissingPopupAnnouncements = createAction(
  `${prefix} Get Missing Popup Announcements | loadingKey=getMissingPopupAnnouncements`,
  props<{ pagedData: PagedPopupAnnouncements }>()
);

export const getMissingPopupAnnouncementsSuccess = createAction(
  `${prefix} Get Missing Popup Announcements Success | loadingKey=getMissingPopupAnnouncements`,
  props<{
    data: PopupAnnouncement[];
    virtualPublishedItems?: PopupAnnouncement[];
  }>()
);

export const getMissingPopupAnnouncementsFailure = createAction(
  `${prefix} Get Missing Popup Announcements Failure | loadingKey=getMissingPopupAnnouncements`,
  props<{ error: CommonError }>()
);

export const reOrderPopupAnnouncements = createAction(
  `${prefix} reorder Popup Announcements | loadingKey=reOrderPopupAnnouncements`
);

export const reOrderPopupAnnouncementsSuccess = createAction(
  `${prefix} reOrder Popup Announcements Success | loadingKey=reOrderPopupAnnouncements`
);

export const reOrderPopupAnnouncementsFailure = createAction(
  `${prefix} reOrder Popup Announcements Failure | loadingKey=reOrderPopupAnnouncements`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(
  `${prefix} Reset Popup Announcement Order`
);
