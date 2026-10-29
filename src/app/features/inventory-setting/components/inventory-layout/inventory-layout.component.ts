import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { filter, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatIconModule } from '@angular/material/icon';
import {
  InventoryTabCode,
  InventoryTabs,
} from '../../constants/inventory-tabs.const';
import { ValueCode } from '@app/shared/models/value-code.model';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { SvgExportComponent } from '@app/shared/icons/svg-export/svg-export.component';
import * as inventoryListActions from '@app/features/inventory-setting/stores/inventory-list/inventory-list.actions';
import { Store } from '@ngrx/store';
import { selectIsLoading } from '@app/store/loading/loading.selectors';

@Component({
  selector: 'app-inventory-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    SvgPlusComponent,
    MatIconModule,
    HasPermissionsDirective,
    SvgExportComponent,
  ],
  templateUrl: './inventory-layout.component.html',
  styleUrl: './inventory-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryLayoutComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);

  tabs: WritableSignal<ValueCode[]> = signal(InventoryTabs);

  activeTab: WritableSignal<string | undefined> = signal(InventoryTabs[0].code);
  inventoryTabCode = InventoryTabCode;
  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  exportLoading$ = this.store.select(
    selectIsLoading(`exportUploadCodeInventory`)
  );

  constructor() {
    super();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getActiveTabUrl();
      });
  }

  ngOnInit(): void {
    this.getActiveTabUrl();
  }

  changeTab(tabCode: string) {
    this.activeTab.set(tabCode);
    this.router.navigate([
      'privilege-management',
      'inventory-setting',
      'list',
      tabCode,
    ]);
  }

  createInventory() {
    this.router.navigate([
      'privilege-management',
      'inventory-setting',
      'form',
      'create',
    ]);
  }

  getActiveTabUrl() {
    let currentRoute = this.activatedRoute;
    let fullPath = '';

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
      if (currentRoute.snapshot.url.length) {
        fullPath += `${currentRoute.snapshot.url
          .map((segment) => segment.path)
          .join('/')}`;
      }

      const isMatchPath = this.tabs().some((tab) => tab.code === fullPath);

      if (isMatchPath) {
        break;
      }
    }

    this.activeTab.set(fullPath);
  }

  exportToExcel() {
    this.store.dispatch(
      inventoryListActions.exportUploadCodeInventory({
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );
  }
}
