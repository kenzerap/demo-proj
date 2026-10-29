import { createReducer, on } from '@ngrx/store';
import * as CreateEditCustomerSegmentationActions from './create-edit-customer-segmentation.actions';
import { PolicyChannel } from '../../../../shared/models/policy-channel.model';
import { SegmentSummaryUser } from '@app/shared/models/segment-summary-user.model';
import { CustomerSegmentationDetail } from '../../models/customer-segmentation.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ProductName } from '@app/shared/models/product-name.model';
import { v4 as uuidv4 } from 'uuid';
import { ProductGroupType } from '../../../../shared/models/product-group-type.model';

export const featureKey = 'createEditCustomerSegmentation';

export interface State {
  productTypes: ProductGroupType[];
  policyChannels: PolicyChannel[];
  isFormDirty: boolean;
  segmentSummaryUsers: SegmentSummaryUser[];
  customerSegmentationDetail: CustomerSegmentationDetail | null;
  productNames: EntityState<ProductName>;
}

export const productNamesAdapter: EntityAdapter<ProductName> =
  createEntityAdapter<ProductName>({
    selectId: () => uuidv4(),
  });

export const initialState: State = {
  isFormDirty: false,
  productTypes: [],
  policyChannels: [],
  segmentSummaryUsers: [],
  customerSegmentationDetail: null,
  productNames: productNamesAdapter.getInitialState(),
};

export const reducer = createReducer(
  initialState,
  on(
    CreateEditCustomerSegmentationActions.getProductTypesSuccess,
    (state, { data }) => ({
      ...state,
      productTypes: data,
    })
  ),
  on(
    CreateEditCustomerSegmentationActions.getPolicyChannelsSuccess,
    (state, { data }) => {
      const uniquePolicyChannels = Array.from(
        new Map(data.map((item) => [item.name, item])).values()
      );

      return {
        ...state,
        policyChannels: uniquePolicyChannels,
      };
    }
  ),
  on(
    CreateEditCustomerSegmentationActions.setFormDirty,
    (state, { isDirty }) => ({
      ...state,
      isFormDirty: isDirty,
    })
  ),
  on(
    // remove
    CreateEditCustomerSegmentationActions.getSegmentSummaryUsersSuccess,
    (state, { data }) => {
      return { ...state, segmentSummaryUsers: data };
    }
  ),
  on(
    CreateEditCustomerSegmentationActions.getCustomerSegmentationDetailSuccess,
    (state, { customerSegmentationDetail }) => ({
      ...state,
      customerSegmentationDetail: customerSegmentationDetail,
    })
  ),
  on(
    CreateEditCustomerSegmentationActions.getProductNamesSuccess,
    (state, { data }) => ({
      ...state,
      productNames: productNamesAdapter.setAll(data, state.productNames),
    })
  ),
  on(CreateEditCustomerSegmentationActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
