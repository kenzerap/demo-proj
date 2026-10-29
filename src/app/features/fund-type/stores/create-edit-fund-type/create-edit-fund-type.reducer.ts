import { createReducer, on } from '@ngrx/store';
import * as CreateEditFundTypeActions from './create-edit-fund-type.actions';
import { FundType } from '../../models/fund-type.model';
import { FundTypeOptions } from '../../models/fund-type-options.model';

export const featureKey = 'createEditFundType';

export interface State {
  isFormDirty: boolean;
  fundTypeDetail: FundType | null;
  fundTypeOptions: FundTypeOptions | null;
}

export const initialState: State = {
  isFormDirty: false,
  fundTypeDetail: null,
  fundTypeOptions: null,
};

export const reducer = createReducer(
  initialState,
  on(CreateEditFundTypeActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(
    CreateEditFundTypeActions.getFundTypeDetailSuccess,
    (state, { fundType }) => ({
      ...state,
      fundTypeDetail: fundType,
    }),
  ),
  on(
    CreateEditFundTypeActions.getFundTypeOptionsSuccess,
    (state, { fundTypeOptions }) => ({
      ...state,
      fundTypeOptions,
    }),
  ),
  on(CreateEditFundTypeActions.reset, () => {
    return { ...initialState };
  }),
);
