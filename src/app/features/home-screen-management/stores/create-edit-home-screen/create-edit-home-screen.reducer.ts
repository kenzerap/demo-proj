import { createReducer, on } from '@ngrx/store';
import * as CreateEditHomeScreenActions from './create-edit-home-screen.actions';
import { v4 as uuidv4 } from 'uuid';
import { HomeScreenManagementDetail } from '../../models/home-screen-management.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TierGroup } from '@app/shared/models/tier-group.model';

export const featureKey = 'createEditHomeScreen';

export interface State {
  isFormDirty: boolean;
  homeScreenDetail: HomeScreenManagementDetail | null;
  tierGroups: EntityState<TierGroup>;
}

export const tierGroupsAdapter: EntityAdapter<TierGroup> =
  createEntityAdapter<TierGroup>({
    selectId: (tierGroup: TierGroup) => tierGroup.tier_id,
  });

export const initialState: State = {
  isFormDirty: false,
  homeScreenDetail: null,
  tierGroups: tierGroupsAdapter.getInitialState(),
};

export const reducer = createReducer(
  initialState,
  on(CreateEditHomeScreenActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(
    CreateEditHomeScreenActions.getHomeScreenDetailSuccess,
    (state, { homeScreen }) => ({
      ...state,
      homeScreenDetail: homeScreen,
    }),
  ),
  on(CreateEditHomeScreenActions.getTierGroupsSuccess, (state, { data }) => ({
    ...state,
    tierGroups: tierGroupsAdapter.setAll(data.data, state.tierGroups),
  })),
  on(CreateEditHomeScreenActions.reset, () => {
    return { ...initialState };
  }),
);
