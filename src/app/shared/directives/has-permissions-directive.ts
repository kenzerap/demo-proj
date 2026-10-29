import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  signal,
  SimpleChanges,
} from '@angular/core';
import { selectPermissions } from '@app/store/user-permission/user-permission.selectors';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

@Directive({
  selector: '[appHasPermissions]',
  standalone: true,
})
export class HasPermissionsDirective {
  @Input('appHasPermissions') hasPermissions: {
    feature: string;
    action: string;
  }[] = [];

  @Input() public appHasPermissionsCheckRule: 'all' | 'any' = 'all';

  private store = inject(Store);

  permissions$: Observable<{ [key: string]: string[] }> =
    this.store.select(selectPermissions);
  permissions = signal<{ [key: string]: string[] }>({});

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hasPermissions']) {
      const hasPermissions =
        this.appHasPermissionsCheckRule === 'all'
          ? checkPermissions(this.permissions(), this.hasPermissions)
          : checkPermissionsAny(this.permissions(), this.hasPermissions);
      if (hasPermissions) {
        this.viewContainerRef.clear();
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    }
  }

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {
    this.permissions$.pipe(take(1)).subscribe((permissions) => {
      this.permissions.set(permissions);
      // const hasPermissions =
      //   this.appHasPermissionsCheckRule === 'all'
      //     ? checkPermissions(permissions, this.hasPermissions)
      //     : checkPermissionsAny(permissions, this.hasPermissions);
      // if (hasPermissions) {
      //   this.viewContainerRef.clear();
      //   this.viewContainerRef.createEmbeddedView(this.templateRef);
      // } else {
      //   this.viewContainerRef.clear();
      // }
    });
  }
}

export const checkPermissions = (
  permissions: { [key: string]: string[] },
  hasPermissions: { feature: string; action: string }[]
): boolean => {
  const hasAllPermissions = hasPermissions.every((perm) => {
    return (
      permissions[perm.feature] &&
      permissions[perm.feature].includes(perm.action)
    );
  });
  return hasPermissions.length > 0 && hasAllPermissions;
};

export const checkPermissionsAny = (
  permissions: { [key: string]: string[] },
  hasPermissions: { feature: string; action: string }[]
): boolean => {
  const hasAllPermissions = hasPermissions.some((perm) => {
    return (
      permissions[perm.feature] &&
      permissions[perm.feature].includes(perm.action)
    );
  });
  return hasPermissions.length > 0 && hasAllPermissions;
};
