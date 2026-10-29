import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PrivilegeSettingActions from './privilege.actions';
import * as PrivilegeSettingSelectors from './privilege.selectors';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { PrivilegeSettingService } from '../../services/privilege-setting.service';
import { PrivilegeTypeEnum } from '../../../../shared/utils/enums/privilege-type.enums';

@Injectable()
export class PrivilegeSettingEffects {
  private actions$ = inject(Actions);
  private privilegeSettingService = inject(PrivilegeSettingService);
  private store = inject(Store);

  getPrivilegeSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegeSettingActions.getPrivilegeSettings),
      switchMap(({ queryParams }) => {
        const params = {
          privilege_type: queryParams.privilege_type,
          page: queryParams.page,
          size: queryParams.size,
          targetGroupId: queryParams.target_group_ids?.includes(-1)
            ? undefined
            : queryParams.target_group_ids,
          keyword: queryParams.keyword || '',
          privilegeId: queryParams.privilegeId || '',
          ...(!!queryParams.sort_by && {
            sortBy: queryParams.sort_by.toLocaleUpperCase(),
          }),
          ...(!!queryParams.sort_direction && {
            sortDirection: queryParams.sort_direction.toLocaleUpperCase(),
          }),
        };

        if (
          !!queryParams.privilegeId &&
          isNaN(Number(queryParams.privilegeId))
        ) {
          return of(
            PrivilegeSettingActions.getPrivilegeSettingsSuccess({
              pagedData: {
                pagination: {
                  page: queryParams.page || 0,
                  totalPages: 0,
                  totalItems: 0,
                  size: queryParams.size || 0,
                },
                data: [],
                lastDisplayOrder: 0,
                privilegeId: 0,
              },
            }),
          );
        }

        return this.privilegeSettingService.getPrivilegeSettings(params).pipe(
          map((pagedData) =>
            PrivilegeSettingActions.getPrivilegeSettingsSuccess({
              pagedData,
            }),
          ),
          catchError((error) => {
            return of(
              PrivilegeSettingActions.getPrivilegeSettingsFailure({ error }),
            );
          }),
        );
      }),
    ),
  );

  setPrivilegeSettingsFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegeSettingActions.setPrivilegeSettingsFilter),
      withLatestFrom(
        this.store.select(
          PrivilegeSettingSelectors.selectPrivilegeSettingFilters,
        ),
      ),
      switchMap(([_, filters]) => {
        return of(
          PrivilegeSettingActions.getPrivilegeSettings({
            queryParams: {
              ...filters,
              privilege_type:
                filters.privilege_type || PrivilegeTypeEnum.E_VOUCHER,
            },
          }),
        );
      }),
    ),
  );

  getTargetGroupUserCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegeSettingActions.getTargetGroupUserCount),
      withLatestFrom(
        this.store.select(
          PrivilegeSettingSelectors.selectTargetGroupUserCountsPagination,
        ),
      ),
      switchMap(([{ privilegeType, page, isGetMore }, pagination]) => {
        const requestPage = isGetMore ? pagination.page + 1 : page || 0;
        return this.privilegeSettingService
          .getTargetGroupUserCount(privilegeType, requestPage)
          .pipe(
            map((pagedData) =>
              PrivilegeSettingActions.getTargetGroupUserCountSuccess({
                pagedData,
                isGetMore,
              }),
            ),
            catchError((error) => {
              return of(
                PrivilegeSettingActions.getTargetGroupUserCountFailure({
                  error,
                }),
              );
            }),
          );
      }),
    ),
  );
}
