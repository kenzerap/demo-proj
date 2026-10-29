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
import { pushNotificationSettingTabs } from './push-notification-setting-tabs.const';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { filter, map, Observable, takeUntil, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as NotificationsActions from '../../stores/notification/notification.actions';
import * as notificationsSelectors from '../../stores/notification/notification.selectors';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { LoadingDirective } from '@app/shared/directives/loading.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { SvgDotsCircleComponent } from '@app/shared/icons/svg-dots-circle/svg-dots-circle.component';

@Component({
  selector: 'app-notifications-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    LoadingDirective,
    MatTooltipModule,
    SvgPlusComponent,
    HasPermissionsDirective,
    SvgDotsCircleComponent,
  ],
  templateUrl: './notifications-layout.component.html',
  styleUrl: './notifications-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsLayoutComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);

  tabs: WritableSignal<{ label: string; url: string }[]> = signal(
    pushNotificationSettingTabs
  );
  targetGroupUserCountId: WritableSignal<string> = signal('');

  activeTabUrl: WritableSignal<string> = signal(
    pushNotificationSettingTabs[0].url
  );
  sendTimeType: WritableSignal<TimePeriodType> = signal(
    TimePeriodType.SPECIFIC_TIME
  );

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  targetGroupUserCount$: Observable<TargetGroupUserCount[]> = this.store
    .select(notificationsSelectors.selectTargetGroupUserCounts)
    .pipe(
      withLatestFrom(
        this.store.select(
          notificationsSelectors.selectTargetGroupUserCountsPagination
        )
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
      })
    );

  selectselectedTargetGroupIds$: Observable<number[] | undefined> =
    this.store.select(notificationsSelectors.selectselectedTargetGroupIds);

  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getTargetGroupUserCount')
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

  changeTab(url: string) {
    this.targetGroupUserCountId.set('');
    this.router.navigate([url], { relativeTo: this.activatedRoute });
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

      const isMatchPath = this.tabs().some((tab) => tab.url === fullPath);

      if (isMatchPath) {
        break;
      }
    }

    this.activeTabUrl.set(fullPath);

    switch (fullPath) {
      case 'scheduled':
        this.sendTimeType.set(TimePeriodType.SPECIFIC_TIME);
        this.store.dispatch(
          NotificationsActions.getTargetGroupUserCount({
            sendTimeType: TimePeriodType.SPECIFIC_TIME,
          })
        );
        break;
      case 'trigger-event-based':
        this.sendTimeType.set(TimePeriodType.TRIGGER_EVENT);
        this.store.dispatch(
          NotificationsActions.getTargetGroupUserCount({
            sendTimeType: TimePeriodType.TRIGGER_EVENT,
          })
        );
        break;
      case 'sent':
        this.sendTimeType.set(TimePeriodType.IMMEDIATELY);
        this.store.dispatch(
          NotificationsActions.getTargetGroupUserCount({
            sendTimeType: TimePeriodType.IMMEDIATELY,
          })
        );
        break;

      default:
        break;
    }
  }

  selectTargetGroup(targetGroupUserCount: TargetGroupUserCount) {
    if (targetGroupUserCount.id === '-2') {
      this.store.dispatch(
        NotificationsActions.getTargetGroupUserCount({
          sendTimeType: this.sendTimeType(),
          isGetMore: true,
        })
      );
      return;
    }

    this.targetGroupUserCountId.set(targetGroupUserCount.id);
    this.store.dispatch(
      NotificationsActions.setNotificationFilters({
        filters: {
          target_group_ids: targetGroupUserCount.target_group_ids,
          page: 0,
        },
      })
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

  openCreatePushNotificationDialog() {
    this.router.navigate(['form', 'create'], {
      relativeTo: this.activatedRoute,
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(NotificationsActions.resetAll());
  }
}
