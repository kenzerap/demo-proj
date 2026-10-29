import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { PointRule } from '../../models/point-rule-model';
import { PointRuleListQueryParams } from '../../models/point-rule-list-query-params.model';

const prefix = '[pointRules]';

export const getPointRules = createAction(
  `${prefix} Get PointRules | loadingKey=getPointRules`,
  props<{ queryParams: Partial<PointRuleListQueryParams> }>()
);

export const getPointRulesSuccess = createAction(
  `${prefix} Get PointRules Success | loadingKey=getPointRules`,
  props<{ pagedData: PagedData<PointRule> }>()
);

export const getPointRulesFailure = createAction(
  `${prefix} Get PointRules Failure | loadingKey=getPointRules`,
  props<{ error: CommonError }>()
);

export const setPointRuleFilters = createAction(
  `${prefix} Set PointRule Filters`,
  props<{ filters: Partial<PointRuleListQueryParams> }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
