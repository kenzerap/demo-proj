import { createReducer, on } from '@ngrx/store';
import * as PopupAnnouncementActions from './popup-announcement.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PopupAnnouncement } from '../../models/popup-announcement-model';
import { PopupAnnouncementTab } from '../../models/popup-announcement-tabs.model';
import { PopupAnnouncementsQueryParams } from '../../models/popup-announcements-query-params.model';
import { PreviewImage } from '../../models/preview-image.model';
import { v4 as uuidv4 } from 'uuid';
import { Pagination } from '@app/shared/models/paged-data.model';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';

export const featureKey = 'popupAnnouncements';

export interface State {
  popupAnnouncements: EntityState<PopupAnnouncement>;
  pagination: Pagination;
  filters: Partial<PopupAnnouncementsQueryParams>;
  popupAnnouncementTabs: PopupAnnouncementTab[];
  previewImages: EntityState<PreviewImage>;
  targetGroupUserCounts: EntityState<TargetGroupUserCount>;
  targetGroupUserCountsPagination: Pagination;
}

export const popupAnnouncementsAdapter: EntityAdapter<PopupAnnouncement> =
  createEntityAdapter<PopupAnnouncement>({
    selectId: (popupAnnouncement: PopupAnnouncement) =>
      popupAnnouncement.bannerId,
  });

export const previewImagesAdapter: EntityAdapter<PreviewImage> =
  createEntityAdapter<PreviewImage>({
    selectId: () => uuidv4(),
  });
export const targetGroupUserCountsAdapter: EntityAdapter<TargetGroupUserCount> =
  createEntityAdapter<TargetGroupUserCount>({
    selectId: () => uuidv4(),
  });

export const initialState: State = {
  popupAnnouncements: popupAnnouncementsAdapter.getInitialState(),
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
  filters: {
    page: 0,
    size: 20,
  },
  popupAnnouncementTabs: [],
  targetGroupUserCounts: targetGroupUserCountsAdapter.getInitialState(),
  targetGroupUserCountsPagination: {
    page: 0,
    size: 5,
    totalItems: 0,
    totalPages: 0,
  },
  previewImages: previewImagesAdapter.getInitialState(),
};

export const reducer = createReducer(
  initialState,
  on(
    PopupAnnouncementActions.getPopupAnnouncementsSuccess,
    (state, { pagedData }) => {
      return {
        ...state,
        popupAnnouncements: popupAnnouncementsAdapter.setAll(
          pagedData.data,
          state.popupAnnouncements
        ),
        pagination: {
          ...pagedData.pagination,
        },
      };
    }
  ),
  on(PopupAnnouncementActions.getPopupAnnouncementTabs, (state) => {
    return {
      ...state,
      popupAnnouncementTabs: [],
    };
  }),
  on(
    PopupAnnouncementActions.getPopupAnnouncementTabsSuccess,
    (state, { data }) => {
      return {
        ...state,
        popupAnnouncementTabs: data,
      };
    }
  ),
  on(
    PopupAnnouncementActions.getTargetGroupUserCountSuccess,
    (state, { pagedData, isGetMore }) => {
      const targetGroupUserCounts = pagedData.data.map((item) => {
        return { ...item, id: uuidv4() };
      });

      if (isGetMore) {
        return {
          ...state,
          targetGroupUserCounts: targetGroupUserCountsAdapter.addMany(
            targetGroupUserCounts,
            state.targetGroupUserCounts
          ),
          targetGroupUserCountsPagination: {
            ...pagedData.pagination,
          },
        };
      }

      return {
        ...state,
        targetGroupUserCounts: targetGroupUserCountsAdapter.setAll(
          targetGroupUserCounts,
          state.targetGroupUserCounts
        ),
        targetGroupUserCountsPagination: {
          ...pagedData.pagination,
        },
      };
    }
  ),
  on(
    PopupAnnouncementActions.setPopupAnnouncementsFilter,
    (state, { filters }) => {
      return {
        ...state,
        filters: {
          page: filters.page !== undefined ? filters.page : state.filters.page,
          size: filters.size !== undefined ? filters.size : state.filters.size,
          pageId:
            filters.pageId !== undefined
              ? filters.pageId
              : state.filters.pageId,
          targetGroupIds:
            filters.targetGroupIds !== undefined
              ? filters.targetGroupIds
              : state.filters.targetGroupIds,
        },
      };
    }
  ),
  on(
    PopupAnnouncementActions.getPublishedImagesSuccess,
    PopupAnnouncementActions.updatePublishedImages,
    (state, { previewImages }) => {
      return {
        ...state,
        previewImages: previewImagesAdapter.setAll(
          previewImages,
          state.previewImages
        ),
      };
    }
  ),
  on(PopupAnnouncementActions.resetPreviewImages, (state) => {
    return {
      ...state,
      previewImages: previewImagesAdapter.getInitialState(),
    };
  }),
  on(PopupAnnouncementActions.resetPopupAnnouncements, (state) => {
    return {
      ...state,
      popupAnnouncements: popupAnnouncementsAdapter.getInitialState(),
      pagination: {
        page: 0,
        size: 20,
        totalItems: 0,
        totalPages: 0,
      },
      filters: {
        page: 0,
        size: 20,
        targetGroupIds: [1],
      },
      previewImages: previewImagesAdapter.getInitialState(),
    };
  }),
  on(PopupAnnouncementActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
