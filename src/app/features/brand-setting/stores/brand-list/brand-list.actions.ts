import { createAction, props } from '@ngrx/store';
import { PagedData } from 'src/app/shared/models/paged-data.model';
import { CommonError } from 'src/app/shared/models/common-error.model';
import { BrandsQueryParams } from '../../../../shared/models/brands-query-params.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { Brand } from '../../../../shared/models/brand-model';

const prefix = '[brands]';

export const getBrands = createAction(
  `${prefix} Get Brands | loadingKey=getBrands`,
  props<{ queryParams: Partial<BrandsQueryParams> }>()
);

export const getBrandsSuccess = createAction(
  `${prefix} Get Brands Success | loadingKey=getBrands`,
  props<{ pagedData: PagedData<Brand> }>()
);

export const getBrandsFailure = createAction(
  `${prefix} Get Brands Failure | loadingKey=getBrands`,
  props<{ error: CommonError }>()
);

export const setBrandFilters = createAction(
  `${prefix} Set Brand Filters`,
  props<{ filters: Partial<BrandsQueryParams> }>()
);

export const updateStatusBrand = createAction(
  `${prefix} update Status Brand | loadingKey=updateStatusBrand`,
  props<{ id: number; is_active: boolean }>()
);

export const updateStatusBrandSuccess = createAction(
  `${prefix} update Status Brand Success | loadingKey=updateStatusBrand`
);

export const updateStatusBrandFailure = createAction(
  `${prefix} update Status Brand Failure | loadingKey=updateStatusBrand`,
  props<{ id: number; messageData: ToastMessageData }>()
);

export const resetAll = createAction(`${prefix} Reset All`);
