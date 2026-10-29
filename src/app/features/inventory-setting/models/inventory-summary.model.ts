export interface InventorySummary {
  inventory_id: number;
  inventory_name: string;
  brand_id: number;
  brand_name: string;
  ready_to_use: number;
  reserved: number;
  redeemed: number;
  used: number;
  created_date: string;
  updated_date: string;
  expire_date_time: string;
  quantity: number;
  ready_to_use_percent: number;
}
