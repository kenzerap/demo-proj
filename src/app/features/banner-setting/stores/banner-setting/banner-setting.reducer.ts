import { createReducer, on } from '@ngrx/store';
import * as BannerSettingActions from './banner-setting.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { BannerSetting } from '../../models/banner-setting-model';
import { BannerSettingTab } from '../../models/banner-setting-tabs.model';
import { BannerSettingsQueryParams } from '../../models/banner-settings-query-params.model';
import { PreviewImage } from '../../models/preview-image.model';
import { v4 as uuidv4 } from 'uuid';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { Pagination } from '@app/shared/models/paged-data.model';

export const featureKey = 'bannerSettings';

export interface State {
  bannerSettings: EntityState<BannerSetting>;
  pagination: Pagination;
  filters: Partial<BannerSettingsQueryParams>;
  bannerSettingTabs: BannerSettingTab[];
  previewImages: EntityState<PreviewImage>;
  targetGroupUserCounts: EntityState<TargetGroupUserCount>;
  targetGroupUserCountsPagination: Pagination;
}

export const bannerSettingsAdapter: EntityAdapter<BannerSetting> =
  createEntityAdapter<BannerSetting>({
    selectId: (bannerSetting: BannerSetting) => bannerSetting.banner_id,
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
  bannerSettings: bannerSettingsAdapter.getInitialState(),
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
  bannerSettingTabs: [],
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
  on(BannerSettingActions.getBannerSettingsSuccess, (state, { pagedData }) => {
    return {
      ...state,
      bannerSettings: bannerSettingsAdapter.setAll(
        pagedData.data,
        state.bannerSettings
      ),
      pagination: {
        ...pagedData.pagination,
      },
    };
  }),
  on(BannerSettingActions.getBannerSettingTabs, (state) => {
    return {
      ...state,
      bannerSettingTabs: [],
    };
  }),
  on(BannerSettingActions.getBannerSettingTabsSuccess, (state, { data }) => {
    return {
      ...state,
      bannerSettingTabs: data,
    };
  }),
  on(
    BannerSettingActions.getTargetGroupUserCountSuccess,
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
  on(BannerSettingActions.setBannerSettingsFilter, (state, { filters }) => {
    return {
      ...state,
      filters: {
        page: filters.page !== undefined ? filters.page : state.filters.page,
        size: filters.size !== undefined ? filters.size : state.filters.size,
        page_id:
          filters.page_id !== undefined
            ? filters.page_id
            : state.filters.page_id,
        target_group_ids:
          filters.target_group_ids !== undefined
            ? filters.target_group_ids
            : state.filters.target_group_ids,
      },
    };
  }),
  on(
    BannerSettingActions.getPublishedImagesSuccess,
    BannerSettingActions.updatePublishedImages,
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
  on(BannerSettingActions.resetPreviewImages, (state) => {
    return {
      ...state,
      previewImages: previewImagesAdapter.getInitialState(),
    };
  }),
  on(BannerSettingActions.resetBannerSettings, (state) => {
    return {
      ...state,
      bannerSettings: bannerSettingsAdapter.getInitialState(),
      pagination: {
        page: 0,
        size: 20,
        totalItems: 0,
        totalPages: 0,
      },
      filters: {
        page: 0,
        size: 20,
        target_group_ids: [1],
      },
      previewImages: previewImagesAdapter.getInitialState(),
    };
  }),
  on(BannerSettingActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
