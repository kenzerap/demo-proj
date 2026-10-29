import { createAction, props } from '@ngrx/store';
import { PagedData } from '@app/shared/models/paged-data.model';
import { CommonError } from '@app/shared/models/common-error.model';
import { SplashScreenManagement } from '../../models/splash-screen-management.model';
import { SplashScreenManagementQueryParams } from '../../models/splash-screen-management-query-params.model';

const prefix = '[Splash Screen Management]';

export const getSplashScreenManagements = createAction(
  `${prefix} Get Splash Screen Managements | loadingKey=getSplashScreenManagements`,
  props<{ queryParams: Partial<SplashScreenManagementQueryParams> }>()
);

export const getSplashScreenManagementsSuccess = createAction(
  `${prefix} Get Splash Screen Managements Success | loadingKey=getSplashScreenManagements`,
  props<{ pagedData: PagedData<SplashScreenManagement> }>()
);

export const getSplashScreenManagementsFailure = createAction(
  `${prefix} Get Splash Screen Managements Failure | loadingKey=getSplashScreenManagements`,
  props<{ error: CommonError }>()
);

export const setSplashScreenManagementFilters = createAction(
  `${prefix} Set Splash Screen Management Filters`,
  props<{ filters: Partial<SplashScreenManagementQueryParams> }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
