import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const codeUploadedColumns: TableColumn[] = [
  {
    value: 'Inventory Stocks Name',
    code: 'inventory_name',
    type: ColumnType.String,
  },
  {
    value: 'Description',
    code: 'inventory_description',
    type: ColumnType.String,
  },
  {
    value: 'Brand',
    code: 'brand_name',
    type: ColumnType.String,
  },
  {
    value: 'Ready to use',
    code: 'ready_to_use',
    type: ColumnType.Number,
  },
  {
    value: 'Expiry Date',
    code: 'expire_date_time',
    type: ColumnType.DateTime,
  },
  {
    value: 'Updated Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
];
