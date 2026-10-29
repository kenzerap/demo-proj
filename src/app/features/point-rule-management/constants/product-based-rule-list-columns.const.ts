import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const productBasedRuleListColumns: TableColumn[] = [
  {
    value: 'Point rule name',
    code: 'name',
    type: ColumnType.String,
  },
  {
    value: 'Description',
    code: 'description',
    type: ColumnType.String,
  },
  {
    value: 'Product name',
    code: 'product_name',
    type: ColumnType.String,
  },
  {
    value: 'Create Date',
    code: 'created_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Start Date',
    code: 'start_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'End date',
    code: 'end_date',
    type: ColumnType.DateTime,
  },
];
