import { createAction, props } from '@ngrx/store';
import { Customer } from '../../models/customer.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { CustomerDetailEditResponse } from '../../models/customer-detail-edit-response.model';

const prefix = '[Customer Detail]';

export const getCustomerDetail = createAction(
  `${prefix} Get Customer Detail | loadingKey=getCustomerDetail`,
  props<{ partyId: string }>(),
);

export const getCustomerDetailSuccess = createAction(
  `${prefix} Get Customer Detail Success | loadingKey=getCustomerDetail`,
  props<{ customerDetail: Customer }>(),
);

export const getCustomerDetailFailure = createAction(
  `${prefix} Get Customer Detail Failure | loadingKey=getCustomerDetail`,
  props<{ error: CommonError }>(),
);

export const markCustomerFraudOrBlock = createAction(
  `${prefix} Mark Customer Fraud Or Block`,
  props<{ partyId: string; is_fraud?: boolean; is_blocked?: boolean }>(),
);

export const markCustomerFraudOrBlockSuccess = createAction(
  `${prefix} Mark Customer Fraud Or Block Success`,
  props<{ partyId: string; is_fraud?: boolean; is_blocked?: boolean }>(),
);

export const markCustomerFraudOrBlockFailure = createAction(
  `${prefix} Mark Customer Fraud Or Block Failure`,
  props<{ error: CommonError }>(),
);

export const updateCustomerDetail = createAction(
  `${prefix} Update Customer Detail | loadingKey=updateCustomerDetail`,
  props<{ partyId: string; customerDetail: Partial<Customer> }>(),
);

export const updateCustomerDetailSuccess = createAction(
  `${prefix} Update Customer Detail Success | loadingKey=updateCustomerDetail`,
  props<{
    dataResponse: CustomerDetailEditResponse;
    requestBody: Partial<Customer>;
  }>(),
);

export const updateCustomerDetailFailure = createAction(
  `${prefix} Update Customer Detail Failure | loadingKey=updateCustomerDetail`,
  props<{ messageData: ToastMessageData }>(),
);

export const deleteCustomer = createAction(
  `${prefix} Delete Customer | loadingKey=deleteCustomer`,
  props<{ partyId: string }>(),
);

export const deleteCustomerSuccess = createAction(
  `${prefix} Delete Customer Success | loadingKey=deleteCustomer`,
);

export const deleteCustomerFailure = createAction(
  `${prefix} Delete Customer Failure | loadingKey=deleteCustomer`,
  props<{ messageData: ToastMessageData }>(),
);

export const setEditFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>(),
);

export const reset = createAction(`${prefix} Reset Customer Detail`);
