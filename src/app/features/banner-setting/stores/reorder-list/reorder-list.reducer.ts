import { createReducer, on } from '@ngrx/store';
import * as BannerSettingOrderActions from './reorder-list.actions';
import * as BannerSettingActions from '../banner-setting/banner-setting.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  BannerSetting,
  PagedBannerSettings,
} from '../../models/banner-setting-model';
import { Pagination } from '@app/shared/models/paged-data.model';

export const featureKey = 'bannerSettingOrder';

export interface State {
  isEditOrderMode: boolean;
  isOrderDirty: boolean;
  lastDisplayOrder: number;
  realPublishedItems: EntityState<BannerSetting>;
  virtualPublishedItems: EntityState<BannerSetting>;
  virtualUnPublishedItems: EntityState<BannerSetting>;
  virtualBannerSettings: EntityState<BannerSetting>;
  virtualPreviousPageLastDisplayOrder: number;
  virtualLastDisplayOrder: number;
  pagination: Pagination;
}

export const bannerSettingsAdapter: EntityAdapter<BannerSetting> =
  createEntityAdapter<BannerSetting>({
    selectId: (bannerSetting: BannerSetting) => bannerSetting.banner_id,
  });

export const orderedBannerSettingsAdapter: EntityAdapter<BannerSetting> =
  createEntityAdapter<BannerSetting>({
    selectId: (bannerSetting: BannerSetting) => bannerSetting.banner_id,
    sortComparer: (a, b) => {
      if (a.is_published === b.is_published) {
        return !a.display_order || !b.display_order
          ? 1
          : a.display_order - b.display_order;
      }
      return a.is_published ? -1 : 1;
    },
  });

const { selectAll } = bannerSettingsAdapter.getSelectors();

export const initialState: State = {
  isEditOrderMode: false,
  isOrderDirty: false,
  lastDisplayOrder: 0,
  realPublishedItems: orderedBannerSettingsAdapter.getInitialState(),
  virtualPublishedItems: orderedBannerSettingsAdapter.getInitialState(),
  virtualUnPublishedItems: bannerSettingsAdapter.getInitialState(),
  virtualBannerSettings: bannerSettingsAdapter.getInitialState(),
  virtualPreviousPageLastDisplayOrder: 0,
  virtualLastDisplayOrder: 0,
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
};

export const reducer = createReducer(
  initialState,
  on(BannerSettingOrderActions.setIsEditOrderMode, (state, { isEditOrder }) => {
    return {
      ...state,
      isEditOrderMode: isEditOrder,
    };
  }),
  on(BannerSettingOrderActions.setOrderDirty, (state, { isDirty }) => {
    return {
      ...state,
      isOrderDirty: isDirty,
    };
  }),
  on(
    BannerSettingActions.getBannerSettingsSuccess,
    (state, { pagedData, canEditOrder }) => {
      if (!canEditOrder) {
        return {
          ...initialState,
        };
      }

      const {
        realPublishedItems,
        virtualPublishedItems,
        virtualPreviousPageLastDisplayOrder,
        virtualLastDisplayOrder,
      } = initNeededValues(pagedData, state);

      return {
        ...state,
        lastDisplayOrder: pagedData.lastDisplayOrder,
        pagination: pagedData.pagination,
        realPublishedItems,
        virtualPublishedItems,
        virtualPreviousPageLastDisplayOrder,
        virtualLastDisplayOrder,
      };
    }
  ),
  on(
    BannerSettingOrderActions.getMissingBannerSettingsSuccess,
    (state, { data, virtualPublishedItems }) => {
      let tempvirtualPublishedItems = state.virtualPublishedItems;
      if (!!virtualPublishedItems) {
        const pagedItems = virtualPublishedItems.map((item, index) => {
          const pagePosition = Math.floor(index / state.pagination.size);

          return {
            ...item,
            pagePosition,
            display_order: index + 1,
          };
        });

        tempvirtualPublishedItems = orderedBannerSettingsAdapter.setAll(
          pagedItems,
          tempvirtualPublishedItems
        );
      }

      const { newItems, newPublishedItems } = reOrderItems(
        data,
        tempvirtualPublishedItems,
        state.virtualUnPublishedItems,
        state.virtualPreviousPageLastDisplayOrder
      );
      return {
        ...state,
        virtualBannerSettings: bannerSettingsAdapter.setAll(
          newItems,
          state.virtualBannerSettings
        ),
        virtualPublishedItems: newPublishedItems,
      };
    }
  ),
  on(
    BannerSettingOrderActions.updatePublishedStatus,
    (state, { id, is_published }) => {
      const banner = state.virtualBannerSettings.entities[id] as BannerSetting;
      let updatedPublishedItems: EntityState<BannerSetting> =
        state.virtualPublishedItems;
      let updatedUnPublishedItems: EntityState<BannerSetting> =
        state.virtualUnPublishedItems;

      if (is_published) {
        // get highest display order in current page
        const highestDisplayOrderItem = selectAll(
          state.virtualBannerSettings
        ).reduce((max, item) =>
          (item.display_order || 0) > (max.display_order || 0) ? item : max
        );

        updatedPublishedItems = orderedBannerSettingsAdapter.addOne(
          {
            ...banner,
            is_published: true,
            display_order: !highestDisplayOrderItem.display_order
              ? state.virtualPreviousPageLastDisplayOrder + 1
              : highestDisplayOrderItem.display_order + 1,
            pagePosition: state.pagination.page,
          },
          state.virtualPublishedItems
        );

        updatedUnPublishedItems = bannerSettingsAdapter.removeOne(
          id,
          state.virtualUnPublishedItems
        );
      } else {
        updatedPublishedItems = orderedBannerSettingsAdapter.removeOne(
          id,
          state.virtualPublishedItems
        );

        if (state.realPublishedItems.entities[id]) {
          updatedUnPublishedItems = bannerSettingsAdapter.addOne(
            { ...banner, is_published: false, display_order: null },
            state.virtualUnPublishedItems
          );
        }
      }

      const updatedBannerSettings = bannerSettingsAdapter.updateOne(
        {
          id,
          changes: {
            is_published,
            display_order: is_published
              ? updatedPublishedItems.entities[id]?.display_order
              : null,
          },
        },
        state.virtualBannerSettings
      );

      const { newItems, newPublishedItems } = reOrderItems(
        selectAll(updatedBannerSettings),
        updatedPublishedItems,
        updatedUnPublishedItems,
        state.virtualPreviousPageLastDisplayOrder
      );

      return {
        ...state,
        isOrderDirty: true,
        virtualPublishedItems: newPublishedItems,
        virtualUnPublishedItems: updatedUnPublishedItems,
        virtualBannerSettings: bannerSettingsAdapter.setAll(
          newItems,
          state.virtualBannerSettings
        ),
        virtualLastDisplayOrder: is_published
          ? state.virtualLastDisplayOrder + 1
          : state.virtualLastDisplayOrder - 1,
      };
    }
  ),
  on(
    BannerSettingOrderActions.updateBannerSettingsOrder,
    (state, { newList }) => {
      const { newItems, newPublishedItems } = reOrderItems(
        newList,
        state.virtualPublishedItems,
        state.virtualUnPublishedItems,
        state.virtualPreviousPageLastDisplayOrder
      );

      return {
        ...state,
        isOrderDirty: true,
        virtualPublishedItems: newPublishedItems,
        virtualBannerSettings: bannerSettingsAdapter.setAll(
          newItems,
          state.virtualBannerSettings
        ),
      };
    }
  ),
  on(
    BannerSettingOrderActions.resetAll,
    BannerSettingOrderActions.reOrderBannerSettingsSuccess,
    () => {
      return {
        ...initialState,
      };
    }
  )
);

