import { createReducer, on } from '@ngrx/store';
import * as CreateEditPopupAnnouncementActions from './create-edit-popup-announcement.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  PopupAnnouncement,
  PopupAnnouncementDetail,
} from '../../models/popup-announcement-model';
import { Privilege } from '@app/shared/models/privilege.model';
import { PreviewImage } from '../../models/preview-image.model';
import { TargetGroup } from '@app/shared/models/target-group.model';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TargetGroupsUserSummary } from '@app/shared/models/target-groups-user-summary.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';

export const featureKey = 'createEditPopupAnnouncement';

export interface State {
  privileges: EntityState<Privilege>;
  isFormDirty: boolean;
  popupAnnouncementDetail: PopupAnnouncementDetail | null;
  previewImages: PreviewImage[];
  tierGroups: EntityState<TierGroup>;
  segmentGroups: EntityState<SegmentGroup>;
  targetGroupsUserSummary: TargetGroupsUserSummary | null;
  includeExcludeSegmentTier: TierSegmentIncludeExclude[];
}

export const privilegeAdapter: EntityAdapter<Privilege> =
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
  privileges: privilegeAdapter.getInitialState(),
  isFormDirty: false,
  popupAnnouncementDetail: null,
  previewImages: [],
  tierGroups: tierGroupsAdapter.getInitialState(),
  segmentGroups: segmentGroupsAdapter.getInitialState(),
  targetGroupsUserSummary: null,
  includeExcludeSegmentTier: [],
};

export const reducer = createReducer(
  initialState,
  on(
    CreateEditPopupAnnouncementActions.getPrivilegesSuccess,
    (state, { data }) => ({
      ...state,
      privileges: privilegeAdapter.setAll(data, state.privileges),
    })
  ),
  on(CreateEditPopupAnnouncementActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(
    CreateEditPopupAnnouncementActions.setPreviewImages,
    (state, { images }) => ({
      ...state,
      previewImages: images,
    })
  ),
  on(
    CreateEditPopupAnnouncementActions.getPopupAnnouncementDetailSuccess,
    (state, { popupAnnouncement }) => ({
      ...state,
      popupAnnouncementDetail: popupAnnouncement,
    })
  ),
  on(
    CreateEditPopupAnnouncementActions.getTierGroupsSuccess,
    (state, { data }) => ({
      ...state,
      tierGroups: tierGroupsAdapter.setAll(data.data, state.tierGroups),
    })
  ),
  on(
    CreateEditPopupAnnouncementActions.getSegmentGroupsSuccess,
    (state, { data }) => ({
      ...state,
      segmentGroups: segmentGroupsAdapter.setAll(
        data.data,
        state.segmentGroups
      ),
    })
  ),
  on(
    CreateEditPopupAnnouncementActions.getTargetGroupUserSummarySuccess,
    (state, { data }) => ({
      ...state,
      targetGroupsUserSummary: data,
    })
  ),
  on(
    CreateEditPopupAnnouncementActions.setIncludeExcludeSegmentTier,
    (state, { items }) => ({
      ...state,
      includeExcludeSegmentTier: items,
    })
  ),
  on(CreateEditPopupAnnouncementActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
