import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Store } from '@ngrx/store';
import { evoucherListColumns } from '../../constants/evoucher-list-columns.const';
import { filter, map, Observable, take } from 'rxjs';
import * as privilegesSelectors from '../../stores/privilege/privilege.selectors';
import * as privilegesActions from '../../stores/privilege/privilege.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivilegeTypeEnum } from '../../../../shared/utils/enums/privilege-type.enums';
import { PrivilegeSettingsQueryParams } from '../../models/privilege-settings-query-params.model';
import {
  PrivilegeSetting,
  PrivilegeSettingTable,
} from '../../models/privilege-setting-model';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent, MatSlideToggleModule],
  providers: [DatePipe],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(evoucherListColumns);
  partyId: WritableSignal<string> = signal('');

  privileges$: Observable<PrivilegeSetting[]> = this.store.select(
    privilegesSelectors.selectPrivilegeSettings,
  );
  selectCommonSearch$: Observable<string> = this.store
    .select(privilegesSelectors.selectPrivilegeSettingFilters)
    .pipe(map((filters) => filters.keyword || ''));
  selectPrivilegeId$: Observable<string> = this.store
    .select(privilegesSelectors.selectPrivilegeSettingFilters)
    .pipe(map((filters) => filters.privilegeId || ''));

  isEditOrderMode: WritableSignal<boolean> = signal(false);
  isEditOrderMode$: Observable<boolean> = this.store.select(
    privilegesSelectors.selectIsEditOrderMode,
  );

  pagination$: Observable<Pagination> = this.store.select(
    privilegesSelectors.selectPagination,
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getPrivilegeSettings'),
  );
  targetGroupUserCount$: Observable<TargetGroupUserCount[]> = this.store.select(
    privilegesSelectors.selectTargetGroupUserCounts,
  );

  defaultParams: WritableSignal<Partial<PrivilegeSettingsQueryParams>> = signal(
    {
      page: 0,
      size: 20,
      privilege_type: PrivilegeTypeEnum.BOOKING,
      keyword: '',
      privilegeId: '',
    },
  );

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.PrivilegeSetting,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        filter((queryParams) => queryParams['isBack'] !== 'true'),
        take(1),
      )
      .subscribe(() => {
        this.store.dispatch(
          privilegesActions.getTargetGroupUserCount({
            privilegeType: PrivilegeTypeEnum.BOOKING,
          }),
        );

        this.targetGroupUserCount$
          .pipe(
            filter((users) => users.length > 0),
            take(1),
          )
          .subscribe((users) => {
            this.store.dispatch(
              privilegesActions.setPrivilegeSettingsFilter({
                filters: {
                  ...this.defaultParams(),
                  target_group_ids: users[0].target_group_ids,
                },
              }),
            );
          });
      });
  }

  onPageChange(page: number) {
    this.store.dispatch(
      privilegesActions.setPrivilegeSettingsFilter({
        filters: { page },
      }),
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      privilegesActions.setPrivilegeSettingsFilter({
        filters: { size: pageSize, page: 0 },
      }),
    );
  }

  onRowClick(privilege: PrivilegeSetting) {
    if (!this.hasEditPermission) {
      return;
    }

    this.router.navigate([
      'privilege-management',
      'privilege-setting',
      'form',
      privilege.privilege_id,
      'view-edit',
    ]);
  }

  onSortChange(event: Sort) {
    const sort_by =
      event.active === 'redeemed_per_total' ? 'QUANTITY' : event.active;
    this.store.dispatch(
      privilegesActions.setPrivilegeSettingsFilter({
        filters: {
          sort_by: event.direction ? sort_by : undefined,
          sort_direction: event.direction,
        },
      }),
    );
  }
}
