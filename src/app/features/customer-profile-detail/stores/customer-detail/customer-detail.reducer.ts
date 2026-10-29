import { createReducer, on } from '@ngrx/store';
import * as CustomerDetailActions from './customer-detail.actions';
import { Customer } from '../../models/customer.model';

export const featureKey = 'customerDetail';

export interface State {
  customerDetail: Customer | null;
  isEditFormDirty: boolean;
}

export const initialState: State = {
  customerDetail: null,
  isEditFormDirty: false,
};

export const reducer = createReducer(
  initialState,
  on(
    CustomerDetailActions.getCustomerDetailSuccess,
    (state, { customerDetail }) => ({
      ...state,
      customerDetail,
    })
  ),
  on(
    CustomerDetailActions.markCustomerFraudOrBlockSuccess,
    (state, { is_fraud, is_blocked }) => {
      const newCustomerDetail = state.customerDetail
        ? {
            ...state.customerDetail,
            is_blocked:
              is_blocked !== undefined
                ? is_blocked
                : state.customerDetail.is_blocked,
            is_fraud:
              is_fraud !== undefined ? is_fraud : state.customerDetail.is_fraud,
          }
        : null;

      return {
        ...state,
        customerDetail: newCustomerDetail,
      };
    }
  ),
  on(CustomerDetailActions.setEditFormDirty, (state, { isDirty }) => ({
    ...state,
    isEditFormDirty: isDirty,
  })),
  on(CustomerDetailActions.reset, () => ({
    ...initialState,
  }))
);
