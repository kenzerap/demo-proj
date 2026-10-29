import { createReducer, on } from '@ngrx/store';
import * as CreateEditPromocodeActions from './create-edit-promocode.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';
import { Privilege } from '@app/shared/models/privilege.model';
import { PromocodeDetail } from '../../models/promocode-model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

export const featureKey = 'createEditPromocode';

export interface State {
  policyChannels: PolicyChannel[];
  privileges: EntityState<Privilege>;
  filters: Partial<CommonListQueryParams>;
  isFormDirty: boolean;
  promocodeDetail: PromocodeDetail | null;
}

export const privilegesAdapter: EntityAdapter<Privilege> =
  createEntityAdapter<Privilege>({
    selectId: (privilege: Privilege) => privilege.privilegeId,
  });

export const initialState: State = {
  policyChannels: [],
  privileges: privilegesAdapter.getInitialState(),
  filters: {
    keyword: '',
    sort_by: '',
    sort_direction: '',
  },
  isFormDirty: false,
  promocodeDetail: null,
};

export const reducer = createReducer(
  initialState,
  on(CreateEditPromocodeActions.getPolicyChannelsSuccess, (state, { data }) => {
    const uniquePolicyChannels = Array.from(
      new Map(data.map((item) => [item.name, item])).values()
    );

    return {
      ...state,
      policyChannels: uniquePolicyChannels,
    };
  }),
  on(CreateEditPromocodeActions.getPrivilegesSuccess, (state, { data }) => ({
    ...state,
    privileges: privilegesAdapter.setAll(data, state.privileges),
  })),
  on(CreateEditPromocodeActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(
    CreateEditPromocodeActions.setPrivilegeSearchFilter,
    (state, { filters }) => ({
      ...state,
      filters: {
        keyword:
          filters.keyword !== undefined
            ? filters.keyword
            : state.filters.keyword,
        sort_by:
          filters.sort_by !== undefined
            ? filters.sort_by
            : state.filters.sort_by,
        sort_direction:
          filters.sort_direction !== undefined
            ? filters.sort_direction
            : state.filters.sort_direction,
      },
    })
  ),
  on(
    CreateEditPromocodeActions.getPromocodeDetailSuccess,
    (state, { promocode }) => ({
      ...state,
      promocodeDetail: promocode,
    })
  ),

  on(CreateEditPromocodeActions.reset, () => ({
    ...initialState,
  }))
);
