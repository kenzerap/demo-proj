import { SortDirection } from "@angular/material/sort";
import { InventoryType } from "@app/shared/utils/enums/inventory-type.enum";

export interface InventoriesQueryParams {
  page: number;
  size: number;
  inventory_type: InventoryType;
  sort_direction: SortDirection;
  sort_by: string;
}
