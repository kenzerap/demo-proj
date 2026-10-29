import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const pointHistoryColumns: TableColumn[] = [
  {
    value: 'Transaction Date',
    code: 'transactionDate',
    type: ColumnType.DateTime,
  },
  { value: 'Transaction Type', code: 'transactionType', type: ColumnType.String },
  { value: 'Policy No', code: 'policy', type: ColumnType.String },
  { value: 'Channel', code: 'channel', type: ColumnType.String },
  { value: 'Point', code: 'point', type: ColumnType.Point },
  { value: 'Balance', code: 'balance', type: ColumnType.Number },
  { value: 'Privilege', code: 'privilege', type: ColumnType.String },
  { value: 'Remark', code: 'remark', type: ColumnType.String, width: '6rem' },
  { value: 'Expiry Date', code: 'expiryDate', type: ColumnType.Date },
  { value: 'Promo Code', code: 'promoCode', type: ColumnType.String },
  { value: 'By', code: 'createdBy', type: ColumnType.String, width: '6rem' },
];
