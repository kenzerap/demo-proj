import { createReducer, on } from '@ngrx/store';
import * as CreateEditPushNotificationActions from './create-edit-push-notification.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Privilege } from '../../../../shared/models/privilege.model';
import { NotificationDetail } from '../../models/notification.model';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TargetGroupsUserSummary } from '@app/shared/models/target-groups-user-summary.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';

export const featureKey = 'createEditPushNotification';

export interface State {
  privileges: EntityState<Privilege>;
  isFormDirty: boolean;
  notificationDetail: NotificationDetail | null;
  previewMessage: { title: string; body: string };
  tierGroups: EntityState<TierGroup>;
  segmentGroups: EntityState<SegmentGroup>;
  targetGroupsUserSummary: TargetGroupsUserSummary | null;
  includeExcludeSegmentTier: TierSegmentIncludeExclude[];
}

export const privilegesAdapter: EntityAdapter<Privilege> =
  createEntityAdapter<Privilege>({
    selectId: (privilege: Privilege) => privilege.privilegeId,
  });

export const tierGroupsAdapter: EntityAdapter<TierGroup> =
  createEntityAdapter<TierGroup>({
    selectId: (tierGroup: TierGroup) => tierGroup.tier_id,
  });

export const segmentGroupsAdapter: EntityAdapter<SegmentGroup> =
  createEntityAdapter<SegmentGroup>({
    selectId: (segmentGroup: SegmentGroup) => segmentGroup.id,
  });

export const initialState: State = {
  privileges: privilegesAdapter.getInitialState(),
  isFormDirty: false,
  notificationDetail: null,
  previewMessage: { title: '', body: '' },
  tierGroups: tierGroupsAdapter.getInitialState(),
  segmentGroups: segmentGroupsAdapter.getInitialState(),
  targetGroupsUserSummary: null,
  includeExcludeSegmentTier: [],
};

export const reducer = createReducer(
  initialState,
  on(
    CreateEditPushNotificationActions.getPrivilegesSuccess,
    (state, { data }) => ({
      ...state,
      privileges: privilegesAdapter.setAll(data, state.privileges),
    })
  ),
  on(CreateEditPushNotificationActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(
    CreateEditPushNotificationActions.getNotificationDetailSuccess,
    (state, { notification }) => ({
      ...state,
      notificationDetail: notification,
    })
  ),
  on(
    CreateEditPushNotificationActions.setPreviewMessage,
    (state, { title, body }) => ({
      ...state,
      previewMessage: { title, body },
    })
  ),
  on(
    CreateEditPushNotificationActions.getTierGroupsSuccess,
    (state, { data }) => ({
      ...state,
      tierGroups: tierGroupsAdapter.setAll(data.data, state.tierGroups),
    })
  ),
  on(
    CreateEditPushNotificationActions.getSegmentGroupsSuccess,
    (state, { data }) => ({
      ...state,
      segmentGroups: segmentGroupsAdapter.setAll(
        data.data,
        state.segmentGroups
      ),
    })
  ),
  on(
    CreateEditPushNotificationActions.getTargetGroupUserSummarySuccess,
    (state, { data }) => ({
      ...state,
      targetGroupsUserSummary: data,
    })
  ),
  on(
    CreateEditPushNotificationActions.setIncludeExcludeSegmentTier,
    (state, { items }) => ({
      ...state,
      includeExcludeSegmentTier: items,
    })
  ),
  on(CreateEditPushNotificationActions.reset, () => ({
    ...initialState,
  }))
);
