import { InventoryType } from '../../../shared/utils/enums/inventory-type.enum';

export interface CreateEditInventoryQueryParams {
  inventory_name: string;
  description: string;
  brand_id: number;
  inventory_type: InventoryType;
  status: string;
  expire_date_time: string;
  created_by: string;
  inventory_id: number;
  updated_by: string;
}
