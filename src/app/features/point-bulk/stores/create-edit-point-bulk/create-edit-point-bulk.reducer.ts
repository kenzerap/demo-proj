import { createReducer, on } from '@ngrx/store';
import * as CreateEditPointBulkActions from './create-edit-point-bulk.actions';
import { ValidateUploadPointResponse } from '../../models/validate-upload-point-response.model';

export const featureKey = 'createEditPointBulk';

export interface State {
  validateUploadPointResponse: ValidateUploadPointResponse | null;
}

export const initialState: State = {
  validateUploadPointResponse: null,
};

export const reducer = createReducer(
  initialState,
  on(
    CreateEditPointBulkActions.validateUploadPointBulkSuccess,
    (state, { response }) => {
      return {
        ...state,
        validateUploadPointResponse: response,
      };
    }
  ),
  on(CreateEditPointBulkActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
