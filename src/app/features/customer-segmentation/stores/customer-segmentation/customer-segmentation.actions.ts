import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { PagedCustomerSegmentations } from '../../models/customer-segmentation.model';
import { CustomerSegmentationsQueryParams } from '../../models/customer-segmentations-query-params.model';

const prefix = '[Customer Segmentation]';

export const getCustomerSegmentations = createAction(
  `${prefix} Get Customer Segmentations | loadingKey=getCustomerSegmentations`,
  props<{ queryParams: Partial<CustomerSegmentationsQueryParams> }>()
);

export const getCustomerSegmentationsSuccess = createAction(
  `${prefix} Get Customer Segmentations Success | loadingKey=getCustomerSegmentations`,
  props<{ pagedData: PagedCustomerSegmentations; canEditOrder: boolean }>()
);

export const getCustomerSegmentationsFailure = createAction(
  `${prefix} Get Customer Segmentations Failure | loadingKey=getCustomerSegmentations`,
  props<{ error: CommonError }>()
);

export const setCustomerSegmentationsFilter = createAction(
  `${prefix} Set Customer Segmentations Filter`,
  props<{ filters: Partial<CustomerSegmentationsQueryParams> }>()
);

export const resetAll = createAction(`${prefix} Reset Customer Segmentation`);
