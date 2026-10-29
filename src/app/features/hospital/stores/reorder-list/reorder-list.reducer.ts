import { createReducer, on } from '@ngrx/store';
import * as HospitalOrderActions from './reorder-list.actions';
import * as HospitalActions from '../hospital-list/hospital-list.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Pagination } from '@app/shared/models/paged-data.model';
import { Hospital, PagedHospital } from '../../models/hospital.model';

export const featureKey = 'hospitalOrder';

export interface State {
  isEditOrderMode: boolean;
  isOrderDirty: boolean;
  lastDisplayOrder: number | null;
  realPublishedItems: EntityState<Hospital>;
  virtualPublishedItems: EntityState<Hospital>;
  virtualUnPublishedItems: EntityState<Hospital>;
  virtualHospitals: EntityState<Hospital>;
  virtualPreviousPageLastDisplayOrder: number;
  virtualLastDisplayOrder: number;
  pagination: Pagination;
}

export const hospitalsAdapter: EntityAdapter<Hospital> =
  createEntityAdapter<Hospital>({
    selectId: (hospital: Hospital) => hospital.hospital_id,
  });

export const orderedHospitalsAdapter: EntityAdapter<Hospital> =
  createEntityAdapter<Hospital>({
    selectId: (hospital: Hospital) => hospital.hospital_id,
    sortComparer: (a, b) => {
      if (a.is_published === b.is_published) {
        return !a.display_order || !b.display_order
          ? 1
          : a.display_order - b.display_order;
      }
      return a.is_published ? -1 : 1;
    },
  });

const { selectAll } = hospitalsAdapter.getSelectors();

export const initialState: State = {
  isEditOrderMode: false,
  isOrderDirty: false,
  lastDisplayOrder: 0,
  realPublishedItems: orderedHospitalsAdapter.getInitialState(),
  virtualPublishedItems: orderedHospitalsAdapter.getInitialState(),
  virtualUnPublishedItems: hospitalsAdapter.getInitialState(),
  virtualHospitals: hospitalsAdapter.getInitialState(),
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
  on(HospitalOrderActions.setIsEditOrderMode, (state, { isEditOrder }) => {
    return {
      ...state,
      isEditOrderMode: isEditOrder,
    };
  }),
  on(HospitalOrderActions.setOrderDirty, (state, { isDirty }) => {
    return {
      ...state,
      isOrderDirty: isDirty,
    };
  }),
  on(
    HospitalActions.getHospitalSuccess,
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
    HospitalOrderActions.getMissingHospitalsSuccess,
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

        tempvirtualPublishedItems = orderedHospitalsAdapter.setAll(
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
        virtualHospitals: hospitalsAdapter.setAll(
          newItems,
          state.virtualHospitals
        ),
        virtualPublishedItems: newPublishedItems,
      };
    }
  ),
  on(
    HospitalOrderActions.updatePublishedStatus,
    (state, { id, is_published }) => {
      const banner = state.virtualHospitals.entities[id] as Hospital;
      let updatedPublishedItems: EntityState<Hospital> =
        state.virtualPublishedItems;
      let updatedUnPublishedItems: EntityState<Hospital> =
        state.virtualUnPublishedItems;

      if (is_published) {
        // get highest display order in current page
        const highestDisplayOrderItem = selectAll(
          state.virtualHospitals
        ).reduce((max, item) =>
          (item.display_order || 0) > (max.display_order || 0) ? item : max
        );

        updatedPublishedItems = orderedHospitalsAdapter.addOne(
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

        updatedUnPublishedItems = hospitalsAdapter.removeOne(
          id,
          state.virtualUnPublishedItems
        );
      } else {
        updatedPublishedItems = orderedHospitalsAdapter.removeOne(
          id,
          state.virtualPublishedItems
        );

        if (state.realPublishedItems.entities[id]) {
          updatedUnPublishedItems = hospitalsAdapter.addOne(
            { ...banner, is_published: false, display_order: null },
            state.virtualUnPublishedItems
          );
        }
      }

      const updatedHospitals = hospitalsAdapter.updateOne(
        {
          id,
          changes: {
            is_published: is_published,
            display_order: is_published
              ? updatedPublishedItems.entities[id]?.display_order
              : null,
          },
        },
        state.virtualHospitals
      );

      const { newItems, newPublishedItems } = reOrderItems(
        selectAll(updatedHospitals),
        updatedPublishedItems,
        updatedUnPublishedItems,
        state.virtualPreviousPageLastDisplayOrder
      );

      return {
        ...state,
        isOrderDirty: true,
        virtualPublishedItems: newPublishedItems,
        virtualUnPublishedItems: updatedUnPublishedItems,
        virtualHospitals: hospitalsAdapter.setAll(
          newItems,
          state.virtualHospitals
        ),
        virtualLastDisplayOrder: is_published
          ? state.virtualLastDisplayOrder + 1
          : state.virtualLastDisplayOrder - 1,
      };
    }
  ),
  on(HospitalOrderActions.updateHospitalsOrder, (state, { newList }) => {
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
      virtualHospitals: hospitalsAdapter.setAll(
        newItems,
        state.virtualHospitals
      ),
    };
  }),
  on(
    HospitalOrderActions.resetAll,
    HospitalOrderActions.reOrderHospitalsSuccess,
    () => {
      return {
        ...initialState,
      };
    }
  )
);

const reOrderItems = (
  items: Hospital[],
  publishedItems: EntityState<Hospital>,
  unPublishedItems: EntityState<Hospital>,
  lastDisplayOrder: number = 0
) => {
  let reOrderedPublishedItems: Hospital[] = [];

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

  const updatedPublishedItems = orderedHospitalsAdapter.updateMany(
    reOrderedPublishedItems.map((item) => ({
      id: item.hospital_id,
      changes: { display_order: item.display_order },
    })),
    publishedItems
  );
  const savedUnpublishedItems = items.filter(
    (item) => !item.is_published && unPublishedItems.ids[item.hospital_id]
  );
  const unSavedUnpublishedItems = items.filter(
    (item) => !item.is_published && !unPublishedItems.ids[item.hospital_id]
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

const initNeededValues = (pagedData: PagedHospital, state: State) => {
  const newData = pagedData.data.map((item) => {
    return { ...item, pagePosition: pagedData.pagination.page };
  });
  const publishedItems = newData.filter((item) => item.is_published);
  const publistItemsFiltered = publishedItems.filter(
    (item) =>
      !state.virtualUnPublishedItems.entities[item.hospital_id] &&
      !state.virtualPublishedItems.entities[item.hospital_id]
  );

  const realPublishedItems = orderedHospitalsAdapter.upsertMany(
    publishedItems,
    state.realPublishedItems
  );
  const virtualPublishedItems = orderedHospitalsAdapter.upsertMany(
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
