import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';

import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { PrivilegeRedemptionReportFilterComponent } from '../privilege-redemption-report-filter/privilege-redemption-report-filter.component';
import * as priviledeRedemptionReportListsSelector from '../../stores/privilede-redemption-report-list/privilege-redemption-report-list.selector';
import * as priviledeRedemptionReportListsActions from '../../stores/privilede-redemption-report-list/privilege-redemption-report-list.actions';

import { map, Observable, take } from 'rxjs';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { PrivilegeRedemptionReportFormatted } from '../../models/privilede-redemption-report.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { PrivilegeRedemptionReportQueryParams } from '../../models/privilede-redemption-report-query-params.model';
import { PrivilegeRedemptionReportListColumns } from '../../constants/display-columns.const';
import { SvgExportComponent } from '@app/shared/icons/svg-export/svg-export.component';
import { MatButtonModule } from '@angular/material/button';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { HighlightTextDirective } from '@app/shared/directives/highlight-text.directive';
@Component({
  selector: 'app-privilege-redemption-report-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    PrivilegeRedemptionReportFilterComponent,
    SvgExportComponent,
    MatButtonModule,
    HasPermissionsDirective,
    HighlightTextDirective,
  ],
  templateUrl: './privilege-redemption-report-list.component.html',
  styleUrl: './privilege-redemption-report-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivilegeRedemptionReportListComponent implements OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    PrivilegeRedemptionReportListColumns
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

  filters$ = this.store.select(
    priviledeRedemptionReportListsSelector.selectPrivilegeRedemptionReportFilters
  );

  hasFilter(filters: Partial<PrivilegeRedemptionReportQueryParams>): boolean {
    if (!filters) return false;
    const hasPrivilegeTypes = Array.isArray(filters.privilege_types)
      ? filters.privilege_types.length > 0
      : !!filters.privilege_types;
    return (
      hasPrivilegeTypes ||
      !!filters.keyword ||
      !!filters.from_date_time ||
      !!filters.to_date_time
    );
  }

  selectCommonSearch$: Observable<boolean> = this.store
    .select(
      priviledeRedemptionReportListsSelector.selectPrivilegeRedemptionReportFilters
    )
    .pipe(map((filters) => this.hasFilter(filters)));

  privilegeRedemptionReport$: Observable<PrivilegeRedemptionReportFormatted[]> =
    this.store
      .select(
        priviledeRedemptionReportListsSelector.selectfromPrivilegeRedemptionReports
      )
      .pipe(
        map((data) =>
          data.map((report) => ({
            ...report,
            formatted_registration_address: this.formatAddress(
              report.registration_address
            ),
            formatted_delivery_address: this.formatAddress(
              report.delivery_address
            ),
            redeemed_point: report.redeemed_point ?? 0,
            policy_no_format:
              report.policy_no && report.policy_no.length
                ? report.policy_no.join(', ')
                : '-',
          }))
        )
      );

  pagination$: Observable<Pagination> = this.store.select(
    priviledeRedemptionReportListsSelector.selectPagination
  );

  listLoading$ = this.store.select(
    selectIsLoading('getPrivilegeRedemptionReports')
  );
  exportLoading$ = this.store.select(
    priviledeRedemptionReportListsSelector.selectExportLoading
  );

  selectSearchHighlightText$: Observable<string> = this.store
    .select(
      priviledeRedemptionReportListsSelector.selectPrivilegeRedemptionReportFilters
    )
    .pipe(map((filters) => filters.keyword || ''));

  defaultParams: WritableSignal<Partial<PrivilegeRedemptionReportQueryParams>> =
    signal({
      page: 0,
      size: 20,
    });

  formatAddress(address: {
    address?: string;
    postcode?: string;
    province?: string;
    district?: string;
    sub_district?: string;
  }): string {
    if (!address) {
      return '-';
    }
    const parts = [
      address.address,
      address.district,
      address.sub_district,
      address.province,
      address.postcode,
    ].filter((part) => !!part && part !== 'undefined');
    return parts.length ? parts.join(', ') : '-';
  }

  onPageChange(page: number) {
    this.store.dispatch(
      priviledeRedemptionReportListsActions.setPrivilegeRedemptionReportFilters(
        {
          filters: { page },
        }
      )
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      priviledeRedemptionReportListsActions.setPrivilegeRedemptionReportFilters(
        {
          filters: { size: pageSize, page: 0 },
        }
      )
    );
  }

  navigateToCustomerProfile(party_id: string) {
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
      window.location.origin + `/user-management/customer-profile/${party_id}`,
      '_blank'
    );
  }

  exportToExcel(): void {
    this.filters$.pipe(take(1)).subscribe((filters) => {
      if (!this.hasFilter(filters)) {
        return;
      }
      this.store.dispatch(
        priviledeRedemptionReportListsActions.exportPrivilegeRedemptionReport({
          params: filters,
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(priviledeRedemptionReportListsActions.resetAll());
  }
}
