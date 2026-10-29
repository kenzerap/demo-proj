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
import * as promoCodeSelectors from '../../stores/promocode-list/promocode-list.selectors';
import * as PromoCodeActions from '../../stores/promocode-list/promocode-list.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { PromoCodeListColumns } from '../../constants/promocode-list-columns.const';
import { PromoCode } from '../../models/promocode-model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { PromocodeListFilterComponent } from '../promocode-list-filter/promocode-list-filter.component';
import { HighlightTextDirective } from '@app/shared/directives/highlight-text.directive';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

@Component({
  selector: 'app-promoCode-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatSlideToggleModule,
    SvgPlusComponent,
    MatButtonModule,
    PromocodeListFilterComponent,
    HighlightTextDirective,
    HasPermissionsDirective,
  ],
  templateUrl: './promocode-list.component.html',
  styleUrls: ['./promocode-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoCodeListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(PromoCodeListColumns);
  promoCodes$: Observable<PromoCode[]> = this.store.select(
    promoCodeSelectors.selectPromoCodes
  );
  pagination$: Observable<Pagination> = this.store.select(
    promoCodeSelectors.selectPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getPromoCodes')
  );
  selectCommonSearch$: Observable<string> = this.store
    .select(promoCodeSelectors.selectPromoCodeFilters)
    .pipe(map((filters) => filters.keyword || ''));

  defaultParams: WritableSignal<Partial<CommonListQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;
  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.PromocodeSetting,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  ngOnInit(): void {
    this.store.dispatch(
      PromoCodeActions.setPromoCodeFilters({
        filters: this.defaultParams(),
      })
    );
  }

  onPageChange(page: number) {
    this.store.dispatch(
      PromoCodeActions.setPromoCodeFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      PromoCodeActions.setPromoCodeFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  createPromoCode() {
    this.router.navigate([
      'privilege-management',
      'promocode-setting',
      'form',
      'create',
    ]);
  }

  onRowClick(promoCode: PromoCode) {
    if (!this.hasEditPermission) {
      return;
    }

    this.router.navigate([
      'privilege-management',
      'promocode-setting',
      'form',
      promoCode.promocode_id,
      'view-edit',
    ]);
  }

  getRewardName(data: PromoCode) {
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
    this.store.dispatch(PromoCodeActions.resetAll());
  }
}
