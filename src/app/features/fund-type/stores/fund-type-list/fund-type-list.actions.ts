import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { FundType } from '../../models/fund-type.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

const prefix = '[fundTypes]';

export const getFundTypes = createAction(
  `${prefix} Get FundTypes | loadingKey=getFundTypes`,
  props<{ queryParams: Partial<CommonListQueryParams> }>()
);

export const getFundTypesSuccess = createAction(
  `${prefix} Get FundTypes Success | loadingKey=getFundTypes`,
  props<{ pagedData: PagedData<FundType> }>()
);

export const getFundTypesFailure = createAction(
  `${prefix} Get FundTypes Failure | loadingKey=getFundTypes`,
  props<{ error: CommonError }>()
);

export const setFundTypeFilters = createAction(
  `${prefix} Set FundType Filters`,
  props<{ filters: Partial<CommonListQueryParams> }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
