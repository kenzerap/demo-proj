import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import * as fundTypeSelectors from '../../stores/fund-type-list/fund-type-list.selectors';
import * as FundTypeActions from '../../stores/fund-type-list/fund-type-list.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { FundTypeListColumns } from '../../constants/fund-type-list-columns.const';
import { FundType } from '../../models/fund-type.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { FundTypeListFilterComponent } from '../fund-type-list-filter/fund-type-list-filter.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

@Component({
  selector: 'app-fund-type-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    SvgPlusComponent,
    MatButtonModule,
    MatChipsModule,
    FundTypeListFilterComponent,
    HasPermissionsDirective,
  ],
  templateUrl: './fund-type-list.component.html',
  styleUrls: ['./fund-type-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundTypeListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private hasPermissionService = inject(HasPermissionService);
  private router = inject(Router);

  tableColumns: WritableSignal<TableColumn[]> = signal(FundTypeListColumns);
  fundTypes$: Observable<FundType[]> = this.store.select(
    fundTypeSelectors.selectFundTypes,
  );
  pagination$: Observable<Pagination> = this.store.select(
    fundTypeSelectors.selectPagination,
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getFundTypes'),
  );
  selectCommonSearch$: Observable<string> = this.store
    .select(fundTypeSelectors.selectFundTypeFilters)
    .pipe(map((filters) => filters.keyword || ''));

  defaultParams: WritableSignal<Partial<CommonListQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;
  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.FundType,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  ngOnInit(): void {
    this.store.dispatch(
      FundTypeActions.setFundTypeFilters({
        filters: this.defaultParams(),
      }),
    );
  }

  onPageChange(page: number) {
    this.store.dispatch(
      FundTypeActions.setFundTypeFilters({
        filters: { page },
      }),
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      FundTypeActions.setFundTypeFilters({
        filters: { size: pageSize, page: 0 },
      }),
    );
  }

  createFundType() {
    this.router.navigate([
      'master-data-management',
      'fund-type',
      'form',
      'create',
    ]);
  }

  onRowClick(fundType: FundType) {
    if (!this.hasEditPermission) {
      return;
    }

    this.router.navigate([
      'master-data-management',
      'fund-type',
      'form',
      fundType.fund_id,
      'view-edit',
    ]);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(FundTypeActions.resetAll());
  }
}
