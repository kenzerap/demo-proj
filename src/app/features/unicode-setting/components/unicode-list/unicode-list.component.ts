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
import * as unicodeSelectors from '../../stores/unicode-list/unicode-list.selectors';
import * as UnicodeActions from '../../stores/unicode-list/unicode-list.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { UnicodeListColumns } from '../../constants/unicode-list-columns.const';
import { Unicode } from '../../models/unicode-model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { UnicodeListFilterComponent } from '../unicode-list-filter/unicode-list-filter.component';
import { HighlightTextDirective } from '@app/shared/directives/highlight-text.directive';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

@Component({
  selector: 'app-unicode-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatSlideToggleModule,
    SvgPlusComponent,
    MatButtonModule,
    UnicodeListFilterComponent,
    HighlightTextDirective,
    HasPermissionsDirective,
  ],
  templateUrl: './unicode-list.component.html',
  styleUrls: ['./unicode-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnicodeListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(UnicodeListColumns);
  unicodes$: Observable<Unicode[]> = this.store.select(
    unicodeSelectors.selectUnicodes
  );
  pagination$: Observable<Pagination> = this.store.select(
    unicodeSelectors.selectPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getUnicodes')
  );
  selectCommonSearch$: Observable<string> = this.store
    .select(unicodeSelectors.selectUnicodeFilters)
    .pipe(map((filters) => filters.keyword || ''));

  defaultParams: WritableSignal<Partial<CommonListQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;
  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.UnicodeSetting,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  ngOnInit(): void {
    this.store.dispatch(
      UnicodeActions.setUnicodeFilters({
        filters: this.defaultParams(),
      })
    );
  }

  onPageChange(page: number) {
    this.store.dispatch(
      UnicodeActions.setUnicodeFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      UnicodeActions.setUnicodeFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  createUnicode() {
    this.router.navigate([
      'privilege-management',
      'unicode-setting',
      'form',
      'create',
    ]);
  }

  onRowClick(unicode: Unicode) {
    if (!this.hasEditPermission) {
      return;
    }

    this.router.navigate([
      'privilege-management',
      'unicode-setting',
      'form',
      unicode.unicode_id,
      'view-edit',
    ]);
  }

  getRewardName(data: Unicode) {
    if (!data.is_point && !data.is_privilege) {
      return '-';
    }

    if (data.is_point && data.is_privilege) {
      return 'Point, Privilege';
    }

    if (data.is_point) {
      return 'Point';
    }

    return 'Privilege';
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(UnicodeActions.resetAll());
  }
}
