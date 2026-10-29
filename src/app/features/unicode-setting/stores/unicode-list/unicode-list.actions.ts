import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { Unicode } from '../../models/unicode-model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

const prefix = '[unicodes]';

export const getUnicodes = createAction(
  `${prefix} Get Unicodes | loadingKey=getUnicodes`,
  props<{ queryParams: Partial<CommonListQueryParams> }>()
);

export const getUnicodesSuccess = createAction(
  `${prefix} Get Unicodes Success | loadingKey=getUnicodes`,
  props<{ pagedData: PagedData<Unicode> }>()
);

export const getUnicodesFailure = createAction(
  `${prefix} Get Unicodes Failure | loadingKey=getUnicodes`,
  props<{ error: CommonError }>()
);

export const setUnicodeFilters = createAction(
  `${prefix} Set Unicode Filters`,
  props<{ filters: Partial<CommonListQueryParams> }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
