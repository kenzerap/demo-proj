import { TransactionType } from 'src/app/shared/utils/enums/transaction-type.enum';

export interface PointHistoriesQueryParams {
  transactionType: TransactionType;
  startDate: string;
  endDate: string;
  page: number;
  size: number;
}

export interface AddDeletePointQueryParams {
  expiryDate: string;
  point: number;
  remark: string;
  createdBy: string;
}
