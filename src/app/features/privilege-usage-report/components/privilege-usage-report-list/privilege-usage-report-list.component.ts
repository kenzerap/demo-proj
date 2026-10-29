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
import { PrivilegeUsageReportFilterComponent } from '../privilege-usage-report-filter/privilege-usage-report-filter.component';
import * as privilegeUsageReportListsSelector from '../../stores/privilege-usage-report-list/privilege-usage-report-list.selector';
import * as privilegeUsagenReportListsActions from '../../stores/privilege-usage-report-list/privilege-usage-report-list.actions';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { PrivilegeUsageReportQueryParams } from '../../models/privilege-usage-report-query-params.model';
import { PrivilegeUsageReportListColumns } from '../../constants/display-columns.const';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { PrivilegeUsageReportFormatted } from '../../models/privilege-usage-report.model';

@Component({
  selector: 'app-privilege-usage-report-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    SvgExportComponent,
    MatButtonModule,
    HasPermissionsDirective,
    PrivilegeUsageReportFilterComponent,
  ],
  templateUrl: './privilege-usage-report-list.component.html',
  styleUrl: './privilege-usage-report-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivilegeUsageReportListComponent implements OnInit, OnDestroy {
  private store = inject(Store);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    PrivilegeUsageReportListColumns
  );

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  pagination$: Observable<Pagination> = this.store.select(
    privilegeUsageReportListsSelector.selectPagination
  );

  listLoading$ = this.store.select(selectIsLoading('getPrivilegeUsageReports'));

  exportLoading$ = this.store.select(
    selectIsLoading('exportPrivilegeUsageReports')
  );

  filters$ = this.store.select(
    privilegeUsageReportListsSelector.selectPrivilegeUsageFilters
  );

  hasFilter(filters: Partial<PrivilegeUsageReportQueryParams>): boolean {
    if (!filters) return false;
    return (
      (filters.is_published !== null && filters.is_published !== undefined) ||
      !!filters.start_date_time_from ||
      !!filters.start_date_time_to ||
      !!filters.end_date_time_from ||
      !!filters.end_date_time_to
    );
  }

  selectCommonSearch$: Observable<boolean> = this.store
    .select(privilegeUsageReportListsSelector.selectPrivilegeUsageFilters)
    .pipe(
      map(
        (filters) =>
          !!(
            (filters.is_published !== undefined &&
              filters.is_published !== null) ||
            filters.start_date_time_from ||
            filters.start_date_time_to ||
            filters.end_date_time_from ||
            filters.end_date_time_to
          )
      )
    );

  selectSearchHighlightText$: Observable<string> = this.store
    .select(privilegeUsageReportListsSelector.selectPrivilegeUsageFilters)
    .pipe(
      map((filters) =>
        filters.is_published !== undefined && filters.is_published !== null
          ? filters.is_published
            ? 'Published'
            : 'Unpublished'
          : ''
      )
    );

  defaultParams: WritableSignal<Partial<PrivilegeUsageReportQueryParams>> =
    signal({
      page: 0,
      size: 20,
    });

  privilegeUsageReport$: Observable<PrivilegeUsageReportFormatted[]> =
    this.store
      .select(privilegeUsageReportListsSelector.selectfromPrivilegeUsageReports)
      .pipe(
        map((data) =>
          data.map((report) => ({
            ...report,
            formatted_status:
              report.status === true ? 'Published' : 'Unpublished',
            target_group_names: Array.isArray(report.target_group_items)
              ? report.target_group_items
                  .map((g) => {
                    if (g.type === 'Segment' || g.type === 'Tier') {
                      if (g.is_include === true) return `${g.name} (included)`;
                      if (g.is_include === false) return `${g.name} (excluded)`;
                    }
                    return g.name;
                  })
                  .filter((name) => !!name)
                  .join(', ')
              : '',
          }))
        )
      );

  ngOnInit(): void {}
  onPageChange(page: number) {
    this.store.dispatch(
      privilegeUsagenReportListsActions.setPrivilegeUsageReportsFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      privilegeUsagenReportListsActions.setPrivilegeUsageReportsFilters({
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
        privilegeUsagenReportListsActions.exportPrivilegeUsageReports({
          params: filters,
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(privilegeUsagenReportListsActions.resetAll());
  }
}
