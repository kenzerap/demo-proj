import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const ManualCodeRedemptionColumns: TableColumn[] = [
  {
    value: 'Redeem Code',
    code: 'redeem_code',
    type: ColumnType.String,
  },
  {
    value: 'Privilege Name',
    code: 'privilege_name_thai',
    type: ColumnType.String,
  },
  {
    value: 'Status',
    code: 'status',
    type: ColumnType.Custom,
  },
  {
    value: 'Create Date',
    code: 'created_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Redeem Date',
    code: 'redeemed_date',
    type: ColumnType.Custom,
  },
  {
    value: 'Expiry Date',
    code: 'expiry_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Mark as redeem',
    code: 'action',
    type: ColumnType.Custom,
  },
];
