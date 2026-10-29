import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map, Observable, of, switchMap, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import {
  getUserPermissions,
  getUserPermissionsAPIFailure,
} from '@app/store/user-permission/user-permission.actions';
import { selectUserPermissions } from '@app/store/user-permission/user-permission.selectors';
import { CommonError } from '@app/shared/models/common-error.model';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivateChild {
  private store = inject(Store);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  canActivateChild(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.store.dispatch(getUserPermissions());

    let obser = this.store.select(selectUserPermissions);

    return obser.pipe(
      filter((permissions) => !!permissions),
      take(1),
      switchMap((response) => {
        if ((response as CommonError).error) {
          const message = (response as CommonError).error?.errors
            ? (response as CommonError).error?.errors[0]?.message || ''
            : '';

          const title = message.includes('Your account is inactive')
            ? 'Account Inactive'
            : message.includes('Access denied')
            ? 'No Permission'
            : '';

          if (!title) {
            this.store.dispatch(
              getUserPermissionsAPIFailure({ error: response as CommonError })
            );
            return of(false);
          }

          const data = {
            title,
            message,
            hideConfirmIcon: true,
            btnConfirmText: 'Close',
            type: 'warning',
          };

          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data,
            width: '25rem',
          });

          return dialogRef.afterClosed().pipe(
            map(() => {
              this.authService.signOut();
              return false;
            })
          );
        }

        return of(true);
      })
    );
  }
}
