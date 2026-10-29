import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectPermissions } from '@app/store/user-permission/user-permission.selectors';
import {
  checkPermissions,
  checkPermissionsAny,
} from '../directives/has-permissions-directive';

@Injectable({ providedIn: 'root' })
export class HasPermissionService {
  private store = inject(Store);

  permissions$: Observable<{ [key: string]: string[] }> =
    this.store.select(selectPermissions);
  permissions: WritableSignal<{
    [key: string]: string[];
  }> = signal({});

  constructor() {
    this.permissions$.pipe(take(1)).subscribe((permissions) => {
      this.permissions.set(permissions);
    });
  }

  hasPermission(
    hasPermissions: { feature: string; action: string }[]
  ): boolean {
    return checkPermissions(this.permissions(), hasPermissions);
  }

  hasPermissionAny(
    hasPermissions: { feature: string; action: string }[]
  ): boolean {
    return checkPermissionsAny(this.permissions(), hasPermissions);
  }
}
