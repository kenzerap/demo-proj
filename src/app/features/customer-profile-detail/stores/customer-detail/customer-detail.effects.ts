import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CustomerDetailActions from './customer-detail.actions';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerProfileDetailService } from '../../services/customer-profile-detail.service';
import { ToastMessageData } from 'src/app/shared/models/toast-message-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastMessageType } from 'src/app/shared/utils/enums/toast-message-type.enum';
import { Customer } from '../../models/customer.model';
import { AuthService } from '@app/core/services/auth-service';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';

@Injectable()
export class CustomerDetailEffects {
  private actions$ = inject(Actions);
  private customerProfileDetailService = inject(CustomerProfileDetailService);
  private authService = inject(AuthService);

  getCustomerDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CustomerDetailActions.getCustomerDetail,
        CustomerDetailActions.markCustomerFraudOrBlockSuccess,
      ),
      switchMap(({ partyId }) => {
        return this.customerProfileDetailService
          .getCustomerProfileDetail(partyId)
          .pipe(
            map((customerDetail) =>
              CustomerDetailActions.getCustomerDetailSuccess({
                customerDetail,
              }),
            ),
            catchError((error) => {
              return of(
                CustomerDetailActions.getCustomerDetailFailure({ error }),
              );
            }),
          );
      }),
    ),
  );

  markCustomerFraudOrBlock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerDetailActions.markCustomerFraudOrBlock),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ partyId, is_fraud, is_blocked }, currentUser]) => {
        const params: {
          is_fraud?: boolean;
          is_blocked?: boolean;
          updated_by?: string;
          partyId: string;
        } = {
          ...(is_fraud !== undefined ? { is_fraud } : {}),
          ...(is_blocked !== undefined ? { is_blocked } : {}),
          updated_by: currentUser?.username,
          partyId,
        };

        return this.customerProfileDetailService
          .markCustomerFraudOrBlock(partyId, params)
          .pipe(
            map(() =>
              CustomerDetailActions.markCustomerFraudOrBlockSuccess(params),
            ),
            catchError((error) => {
              return of(
                CustomerDetailActions.markCustomerFraudOrBlockFailure({
                  error,
                }),
              );
            }),
          );
      }),
    ),
  );

  markCustomerFraudOrBlockSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerDetailActions.markCustomerFraudOrBlockSuccess),
      mergeMap(() => {
        const messageData: ToastMessageData = {
          title: 'Customer profile update',
          message: `Your updates saved successfully.`,
          type: ToastMessageType.SUCCESS,
        };

        return of(pushMessage({ messageData, duration: 3000 }));
      }),
    ),
  );

  markCustomerFraudOrBlockFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerDetailActions.markCustomerFraudOrBlockFailure),
      mergeMap(({ error }) => {
        const messageData: ToastMessageData = {
          title: 'Customer profile update',
          message: `Your updates failed (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
          type: ToastMessageType.ERROR,
        };

        return of(pushMessage({ messageData }));
      }),
    ),
  );

  updateCustomerDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerDetailActions.updateCustomerDetail),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ partyId, customerDetail }, currentUser]) => {
        const bodyData: Partial<Customer> = {
          first_name: customerDetail.first_name,
          last_name: customerDetail.last_name,
          updated_by: currentUser?.username,
          mobile_no: customerDetail.mobile_no,
          security_no: customerDetail.security_no,
          birth_date: customerDetail.birth_date,
          security_type: customerDetail.security_type,
          email: customerDetail.email,
        };

        return this.customerProfileDetailService
          .updateCustomerDetail(partyId, bodyData)
          .pipe(
            map((dataResponse) => {
              return CustomerDetailActions.updateCustomerDetailSuccess({
                dataResponse,
                requestBody: bodyData,
              });
            }),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Customer profile update',
                message: `Your updates failed (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };
              return of(
                CustomerDetailActions.updateCustomerDetailFailure({
                  messageData,
                }),
              );
            }),
          );
      }),
    ),
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerDetailActions.deleteCustomer),
      switchMap(({ partyId }) => {
        return this.customerProfileDetailService
          .deleteCustomerProfile(partyId)
          .pipe(
            map(() => CustomerDetailActions.deleteCustomerSuccess()),
            catchError((error) => {
              const messageData: ToastMessageData = {
                title: 'Delete Customer Profile',
                message: `Failed to delete customer profile (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
                type: ToastMessageType.ERROR,
              };
              return of(
                CustomerDetailActions.deleteCustomerFailure({
                  messageData,
                }),
              );
            }),
          );
      }),
    ),
  );
}
