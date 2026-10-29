import { createReducer, on } from '@ngrx/store';
import * as PopupAnnouncementOrderActions from './reorder-list.actions';
import * as PopupAnnouncementActions from '../popup-announcement/popup-announcement.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  PopupAnnouncement,
  PagedPopupAnnouncements,
} from '../../models/popup-announcement-model';
import { Pagination } from '@app/shared/models/paged-data.model';

export const featureKey = 'popupAnnouncementOrder';

export interface State {
  isEditOrderMode: boolean;
  isOrderDirty: boolean;
  lastDisplayOrder: number | null;
  realPublishedItems: EntityState<PopupAnnouncement>;
  virtualPublishedItems: EntityState<PopupAnnouncement>;
  virtualUnPublishedItems: EntityState<PopupAnnouncement>;
  virtualPopupAnnouncements: EntityState<PopupAnnouncement>;
  virtualPreviousPageLastDisplayOrder: number;
  virtualLastDisplayOrder: number;
  pagination: Pagination;
}

export const popupAnnouncementsAdapter: EntityAdapter<PopupAnnouncement> =
  createEntityAdapter<PopupAnnouncement>({
    selectId: (popupAnnouncement: PopupAnnouncement) =>
      popupAnnouncement.bannerId,
  });

export const orderedPopupAnnouncementsAdapter: EntityAdapter<PopupAnnouncement> =
  createEntityAdapter<PopupAnnouncement>({
    selectId: (popupAnnouncement: PopupAnnouncement) =>
      popupAnnouncement.bannerId,
    sortComparer: (a, b) => {
      if (a.isPublished === b.isPublished) {
        return !a.displayOrder || !b.displayOrder
          ? 1
          : a.displayOrder - b.displayOrder;
      }
      return a.isPublished ? -1 : 1;
    },
  });

const { selectAll } = popupAnnouncementsAdapter.getSelectors();

export const initialState: State = {
  isEditOrderMode: false,
  isOrderDirty: false,
  lastDisplayOrder: 0,
  realPublishedItems: orderedPopupAnnouncementsAdapter.getInitialState(),
  virtualPublishedItems: orderedPopupAnnouncementsAdapter.getInitialState(),
  virtualUnPublishedItems: popupAnnouncementsAdapter.getInitialState(),
  virtualPopupAnnouncements: popupAnnouncementsAdapter.getInitialState(),
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
  on(
    PopupAnnouncementOrderActions.setIsEditOrderMode,
    (state, { isEditOrder }) => {
      return {
        ...state,
        isEditOrderMode: isEditOrder,
      };
    }
  ),
  on(PopupAnnouncementOrderActions.setOrderDirty, (state, { isDirty }) => {
    return {
      ...state,
      isOrderDirty: isDirty,
    };
  }),
  on(
    PopupAnnouncementActions.getPopupAnnouncementsSuccess,
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
    PopupAnnouncementOrderActions.getMissingPopupAnnouncementsSuccess,
    (state, { data, virtualPublishedItems }) => {
      let tempvirtualPublishedItems = state.virtualPublishedItems;
      if (!!virtualPublishedItems) {
        const pagedItems = virtualPublishedItems.map((item, index) => {
          const pagePosition = Math.floor(index / state.pagination.size);

          return {
            ...item,
            pagePosition,
            displayOrder: index + 1,
          };
        });

        tempvirtualPublishedItems = orderedPopupAnnouncementsAdapter.setAll(
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
        virtualPopupAnnouncements: popupAnnouncementsAdapter.setAll(
          newItems,
          state.virtualPopupAnnouncements
        ),
        virtualPublishedItems: newPublishedItems,
      };
    }
  ),
  on(
    PopupAnnouncementOrderActions.updatePublishedStatus,
    (state, { id, is_published }) => {
      const banner = state.virtualPopupAnnouncements.entities[
        id
      ] as PopupAnnouncement;
      let updatedPublishedItems: EntityState<PopupAnnouncement> =
        state.virtualPublishedItems;
      let updatedUnPublishedItems: EntityState<PopupAnnouncement> =
        state.virtualUnPublishedItems;

      if (is_published) {
        // get highest display order in current page
        const highestDisplayOrderItem = selectAll(
          state.virtualPopupAnnouncements
        ).reduce((max, item) =>
          (item.displayOrder || 0) > (max.displayOrder || 0) ? item : max
        );

        updatedPublishedItems = orderedPopupAnnouncementsAdapter.addOne(
          {
            ...banner,
            isPublished: true,
            displayOrder: !highestDisplayOrderItem.displayOrder
              ? state.virtualPreviousPageLastDisplayOrder + 1
              : highestDisplayOrderItem.displayOrder + 1,
            pagePosition: state.pagination.page,
          },
          state.virtualPublishedItems
        );

        updatedUnPublishedItems = popupAnnouncementsAdapter.removeOne(
          id,
          state.virtualUnPublishedItems
        );
      } else {
        updatedPublishedItems = orderedPopupAnnouncementsAdapter.removeOne(
          id,
          state.virtualPublishedItems
        );

        if (state.realPublishedItems.entities[id]) {
          updatedUnPublishedItems = popupAnnouncementsAdapter.addOne(
            { ...banner, isPublished: false, displayOrder: null },
            state.virtualUnPublishedItems
          );
        }
      }

      const updatedPopupAnnouncements = popupAnnouncementsAdapter.updateOne(
        {
          id,
          changes: {
            isPublished: is_published,
            displayOrder: is_published
              ? updatedPublishedItems.entities[id]?.displayOrder
              : null,
          },
        },
        state.virtualPopupAnnouncements
      );

      const { newItems, newPublishedItems } = reOrderItems(
        selectAll(updatedPopupAnnouncements),
        updatedPublishedItems,
        updatedUnPublishedItems,
        state.virtualPreviousPageLastDisplayOrder
      );

      return {
        ...state,
        isOrderDirty: true,
        virtualPublishedItems: newPublishedItems,
        virtualUnPublishedItems: updatedUnPublishedItems,
        virtualPopupAnnouncements: popupAnnouncementsAdapter.setAll(
          newItems,
          state.virtualPopupAnnouncements
        ),
        virtualLastDisplayOrder: is_published
          ? state.virtualLastDisplayOrder + 1
          : state.virtualLastDisplayOrder - 1,
      };
    }
  ),
  on(
    PopupAnnouncementOrderActions.updatePopupAnnouncementsOrder,
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
        virtualPopupAnnouncements: popupAnnouncementsAdapter.setAll(
          newItems,
          state.virtualPopupAnnouncements
        ),
      };
    }
  ),
  on(
    PopupAnnouncementOrderActions.resetAll,
    PopupAnnouncementOrderActions.reOrderPopupAnnouncementsSuccess,
    () => {
      return {
        ...initialState,
      };
    }
  )
);

