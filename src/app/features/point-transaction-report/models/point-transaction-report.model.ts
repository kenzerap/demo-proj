export interface PointTransactionReport {
  id: number;
  party_id: number;
  transaction_date: string;
  transaction_type: string;
  first_name: string;
  last_name: string;
  earning_type: string;
  privilege_name: string;
  privilege_type: string;
  point: number;
  expiry_date: string;
}
