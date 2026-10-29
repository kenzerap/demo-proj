import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as CustomerProfileListActions from './customer-profile-list.actions';
import { CustomerProfile } from '../../models/customer-profile.model';
import { Pagination } from 'src/app/shared/models/paged-data.model';

export const featureKey = 'customerProfileList';

export interface State extends EntityState<CustomerProfile> {
  pagination: Pagination;
}

export const adapter: EntityAdapter<CustomerProfile> =
  createEntityAdapter<CustomerProfile>({
    selectId: (customerProfile: CustomerProfile) => customerProfile.party_id,
  });

export const initialState: State = adapter.getInitialState({
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0,
  },
});

export const reducer = createReducer(
  initialState,
  on(
    CustomerProfileListActions.getCustomerProfilesSuccess,
    (state, { pagedData }) => {
      return adapter.setAll(pagedData.data, {
        ...state,
        pagination: {
          ...pagedData.pagination,
        },
      });
    }
  ),
  on(CustomerProfileListActions.reset, () => {
    return {
      ...initialState,
    };
  })
);
