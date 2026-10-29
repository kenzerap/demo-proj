import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const InventoryListProductColumns: TableColumn[] = [
  {
    value: 'Inventory Stocks Name',
    code: 'inventory_name',
    type: ColumnType.String,
    isSortable: true,
  },
  {
    value: 'Brand',
    code: 'brand_name',
    type: ColumnType.String,
    isSortable: true,
  },
  {
    value: 'Ready to use',
    code: 'ready_to_use',
    type: ColumnType.Custom,
    isSortable: true,
  },
  {
    value: 'Reserved',
    code: 'reserved',
    type: ColumnType.Number,
    isSortable: true,
  },
  {
    value: 'Redeemed',
    code: 'redeemed',
    type: ColumnType.Number,
    isSortable: true,
  },
  {
    value: 'Used',
    code: 'used',
    type: ColumnType.Number,
    isSortable: true,
  },
  {
    value: 'Created date',
    code: 'created_date',
    type: ColumnType.DateTime,
    isSortable: true,
  },
  {
    value: 'Updated date',
    code: 'updated_date',
    type: ColumnType.DateTime,
    isSortable: true,
  },
  {
    value: 'Expiry Date',
    code: 'expire_date_time',
    type: ColumnType.DateTime,
    isSortable: true,
  },
];
