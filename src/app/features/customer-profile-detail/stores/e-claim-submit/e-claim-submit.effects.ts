import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as EClaimSubmitActions from './e-claim-submit.actions';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerProfileDetailService } from '../../services/customer-profile-detail.service';
import { setLoading } from 'src/app/store/loading/loading.actions';
import { FileService } from '@app/shared/services/file.service';
import { Store } from '@ngrx/store';
import * as fromPolicyDetailSelectors from '../policy-detail/policy-detail.selectors';

@Injectable()
export class EClaimSubmitEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private customerProfileDetailService = inject(CustomerProfileDetailService);
  private downloadFileService = inject(FileService);

  getEClaimSubmits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EClaimSubmitActions.getEClaimSubmits),
      mergeMap(({ partyId, policyId, queryParams }) => {
        return this.customerProfileDetailService
          .getEClaimSubmits(partyId, policyId, queryParams)
          .pipe(
            map((pagedData) =>
              EClaimSubmitActions.getEClaimSubmitsSuccess({
                policyId,
                pagedData,
              })
            ),
            catchError((error) => {
              return of(
                EClaimSubmitActions.getEClaimSubmitsFailure({
                  policyId,
                  error,
                })
              );
            })
          );
      })
    )
  );

  getEClaimImageUrls$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EClaimSubmitActions.getEClaimImageUrls),
      mergeMap(({ partyId, policyId, imageNames }) => {
        return this.customerProfileDetailService
          .getEClaimImageUrls(partyId, { key_names: imageNames })
          .pipe(
            map((data) =>
              EClaimSubmitActions.getEClaimImageUrlsSuccess({
                policyId,
                data,
              })
            ),
            catchError((error) => {
              return of(
                EClaimSubmitActions.getEClaimImageUrlsFailure({
                  policyId,
                  error,
                })
              );
            })
          );
      })
    )
  );

  downloadImagesZip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EClaimSubmitActions.downloadImagesZip),
      withLatestFrom(
        this.store.select(fromPolicyDetailSelectors.selectPolicyDetails)
      ),
      switchMap(
        ([{ eclaimId, policyId, imageUrls, partyId }, policyDetails]) => {
          return this.customerProfileDetailService
            .getEClaimImageUrls(partyId, {
              key_names: imageUrls,
            })
            .pipe(
              switchMap((data) => {
                const fileUrls = data.presigned_urls.map((url, index) => {
                  const fileName = url.key_name.split('/').pop();
                  return {
                    name: fileName || `image-${index}.jpg`,
                    url: url.presigned_url,
                  };
                });

                const policy = policyDetails[policyId];
                const zipName = `${policy?.policy_no}_${policy?.client_no}_${eclaimId}_documents`;

                return this.downloadFileService
                  .downloadZipFile(fileUrls, zipName)
                  .pipe(
                    map(() => EClaimSubmitActions.downloadImagesZipSuccess()),
                    catchError((error) => {
                      return of(
                        EClaimSubmitActions.downloadImagesZipFailure({ error })
                      );
                    })
                  );
              }),
              catchError((error) => {
                return of(
                  EClaimSubmitActions.downloadImagesZipFailure({ error })
                );
              })
            );
        }
      )
    )
  );

  startLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EClaimSubmitActions.getEClaimSubmits),
      concatMap(({ policyId }) => {
        return of(
          setLoading({
            loadingKey: `getEClaimSubmits-${policyId}`,
            value: true,
          })
        );
      })
    )
  );

  stopLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EClaimSubmitActions.getEClaimSubmitsSuccess,
        EClaimSubmitActions.getEClaimSubmitsFailure
      ),
      concatMap(({ policyId }) => {
        return of(
          setLoading({
            loadingKey: `getEClaimSubmits-${policyId}`,
            value: false,
          })
        );
      })
    )
  );
}
