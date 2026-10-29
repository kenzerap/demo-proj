import { createAction, props } from '@ngrx/store';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { CreateEditCustomerSegmentationQueryParams } from '../../models/create-edit-customer-segmentation-query-params.model';
import { PolicyChannel } from '../../../../shared/models/policy-channel.model';
import { SegmentSummaryUser } from '@app/shared/models/segment-summary-user.model';
import { CustomerSegmentationDetail } from '../../models/customer-segmentation.model';
import { CommonError } from '@app/shared/models/common-error.model';
import { ProductName } from '@app/shared/models/product-name.model';
import { ProductGroupType } from '../../../../shared/models/product-group-type.model';
import { ValidateUploadPartyIdResponse } from '../../models/validate-upload-party-id-response.model';
import { PartyIdFileInfo } from '../../models/party-id-file-info.model';

const prefix = '[Create Edit Customer Segmentation]';

export const createCustomerSegmentation = createAction(
  `${prefix} Create Customer Segmentation | loadingKey=createCustomerSegmentation`,
  props<{ data: Partial<CreateEditCustomerSegmentationQueryParams> }>(),
);

export const createCustomerSegmentationSuccess = createAction(
  `${prefix} Create Customer Segmentation Success | loadingKey=createCustomerSegmentation`,
);

export const createCustomerSegmentationFailure = createAction(
  `${prefix} Create Customer Segmentation Failure | loadingKey=createCustomerSegmentation`,
  props<{ messageData: ToastMessageData }>(),
);

export const getProductTypes = createAction(
  `${prefix} Get Product Types | loadingKey=getProductTypes`,
);

export const getProductTypesSuccess = createAction(
  `${prefix} Get Product Types Success | loadingKey=getProductTypes`,
  props<{ data: ProductGroupType[] }>(),
);

export const getProductTypesFailure = createAction(
  `${prefix} Get Product Types Failure | loadingKey=getProductTypes`,
  props<{ error: CommonError }>(),
);

export const getPolicyChannels = createAction(
  `${prefix} Get Policy Channels | loadingKey=getPolicyChannels`,
);

export const getPolicyChannelsSuccess = createAction(
  `${prefix} Get Policy Channels Success | loadingKey=getPolicyChannels`,
  props<{ data: PolicyChannel[] }>(),
);

export const getPolicyChannelsFailure = createAction(
  `${prefix} Get Policy Channels Failure | loadingKey=getPolicyChannels`,
  props<{ error: CommonError }>(),
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>(),
);

// remove
export const getSegmentSummaryUsers = createAction(
  `${prefix} Get Segment Summary Users | loadingKey=getSegmentSummaryUsers`,
);

export const getSegmentSummaryUsersSuccess = createAction(
  `${prefix} Get Segment Summary Users Success | loadingKey=getSegmentSummaryUsers`,
  props<{ data: SegmentSummaryUser[] }>(),
);

export const getSegmentSummaryUsersFailure = createAction(
  `${prefix} Get Segment Summary Users Failure | loadingKey=getSegmentSummaryUsers`,
  props<{ error: CommonError }>(),
);

export const getCustomerSegmentationDetail = createAction(
  `${prefix} Get Customer Segmentation Detail | loadingKey=getCustomerSegmentationDetail`,
  props<{ id: number }>(),
);
export const getCustomerSegmentationDetailSuccess = createAction(
  `${prefix} Get Customer Segmentation Detail Success | loadingKey=getCustomerSegmentationDetail`,
  props<{ customerSegmentationDetail: CustomerSegmentationDetail }>(),
);
export const getCustomerSegmentationDetailFailure = createAction(
  `${prefix} Get Customer Segmentation Detail Failure | loadingKey=getCustomerSegmentationDetail`,
  props<{ error: CommonError }>(),
);

export const getProductNames = createAction(
  `${prefix} Get Product Names | loadingKey=getProductNames`,
);

export const getProductNamesSuccess = createAction(
  `${prefix} Get Product Names Success | loadingKey=getProductNames`,
  props<{ data: ProductName[] }>(),
);

export const getProductNamesFailure = createAction(
  `${prefix} Get Product Names Failure | loadingKey=getProductNames`,
  props<{ error: CommonError }>(),
);

export const validateUploadPartyId = createAction(
  `${prefix} Validate Upload Party ID | loadingKey=validateUploadPartyId`,
  props<{ file: File }>(),
);

export const validateUploadPartyIdSuccess = createAction(
  `${prefix} Validate Upload Party ID Success | loadingKey=validateUploadPartyId`,
  props<{ response: ValidateUploadPartyIdResponse }>(),
);

export const validateUploadPartyIdFailure = createAction(
  `${prefix} Validate Upload Party ID Failure | loadingKey=validateUploadPartyId`,
  props<{ response: ValidateUploadPartyIdResponse }>(),
);

export const uploadPartyId = createAction(
  `${prefix} Upload Party Ids | loadingKey=uploadPartyId`,
  props<{
    file: File;
  }>(),
);

export const uploadPartyIdSuccess = createAction(
  `${prefix} Upload Party Ids Success | loadingKey=uploadPartyId`,
  props<{
    partyIdFileInfo: PartyIdFileInfo;
  }>(),
);

export const uploadPartyIdFailure = createAction(
  `${prefix} Upload Party Ids Failure | loadingKey=uploadPartyId`,
  props<{ messageData: ToastMessageData }>(),
);

export const deleteUploadPartyId = createAction(
  `${prefix} Delete Upload Party ID | loadingKey=deleteUploadPartyId`,
  props<{ fileId: number }>(),
);

export const deleteUploadPartyIdSuccess = createAction(
  `${prefix} Delete Upload Party ID Success | loadingKey=deleteUploadPartyId`,
);

export const deleteUploadPartyIdFailure = createAction(
  `${prefix} Delete Upload Party ID Failure | loadingKey=deleteUploadPartyId`,
  props<{ messageData: ToastMessageData }>(),
);

export const resetAll = createAction(
  `${prefix} Reset Create Edit Customer Segmentation`,
);
