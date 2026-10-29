import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { SplashScreenDetail } from '../../models/splash-screen-management.model';
import { CreateEditSplashScreenQueryParams } from '../../models/create-edit-splash-screen-query-params.model';

const prefix = '[Create Edit Splash Screen]';

export const createSplashScreen = createAction(
  `${prefix} Create Splash Screen | loadingKey=createSplashScreen`,
  props<{ data: Partial<CreateEditSplashScreenQueryParams>; file: File }>()
);

export const createSplashScreenSuccess = createAction(
  `${prefix} Create Splash Screen Success | loadingKey=createSplashScreen`
);

export const createSplashScreenFailure = createAction(
  `${prefix} Create Splash Screen Failure | loadingKey=createSplashScreen`,
  props<{ messageData: ToastMessageData }>()
);

export const updateSplashScreen = createAction(
  `${prefix} Update Splash Screen | loadingKey=updateSplashScreen`,
  props<{
    id: number;
    data: Partial<CreateEditSplashScreenQueryParams>;
    file: File;
  }>()
);

export const updateSplashScreenSuccess = createAction(
  `${prefix} Update Splash Screen Success | loadingKey=updateSplashScreen`
);

export const updateSplashScreenFailure = createAction(
  `${prefix} Update Splash Screen Failure | loadingKey=updateSplashScreen`,
  props<{ messageData: ToastMessageData }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getSplashScreenDetail = createAction(
  `${prefix} Get Splash Screen Detail | loadingKey=getSplashScreenDetail`,
  props<{ id: number }>()
);

export const getSplashScreenDetailSuccess = createAction(
  `${prefix} Get Splash Screen Detail Success | loadingKey=getSplashScreenDetail`,
  props<{ splashScreenDetail: SplashScreenDetail }>()
);

export const getSplashScreenDetailFailure = createAction(
  `${prefix} Get Splash Screen Detail Failure | loadingKey=getSplashScreenDetail`,
  props<{ error: CommonError }>()
);

export const getSplashScreenDisplayOrders = createAction(
  `${prefix} Get Splash Screen Display Orders | loadingKey=getSplashScreenDisplayOrders`
);

export const getSplashScreenDisplayOrdersSuccess = createAction(
  `${prefix} Get Splash Screen Display Orders Success | loadingKey=getSplashScreenDisplayOrders`,
  props<{ data: number[] }>()
);

export const getSplashScreenDisplayOrdersFailure = createAction(
  `${prefix} Get Splash Screen Display Orders Failure | loadingKey=getSplashScreenDisplayOrders`,
  props<{ error: CommonError }>()
);

export const resetAll = createAction(`${prefix} Reset Create Edit Splash Screen`);
