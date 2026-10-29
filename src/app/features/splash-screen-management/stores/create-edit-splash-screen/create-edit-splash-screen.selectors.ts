import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreateEditSplashScreen from './create-edit-splash-screen.reducer';

export const selectFeature =
  createFeatureSelector<fromCreateEditSplashScreen.State>(
    fromCreateEditSplashScreen.featureKey
  );

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreateEditSplashScreen.State) => state.isFormDirty
);

export const selectSplashScreenDetail = createSelector(
  selectFeature,
  (state: fromCreateEditSplashScreen.State) => state.splashScreenDetail
);

export const selectSplashScreenDisplayOrders = createSelector(
  selectFeature,
  (state: fromCreateEditSplashScreen.State) => state.splashScreenDisplayOrders
);
