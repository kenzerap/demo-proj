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
import { Observable } from 'rxjs';
import * as brandSelectors from '../../stores/brand-list/brand-list.selectors';
import * as BrandActions from '../../stores/brand-list/brand-list.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { Brand } from '../../../../shared/models/brand-model';
import { BrandsQueryParams } from '../../../../shared/models/brands-query-params.model';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { BrandListColumns } from '../../constants/brand-list-columns.const';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { encodeImageUrl } from '@app/shared/utils/encode-image-url';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatSlideToggleModule,
    SvgPlusComponent,
    MatButtonModule,
    HasPermissionsDirective,
  ],
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(BrandListColumns);
  brands$: Observable<Brand[]> = this.store.select(brandSelectors.selectBrands);
  pagination$: Observable<Pagination> = this.store.select(
    brandSelectors.selectPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getBrands')
  );

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;
  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.BrandSetting,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  defaultParams: WritableSignal<Partial<BrandsQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  ngOnInit(): void {
    this.store.dispatch(
      BrandActions.setBrandFilters({
        filters: this.defaultParams(),
      })
    );
  }

  onPageChange(page: number) {
    this.store.dispatch(
      BrandActions.setBrandFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      BrandActions.setBrandFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  onToggleChange(event: MatSlideToggleChange, rowData: Brand) {
    this.store.dispatch(
      BrandActions.updateStatusBrand({
        id: rowData.brand_id,
        is_active: event.checked,
      })
    );
  }

  createBrand() {
    this.router.navigate([
      'privilege-management',
      'brand-setting',
      'form',
      'create',
    ]);
  }

  onRowClick(brand: Brand) {
    if (!this.hasEditPermission) {
      return;
    }

    this.router.navigate([
      'privilege-management',
      'brand-setting',
      'form',
      brand.brand_id,
      'view-edit',
    ]);
  }

  encodeImageUrl(url: string, imageName: string): string {
    return encodeImageUrl(url, imageName);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(BrandActions.resetAll());
  }
}
