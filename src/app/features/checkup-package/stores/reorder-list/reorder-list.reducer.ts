import { createReducer, on } from '@ngrx/store';
import * as CheckupPackageOrderActions from './reorder-list.actions';
import * as CheckupPackageActions from '../checkup-package-list/checkup-package-list.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Pagination } from '@app/shared/models/paged-data.model';
import {
  CheckupPackage,
  PagedCheckupPackage,
} from '../../models/checkup-package.model';

export const featureKey = 'checkupPackageOrder';

export interface State {
  isEditOrderMode: boolean;
  isOrderDirty: boolean;
  lastDisplayOrder: number | null;
  realPublishedItems: EntityState<CheckupPackage>;
  virtualPublishedItems: EntityState<CheckupPackage>;
  virtualUnPublishedItems: EntityState<CheckupPackage>;
  virtualCheckupPackages: EntityState<CheckupPackage>;
  virtualPreviousPageLastDisplayOrder: number;
  virtualLastDisplayOrder: number;
  pagination: Pagination;
}

export const checkupPackagesAdapter: EntityAdapter<CheckupPackage> =
  createEntityAdapter<CheckupPackage>({
    selectId: (checkupPackage: CheckupPackage) => checkupPackage.id,
  });

export const orderedCheckupPackagesAdapter: EntityAdapter<CheckupPackage> =
  createEntityAdapter<CheckupPackage>({
    selectId: (checkupPackage: CheckupPackage) => checkupPackage.id,
    sortComparer: (a, b) => {
      if (a.is_published === b.is_published) {
        return !a.display_order || !b.display_order
          ? 1
          : a.display_order - b.display_order;
      }
      return a.is_published ? -1 : 1;
    },
  });

const { selectAll } = checkupPackagesAdapter.getSelectors();

export const initialState: State = {
  isEditOrderMode: false,
  isOrderDirty: false,
  lastDisplayOrder: 0,
  realPublishedItems: orderedCheckupPackagesAdapter.getInitialState(),
  virtualPublishedItems: orderedCheckupPackagesAdapter.getInitialState(),
  virtualUnPublishedItems: checkupPackagesAdapter.getInitialState(),
  virtualCheckupPackages: checkupPackagesAdapter.getInitialState(),
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
    CheckupPackageOrderActions.setIsEditOrderMode,
    (state, { isEditOrder }) => {
      return {
        ...state,
        isEditOrderMode: isEditOrder,
      };
    }
  ),
  on(CheckupPackageOrderActions.setOrderDirty, (state, { isDirty }) => {
    return {
      ...state,
      isOrderDirty: isDirty,
    };
  }),
  on(
    CheckupPackageActions.getCheckupPackgageSuccess,
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
    CheckupPackageOrderActions.getMissingCheckupPackagesSuccess,
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

        tempvirtualPublishedItems = orderedCheckupPackagesAdapter.setAll(
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
        virtualCheckupPackages: checkupPackagesAdapter.setAll(
          newItems,
          state.virtualCheckupPackages
        ),
        virtualPublishedItems: newPublishedItems,
      };
    }
  ),
  on(
    CheckupPackageOrderActions.updatePublishedStatus,
    (state, { id, is_published }) => {
      const banner = state.virtualCheckupPackages.entities[
        id
      ] as CheckupPackage;
      let updatedPublishedItems: EntityState<CheckupPackage> =
        state.virtualPublishedItems;
      let updatedUnPublishedItems: EntityState<CheckupPackage> =
        state.virtualUnPublishedItems;

      if (is_published) {
        // get highest display order in current page
        const highestDisplayOrderItem = selectAll(
          state.virtualCheckupPackages
        ).reduce((max, item) =>
          (item.display_order || 0) > (max.display_order || 0) ? item : max
        );

        updatedPublishedItems = orderedCheckupPackagesAdapter.addOne(
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

        updatedUnPublishedItems = checkupPackagesAdapter.removeOne(
          id,
          state.virtualUnPublishedItems
        );
      } else {
        updatedPublishedItems = orderedCheckupPackagesAdapter.removeOne(
          id,
          state.virtualPublishedItems
        );

        if (state.realPublishedItems.entities[id]) {
          updatedUnPublishedItems = checkupPackagesAdapter.addOne(
            { ...banner, is_published: false, display_order: null },
            state.virtualUnPublishedItems
          );
        }
      }

      const updatedCheckupPackages = checkupPackagesAdapter.updateOne(
        {
          id,
          changes: {
            is_published: is_published,
            display_order: is_published
              ? updatedPublishedItems.entities[id]?.display_order
              : null,
          },
        },
        state.virtualCheckupPackages
      );

      const { newItems, newPublishedItems } = reOrderItems(
        selectAll(updatedCheckupPackages),
        updatedPublishedItems,
        updatedUnPublishedItems,
        state.virtualPreviousPageLastDisplayOrder
      );

      return {
        ...state,
        isOrderDirty: true,
        virtualPublishedItems: newPublishedItems,
        virtualUnPublishedItems: updatedUnPublishedItems,
        virtualCheckupPackages: checkupPackagesAdapter.setAll(
          newItems,
          state.virtualCheckupPackages
        ),
        virtualLastDisplayOrder: is_published
          ? state.virtualLastDisplayOrder + 1
          : state.virtualLastDisplayOrder - 1,
      };
    }
  ),
  on(
    CheckupPackageOrderActions.updateCheckupPackagesOrder,
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
        virtualCheckupPackages: checkupPackagesAdapter.setAll(
          newItems,
          state.virtualCheckupPackages
        ),
      };
    }
  ),
  on(
    CheckupPackageOrderActions.resetAll,
    CheckupPackageOrderActions.reOrderCheckupPackagesSuccess,
    () => {
      return {
        ...initialState,
      };
    }
  )
);

const reOrderItems = (
  items: CheckupPackage[],
  publishedItems: EntityState<CheckupPackage>,
  unPublishedItems: EntityState<CheckupPackage>,
  lastDisplayOrder: number = 0
) => {
  let reOrderedPublishedItems: CheckupPackage[] = [];

  let display_order = lastDisplayOrder + 1;

  items
    .filter((item) => item.is_published)
    .forEach((item) => {
      reOrderedPublishedItems.push({
        ...item,
        display_order: display_order,
      });

      display_order += 1;
    });

  const updatedPublishedItems = orderedCheckupPackagesAdapter.updateMany(
    reOrderedPublishedItems.map((item) => ({
      id: item.id,
      changes: { display_order: item.display_order },
    })),
    publishedItems
  );
  const savedUnpublishedItems = items.filter(
    (item) => !item.is_published && unPublishedItems.ids[item.id]
  );
  const unSavedUnpublishedItems = items.filter(
    (item) => !item.is_published && !unPublishedItems.ids[item.id]
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

const initNeededValues = (pagedData: PagedCheckupPackage, state: State) => {
  const newData = pagedData.data.map((item) => {
    return { ...item, pagePosition: pagedData.pagination.page };
  });
  const publishedItems = newData.filter((item) => item.is_published);
  const publistItemsFiltered = publishedItems.filter(
    (item) =>
      !state.virtualUnPublishedItems.entities[item.id] &&
      !state.virtualPublishedItems.entities[item.id]
  );

  const realPublishedItems = orderedCheckupPackagesAdapter.upsertMany(
    publishedItems,
    state.realPublishedItems
  );
  const virtualPublishedItems = orderedCheckupPackagesAdapter.upsertMany(
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
