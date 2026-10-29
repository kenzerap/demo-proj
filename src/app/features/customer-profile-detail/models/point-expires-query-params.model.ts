import { TransactionType } from "src/app/shared/utils/enums/transaction-type.enum";

export interface PointExpiriesQueryParams {
  transaction_type: TransactionType;
  start_date: string;
  end_date: string;
  page: number;
  size: number;
}
