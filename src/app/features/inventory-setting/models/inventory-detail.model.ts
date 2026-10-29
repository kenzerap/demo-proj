import { InventorySummary } from './inventory-summary.model';
import { ProductStock } from './product-stock.model';
import { UploadCode } from './upload-code.model';

export interface InventoryDetail {
  inventory_id: number;
  inventory_name: string;
  description: string;
  brand_id: number;
  inventory_type: string;
  status: string;
  created_date: string;
  updated_date: string;
  expire_date_time: string;
  upload_code_list: UploadCode[];
  product_stock_list: ProductStock[];
  summary_section_output: InventorySummary;
}
