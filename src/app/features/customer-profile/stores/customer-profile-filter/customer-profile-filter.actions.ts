import { createAction, props } from '@ngrx/store';

const prefix = '[Customer Profile Filter]';

export const searchCustomerProfiles = createAction(
  `${prefix} Search Customer Profiles`,
  props<{
    commonSearch: string;
    policyNumber: string;
    certificateNumber: string;
  }>()
);

export const reset = createAction(`${prefix} Reset Customer Profile Filter`);
