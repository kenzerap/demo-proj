import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { SvgExportComponent } from '@app/shared/icons/svg-export/svg-export.component';
import { MatButtonModule } from '@angular/material/button';
import { map, Observable, take } from 'rxjs';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import * as userAccountReportListsSelector from '../../stores/user-account-report-list/user-account-report-list.selector';
import * as userAccountnReportListsActions from '../../stores/user-account-report-list/user-account-report-list.actions';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { UserAccountReportListColumns } from '../../constants/display-columns.const';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { UserAccountReportFilterComponent } from '../user-account-report-filter/user-account-report-filter.component';
import { UserAccountReportQueryParams } from '../../models/user-account-report-query-params.model';
import { UserAccountReportLists } from '../../models/user-account-report-report.model';
import { UserAccountReportTotalsComponent } from '../user-account-report-totals/user-account-report-totals.component';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';

@Component({
  selector: 'app-user-account-report-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    SvgExportComponent,
    MatButtonModule,
    HasPermissionsDirective,
    UserAccountReportFilterComponent,
    UserAccountReportTotalsComponent,
  ],
  templateUrl: './user-account-report-list.component.html',
  styleUrl: './user-account-report-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccountReportListComponent implements OnDestroy {
  private store = inject(Store);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    UserAccountReportListColumns
  );

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  hasViewCustomerProfilePermission = this.hasPermissionService.hasPermissionAny(
    [
      {
        feature: FeaturePermissionCode.CustomerProfile,
        action: ActionPermissionCode.View,
      },
      {
        feature: FeaturePermissionCode.CustomerProfile,
        action: ActionPermissionCode.ViewWithMasking,
      },
    ]
  );

  pagination$: Observable<Pagination> = this.store.select(
    userAccountReportListsSelector.selectPagination
  );

  listLoading$ = this.store.select(selectIsLoading('getUserAccountReports'));

  exportLoading$ = this.store.select(
    selectIsLoading('exportUserAccountReports')
  );

  filters$ = this.store.select(
    userAccountReportListsSelector.selectUserAccountFilters
  );

  ngOnInit(): void {
    this.store.dispatch(
      userAccountnReportListsActions.getUserAccountReportTotals({
        params: {
          user_types: [],
        },
      })
    );
  }

  hasFilter(filters: Partial<UserAccountReportQueryParams>): boolean {
    if (!filters) return false;
    const hasUserTypes = Array.isArray(filters.user_types)
      ? filters.user_types.length > 0
      : !!filters.user_types;
    return hasUserTypes || !!filters.from_date_time || !!filters.to_date_time;
  }

  selectCommonSearch$: Observable<boolean> = this.store
    .select(userAccountReportListsSelector.selectUserAccountFilters)
    .pipe(map((filters) => this.hasFilter(filters)));

  defaultParams: WritableSignal<Partial<UserAccountReportQueryParams>> = signal(
    {
      page: 0,
      size: 20,
    }
  );

  userAccountReport$: Observable<UserAccountReportLists[]> = this.store.select(
    userAccountReportListsSelector.selectfromUserAccountReports
  );

  getCleanUserType(userType: string): string {
    return userType ? userType.replace(/,\s*$/, '') : '';
  }

  onPageChange(page: number) {
    this.store.dispatch(
      userAccountnReportListsActions.setUserAccountReportsFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.userAccountReport$.pipe(take(1)).subscribe((data) => {
      if (!data || data.length === 0) return;
      this.store.dispatch(
        userAccountnReportListsActions.setUserAccountReportsFilters({
          filters: { size: pageSize, page: 0 },
        })
      );
    });
  }

  navigateToCustomerProfile(partyId: string) {
    if (!this.hasViewCustomerProfilePermission) {
      const messageData: ToastMessageData = {
        title: 'Permission Denied',
        message: `You not have permission to access user profile.`,
        type: ToastMessageType.ERROR,
      };
      this.store.dispatch(pushMessage({ messageData, duration: 3000 }));
      return;
    }
    window.open(
      window.location.origin + `/user-management/customer-profile/${partyId}`,
      '_blank'
    );
  }

  exportToExcel(): void {
    this.filters$.pipe(take(1)).subscribe((filters) => {
      if (!this.hasFilter(filters)) {
        return;
      }
      this.store.dispatch(
        userAccountnReportListsActions.exportUserAccountReports({
          params: filters,
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(userAccountnReportListsActions.resetAll());
  }
}
