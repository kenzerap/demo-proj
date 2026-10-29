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
import { SvgExportComponent } from '@app/shared/icons/svg-export/svg-export.component';
import { MatButtonModule } from '@angular/material/button';
import { map, Observable, take } from 'rxjs';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { PointTransactionReportFilterComponent } from '../point-transaction-report-filter/point-transaction-report-filter.component';
import * as pointTransactionReportListsSelector from '../../../popup-announcement-setting/point-transaction-report-list.selector';
import * as pointTransactionnReportListsActions from '../../stores/point-transaction-report-list/point-transaction-report-list.actions';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { PointTransactionReportQueryParams } from '../../models/point-transaction-report-query-params.model';
import { PointTransactionReportListColumns } from '../../constants/display-columns.const';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';

@Component({
  selector: 'app-point-transaction-report-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    PointTransactionReportFilterComponent,
    SvgExportComponent,
    MatButtonModule,
    HasPermissionsDirective,
  ],
  templateUrl: './point-transaction-report-list.component.html',
  styleUrl: './point-transaction-report-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointTransactionReportListComponent implements OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    PointTransactionReportListColumns
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
    pointTransactionReportListsSelector.selectPointTransactionFilters
  );

  hasFilter(filters: Partial<PointTransactionReportQueryParams>): boolean {
    if (!filters) return false;
    return (
      !!filters.transaction_type ||
      !!filters.from_date_time ||
      !!filters.to_date_time
    );
  }

  pointTransactionReport$ = this.store.select(
    pointTransactionReportListsSelector.selectfromPointTransactionReports
  );

  pagination$: Observable<Pagination> = this.store.select(
    pointTransactionReportListsSelector.selectPagination
  );

  listLoading$ = this.store.select(
    selectIsLoading('getPointTransactionReports')
  );

  exportLoading$ = this.store.select(
    pointTransactionReportListsSelector.selectExportLoading
  );

  selectCommonSearch$: Observable<boolean> = this.store
    .select(pointTransactionReportListsSelector.selectPointTransactionFilters)
    .pipe(
      map(
        (filters) =>
          !!(
            filters.transaction_type ||
            filters.from_date_time ||
            filters.to_date_time
          )
      )
    );

  selectSearchHighlightText$: Observable<string> = this.store
    .select(pointTransactionReportListsSelector.selectPointTransactionFilters)
    .pipe(
      map(
        (filters) =>
          filters.transaction_type ||
          filters.from_date_time ||
          filters.to_date_time ||
          ''
      )
    );

  defaultParams: WritableSignal<Partial<PointTransactionReportQueryParams>> =
    signal({
      page: 0,
      size: 20,
    });

  onPageChange(page: number) {
    this.store.dispatch(
      pointTransactionnReportListsActions.setPointTransactionReportsFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      pointTransactionnReportListsActions.setPointTransactionReportsFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
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
        pointTransactionnReportListsActions.exportPointTransactionReports({
          params: { ...this.defaultParams() },
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(pointTransactionnReportListsActions.resetAll());
  }
}
