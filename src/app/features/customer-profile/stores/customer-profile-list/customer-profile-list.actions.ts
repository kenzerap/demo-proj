import { createAction, props } from '@ngrx/store';
import { CustomerProfile } from '../../models/customer-profile.model';
import { CustomerProfileQueryParams } from '../../models/customer-profile-query-params.model';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';

const prefix = '[Customer Profile List]';

export const getCustomerProfiles = createAction(
  `${prefix} Get Customer Profiles | loadingKey=getCustomerProfiles`,
  props<{ params: Partial<CustomerProfileQueryParams> }>()
);

export const getCustomerProfilesSuccess = createAction(
  `${prefix} Get Customer Profiles Success | loadingKey=getCustomerProfiles`,
  props<{ pagedData: PagedData<CustomerProfile> }>()
);

export const getCustomerProfilesFailure = createAction(
  `${prefix} Get Customer Profiles Failure | loadingKey=getCustomerProfiles`,
  props<{ error: CommonError }>()
);

export const getCustomerProfile = createAction(
  `${prefix} Get Customer Profile`,
  props<{ user: CustomerProfile }>()
);

export const reset = createAction(`${prefix} Reset Customer Profile List`);
