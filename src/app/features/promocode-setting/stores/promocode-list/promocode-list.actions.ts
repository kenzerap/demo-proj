import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { PromoCode } from '../../models/promocode-model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

const prefix = '[promoCodes]';

export const getPromoCodes = createAction(
  `${prefix} Get PromoCodes | loadingKey=getPromoCodes`,
  props<{ queryParams: Partial<CommonListQueryParams> }>()
);

export const getPromoCodesSuccess = createAction(
  `${prefix} Get PromoCodes Success | loadingKey=getPromoCodes`,
  props<{ pagedData: PagedData<PromoCode> }>()
);

export const getPromoCodesFailure = createAction(
  `${prefix} Get PromoCodes Failure | loadingKey=getPromoCodes`,
  props<{ error: CommonError }>()
);

export const setPromoCodeFilters = createAction(
  `${prefix} Set PromoCode Filters`,
  props<{ filters: Partial<CommonListQueryParams> }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
