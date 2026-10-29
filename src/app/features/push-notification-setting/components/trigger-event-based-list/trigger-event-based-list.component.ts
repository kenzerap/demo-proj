import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Store } from '@ngrx/store';
import { filter, Observable, take } from 'rxjs';
import * as notificationsSelectors from '../../stores/notification/notification.selectors';
import * as NotificationsActions from '../../stores/notification/notification.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { Notification } from '../../models/notification.model';
import { NotificationQueryParams } from '../../models/notifications-query-params.model';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { triggerEventBasedListColumns } from '../../constants/trigger-event-based-list-columns.const';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

@Component({
  selector: 'app-trigger-event-based-list',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent, MatSlideToggleModule],
  templateUrl: './trigger-event-based-list.component.html',
  styleUrl: './trigger-event-based-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriggerEventBasedListComponent implements OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    triggerEventBasedListColumns
  );
  partyId: WritableSignal<string> = signal('');

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.PushNotificationSetting,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  notifications$: Observable<Notification[]> = this.store.select(
    notificationsSelectors.selectNotifications
  );

  pagination$: Observable<Pagination> = this.store.select(
    notificationsSelectors.selectPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getNotifications')
  );
  targetGroupUserCount$: Observable<TargetGroupUserCount[]> = this.store.select(
    notificationsSelectors.selectTargetGroupUserCounts
  );

  defaultParams: WritableSignal<Partial<NotificationQueryParams>> = signal({
    page: 0,
    size: 20,
    isSent: true,
    sendTimeType: TimePeriodType.TRIGGER_EVENT,
  });

  ngOnInit(): void {
    this.targetGroupUserCount$
      .pipe(
        filter((users) => users.length > 0),
        take(1)
      )
      .subscribe((users) => {
        this.store.dispatch(
          NotificationsActions.setNotificationFilters({
            filters: {
              ...this.defaultParams(),
              target_group_ids: users[0].target_group_ids,
            },
          })
        );
      });
  }

  onPageChange(page: number) {
    this.store.dispatch(
      NotificationsActions.setNotificationFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      NotificationsActions.setNotificationFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  onRowClick(notification: Notification) {
    if (!this.hasEditPermission) {
      return;
    }

    this.router.navigate([
      'application-management',
      'push-notification-setting',
      'form',
      notification.id,
      'view-edit',
    ]);
  }

  ngOnDestroy(): void {
    this.store.dispatch(NotificationsActions.resetNotifications());
  }
}
