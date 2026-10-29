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
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import * as PointRuleSelectors from '../../stores/point-rule-list/point-rule-list.selectors';
import * as PointRuleActions from '../../stores/point-rule-list/point-rule-list.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { criteriaBasedRuleListColumns } from '../../constants/criteria-based-rule-list-columns.const';
import { PointRule } from '../../models/point-rule-model';
import { HighlightTextDirective } from '@app/shared/directives/highlight-text.directive';
import { PointRuleListQueryParams } from '../../models/point-rule-list-query-params.model';
import { CategoryCode } from '../../constants/category-options.const';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

@Component({
  selector: 'app-criteria-based-rule-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatSlideToggleModule,
    MatButtonModule,
    HighlightTextDirective,
  ],
  templateUrl: './criteria-based-rule-list.component.html',
  styleUrls: ['./criteria-based-rule-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriteriaBasedRuleListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    criteriaBasedRuleListColumns
  );
  pointRules$: Observable<PointRule[]> = this.store.select(
    PointRuleSelectors.selectPointRules
  );
  pagination$: Observable<Pagination> = this.store.select(
    PointRuleSelectors.selectPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getPointRules')
  );
  selectCommonSearch$: Observable<string> = this.store
    .select(PointRuleSelectors.selectPointRuleFilters)
    .pipe(map((filters) => filters.keyword || ''));

  defaultParams: WritableSignal<Partial<PointRuleListQueryParams>> = signal({
    page: 0,
    size: 20,
    category: CategoryCode.CriteriaBasedRule,
    keyword: '',
  });

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.PointRules,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  ngOnInit(): void {
    this.store.dispatch(
      PointRuleActions.setPointRuleFilters({
        filters: this.defaultParams(),
      })
    );
  }

  onPageChange(page: number) {
    this.store.dispatch(
      PointRuleActions.setPointRuleFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      PointRuleActions.setPointRuleFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  onRowClick(pointRule: PointRule) {
    if (!this.hasEditPermission) {
      return;
    }

    this.router.navigate([
      'point-management',
      'point-rule-management',
      'form',
      pointRule.point_rule_id,
      'view-edit',
    ]);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(PointRuleActions.resetAll());
  }
}
