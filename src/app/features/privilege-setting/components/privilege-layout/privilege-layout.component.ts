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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { privilegeSettingTabs } from './privilege-setting-tabs.const';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { map, Observable, take, takeUntil, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as privilegesActions from '../../stores/privilege/privilege.actions';
import * as privilegesSelectors from '../../stores/privilege/privilege.selectors';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { LoadingDirective } from '@app/shared/directives/loading.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { PrivilegeTypeEnum } from '../../../../shared/utils/enums/privilege-type.enums';
import { PrivilegeListFilterComponent } from '../privilege-list-filter/privilege-list-filter.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { SvgDotsCircleComponent } from '@app/shared/icons/svg-dots-circle/svg-dots-circle.component';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';

@Component({
  selector: 'app-privilege-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    LoadingDirective,
    MatTooltipModule,
    SvgPlusComponent,
    PrivilegeListFilterComponent,
    HasPermissionsDirective,
    SvgDotsCircleComponent,
  ],
  templateUrl: './privilege-layout.component.html',
  styleUrl: './privilege-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivilegeLayoutComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);

  tabs: WritableSignal<{ label: string; url: string }[]> =
    signal(privilegeSettingTabs);
  targetGroupUserCountId: WritableSignal<string> = signal('');

  activeTabUrl: WritableSignal<string> = signal(privilegeSettingTabs[0].url);
  privilegeType: WritableSignal<PrivilegeTypeEnum> = signal(
    PrivilegeTypeEnum.E_VOUCHER,
  );

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  targetGroupUserCount$: Observable<TargetGroupUserCount[]> = this.store
    .select(privilegesSelectors.selectTargetGroupUserCounts)
    .pipe(
      withLatestFrom(
        this.store.select(
          privilegesSelectors.selectTargetGroupUserCountsPagination,
        ),
      ),
      map(([users, pagination]) => {
        const newUsers = [...users];

        // check is last page
        if (pagination.totalPages !== pagination.page + 1) {
          newUsers.push({
            target_group_ids: [-2],
            name: 'See more',
            count: 0,
            id: '-2',
          });
        }
        return newUsers;
      }),
    );

  selectSelectedTargetGroupIds$: Observable<number[] | undefined> =
    this.store.select(privilegesSelectors.selectSelectedTargetGroupIds);

  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getTargetGroupUserCount'),
  );

  privilegeType$: Observable<PrivilegeTypeEnum | undefined> = this.store.select(
    privilegesSelectors.selectSelectedTab,
  );

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((queryParams) => {
      const isBack = queryParams['isBack'] === 'true';

      if (!isBack) {
        this.store.dispatch(privilegesActions.resetAll());
      }

      if (isBack) {
        this.privilegeType$.pipe(take(1)).subscribe((privilegeType) => {
          const privilegeTab = privilegeSettingTabs.find(
            (tab) => tab.privilegeType === privilegeType,
          );

          this.router.navigate(
            [privilegeTab?.url || privilegeSettingTabs[0].url],
            { relativeTo: this.activatedRoute, queryParams: { isBack } },
          );
        });
      }
    });

    this.privilegeType$
      .pipe(takeUntil(this.destroy$))
      .subscribe((privilegeType) => {
        const privilegeTab = privilegeSettingTabs.find(
          (tab) => tab.privilegeType === privilegeType,
        );

        this.activeTabUrl.set(privilegeTab?.url || privilegeSettingTabs[0].url);
        this.privilegeType.set(
          privilegeTab?.privilegeType || PrivilegeTypeEnum.E_VOUCHER,
        );
      });
  }

  changeTab(url: string) {
    this.targetGroupUserCountId.set('');
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }

  selectTargetGroup(targetGroupUserCount: TargetGroupUserCount) {
    if (targetGroupUserCount.id === '-2') {
      this.store.dispatch(
        privilegesActions.getTargetGroupUserCount({
          privilegeType: this.privilegeType(),
          isGetMore: true,
        }),
      );
      return;
    }

    this.targetGroupUserCountId.set(targetGroupUserCount.id);
    this.store.dispatch(
      privilegesActions.setPrivilegeSettingsFilter({
        filters: {
          target_group_ids: targetGroupUserCount.target_group_ids,
          page: 0,
        },
      }),
    );
  }

  checkEqualTargetGroupIds(arrayA: number[], arrayB: number[], id: string) {
    if (!this.targetGroupUserCountId()) {
      return (
        JSON.stringify([...arrayA].sort()) ===
        JSON.stringify([...arrayB].sort())
      );
    } else {
      return (
        JSON.stringify([...arrayA].sort()) ===
          JSON.stringify([...arrayB].sort()) &&
        this.targetGroupUserCountId() === id
      );
    }
  }

  navigateCreatePrivilege() {
    this.router.navigate(['form', 'create'], {
      relativeTo: this.activatedRoute,
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    // this.store.dispatch(privilegesActions.resetAll());
  }
}
