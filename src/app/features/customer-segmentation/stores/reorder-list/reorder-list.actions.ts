import { createAction, props } from '@ngrx/store';
import {
  CustomerSegmentation,
  PagedCustomerSegmentations,
} from '../../models/customer-segmentation.model';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

const prefix = '[Customer Segmentation Order]';

export const setIsEditOrderMode = createAction(
  `${prefix} Set Is Edit Order Mode`,
  props<{ isEditOrder: boolean }>()
);

export const setOrderDirty = createAction(
  `${prefix} Set Order Dirty`,
  props<{ isDirty: boolean }>()
);

export const updatePublishedStatus = createAction(
  `${prefix} update Published Status`,
  props<{ id: number; is_published: boolean }>()
);

export const updateCustomerSegmentationsOrder = createAction(
  `${prefix} update Customer Segmentations Order`,
  props<{ newList: CustomerSegmentation[] }>()
);

export const getMissingCustomerSegmentations = createAction(
  `${prefix} Get Missing Customer Segmentations | loadingKey=getMissingCustomerSegmentations`,
  props<{ pagedData: PagedCustomerSegmentations }>()
);

export const getMissingCustomerSegmentationsSuccess = createAction(
  `${prefix} Get Missing Customer Segmentations Success | loadingKey=getMissingCustomerSegmentations`,
  props<{
    data: CustomerSegmentation[];
    virtualPublishedItems?: CustomerSegmentation[];
  }>()
);

export const getMissingCustomerSegmentationsFailure = createAction(
  `${prefix} Get Missing Customer Segmentations Failure | loadingKey=getMissingCustomerSegmentations`,
  props<{ error: CommonError }>()
);

export const reOrderCustomerSegmentations = createAction(
  `${prefix} reorder Customer Segmentations | loadingKey=reOrderCustomerSegmentations`
);

export const reOrderCustomerSegmentationsSuccess = createAction(
  `${prefix} reOrder Customer Segmentations Success | loadingKey=reOrderCustomerSegmentations`
);

export const reOrderCustomerSegmentationsFailure = createAction(
  `${prefix} reOrder Customer Segmentations Failure | loadingKey=reOrderCustomerSegmentations`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(
  `${prefix} Reset Customer Segmentation Order`
);
