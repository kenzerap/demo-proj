import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as CreateEditPrivilegeActions from './create-edit-privilege.actions';
import * as CreateEditPrivilegeSelectors from './create-edit-privilege.selectors';

import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { CommonTierSegmentService } from '@app/shared/services/common-tier-segment.service';
import { PrivilegeSettingService } from '../../services/privilege-setting.service';
import { CreateEditPrivilegesQueryParams } from '../../models/create-edit-privilege-query-params.model';
import { PrivilegeService } from '@app/shared/services/privilege.service';
import { FileService } from '@app/shared/services/file.service';

@Injectable()
export class CreateEditPrivilegeEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private privilegeSettingService = inject(PrivilegeSettingService);
  private commonTierSegmentService = inject(CommonTierSegmentService);
  private privilegeService = inject(PrivilegeService);
  private authService = inject(AuthService);
  private fileService = inject(FileService);

  createPrivilege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPrivilegeActions.createPrivilege),
      withLatestFrom(
        this.authService.getCurrentUser$(),
        this.store.select(CreateEditPrivilegeSelectors.selectPrivilegeDetail)
      ),
      switchMap(
        ([
          { queryParams, thumbnailFile, detailFile },
          currentUser,
          privilegeDetail,
        ]) => {
          const params: Partial<CreateEditPrivilegesQueryParams> = {
            ...queryParams,
            created_by: currentUser?.username,
          };

          if (!!privilegeDetail && (!thumbnailFile || !detailFile)) {
            return forkJoin([
              this.fileService.urlToFile(
                privilegeDetail.thumbnail_image,
                privilegeDetail.thumbnail_name_image
              ),
              this.fileService.urlToFile(
                privilegeDetail.privilege_detail_image,
                privilegeDetail.detail_name_image
              ),
            ]).pipe(
              switchMap(([existedThumbnailFile, existedDetailFile]) => {
                const newThumbnailFile = thumbnailFile || existedThumbnailFile;
                const newDetailFile = detailFile || existedDetailFile;
                return this.privilegeSettingService
                  .createPrivilege(params, newThumbnailFile, newDetailFile)
                  .pipe(
                    map(() =>
                      CreateEditPrivilegeActions.createPrivilegeSuccess({
                        isPublished: !!queryParams.is_published,
                      })
                    ),
                    catchError((error) => {
                      const messageData: ToastMessageData = {
                        title: 'Privilege',
                        message: `Failed to create privilege (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                        type: ToastMessageType.ERROR,
                      };

                      return of(
                        CreateEditPrivilegeActions.createPrivilegeFailure({
                          messageData,
                        })
                      );
                    })
                  );
              }),
              catchError((error) => {
                const errorObjectMessage =
                  error?.error?.errors && error?.error?.errors.length > 0
                    ? error?.error?.errors?.[0]
                    : null;
                const errorTitle = !errorObjectMessage
                  ? 'API Undefined Error'
                  : error?.title || 'System error';

                const messageData: ToastMessageData = {
                  title: errorTitle,
                  message: errorObjectMessage
                    ? `${errorObjectMessage.error_code} - ${errorObjectMessage.message}`
                    : 'Something went wrong - API Undefined error',
                  type: ToastMessageType.ERROR,
                };

                return of(
                  CreateEditPrivilegeActions.createPrivilegeFailure({
                    messageData,
                  })
                );
              })
            );
          }

          return this.privilegeSettingService
            .createPrivilege(params, thumbnailFile, detailFile)
            .pipe(
              map(() =>
                CreateEditPrivilegeActions.createPrivilegeSuccess({
                  isPublished: !!queryParams.is_published,
                })
              ),
              catchError((error) => {
                const messageData: ToastMessageData = {
                  title: 'Privilege',
                  message: `Failed to create privilege (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                  type: ToastMessageType.ERROR,
                };

                return of(
                  CreateEditPrivilegeActions.createPrivilegeFailure({
                    messageData,
                  })
                );
              })
            );
        }
      )
    )
  );

  getPrivilegeDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPrivilegeActions.getPrivilegeDetail),
      switchMap(({ privilegeId }) => {
        return this.privilegeSettingService
          .getPrivilegeDetail(privilegeId)
          .pipe(
            map((privilege) =>
              CreateEditPrivilegeActions.getPrivilegeDetailSuccess({
                privilege,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditPrivilegeActions.getPrivilegeDetailFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  updatePrivilege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPrivilegeActions.updatePrivilege),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data, detailFile, thumbnailFile }, currentUser]) => {
        const dataBody: Partial<CreateEditPrivilegesQueryParams> = {
          ...data,
          updated_by: currentUser?.username,
        };

        return this.privilegeSettingService
          .updatePrivilege(dataBody, thumbnailFile, detailFile)
          .pipe(
            map(() =>
              CreateEditPrivilegeActions.updatePrivilegeSuccess({
                isPublished: !!data.is_published,
              })
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Privilege',
                message: `Failed to update privilege (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditPrivilegeActions.updatePrivilegeFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );

  getTierGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPrivilegeActions.getTierGroups),
      switchMap(({ page, size }) => {
        return this.commonTierSegmentService.getTierGroupList(page, size).pipe(
          map((data) =>
            CreateEditPrivilegeActions.getTierGroupsSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditPrivilegeActions.getTierGroupsFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getSegmentGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPrivilegeActions.getSegmentGroups),
      switchMap(({ page, size }) => {
        return this.commonTierSegmentService
          .getSegmentGroupList(page, size)
          .pipe(
            map((data) =>
              CreateEditPrivilegeActions.getSegmentGroupsSuccess({
                data,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditPrivilegeActions.getSegmentGroupsFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  getBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPrivilegeActions.getBrandOptions),
      switchMap(() => {
        return this.privilegeSettingService.getBrandsDropdown().pipe(
          map((data) =>
            CreateEditPrivilegeActions.getBrandOptionsSuccess({ data })
          ),
          catchError((error) => {
            return of(
              CreateEditPrivilegeActions.getBrandOptionsFailure({ error })
            );
          })
        );
      })
    )
  );

  getHealthcarePackageOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPrivilegeActions.getHealthcarePackageOptions),
      switchMap(() => {
        return this.privilegeSettingService
          .getHealthcarePackagesDropdown()
          .pipe(
            map((data) =>
              CreateEditPrivilegeActions.getHealthcarePackageOptionsSuccess({
                data,
              })
            ),
            catchError((error) => {
              return of(
                CreateEditPrivilegeActions.getHealthcarePackageOptionsFailure({
                  error,
                })
              );
            })
          );
      })
    )
  );

  getUploadCodeInventories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPrivilegeActions.getUploadCodeInventories),
      switchMap(({ queryParams }) => {
        return this.privilegeService.getInventories(queryParams).pipe(
          map((pagedData) =>
            CreateEditPrivilegeActions.getUploadCodeInventoriesSuccess({
              pagedData,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditPrivilegeActions.getUploadCodeInventoriesFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getProductInventories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPrivilegeActions.getProductInventories),
      switchMap(({ queryParams }) => {
        return this.privilegeService.getInventories(queryParams).pipe(
          map((pagedData) =>
            CreateEditPrivilegeActions.getProductInventoriesSuccess({
              pagedData,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditPrivilegeActions.getProductInventoriesFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  updatePublishedPrivilege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditPrivilegeActions.updatePublishedPrivilege),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ privilege_id, is_published }, currentUser]) => {
        return this.privilegeSettingService
          .updatePublishedPrivilege(
            is_published,
            privilege_id,
            currentUser?.username || ''
          )
          .pipe(
            map(() =>
              CreateEditPrivilegeActions.updatePublishedPrivilegeSuccess()
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Privilege',
                message: `Failed to update privilege (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditPrivilegeActions.updatePublishedPrivilegeFailure({
                  messageData,
                })
              );
            })
          );
      })
    )
  );
}
