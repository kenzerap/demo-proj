import { createReducer, on } from '@ngrx/store';
import * as CreateEditSplashScreenActions from './create-edit-splash-screen.actions';
import { SplashScreenDetail } from '../../models/splash-screen-management.model';

export const featureKey = 'createEditSplashScreen';

export interface State {
  isFormDirty: boolean;
  splashScreenDetail: SplashScreenDetail | null;
  splashScreenDisplayOrders: number[];
}

export const initialState: State = {
  isFormDirty: false,
  splashScreenDetail: null,
  splashScreenDisplayOrders: [],
};

export const reducer = createReducer(
  initialState,
  on(CreateEditSplashScreenActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(
    CreateEditSplashScreenActions.getSplashScreenDetailSuccess,
    (state, { splashScreenDetail }) => ({
      ...state,
      splashScreenDetail,
    })
  ),
  on(
    CreateEditSplashScreenActions.getSplashScreenDisplayOrdersSuccess,
    (state, { data }) => ({
      ...state,
      splashScreenDisplayOrders: data,
    })
  ),
  on(CreateEditSplashScreenActions.resetAll, () => ({
    ...initialState,
  }))
);
