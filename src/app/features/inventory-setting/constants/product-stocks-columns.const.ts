import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const ProductStocksColumns: TableColumn[] = [
  {
    value: 'Product Name',
    code: 'product_name',
    type: ColumnType.String,
  },
  {
    value: 'Description',
    code: 'description',
    type: ColumnType.String,
  },
  {
    value: 'Quantity',
    code: 'quantity',
    type: ColumnType.Number,
  },
  {
    value: 'Updated Date',
    code: 'created_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Uploaded by',
    code: 'created_by',
    type: ColumnType.String,
  },
  {
    value: '',
    code: 'actions',
    type: ColumnType.Custom,
    width: '4rem',
  },
];
