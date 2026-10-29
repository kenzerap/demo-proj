import { createReducer, on } from '@ngrx/store';
import * as CreateEditPointRuleActions from './create-edit-point-rule.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PointRuleDetail } from '../../models/point-rule-model';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';
import { ProductName } from '@app/shared/models/product-name.model';
import { v4 as uuidv4 } from 'uuid';

export const featureKey = 'createEditPointRule';

export interface State {
  isFormDirty: boolean;
  pointRuleDetail: PointRuleDetail | null;
  tierGroups: EntityState<TierGroup>;
  policyChannels: PolicyChannel[];
  productNames: EntityState<ProductName>;
}

export const tierGroupsAdapter: EntityAdapter<TierGroup> =
  createEntityAdapter<TierGroup>({
    selectId: (tierGroup: TierGroup) => tierGroup.tier_id,
  });

export const productNamesAdapter: EntityAdapter<ProductName> =
  createEntityAdapter<ProductName>({
    selectId: () => uuidv4(),
  });

export const initialState: State = {
  isFormDirty: false,
  pointRuleDetail: null,
  tierGroups: tierGroupsAdapter.getInitialState(),
  policyChannels: [],
  productNames: productNamesAdapter.getInitialState(),
};

export const reducer = createReducer(
  initialState,
  on(CreateEditPointRuleActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(
    CreateEditPointRuleActions.getPointRuleDetailSuccess,
    (state, { pointRule }) => ({
      ...state,
      pointRuleDetail: pointRule,
    })
  ),
  on(CreateEditPointRuleActions.getTierGroupsSuccess, (state, { data }) => ({
    ...state,
    tierGroups: tierGroupsAdapter.setAll(data.data, state.tierGroups),
  })),
  on(
    CreateEditPointRuleActions.getPolicyChannelsSuccess,
    (state, { data }) => ({
      ...state,
      policyChannels: data,
    })
  ),
  on(CreateEditPointRuleActions.getProductNamesSuccess, (state, { data }) => ({
    ...state,
    productNames: productNamesAdapter.setAll(data, state.productNames),
  })),
  on(CreateEditPointRuleActions.reset, () => {
    return { ...initialState };
  })
);
