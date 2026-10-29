import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { PointBulk } from '../../models/point-bulk.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

const prefix = '[Point Bulks]';

export const getPointBulks = createAction(
  `${prefix} Get Point Bulks | loadingKey=getPointBulks`,
  props<{ queryParams: Partial<CommonListQueryParams> }>()
);

export const getPointBulksSuccess = createAction(
  `${prefix} Get Point Bulks Success | loadingKey=getPointBulks`,
  props<{ pagedData: PagedData<PointBulk> }>()
);

export const getPointBulksFailure = createAction(
  `${prefix} Get Point Bulks Failure | loadingKey=getPointBulks`,
  props<{ error: CommonError }>()
);

export const setPointBulkFilters = createAction(
  `${prefix} Set Point Bulk Filters`,
  props<{ filters: Partial<CommonListQueryParams> }>()
);

export const downloadFileTemplate = createAction(
  `${prefix} Download File Template | loadingKey=downloadFileTemplate`
);

export const downloadFileTemplateSuccess = createAction(
  `${prefix} Download File Template Success | loadingKey=downloadFileTemplate`
);

export const downloadFileTemplateFailure = createAction(
  `${prefix} Download File Template Failure | loadingKey=downloadFileTemplate`,
  props<{ error: CommonError }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
