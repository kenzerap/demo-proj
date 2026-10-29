import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCreatePromocode from './create-edit-promocode.reducer';
import { Privilege } from '@app/shared/models/privilege.model';

export const selectFeature = createFeatureSelector<fromCreatePromocode.State>(
  fromCreatePromocode.featureKey
);

export const selectIsFormDirty = createSelector(
  selectFeature,
  (state: fromCreatePromocode.State) => state.isFormDirty
);

export const selectPromocodeDetail = createSelector(
  selectFeature,
  (state: fromCreatePromocode.State) => state.promocodeDetail
);

// Policy Channel list
export const selectPolicyChannels = createSelector(
  selectFeature,
  (state: fromCreatePromocode.State) => state.policyChannels
);

// privileges list
const { selectAll: selectAllPrivileges } =
  fromCreatePromocode.privilegesAdapter.getSelectors();

export const selectPrivileges = createSelector(
  selectFeature,
  (state: fromCreatePromocode.State) => selectAllPrivileges(state.privileges)
);

export const selectPrivilegeSearchFilters = createSelector(
  selectFeature,
  (state: fromCreatePromocode.State) => state.filters
);

export const selectFilteredPrivileges = createSelector(
  selectPrivileges,
  selectPrivilegeSearchFilters,
  (privileges, filters) => {
    const trimmedKeyword = (filters.keyword || '').trim().toLowerCase();

    const filteredPrivileges = trimmedKeyword
      ? privileges.filter((privilege) =>
          privilege.privilegeName?.toLowerCase().includes(trimmedKeyword)
        )
      : privileges;

    if (!filters.sort_by || !filters.sort_direction) {
      return filteredPrivileges;
    }

    const sortField = filters.sort_by as keyof Privilege;

    return [...filteredPrivileges].sort((a, b) => {
      const valueA = a[sortField] ?? '';
      const valueB = b[sortField] ?? '';
      const compareResult = valueA === valueB ? 0 : valueA < valueB ? -1 : 1;

      return filters.sort_direction === 'desc'
        ? -compareResult
        : compareResult;
    });
  }
);
