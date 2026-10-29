import { createReducer, on } from '@ngrx/store';
import * as CreateEditCheckupPackageActions from './create-edit-checkup-package.actions';
import { v4 as uuidv4 } from 'uuid';
import { CheckupPackage } from '../../models/checkup-package.model';

export const featureKey = 'createEditCheckupPackage';

export interface State {
  isFormDirty: boolean;
  checkupPackageDetail: CheckupPackage | null;
}

export const initialState: State = {
  isFormDirty: false,
  checkupPackageDetail: null,
};

export const reducer = createReducer(
  initialState,
  on(CreateEditCheckupPackageActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(
    CreateEditCheckupPackageActions.getCheckupPackageDetailSuccess,
    (state, { checkupPackage }) => ({
      ...state,
      checkupPackageDetail: checkupPackage,
    })
  ),
  on(CreateEditCheckupPackageActions.reset, () => {
    return { ...initialState };
  })
);
