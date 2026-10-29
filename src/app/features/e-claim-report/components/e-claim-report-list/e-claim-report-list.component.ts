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
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { EclaimReportListColumns } from '../../constants/display-columns.const';
import { EclaimReport } from '../../models/e-claim-report.model';
import { EclaimReportQueryParams } from '../../models/e-claim-report-query-params.model';
import * as eclaimReportsActions from '../../stores/e-claim-report-list/e-claim-report-list.actions';
import * as eclaimReportListsSelector from '../../stores/e-claim-report-list/e-claim-report-list.selector';
import { EclaimReportFilterComponent } from '../e-claim-report-filter/e-claim-report-filter.component';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { ToastMessageType } from '@app/shared/utils/enums/toast-message-type.enum';
import { pushMessage } from '@app/store/message-handling/message-handling.actions';

@Component({
  selector: 'app-privilege-usage-report-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    SvgExportComponent,
    MatButtonModule,
    HasPermissionsDirective,
    EclaimReportFilterComponent,
  ],
  templateUrl: './e-claim-report-list.component.html',
  styleUrl: './e-claim-report-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EclaimReportListComponent implements OnDestroy {
  private store = inject(Store);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(EclaimReportListColumns);

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
    eclaimReportListsSelector.selectPagination
  );

  listLoading$ = this.store.select(selectIsLoading('getEclaimReports'));

  exportLoading$ = this.store.select(selectIsLoading('exportEclaimReports'));

  filters$ = this.store.select(eclaimReportListsSelector.selectClaimFilters);

  hasFilter(filters: Partial<EclaimReportQueryParams>): boolean {
    if (!filters) return false;
    return !!filters.from_date_time || !!filters.to_date_time;
  }

  selectCommonSearch$: Observable<boolean> = this.store
    .select(eclaimReportListsSelector.selectClaimFilters)
    .pipe(map((filters) => !!(filters.from_date_time || filters.to_date_time)));

  defaultParams: WritableSignal<Partial<EclaimReportQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  eclaimReport$: Observable<EclaimReport[]> = this.store.select(
    eclaimReportListsSelector.selectfromClaimReports
  );

  onPageChange(page: number) {
    this.store.dispatch(
      eclaimReportsActions.setEclaimReportsFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      eclaimReportsActions.setEclaimReportsFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  exportToExcel(): void {
    this.filters$.pipe(take(1)).subscribe((filters) => {
      if (!this.hasFilter(filters)) {
        return;
      }
      this.store.dispatch(
        eclaimReportsActions.exportEclaimReports({
          params: filters,
        })
      );
    });
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

  ngOnDestroy(): void {
    this.store.dispatch(eclaimReportsActions.resetAll());
  }
}
