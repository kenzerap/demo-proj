import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CustomerSegmentationService } from '../../services/customer-segmentation.service';
import * as CreateEditCustomerSegmentationActions from './create-edit-customer-segmentation.actions';
import * as CreateEditCustomerSegmentationSelectors from './create-edit-customer-segmentation.selectors';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { CreateEditCustomerSegmentationQueryParams } from '../../models/create-edit-customer-segmentation-query-params.model';
import { CommonNotificationService } from '@app/shared/services/common-notification.service';
import { CommonContentService } from '@app/shared/services/common-content.service';
import { Store } from '@ngrx/store';
import { CustomerSegmentRuleAttribute } from '@app/shared/constants/segment-attribute-options.const';

@Injectable()
export class CreateEditCustomerSegmentationEffects {
  private actions$ = inject(Actions);
  private customerSegmentationService = inject(CustomerSegmentationService);
  private commonNotificationService = inject(CommonNotificationService);
  private authService = inject(AuthService);
  private commonContentService = inject(CommonContentService);
  private store = inject(Store);

  createCustomerSegmentation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCustomerSegmentationActions.createCustomerSegmentation),
      withLatestFrom(
        this.authService.getCurrentUser$(),
        this.store.select(
          CreateEditCustomerSegmentationSelectors.selectProductNames,
        ),
      ),
      switchMap(([{ data }, currentUser, productNames]) => {
        let dataBody: Partial<CreateEditCustomerSegmentationQueryParams> = {
          ...data,
          created_by: currentUser?.username,
          updated_by: currentUser?.username,
        };

        const segmentGroups = dataBody.segment_groups || [];
        if (segmentGroups?.length > 0) {
          const segment_groups = segmentGroups.map((group) => {
            const segment_rules = group.segment_rules.map((rule) => {
              if (
                rule.attribute === CustomerSegmentRuleAttribute.PRODUCT_NAME
              ) {
                const productCode = rule.rule_value;
                const productName = productNames.find(
                  (product) => product.product_code === productCode,
                );

                return (rule = {
                  ...rule,
                  rule_code: productCode,
                  rule_value: productName ? productName.product_name : '',
                });
              }
              return rule;
            });

            return {
              ...group,
              segment_rules,
            };
          });
          dataBody = {
            ...dataBody,
            segment_groups,
          };
        }

        return this.customerSegmentationService
          .createCustomerSegmentation(dataBody)
          .pipe(
            map(() =>
              CreateEditCustomerSegmentationActions.createCustomerSegmentationSuccess(),
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Customer Segmentation',
                message: `Failed to create Customer Segmentation (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditCustomerSegmentationActions.createCustomerSegmentationFailure(
                  {
                    messageData,
                  },
                ),
              );
            }),
          );
      }),
    ),
  );

  getProductTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCustomerSegmentationActions.getProductTypes),
      switchMap(() => {
        return this.commonContentService.getProductGroupTypes().pipe(
          map((rows) =>
            CreateEditCustomerSegmentationActions.getProductTypesSuccess({
              data: rows || [],
            }),
          ),
          catchError((error) => {
            return of(
              CreateEditCustomerSegmentationActions.getProductTypesFailure({
                error,
              }),
            );
          }),
        );
      }),
    ),
  );

  getPolicyChannels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCustomerSegmentationActions.getPolicyChannels),
      switchMap(() => {
        return this.commonContentService.getPolicyChannels().pipe(
          map((rows) =>
            CreateEditCustomerSegmentationActions.getPolicyChannelsSuccess({
              data: rows || [],
            }),
          ),
          catchError((error) => {
            return of(
              CreateEditCustomerSegmentationActions.getPolicyChannelsFailure({
                error,
              }),
            );
          }),
        );
      }),
    ),
  );

  // remove
  getSegmentSummaryUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCustomerSegmentationActions.getSegmentSummaryUsers),
      switchMap(() => {
        return this.commonNotificationService.getSegmentSummaryUsers().pipe(
          map((data) =>
            CreateEditCustomerSegmentationActions.getSegmentSummaryUsersSuccess(
              {
                data,
              },
            ),
          ),
          catchError((error) => {
            return of(
              CreateEditCustomerSegmentationActions.getSegmentSummaryUsersFailure(
                {
                  error,
                },
              ),
            );
          }),
        );
      }),
    ),
  );

  getCustomerSegmentationDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CreateEditCustomerSegmentationActions.getCustomerSegmentationDetail,
      ),
      switchMap(({ id }) => {
        return this.customerSegmentationService
          .getCustomerSegmentationDetail(id)
          .pipe(
            map((customerSegmentationDetail) =>
              CreateEditCustomerSegmentationActions.getCustomerSegmentationDetailSuccess(
                {
                  customerSegmentationDetail,
                },
              ),
            ),
            catchError((error) => {
              return of(
                CreateEditCustomerSegmentationActions.getCustomerSegmentationDetailFailure(
                  {
                    error,
                  },
                ),
              );
            }),
          );
      }),
    ),
  );

  getProductNames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCustomerSegmentationActions.getProductNames),
      switchMap(() => {
        return this.commonContentService.getProductNameList().pipe(
          map((productNames) =>
            CreateEditCustomerSegmentationActions.getProductNamesSuccess({
              data: productNames || [],
            }),
          ),
          catchError((error) => {
            return of(
              CreateEditCustomerSegmentationActions.getProductNamesFailure({
                error,
              }),
            );
          }),
        );
      }),
    ),
  );

  validateUploadPartyId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCustomerSegmentationActions.validateUploadPartyId),
      switchMap(({ file }) => {
        return this.customerSegmentationService
          .validateSegmentUploadPartyId(file)
          .pipe(
            map((response) =>
              CreateEditCustomerSegmentationActions.validateUploadPartyIdSuccess(
                {
                  response,
                },
              ),
            ),
            catchError((error) => {
              return of(
                CreateEditCustomerSegmentationActions.validateUploadPartyIdFailure(
                  {
                    response: error.error,
                  },
                ),
              );
            }),
          );
      }),
    ),
  );

  uploadPartyId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCustomerSegmentationActions.uploadPartyId),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ file }, currentUser]) => {
        return this.customerSegmentationService
          .uploadSegmentPartyId(currentUser?.username || '', file || null)
          .pipe(
            map((response) =>
              CreateEditCustomerSegmentationActions.uploadPartyIdSuccess({
                partyIdFileInfo: response.file,
              }),
            ),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Inventory',
                message: `Failed to upload Party ID file (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };

              return of(
                CreateEditCustomerSegmentationActions.uploadPartyIdFailure({
                  messageData,
                }),
              );
            }),
          );
      }),
    ),
  );

  deleteUploadPartyId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditCustomerSegmentationActions.deleteUploadPartyId),
      switchMap(({ fileId }) => {
        return this.customerSegmentationService.deleteUploadCode(fileId).pipe(
          map(() =>
            CreateEditCustomerSegmentationActions.deleteUploadPartyIdSuccess(),
          ),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Upload Code',
              message: `Failed to delete Upload Code (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditCustomerSegmentationActions.deleteUploadPartyIdFailure({
                messageData,
              }),
            );
          }),
        );
      }),
    ),
  );
}
