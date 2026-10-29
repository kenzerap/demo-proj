import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { CategoryCode } from '../constants/category-options.const';

export interface PointRuleListQueryParams extends CommonListQueryParams {
  category: CategoryCode;
}
