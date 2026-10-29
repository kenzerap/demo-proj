import { InventorySummary } from './inventory-summary.model';
import { LinkedPrivileges } from './linked-privileges.model';
import { ProductStock } from './product-stock.model';

export interface UpdateDeleteProductStockResponse {
  product_stock_outputs: ProductStock[];
  linked_privileges: LinkedPrivileges[];
  could_update_delete: boolean;
  summary_section_output: InventorySummary;
}
