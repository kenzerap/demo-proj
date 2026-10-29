import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const redeemHistoryColumns: TableColumn[] = [
  {
    value: 'Transaction Date',
    code: 'transactionDate',
    type: ColumnType.DateTime,
  },
  {
    value: 'Privilege ID',
    code: 'privilegeId',
    type: ColumnType.String,
  },
  {
    value: 'Privilege',
    code: 'privilegeName',
    type: ColumnType.String,
  },
  {
    value: 'Place',
    code: 'placeNameThai',
    type: ColumnType.String,
  },
  {
    value: 'Redeem Code',
    code: 'redeemCode',
    type: ColumnType.String,
  },
  {
    value: 'Promo Code/Unique Code',
    code: 'promoUniCodeCode',
    type: ColumnType.String,
  },
  {
    value: 'Code Type',
    code: 'redeemType',
    type: ColumnType.String,
  },
  {
    value: 'Point',
    code: 'point',
    type: ColumnType.Point,
  },
  {
    value: 'Error',
    code: 'errorCodeMessageThai',
    type: ColumnType.String,
  },
];
