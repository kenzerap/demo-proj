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
import * as inventorySelectors from '../../stores/inventory-list/inventory-list.selectors';
import * as InventoryActions from '../../stores/inventory-list/inventory-list.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { Inventory } from '../../../../shared/models/inventory-model';
import { InventoriesQueryParams } from '../../../../shared/models/inventories-query-params.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { InventoryListColumns } from '../../constants/inventory-list-columns.const';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { InventoryType } from '../../../../shared/utils/enums/inventory-type.enum';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(InventoryListColumns);
  inventories$: Observable<Inventory[]> = this.store.select(
    inventorySelectors.selectInventories,
  );
  pagination$: Observable<Pagination> = this.store.select(
    inventorySelectors.selectPagination,
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getInventories'),
  );

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.InventorySetting,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  defaultParams: WritableSignal<Partial<InventoriesQueryParams>> = signal({
    page: 0,
    size: 20,
    inventory_type: InventoryType.UPLOAD_CODE,
  });

  ngOnInit(): void {
    this.store.dispatch(
      InventoryActions.setInventoryFilters({
        filters: this.defaultParams(),
      }),
    );
  }

  onPageChange(page: number) {
    this.store.dispatch(
      InventoryActions.setInventoryFilters({
        filters: { page },
      }),
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      InventoryActions.setInventoryFilters({
        filters: { size: pageSize, page: 0 },
      }),
    );
  }

  onRowClick(inventory: Inventory) {
    if (!this.hasEditPermission) {
      return;
    }

    this.router.navigate([
      'privilege-management',
      'inventory-setting',
      'form',
      inventory.inventory_id,
      'view-edit',
    ]);
  }

  onSortChange(event: Sort) {
    this.store.dispatch(
      InventoryActions.setInventoryFilters({
        filters: {
          sort_by: event.direction ? event.active : undefined,
          sort_direction: event.direction,
        },
      }),
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(InventoryActions.resetAll());
  }
}
