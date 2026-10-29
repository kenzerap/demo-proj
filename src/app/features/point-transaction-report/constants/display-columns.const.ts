import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const PointTransactionReportListColumns: TableColumn[] = [
  {
    value: 'Party ID',
    code: 'party_id',
    type: ColumnType.Custom,
  },
  {
    value: 'Transaction Date',
    code: 'transaction_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Transaction Type',
    code: 'transaction_type',
    type: ColumnType.String,
  },
  {
    value: 'First Name',
    code: 'first_name',
    type: ColumnType.String,
  },
  {
    value: 'Last Name',
    code: 'last_name',
    type: ColumnType.String,
  },
  {
    value: 'Earning Type',
    code: 'earning_type',
    type: ColumnType.String,
  },
  {
    value: 'Privilege',
    code: 'privilege_name',
    type: ColumnType.String,
  },
  {
    value: 'Privilege Type',
    code: 'privilege_type',
    type: ColumnType.String,
  },
  {
    value: 'Point',
    code: 'point',
    type: ColumnType.Number,
  },
  {
    value: 'Expiry Date',
    code: 'expiry_date',
    type: ColumnType.DateTime,
  },
];
