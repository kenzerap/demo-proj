import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { Brand, BrandDetail } from '../../../../shared/models/brand-model';
import { CreateEditBrandQueryParams } from '../../models/create-edit-brand-query-params.model';
import { BrandCategory } from '../../models/brand-category.model';
import { CreateEditBrandCategoryQueryParams } from '../../models/create-edit-brand-category-query-params.model';

const prefix = '[Create Edit Brand]';

export const createBrand = createAction(
  `${prefix} Create Brand | loadingKey=createBrand`,
  props<{ data: Partial<CreateEditBrandQueryParams>; file: File }>()
);

export const createBrandSuccess = createAction(
  `${prefix} Create Brand Success | loadingKey=createBrand`
);

export const createBrandFailure = createAction(
  `${prefix} Create Brand Failure | loadingKey=createBrand`,
  props<{ messageData: ToastMessageData }>()
);

export const updateBrand = createAction(
  `${prefix} update popup announcement | loadingKey=updateBrand`,
  props<{ id: number; data: Partial<CreateEditBrandQueryParams>; file: File }>()
);

export const updateBrandSuccess = createAction(
  `${prefix} update popup announcement Success | loadingKey=updateBrand`
);

export const updateBrandFailure = createAction(
  `${prefix} update popup announcement Failure | loadingKey=updateBrand`,
  props<{ messageData: ToastMessageData }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getBrandDetail = createAction(
  `${prefix} Get Brand Detail | loadingKey=getBrandDetail`,
  props<{ id: number }>()
);

export const getBrandDetailSuccess = createAction(
  `${prefix} Get Brand Detail Success | loadingKey=getBrandDetail`,
  props<{ brand: BrandDetail }>()
);

export const getBrandDetailFailure = createAction(
  `${prefix} Get Brand Detail Failure | loadingKey=getBrandDetail`,
  props<{ error: CommonError }>()
);

export const getBrandDisplayOrders = createAction(
  `${prefix} get Brand Display Orders | loadingKey=getBrandDisplayOrders`
);

export const getBrandDisplayOrdersSuccess = createAction(
  `${prefix} get Brand Display Orders Success | loadingKey=getBrandDisplayOrders`,
  props<{ data: number[] }>()
);

export const getBrandDisplayOrdersFailure = createAction(
  `${prefix} get Brand Display Orders Failure | loadingKey=getBrandDisplayOrders`,
  props<{ error: CommonError }>()
);

export const getBrandCategories = createAction(
  `${prefix} Get Brand Categories | loadingKey=getBrandCategories`
);

export const getBrandCategoriesSuccess = createAction(
  `${prefix} Get Brand Categories Success | loadingKey=getBrandCategories`,
  props<{ brandCategories: BrandCategory[] }>()
);

export const getBrandCategoriesFailure = createAction(
  `${prefix} Get Brand Categories Failure | loadingKey=getBrandCategories`,
  props<{ error: CommonError }>()
);

export const createBrandCategory = createAction(
  `${prefix} Create Brand Category | loadingKey=createBrandCategory`,
  props<{ params: Partial<CreateEditBrandCategoryQueryParams> }>()
);

export const createBrandCategorySuccess = createAction(
  `${prefix} Create Brand Category Success | loadingKey=createBrandCategory`
);

export const createBrandCategoryFailure = createAction(
  `${prefix} Create Brand Category Failure | loadingKey=createBrandCategory`,
  props<{ messageData: ToastMessageData }>()
);

export const editBrandCategory = createAction(
  `${prefix} Edit Brand Category | loadingKey=editBrandCategory`,
  props<{
    brandCategoryId: number;
    params: Partial<CreateEditBrandCategoryQueryParams>;
  }>()
);

export const editBrandCategorySuccess = createAction(
  `${prefix} Edit Brand Category Success | loadingKey=editBrandCategory`
);

export const editBrandCategoryFailure = createAction(
  `${prefix} Edit Brand Category Failure | loadingKey=editBrandCategory`,
  props<{ messageData: ToastMessageData }>()
);

export const deleteBrandCategory = createAction(
  `${prefix} Delete Brand Category | loadingKey=deleteBrandCategory`,
  props<{ brandCategoryId: number }>()
);

export const deleteBrandCategorySuccess = createAction(
  `${prefix} Delete Brand Category Success | loadingKey=deleteBrandCategory`,
  props<{ existedBrands: Brand[], brandCategoryId: number }>()
);

export const deleteBrandCategoryFailure = createAction(
  `${prefix} Delete Brand Category Failure | loadingKey=deleteBrandCategory`,
  props<{ messageData: ToastMessageData }>()
);

export const resetAll = createAction(`${prefix} Reset Create Edit Brand`);
