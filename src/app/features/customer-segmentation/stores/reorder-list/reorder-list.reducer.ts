import { createReducer, on } from '@ngrx/store';
import * as CustomerSegmentationOrderActions from './reorder-list.actions';
import * as CustomerSegmentationActions from '../customer-segmentation/customer-segmentation.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  CustomerSegmentation,
  PagedCustomerSegmentations,
} from '../../models/customer-segmentation.model';
import { Pagination } from '@app/shared/models/paged-data.model';

export const featureKey = 'customerSegmentationOrder';

export interface State {
  isEditOrderMode: boolean;
  isOrderDirty: boolean;
  lastDisplayOrder: number | null;
  realPublishedItems: EntityState<CustomerSegmentation>;
  virtualPublishedItems: EntityState<CustomerSegmentation>;
  virtualUnPublishedItems: EntityState<CustomerSegmentation>;
  virtualCustomerSegmentations: EntityState<CustomerSegmentation>;
  virtualPreviousPageLastDisplayOrder: number;
  virtualLastDisplayOrder: number;
  pagination: Pagination;
}

export const customerSegmentationsAdapter: EntityAdapter<CustomerSegmentation> =
  createEntityAdapter<CustomerSegmentation>({
    selectId: (customerSegmentation: CustomerSegmentation) =>
      customerSegmentation.id,
  });

export const orderedCustomerSegmentationsAdapter: EntityAdapter<CustomerSegmentation> =
  createEntityAdapter<CustomerSegmentation>({
    selectId: (customerSegmentation: CustomerSegmentation) =>
      customerSegmentation.id,
    sortComparer: (a, b) => {
      if (a.is_published === b.is_published) {
        return !a.display_order || !b.display_order
          ? 1
          : a.display_order - b.display_order;
      }
      return a.is_published ? -1 : 1;
    },
  });

const { selectAll } = customerSegmentationsAdapter.getSelectors();

export const initialState: State = {
  isEditOrderMode: false,
  isOrderDirty: false,
  lastDisplayOrder: 0,
  realPublishedItems: orderedCustomerSegmentationsAdapter.getInitialState(),
  virtualPublishedItems: orderedCustomerSegmentationsAdapter.getInitialState(),
  virtualUnPublishedItems: customerSegmentationsAdapter.getInitialState(),
  virtualCustomerSegmentations: customerSegmentationsAdapter.getInitialState(),
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
    CustomerSegmentationOrderActions.setIsEditOrderMode,
    (state, { isEditOrder }) => {
      return {
        ...state,
        isEditOrderMode: isEditOrder,
      };
    }
  ),
  on(CustomerSegmentationOrderActions.setOrderDirty, (state, { isDirty }) => {
    return {
      ...state,
      isOrderDirty: isDirty,
    };
  }),
  on(
    CustomerSegmentationActions.getCustomerSegmentationsSuccess,
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
    CustomerSegmentationOrderActions.getMissingCustomerSegmentationsSuccess,
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

        tempvirtualPublishedItems = orderedCustomerSegmentationsAdapter.setAll(
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
        virtualCustomerSegmentations: customerSegmentationsAdapter.setAll(
          newItems,
          state.virtualCustomerSegmentations
        ),
        virtualPublishedItems: newPublishedItems,
      };
    }
  ),
  on(
    CustomerSegmentationOrderActions.updatePublishedStatus,
    (state, { id, is_published }) => {
      const banner = state.virtualCustomerSegmentations.entities[
        id
      ] as CustomerSegmentation;
      let updatedPublishedItems: EntityState<CustomerSegmentation> =
        state.virtualPublishedItems;
      let updatedUnPublishedItems: EntityState<CustomerSegmentation> =
        state.virtualUnPublishedItems;

      if (is_published) {
        // get highest display order in current page
        const highestDisplayOrderItem = selectAll(
          state.virtualCustomerSegmentations
        ).reduce((max, item) =>
          (item.display_order || 0) > (max.display_order || 0) ? item : max
        );

        updatedPublishedItems = orderedCustomerSegmentationsAdapter.addOne(
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

        updatedUnPublishedItems = customerSegmentationsAdapter.removeOne(
          id,
          state.virtualUnPublishedItems
        );
      } else {
        updatedPublishedItems = orderedCustomerSegmentationsAdapter.removeOne(
          id,
          state.virtualPublishedItems
        );

        if (state.realPublishedItems.entities[id]) {
          updatedUnPublishedItems = customerSegmentationsAdapter.addOne(
            { ...banner, is_published: false, display_order: null },
            state.virtualUnPublishedItems
          );
        }
      }

      const updatedCustomerSegmentations =
        customerSegmentationsAdapter.updateOne(
          {
            id,
            changes: {
              is_published,
              display_order: is_published
                ? updatedPublishedItems.entities[id]?.display_order
                : null,
            },
          },
          state.virtualCustomerSegmentations
        );

      const { newItems, newPublishedItems } = reOrderItems(
        selectAll(updatedCustomerSegmentations),
        updatedPublishedItems,
        updatedUnPublishedItems,
        state.virtualPreviousPageLastDisplayOrder
      );

      return {
        ...state,
        isOrderDirty: true,
        virtualPublishedItems: newPublishedItems,
        virtualUnPublishedItems: updatedUnPublishedItems,
        virtualCustomerSegmentations: customerSegmentationsAdapter.setAll(
          newItems,
          state.virtualCustomerSegmentations
        ),
        virtualLastDisplayOrder: is_published
          ? state.virtualLastDisplayOrder + 1
          : state.virtualLastDisplayOrder - 1,
      };
    }
  ),
  on(
    CustomerSegmentationOrderActions.updateCustomerSegmentationsOrder,
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
        virtualCustomerSegmentations: customerSegmentationsAdapter.setAll(
          newItems,
          state.virtualCustomerSegmentations
        ),
      };
    }
  ),
  on(
    CustomerSegmentationOrderActions.resetAll,
    CustomerSegmentationOrderActions.reOrderCustomerSegmentationsSuccess,
    () => {
      return {
        ...initialState,
      };
    }
  )
);

const reOrderItems = (
  items: CustomerSegmentation[],
  publishedItems: EntityState<CustomerSegmentation>,
  unPublishedItems: EntityState<CustomerSegmentation>,
  lastDisplayOrder: number = 0
) => {
  let reOrderedPublishedItems: CustomerSegmentation[] = [];

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

  const updatedPublishedItems = orderedCustomerSegmentationsAdapter.updateMany(
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

const initNeededValues = (
  pagedData: PagedCustomerSegmentations,
  state: State
) => {
  const newData = pagedData.data.map((item) => {
    return { ...item, pagePosition: pagedData.pagination.page };
  });
  const publishedItems = newData.filter((item) => item.is_published);
  const publistItemsFiltered = publishedItems.filter(
    (item) =>
      !state.virtualUnPublishedItems.entities[item.id] &&
      !state.virtualPublishedItems.entities[item.id]
  );

  const realPublishedItems = orderedCustomerSegmentationsAdapter.upsertMany(
    publishedItems,
    state.realPublishedItems
  );
  const virtualPublishedItems = orderedCustomerSegmentationsAdapter.upsertMany(
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
