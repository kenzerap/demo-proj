import { createReducer, on } from '@ngrx/store';
import * as PrivilegeSettingActions from './privilege.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PrivilegeSetting } from '../../models/privilege-setting-model';
import { PrivilegeSettingsQueryParams } from '../../models/privilege-settings-query-params.model';
import { v4 as uuidv4 } from 'uuid';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { PrivilegeTypeEnum } from '@app/shared/utils/enums/privilege-type.enums';

export const featureKey = 'privilegeSettings';

export interface State {
  privilegeSettings: EntityState<PrivilegeSetting>;
  virtualPublishedItems: EntityState<PrivilegeSetting>;
  virtualUnPublishedItems: EntityState<PrivilegeSetting>;
  isEditOrderMode: boolean;
  pagination: any;
  lastPrivilegeId: number;
  lastDisplayOrder: number;
  filters: Partial<PrivilegeSettingsQueryParams>;
  targetGroupUserCounts: EntityState<TargetGroupUserCount>;
  targetGroupUserCountsPagination: Pagination;
  isOrderDirty: boolean;
}

export const privilegeSettingsAdapter: EntityAdapter<PrivilegeSetting> =
  createEntityAdapter<PrivilegeSetting>({
    selectId: (privilegeSetting: PrivilegeSetting) =>
      privilegeSetting.privilege_id,
    sortComparer: (a, b) => {
      if (a.is_published === b.is_published) {
        return !a.display_order || !b.display_order
          ? 1
          : a.display_order - b.display_order;
      }
      return a.is_published ? -1 : 1;
    },
  });

export const targetGroupUserCountsAdapter: EntityAdapter<TargetGroupUserCount> =
  createEntityAdapter<TargetGroupUserCount>({
    selectId: () => uuidv4(),
  });

export const initialState: State = {
  privilegeSettings: privilegeSettingsAdapter.getInitialState(),
  virtualPublishedItems: privilegeSettingsAdapter.getInitialState(),
  virtualUnPublishedItems: privilegeSettingsAdapter.getInitialState(),
  isEditOrderMode: false,
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
  lastPrivilegeId: 0,
  lastDisplayOrder: 0,
  filters: {
    page: 0,
    size: 20,
    keyword: '',
    privilegeId: '',
    privilege_type: PrivilegeTypeEnum.E_VOUCHER,
  },
  targetGroupUserCounts: targetGroupUserCountsAdapter.getInitialState(),
  targetGroupUserCountsPagination: {
    page: 0,
    size: 5,
    totalItems: 0,
    totalPages: 0,
  },
  isOrderDirty: false,
};

export const reducer = createReducer(
  initialState,
  on(
    PrivilegeSettingActions.getPrivilegeSettingsSuccess,
    (state, { pagedData }) => {
      const newData = pagedData.data.map((item) => {
        if (state.virtualUnPublishedItems.entities[item.privilege_id]) {
          return { ...item, is_published: false, display_order: null } as any;
        }

        return item as any;
      });

      const newVirtualPublishedItems = state.filters.target_group_ids?.includes(
        -1,
      )
        ? newData
            .filter((item) => item.is_published)
            .map(
              (item) =>
                ({
                  ...item,
                  pagePosition: state.filters.page,
                  is_published: state.virtualUnPublishedItems.entities[
                    item.privilege_id
                  ]
                    ? false
                    : item.is_published,
                  display_order: state.virtualUnPublishedItems.entities[
                    item.privilege_id
                  ]
                    ? null
                    : state.virtualPublishedItems.entities[item.privilege_id]
                        ?.display_order || item.display_order,
                }) as any,
            )
        : [];

      return {
        ...state,
        privilegeSettings: privilegeSettingsAdapter.setAll(
          newData,
          state.privilegeSettings,
        ),
        virtualPublishedItems: privilegeSettingsAdapter.upsertMany(
          newVirtualPublishedItems,
          state.virtualPublishedItems,
        ),
        pagination: {
          ...pagedData.pagination,
        },
        lastPrivilegeId: pagedData.privilegeId,
        lastDisplayOrder: pagedData.lastDisplayOrder,
      };
    },
  ),
  on(
    PrivilegeSettingActions.getTargetGroupUserCountSuccess,
    (state, { pagedData, isGetMore }) => {
      const targetGroupUserCounts = pagedData.data.map((item) => {
        return { ...item, id: uuidv4() };
      });

      if (isGetMore) {
        return {
          ...state,
          targetGroupUserCounts: targetGroupUserCountsAdapter.addMany(
            targetGroupUserCounts,
            state.targetGroupUserCounts,
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
          state.targetGroupUserCounts,
        ),
        targetGroupUserCountsPagination: {
          ...pagedData.pagination,
        },
      };
    },
  ),
  on(
    PrivilegeSettingActions.setPrivilegeSettingsFilter,
    (state, { filters }) => {
      return {
        ...state,
        filters: {
          page: filters.page !== undefined ? filters.page : state.filters.page,
          size: filters.size !== undefined ? filters.size : state.filters.size,
          privilege_type:
            filters.privilege_type !== undefined
              ? filters.privilege_type
              : state.filters.privilege_type,
          target_group_ids:
            filters.target_group_ids !== undefined
              ? filters.target_group_ids
              : (state.filters.target_group_ids || [])?.length > 0
                ? state.filters.target_group_ids
                : state.targetGroupUserCounts.entities[
                    state.targetGroupUserCounts.ids[0]
                  ]?.target_group_ids,
          keyword:
            filters.keyword !== undefined
              ? filters.keyword
              : state.filters.keyword,
          privilegeId:
            filters.privilegeId !== undefined
              ? filters.privilegeId
              : state.filters.privilegeId,
          sort_by:
            filters.sort_by !== undefined
              ? filters.sort_by
              : state.filters.sort_by,
          sort_direction:
            filters.sort_direction !== undefined
              ? filters.sort_direction
              : state.filters.sort_direction,
        },
      };
    },
  ),
  on(PrivilegeSettingActions.setOrderDirty, (state, { isDirty }) => {
    return {
      ...state,
      isOrderDirty: isDirty,
    };
  }),
  on(PrivilegeSettingActions.resetAll, () => {
    return {
      ...initialState,
    };
  }),
  on(PrivilegeSettingActions.resetPrivilegeSettings, (state) => {
    return {
      ...initialState,
      filters: {...state.filters, sort_by: undefined, sort_direction: undefined},
    };
  }),
);
