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
import { ValueCode } from '@app/shared/models/value-code.model';
import { PointRuleTabs } from '../../constants/point-rule-tabs.const';
import { PointRuleListFilterComponent } from '../point-rule-list-filter/point-rule-list-filter.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

@Component({
  selector: 'app-point-rule-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    SvgPlusComponent,
    MatIconModule,
    PointRuleListFilterComponent,
    HasPermissionsDirective,
  ],
  templateUrl: './point-rule-layout.component.html',
  styleUrl: './point-rule-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointRuleLayoutComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  tabs: WritableSignal<ValueCode[]> = signal(PointRuleTabs);

  activeTab: WritableSignal<string | undefined> = signal(PointRuleTabs[0].code);

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

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
      'point-management',
      'point-rule-management',
      'list',
      tabCode,
    ]);
  }

  createPointRule() {
    this.router.navigate([
      'point-management',
      'point-rule-management',
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
}
