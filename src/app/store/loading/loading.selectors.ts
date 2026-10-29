import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoadingState, featureKey } from './loading.reducer';

export const selectFeature = createFeatureSelector<LoadingState>(featureKey);

export const selectIsLoading = (loadingKey: string) =>
  createSelector(
    selectFeature,
    (state: LoadingState) => state.isLoading[loadingKey]
  );