const reOrderItems = (
  items: PopupAnnouncement[],
  publishedItems: EntityState<PopupAnnouncement>,
  unPublishedItems: EntityState<PopupAnnouncement>,
  lastDisplayOrder: number = 0
) => {
  let reOrderedPublishedItems: PopupAnnouncement[] = [];

  let displayOrder = lastDisplayOrder + 1;

  items
    .filter((item) => item.isPublished)
    .forEach((item) => {
      reOrderedPublishedItems.push({
        ...item,
        displayOrder: displayOrder,
      });

      displayOrder += 1;
    });

  const updatedPublishedItems = orderedPopupAnnouncementsAdapter.updateMany(
    reOrderedPublishedItems.map((item) => ({
      id: item.bannerId,
      changes: { displayOrder: item.displayOrder },
    })),
    publishedItems
  );
  const savedUnpublishedItems = items.filter(
    (item) => !item.isPublished && unPublishedItems.ids[item.bannerId]
  );
  const unSavedUnpublishedItems = items.filter(
    (item) => !item.isPublished && !unPublishedItems.ids[item.bannerId]
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

const initNeededValues = (pagedData: PagedPopupAnnouncements, state: State) => {
  const newData = pagedData.data.map((item) => {
    return { ...item, pagePosition: pagedData.pagination.page };
  });
  const publishedItems = newData.filter((item) => item.isPublished);
  const publistItemsFiltered = publishedItems.filter(
    (item) =>
      !state.virtualUnPublishedItems.entities[item.bannerId] &&
      !state.virtualPublishedItems.entities[item.bannerId]
  );

  const realPublishedItems = orderedPopupAnnouncementsAdapter.upsertMany(
    publishedItems,
    state.realPublishedItems
  );
  const virtualPublishedItems = orderedPopupAnnouncementsAdapter.upsertMany(
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
    (pagedData.lastDisplayOrder || 0) +
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
