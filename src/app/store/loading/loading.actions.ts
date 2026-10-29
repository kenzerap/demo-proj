import { createAction, props } from '@ngrx/store';

const prefix = '[Loading Container]';
export const setLoading = createAction(
  `${prefix} Set Loading`,
  props<{ loadingKey: string; value: boolean }>()
);
export const resetLoading = createAction(`${prefix} Reset Loading`);