const reOrderItems = (
  items: BannerSetting[],
  publishedItems: EntityState<BannerSetting>,
  unPublishedItems: EntityState<BannerSetting>,
  lastDisplayOrder: number = 0
) => {
  let reOrderedPublishedItems: BannerSetting[] = [];

  let displayOrder = lastDisplayOrder + 1;

  items
    .filter((item) => item.is_published)
    .forEach((item) => {
      reOrderedPublishedItems.push({
        ...item,
        display_order: displayOrder,
      });

      displayOrder += 1;
    });

  const updatedPublishedItems = orderedBannerSettingsAdapter.updateMany(
    reOrderedPublishedItems.map((item) => ({
      id: item.banner_id,
      changes: { display_order: item.display_order },
    })),
    publishedItems
  );
  const savedUnpublishedItems = items.filter(
    (item) => !item.is_published && unPublishedItems.ids[item.banner_id]
  );
  const unSavedUnpublishedItems = items.filter(
    (item) => !item.is_published && !unPublishedItems.ids[item.banner_id]
  );

  return {
    newItems: [
      ...reOrderedPublishedItems,
      ...savedUnpublishedItems,
      ...unSavedUnpublishedItems,
    ],
    newPublishedItems: updatedPublishedItems,
  };
};

const initNeededValues = (pagedData: PagedBannerSettings, state: State) => {
  const newData = pagedData.data.map((item) => {
    return { ...item, pagePosition: pagedData.pagination.page };
  });
  const publishedItems = newData.filter((item) => item.is_published);
  const publistItemsFiltered = publishedItems.filter(
    (item) =>
      !state.virtualUnPublishedItems.entities[item.banner_id] &&
      !state.virtualPublishedItems.entities[item.banner_id]
  );

  const realPublishedItems = orderedBannerSettingsAdapter.upsertMany(
    publishedItems,
    state.realPublishedItems
  );
  const virtualPublishedItems = orderedBannerSettingsAdapter.upsertMany(
    publistItemsFiltered,
    state.virtualPublishedItems
  );

  let virtualLastDisplayOrder = 0;
  let virtualLastPageDisplayOrder = 0;
  let virtualPreviousPageLastDisplayOrder = 0;

  const modifiedPublishedItems =
    realPublishedItems.ids.length - state.virtualUnPublishedItems.ids.length;
  const unsavedPublishedItems =
    virtualPublishedItems.ids.length - modifiedPublishedItems > 0
      ? virtualPublishedItems.ids.length - modifiedPublishedItems
      : 0;
  virtualLastDisplayOrder =
    pagedData.lastDisplayOrder +
    unsavedPublishedItems -
    state.virtualUnPublishedItems.ids.length;
  const itemIndex =
    virtualLastDisplayOrder - 1 < 0 ? 0 : virtualLastDisplayOrder - 1;
  virtualLastPageDisplayOrder = Math.floor(
    itemIndex / pagedData.pagination.size
  );

  // calculate virtualPreviousPageLastDisplayOrder in case current page is less than or equal or greater than to virtualLastPageDisplayOrder
  if (pagedData.pagination.page <= virtualLastPageDisplayOrder) {
    const previousPage = pagedData.pagination.page - 1;
    const maxLastPageItemsCount =
      pagedData.pagination.page === 0
        ? 0
        : previousPage * pagedData.pagination.size + pagedData.pagination.size;
    virtualPreviousPageLastDisplayOrder = maxLastPageItemsCount;
  } else {
    virtualPreviousPageLastDisplayOrder = virtualLastDisplayOrder;
  }

  return {
    realPublishedItems,
    virtualPublishedItems,
    virtualPreviousPageLastDisplayOrder,
    virtualLastDisplayOrder,
  };
};
