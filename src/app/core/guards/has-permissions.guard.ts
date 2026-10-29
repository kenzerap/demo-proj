import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map, Observable, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectPermissions } from '@app/store/user-permission/user-permission.selectors';
import { checkPermissionsAny } from '@app/shared/directives/has-permissions-directive';
import { getSidebarItemsByPermission } from '@app/shared/components/sidebar/get-sidebar-items-by-permission.const';

@Injectable({
  providedIn: 'root',
})
export class HasPermissionsGuard implements CanActivate, CanActivateChild {
  private store = inject(Store);
  router = inject(Router);

  permissions$: Observable<{ [key: string]: string[] }> =
    this.store.select(selectPermissions);

  canActivate(
    currentRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.permissions$.pipe(
      take(1),
      map((permissions) => {
        const hasPermissions = currentRoute.data['hasPermissions'] || [];
        const canActivate = checkPermissionsAny(permissions, hasPermissions);

        if (!canActivate) {
          const sidebarItems = getSidebarItemsByPermission(permissions);
          this.router.navigate([
            sidebarItems[0].code,
            (sidebarItems[0].childrens || [])[0]?.code || '',
          ]);
        }
        return canActivate;
      })
    );
  }

  canActivateChild(
    currentRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.permissions$.pipe(
      take(1),
      map((permissions) => {
        const hasPermissions = currentRoute.data['hasPermissions'] || [];
        const canActivate = checkPermissionsAny(permissions, hasPermissions);

        if (!canActivate) {
          const sidebarItems = getSidebarItemsByPermission(permissions);
          this.router.navigate([
            sidebarItems[0].code,
            (sidebarItems[0].childrens || [])[0]?.code || '',
          ]);
        }

        return canActivate;
      })
    );
  }
}
