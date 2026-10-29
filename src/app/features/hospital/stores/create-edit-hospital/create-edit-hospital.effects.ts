import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CreateEditHospitalActions from './create-edit-hospital.actions';

import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { AuthService } from '@app/core/services/auth-service';
import { HospitalService } from '../../services/hospital.services';
import { CreateEditHospitalQueryParams } from '../../models/create-edit-hospital-query-params.model';

@Injectable()
export class CreateEditHospitalEffects {
  private actions$ = inject(Actions);
  private hospitalService = inject(HospitalService);
  private authService = inject(AuthService);

  createHospital$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditHospitalActions.createHospital),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ queryParams }, currentUser]) => {
        const params: Partial<CreateEditHospitalQueryParams> = {
          ...queryParams,
          created_by: currentUser?.username,
        };

        return this.hospitalService.createHospital(params).pipe(
          map(() => CreateEditHospitalActions.createHospitalSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Hospital',
              message: `Failed to create Hospital (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditHospitalActions.createHospitalFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );

  getProvinces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditHospitalActions.getProvinces),
      switchMap(() => {
        return this.hospitalService.getProvinces().pipe(
          map((provinces) =>
            CreateEditHospitalActions.getProvincesSuccess({ provinces })
          ),
          catchError((error) => {
            return of(CreateEditHospitalActions.getProvincesFailure({ error }));
          })
        );
      })
    )
  );

  getDistricts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditHospitalActions.getDistricts),
      switchMap(({ provinceId }) => {
        return this.hospitalService.getDistricts(provinceId).pipe(
          map((districts) =>
            CreateEditHospitalActions.getDistrictsSuccess({ districts })
          ),
          catchError((error) => {
            return of(CreateEditHospitalActions.getDistrictsFailure({ error }));
          })
        );
      })
    )
  );

  getHealthcarePackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditHospitalActions.getHealthcarePackage),
      switchMap(({ params }) => {
        return this.hospitalService.getHealthcarePackages(params).pipe(
          map((pagedData) =>
            CreateEditHospitalActions.getHealthcarePackageSuccess({
              pagedData,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditHospitalActions.getHealthcarePackageFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  getHospitalDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditHospitalActions.getHospitalDetail),
      switchMap(({ hospitalId }) => {
        return this.hospitalService.getHospitalDetail(hospitalId).pipe(
          map((hospital) =>
            CreateEditHospitalActions.getHospitalDetailSuccess({
              hospital,
            })
          ),
          catchError((error) => {
            return of(
              CreateEditHospitalActions.getHospitalDetailFailure({
                error,
              })
            );
          })
        );
      })
    )
  );

  updateHospital$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateEditHospitalActions.updateHospital),
      withLatestFrom(this.authService.getCurrentUser$()),
      switchMap(([{ data }, currentUser]) => {
        const dataBody: Partial<CreateEditHospitalQueryParams> = {
          ...data,
          created_by: currentUser?.username,
        };

        return this.hospitalService.updateHospital(dataBody).pipe(
          map(() => CreateEditHospitalActions.updateHospitalSuccess()),
          catchError((error) => {
            const messageData: ToastMessageData = {
              title: 'Hospital',
              message: `Failed to update Hospital (${error?.error?.errors?.[0]?.error_code} - ${error?.error?.errors?.[0]?.message})`,
              type: ToastMessageType.ERROR,
            };

            return of(
              CreateEditHospitalActions.updateHospitalFailure({
                messageData,
              })
            );
          })
        );
      })
    )
  );
}
