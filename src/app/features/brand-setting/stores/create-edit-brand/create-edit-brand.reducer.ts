import { createReducer, on } from '@ngrx/store';
import * as CreateEditBrandActions from './create-edit-brand.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Brand, BrandDetail } from '../../../../shared/models/brand-model';
import { BrandCategory } from '../../models/brand-category.model';

export const featureKey = 'createEditBrand';

export interface State {
  isFormDirty: boolean;
  brandDetail: BrandDetail | null;
  brandCategories: EntityState<BrandCategory>;
  brandCategoryDisplayOrders: number[];
  brandDisplayOrders: number[];
}

export const brandCategoryAdapter: EntityAdapter<BrandCategory> =
  createEntityAdapter<BrandCategory>({
    selectId: (brandCategory: BrandCategory) => brandCategory.brand_category_id,
  });

export const initialState: State = {
  isFormDirty: false,
  brandDetail: null,
  brandCategories: brandCategoryAdapter.getInitialState(),
  brandCategoryDisplayOrders: [],
  brandDisplayOrders: [],
};

export const reducer = createReducer(
  initialState,
  on(CreateEditBrandActions.setFormDirty, (state, { isDirty }) => ({
    ...state,
    isFormDirty: isDirty,
  })),
  on(CreateEditBrandActions.getBrandDetailSuccess, (state, { brand }) => ({
    ...state,
    brandDetail: brand,
  })),
  on(
    CreateEditBrandActions.getBrandCategoriesSuccess,
    (state, { brandCategories }) => {
      const brandCategoryDisplayOrders = brandCategories.map(
        (brandCategory) => brandCategory.display_order
      );

      return {
        ...state,
        brandCategories: brandCategoryAdapter.setAll(
          brandCategories,
          state.brandCategories
        ),
        brandCategoryDisplayOrders,
      };
    }
  ),
  on(
    CreateEditBrandActions.getBrandDisplayOrdersSuccess,
    (state, { data }) => ({
      ...state,
      brandDisplayOrders: data,
    })
  ),
  on(CreateEditBrandActions.resetAll, () => {
    return {
      ...initialState,
    };
  })
);
